'use client'

import { useState, useEffect } from 'react'
import { profileService } from '@/services/profileService'
import Button from '@/components/ui/Button'
import GlassCard from '@/components/ui/GlassCard'
import { toast } from 'react-hot-toast'
import { HiPlus, HiTrash, HiSave, HiBriefcase } from 'react-icons/hi'

export default function ProfileAdmin() {
  const [profile, setProfile] = useState({
    full_name: '',
    title: '',
    bio: '',
    cv_url: '',
    email: '',
    location: ''
  })
  const [experiences, setExperiences] = useState([])
  const [newExperience, setNewExperience] = useState({
    company: '',
    position: '',
    duration: '',
    description: ''
  })
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    async function fetchData() {
      try {
        const [p, e] = await Promise.all([
          profileService.getProfile(),
          profileService.getExperiences()
        ])
        if (p) setProfile(p)
        setExperiences(e || [])
      } catch (err) {
        toast.error('Gagal mengambil data profil')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleProfileSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await profileService.updateProfile(profile)
      toast.success('Profil berhasil diperbarui')
    } catch (err) {
      toast.error('Gagal memperbarui profil')
    } finally {
      setSubmitting(false)
    }
  }

  const handleAddExperience = async (e) => {
    e.preventDefault()
    try {
      const added = await profileService.addExperience(newExperience)
      setExperiences([...experiences, added])
      setNewExperience({ company: '', position: '', duration: '', description: '' })
      toast.success('Pengalaman ditambahkan')
    } catch (err) {
      toast.error('Gagal menambahkan pengalaman')
    }
  }

  const handleDeleteExperience = async (id) => {
    if (confirm('Hapus pengalaman ini?')) {
      try {
        await profileService.deleteExperience(id)
        setExperiences(experiences.filter(e => e.id !== id))
        toast.success('Pengalaman dihapus')
      } catch (err) {
        toast.error('Gagal menghapus pengalaman')
      }
    }
  }

  if (loading) return <div className="p-12 text-white">Loading Profil...</div>

  return (
    <div className="p-6 md:p-12 bg-slate-950 min-h-screen">
      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* Profile Settings */}
        <div className="space-y-8">
          <h1 className="text-3xl font-bold text-white mb-8">Informasi Profil</h1>
          <GlassCard className="p-8">
            <form onSubmit={handleProfileSubmit} className="space-y-6">
              <div>
                <label className="block text-slate-400 text-sm mb-2">Nama Lengkap</label>
                <input 
                  value={profile.full_name}
                  onChange={(e) => setProfile({...profile, full_name: e.target.value})}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-brand outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-400 text-sm mb-2">Pekerjaan / Jabatan</label>
                <input 
                  value={profile.title}
                  onChange={(e) => setProfile({...profile, title: e.target.value})}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-brand outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-400 text-sm mb-2">Bio Singkat</label>
                <textarea 
                  value={profile.bio}
                  onChange={(e) => setProfile({...profile, bio: e.target.value})}
                  rows={4}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-brand outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 text-sm mb-2">Email Publik</label>
                  <input 
                    value={profile.email}
                    onChange={(e) => setProfile({...profile, email: e.target.value})}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-brand outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 text-sm mb-2">Lokasi</label>
                  <input 
                    value={profile.location}
                    onChange={(e) => setProfile({...profile, location: e.target.value})}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-brand outline-none"
                  />
                </div>
              </div>
              <Button type="submit" disabled={submitting} className="w-full py-4">
                <HiSave className="text-xl" /> {submitting ? 'Menyimpan...' : 'Simpan Perubahan'}
              </Button>
            </form>
          </GlassCard>
        </div>

        {/* Experience Settings */}
        <div className="space-y-8">
          <h2 className="text-3xl font-bold text-white mb-8">Riwayat Pengalaman</h2>
          
          <GlassCard className="p-8 mb-8">
            <h3 className="text-xl font-bold text-white mb-6">Tambah Pengalaman Baru</h3>
            <form onSubmit={handleAddExperience} className="space-y-4">
               <input 
                 placeholder="Nama Perusahaan"
                 value={newExperience.company}
                 onChange={(e) => setNewExperience({...newExperience, company: e.target.value})}
                 className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2 text-white outline-none"
                 required
               />
               <input 
                 placeholder="Posisi / Jabatan"
                 value={newExperience.position}
                 onChange={(e) => setNewExperience({...newExperience, position: e.target.value})}
                 className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2 text-white outline-none"
                 required
               />
               <input 
                 placeholder="Durasi (Contoh: 2020 - 2022)"
                 value={newExperience.duration}
                 onChange={(e) => setNewExperience({...newExperience, duration: e.target.value})}
                 className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2 text-white outline-none"
               />
               <textarea 
                 placeholder="Deskripsi tugas..."
                 value={newExperience.description}
                 onChange={(e) => setNewExperience({...newExperience, description: e.target.value})}
                 rows={3}
                 className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2 text-white outline-none"
               />
               <Button type="submit" className="w-full">
                 <HiPlus /> Tambah Pengalaman
               </Button>
            </form>
          </GlassCard>

          <div className="space-y-4">
            {experiences.map((exp) => (
              <GlassCard key={exp.id} className="p-4 flex items-center justify-between">
                <div>
                  <h4 className="text-white font-bold">{exp.position}</h4>
                  <p className="text-slate-500 text-xs">{exp.company} • {exp.duration}</p>
                </div>
                <button 
                  onClick={() => handleDeleteExperience(exp.id)}
                  className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                >
                  <HiTrash className="text-xl" />
                </button>
              </GlassCard>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
