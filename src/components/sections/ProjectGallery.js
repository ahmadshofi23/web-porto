'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { projectService } from '@/services/projectService'
import PhoneMockup from '@/components/ui/PhoneMockup'
import GlassCard from '@/components/ui/GlassCard'
import { HiOutlineExternalLink, HiOutlineCode } from 'react-icons/hi'

export default function ProjectGallery() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadProjects() {
      try {
        const data = await projectService.getAll()
        setProjects(data || [])
      } catch (error) {
        console.error('Failed to load projects:', error)
      } finally {
        setLoading(false)
      }
    }
    loadProjects()
  }, [])

  if (loading) {
    return (
      <section id="projects" className="py-24 container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {[1, 2, 3].map((n) => (
            <div key={n} className="flex flex-col gap-6 animate-pulse">
              <div className="w-[300px] h-[600px] bg-slate-800 rounded-[2.5rem] mx-auto" />
              <div className="h-6 w-3/4 bg-slate-800 rounded mx-auto" />
            </div>
          ))}
        </div>
      </section>
    )
  }

  return (
    <section id="projects" className="py-24 bg-slate-900/50 container mx-auto px-6">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold text-white mb-4">Project Unggulan</h2>
        <p className="text-slate-400 max-w-xl mx-auto">
          Koleksi aplikasi mobile yang telah saya kembangkan dengan Flutter.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 items-start justify-center">
        {projects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="flex flex-col items-center group"
          >
            <PhoneMockup className="mb-6 group-hover:scale-[1.02] transition-transform duration-500">
              <img 
                src={project.image_url || 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=2670&auto=format&fit=crop'} 
                alt={project.title}
                className="w-full h-full object-cover"
              />
            </PhoneMockup>

            <div className="text-center max-w-[300px]">
              <h3 className="text-xl font-bold text-white mb-2">{project.title}</h3>
              <p className="text-slate-400 text-sm mb-4 line-clamp-2">{project.description}</p>
              
              <div className="flex flex-wrap justify-center gap-2 mb-4">
                {(project.tech_stack || []).map(tech => (
                  <span key={tech} className="px-2 py-0.5 rounded bg-brand/10 border border-brand/20 text-brand text-[10px] font-medium uppercase tracking-wider">
                    {tech}
                  </span>
                ))}
              </div>

              <div className="flex justify-center gap-4">
                <a 
                  href={project.link_demo} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-white/60 hover:text-brand transition-colors flex items-center gap-1 text-sm font-medium"
                >
                  <HiOutlineExternalLink /> Live Demo
                </a>
                <a 
                  href={project.link_repo} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-white/60 hover:text-brand transition-colors flex items-center gap-1 text-sm font-medium"
                >
                  <HiOutlineCode /> Repo
                </a>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
