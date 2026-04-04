'use client'

import { useState, useEffect } from 'react'
import { projectService } from '@/services/projectService'
import { useAuth } from '@/hooks/useAuth'
import Button from '@/components/ui/Button'
import GlassCard from '@/components/ui/GlassCard'
import ProjectForm from '@/components/admin/ProjectForm'
import { HiPlus, HiPencil, HiTrash } from 'react-icons/hi'
import { toast } from 'react-hot-toast'

export default function AdminPage() {
  const { user, loading: authLoading } = useAuth()
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingProject, setEditingProject] = useState(null)

  const loadProjects = async () => {
    try {
      const data = await projectService.getAll()
      setProjects(data || [])
    } catch (error) {
      toast.error('Gagal memuat proyek')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user) loadProjects()
  }, [user])

  const handleDelete = async (id) => {
    if (window.confirm('Hapus proyek ini?')) {
      const deleteToast = toast.loading('Menghapus...')
      try {
        await projectService.delete(id)
        toast.success('Proyek dihapus', { id: deleteToast })
        loadProjects()
      } catch (err) {
        toast.error('Gagal menghapus', { id: deleteToast })
      }
    }
  }

  if (authLoading || loading) {
    return <div className="p-12 text-white">Loading Proyek...</div>
  }

  return (
    <div className="p-6 md:p-12">
      <header className="flex items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Manajemen Proyek</h1>
          <p className="text-slate-400">Total {projects.length} proyek diterbitkan.</p>
        </div>
        
        <Button onClick={() => { setEditingProject(null); setIsFormOpen(true); }} className="flex items-center gap-2">
          <HiPlus /> Tambah Proyek
        </Button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {projects.map((project) => (
          <GlassCard key={project.id} className="p-6">
            <div className="aspect-video w-full mb-4 rounded-lg overflow-hidden bg-slate-900 border border-white/5">
              <img 
                src={project.image_url || 'https://via.placeholder.com/300x160'} 
                alt={project.title}
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-xl font-bold text-white mb-2 truncate">{project.title}</h3>
            <p className="text-slate-400 text-sm mb-6 line-clamp-2">{project.description}</p>
            
            <div className="flex items-center justify-between gap-4 pt-4 border-t border-white/5">
               <button 
                 onClick={() => { setEditingProject(project); setIsFormOpen(true); }}
                 className="flex-1 flex items-center justify-center gap-2 py-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all text-white font-medium"
               >
                 <HiPencil /> Edit
               </button>
               <button 
                 onClick={() => handleDelete(project.id)}
                 className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 hover:bg-red-500/20 transition-all"
               >
                 <HiTrash />
               </button>
            </div>
          </GlassCard>
        ))}
      </div>

      {isFormOpen && (
        <ProjectForm 
          project={editingProject} 
          onClose={() => setIsFormOpen(false)} 
          onSuccess={() => {
            setIsFormOpen(false)
            loadProjects()
          }}
        />
      )}
    </div>
  )
}
