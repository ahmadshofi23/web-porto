'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { projectService } from '@/services/projectService'
import Button from '@/components/ui/Button'
import GlassCard from '@/components/ui/GlassCard'
import { HiX } from 'react-icons/hi'

export default function ProjectForm({ project, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image_url: '',
    tech_stack: '',
    link_demo: '',
    link_repo: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (project) {
      setFormData({
        ...project,
        tech_stack: project.tech_stack ? project.tech_stack.join(', ') : '',
      })
    }
  }, [project])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const payload = {
      ...formData,
      tech_stack: formData.tech_stack.split(',').map((s) => s.trim()).filter(Boolean),
    }

    try {
      if (project) {
        await projectService.update(project.id, payload)
      } else {
        await projectService.create(payload)
      }
      onSuccess()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 sm:p-12 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
      />
      
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="w-full max-w-2xl relative z-10"
      >
        <GlassCard className="p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-white">
              {project ? 'Edit Project' : 'Add New Project'}
            </h2>
            <button onClick={onClose} className="text-slate-400 hover:text-white text-2xl transition-colors">
              <HiX />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {error && (
              <div className="md:col-span-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm text-center">
                {error}
              </div>
            )}

            <div className="md:col-span-2">
              <label className="block text-slate-400 text-sm font-medium mb-2">Project Title</label>
              <input
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand transition-colors"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-slate-400 text-sm font-medium mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-slate-400 text-sm font-medium mb-2">Image URL</label>
              <input
                name="image_url"
                value={formData.image_url}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand transition-colors"
                placeholder="https://..."
              />
            </div>

            <div>
              <label className="block text-slate-400 text-sm font-medium mb-2">Tech Stack (comma separated)</label>
              <input
                name="tech_stack"
                value={formData.tech_stack}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand transition-colors"
                placeholder="Flutter, Firebase, Bloc..."
              />
            </div>

            <div>
              <label className="block text-slate-400 text-sm font-medium mb-2">Demo Link</label>
              <input
                name="link_demo"
                value={formData.link_demo}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand transition-colors"
                placeholder="https://..."
              />
            </div>

            <div>
              <label className="block text-slate-400 text-sm font-medium mb-2">Repository Link</label>
              <input
                name="link_repo"
                value={formData.link_repo}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand transition-colors"
                placeholder="https://github.com/..."
              />
            </div>

            <div className="md:col-span-2 flex gap-4 pt-4">
              <Button type="submit" className="flex-1 py-4" disabled={loading}>
                {loading ? 'Saving...' : project ? 'Update Project' : 'Publish Project'}
              </Button>
              <Button variant="glass" onClick={onClose} className="px-8 py-4">
                Cancel
              </Button>
            </div>
          </form>
        </GlassCard>
      </motion.div>
    </div>
  )
}
