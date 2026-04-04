import { createClient } from '@/utils/supabase/client'

const supabase = createClient()

export const projectService = {
  async getAll() {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) throw error
    return data
  },

  async getById(id) {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single()
    if (error) throw error
    return data
  },

  async create(projectData) {
    const { data, error } = await supabase
      .from('projects')
      .insert([projectData])
      .select()
    if (error) throw error
    return data[0]
  },

  async update(id, projectData) {
    const { data, error } = await supabase
      .from('projects')
      .update(projectData)
      .eq('id', id)
      .select()
    if (error) throw error
    return data[0]
  },

  async delete(id) {
    const { error } = await supabase.from('projects').delete().eq('id', id)
    if (error) throw error
    return true
  },

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

    if (uploadError) {
      if (uploadError.message === 'Bucket not found') {
        throw new Error('Storage bucket "portfolio-assets" belum dibuat di Supabase. Silakan buat secara manual di Dashboard.')
      }
      throw uploadError
    }

    const { data: { publicUrl } } = supabase.storage
      .from('portfolio-assets')
      .getPublicUrl(filePath)

    return publicUrl
  }
}
