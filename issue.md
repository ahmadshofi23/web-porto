# Bug: Upload Gambar Gagal Saat Menambahkan Proyek Portofolio

## Analisa Root Cause (Penyebab Utama)

Error terjadi saat aplikasi mencoba mengunggah gambar ke Supabase Storage dengan request:

```
POST https://mhqwxyjrnmcdyuagnpng.supabase.co/storage/v1/object/portfolio-assets/projects/94ibz3fvwhu.png
```

Berdasarkan URL dan metode request (`POST`) tersebut, berikut adalah **3 kandidat penyebab error** yang paling mungkin, diurutkan dari yang paling sering terjadi:

### Kandidat 1 (Paling Mungkin): Bucket `portfolio-assets` Belum Dibuat
Kode di `src/services/projectService.js` pada fungsi `uploadImage()` mencoba meng-upload ke:
```js
supabase.storage.from('portfolio-assets').upload(filePath, file)
```
Bucket bernama `portfolio-assets` tidak bisa dibuat via SQL biasa—ia harus dibuat secara **manual melalui Dashboard Supabase > Storage**. Jika bucket belum ada, Supabase Storage akan mengembalikan error `Bucket not found` dan upload akan selalu gagal.

### Kandidat 2 (Sangat Mungkin): Storage Policy Tidak Mengizinkan Upload
Meskipun bucket sudah ada, Supabase menggunakan Row Level Security (RLS) untuk Storage. Jika tidak ada *Policy* yang mengizinkan user yang terautentikasi untuk melakukan operasi `INSERT` (upload), maka request akan ditolak dengan HTTP `403 Forbidden`.

### Kandidat 3 (Mungkin): Sesi Authentication Sudah Expired
Upload gambar ke bucket private memerlukan token autentikasi yang valid. Jika user sudah terlalu lama di-idle di halaman admin, sesi Supabase bisa expire dan upload akan gagal dengan `401 Unauthorized`.

---

## Tahapan Implementasi Solusi

### Fase 1: Setup Manual Bucket di Supabase Dashboard (Wajib Pertama)
> Ini adalah langkah yang **PALING PENTING** dan harus dikerjakan lebih dulu sebelum yang lain, karena bucket tidak bisa dibuat via kode.

1. Login ke dashboard Supabase Anda di [app.supabase.com](https://app.supabase.com).
2. Pilih project portofolio Anda (`mhqwxyjrnmcdyuagnpng`).
3. Klik menu **Storage** di sidebar kiri.
4. Klik tombol **New bucket** (tombol hijau di pojok kanan atas).
5. Isi nama bucket dengan persis: `portfolio-assets`.
6. **PENTING**: Centang checkbox **Public bucket** agar gambar bisa diakses publik tanpa autentikasi saat ditampilkan di website.
7. Klik **Save**.

### Fase 2: Buat Storage Policy untuk Upload
Setelah bucket dibuat, kita perlu menambahkan policy agar user yang sudah login bisa men-upload file.

1. Masih di halaman **Storage** Dashboard Supabase, klik bucket `portfolio-assets` yang baru saja dibuat.
2. Klik tab **Policies** (Kebijakan Akses).
3. Klik **New Policy**.
4. Pilih template **Give users access to only their own top level folder named as uid**.
5. Atau pilih **Custom Policy** dan isi dengan konfigurasi berikut:
   - **Policy Name**: `Allow authenticated uploads`
   - **Allowed Operations**: Centang `INSERT`
   - **Target Roles**: `authenticated`
   - **Policy Definition (WITH CHECK)**:
     ```sql
     bucket_id = 'portfolio-assets'
     ```
6. Klik **Save Policy**.

Alternatif lebih cepat: jalankan SQL berikut di **SQL Editor** Dashboard Supabase:
```sql
-- Izinkan user yang login untuk upload ke bucket portfolio-assets
INSERT INTO storage.buckets (id, name, public) 
VALUES ('portfolio-assets', 'portfolio-assets', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Authenticated users can upload images"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'portfolio-assets');

CREATE POLICY "Public can view images"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'portfolio-assets');

CREATE POLICY "Authenticated users can delete their images"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'portfolio-assets');
```

### Fase 3: Perbaikan Kode - Tambahkan Error Handling yang Lebih Informatif
Buka file `src/services/projectService.js`. Temukan fungsi `uploadImage()` dan perbarui agar memberikan pesan error yang lebih spesifik ke pengguna:

```js
async uploadImage(file) {
  // Validasi tipe file
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
  if (!allowedTypes.includes(file.type)) {
    throw new Error(`Tipe file tidak diizinkan. Gunakan JPG, PNG, atau WebP.`)
  }
  
  // Validasi ukuran (max 5MB)
  const maxSize = 5 * 1024 * 1024 // 5 MB
  if (file.size > maxSize) {
    throw new Error(`Ukuran file terlalu besar. Maksimum 5MB.`)
  }

  const fileExt = file.name.split('.').pop()
  const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`
  const filePath = `projects/${fileName}`

  const { error: uploadError } = await supabase.storage
    .from('portfolio-assets')
    .upload(filePath, file, { upsert: false })

  if (uploadError) throw uploadError

  const { data: { publicUrl } } = supabase.storage
    .from('portfolio-assets')
    .getPublicUrl(filePath)

  return publicUrl
},
```

### Fase 4: Verifikasi Akhir (QA)
1. Restart development server: tekan `Ctrl+C` lalu jalankan `npm run dev`.
2. Login ke halaman admin di `http://localhost:3000/admin/login`.
3. Klik **Tambah Proyek**.
4. Di form yang muncul, klik area upload gambar dan pilih file gambar (JPG/PNG, kurang dari 5MB).
5. Isi field lainnya (Judul, Deskripsi) dan klik **Publish Project**.
6. **Verifikasi Sukses**: Jika berhasil, akan muncul toast notifikasi hijau "Image uploaded successfully" diikuti "Project created!".
7. Cek halaman utama `http://localhost:3000` dan pastikan kartu proyek baru muncul berserta gambarnya.
