'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { projectService } from '@/services/projectService'
import { authService } from '@/services/authService'
import { useAuth } from '@/hooks/useAuth'
import Button from '@/components/ui/Button'
import GlassCard from '@/components/ui/GlassCard'
import ProjectForm from '@/components/admin/ProjectForm'
import { HiPlus, HiPencil, HiTrash, HiLogout } from 'react-icons/hi'

export default function AdminPage() {
  const { user, loading: authLoading } = useAuth(true)
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingProject, setEditingProject] = useState(null)
  const router = useRouter()

  const loadProjects = async () => {
    try {
      const data = await projectService.getAll()
      setProjects(data || [])
    } catch (error) {
      console.error('Failed to load projects:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user) loadProjects()
  }, [user])

  const handleLogout = async () => {
    await authService.logout()
    router.push('/admin/login')
  }

  const handleDelete = async (id) => {
    if (window.confirm('Delete this project?')) {
      await projectService.delete(id)
      loadProjects()
    }
  }

  const handleEdit = (project) => {
    setEditingProject(project)
    setIsFormOpen(true)
  }

  const handleAdd = () => {
    setEditingProject(null)
    setIsFormOpen(true)
  }

  if (authLoading || loading) {
    return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">Loading Admin...</div>
  }

  return (
    <div className="min-h-screen bg-slate-950 p-6 md:p-12">
      <div className="container mx-auto">
        <header className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Project Management</h1>
            <p className="text-slate-400">Total {projects.length} projects published.</p>
          </div>
          
          <div className="flex items-center gap-4">
            <Button onClick={handleAdd} className="flex items-center gap-2">
              <HiPlus /> New Project
            </Button>
            <button 
              onClick={handleLogout}
              className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 hover:bg-red-500/20 transition-all"
            >
              <HiLogout />
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <GlassCard key={project.id} className="p-6">
              <div className="aspect-video w-full mb-4 rounded-lg overflow-hidden bg-slate-900">
                <img 
                  src={project.image_url || 'https://via.placeholder.com/300x160'} 
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-bold text-white mb-2 truncate">{project.title}</h3>
              <p className="text-slate-400 text-sm mb-6 line-clamp-2">{project.description}</p>
              
              <div className="flex items-center justify-between gap-4">
                 <Button 
                   variant="glass" 
                   onClick={() => handleEdit(project)}
                   className="flex-1 py-3"
                 >
                   <HiPencil /> Edit
                 </Button>
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
