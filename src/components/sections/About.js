'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { profileService } from '@/services/profileService'
import GlassCard from '@/components/ui/GlassCard'
import { HiBriefcase, HiOutlineBadgeCheck } from 'react-icons/hi'

export default function About() {
  const [profile, setProfile] = useState(null)
  const [experiences, setExperiences] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const [profileData, expData] = await Promise.all([
          profileService.getProfile(),
          profileService.getExperiences()
        ])
        setProfile(profileData)
        setExperiences(expData || [])
      } catch (error) {
        // Silently handle table not found errors during initial setup
        if (error.code === 'PGRST205') {
          console.warn('Database tables not found. Please run database_setup.sql in Supabase SQL Editor.')
        } else {
          console.error('Failed to load about data:', error)
        }
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  if (loading) return null

  return (
    <section id="about" className="py-24 container mx-auto px-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        {/* Personal Bio */}
        <motion.div
           initial={{ opacity: 0, x: -30 }}
           whileInView={{ opacity: 1, x: 0 }}
           viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold text-white mb-8">Tentang Saya</h2>
          <div className="prose prose-invert prose-lg text-slate-400">
            <p className="mb-6 leading-relaxed">
              {profile?.bio || "Halo! Saya adalah seorang Flutter Developer yang berdedikasi membangun aplikasi yang indah dan fungsional."}
            </p>
          </div>
          
          <div className="flex flex-wrap gap-4 mt-8">
            <div className="flex items-center gap-2 text-slate-300">
              <HiOutlineBadgeCheck className="text-brand text-xl" />
              <span>Problem Solver</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <HiOutlineBadgeCheck className="text-brand text-xl" />
              <span>Clean Code Advocate</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <HiOutlineBadgeCheck className="text-brand text-xl" />
              <span>UI/UX Focused</span>
            </div>
          </div>
        </motion.div>

        {/* Experience Timeline */}
        <motion.div
           initial={{ opacity: 0, x: 30 }}
           whileInView={{ opacity: 1, x: 0 }}
           viewport={{ once: true }}
        >
          <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
            <HiBriefcase className="text-brand" /> Pengalaman Kerja
          </h3>
          
          <div className="space-y-8 border-l border-white/10 ml-4 pl-8 pt-2">
            {experiences.length > 0 ? experiences.map((exp, index) => (
              <div key={exp.id} className="relative">
                <div className="absolute -left-[41px] top-1 w-4 h-4 rounded-full bg-brand shadow-[0_0_10px_rgba(56,189,248,0.5)] border-4 border-slate-950" />
                <h4 className="text-xl font-bold text-white">{exp.position}</h4>
                <div className="flex items-center justify-between text-brand text-sm mb-2">
                  <span>{exp.company}</span>
                  <span className="text-slate-500">{exp.duration}</span>
                </div>
                <p className="text-slate-400 text-sm leading-relaxed">{exp.description}</p>
              </div>
            )) : (
              <p className="text-slate-500 italic">Belum ada pengalaman yang ditambahkan.</p>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
