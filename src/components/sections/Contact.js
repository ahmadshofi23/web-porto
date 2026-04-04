'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { messageService } from '@/services/messageService'
import Button from '@/components/ui/Button'
import GlassCard from '@/components/ui/GlassCard'
import { toast } from 'react-hot-toast'
import { HiMail, HiUser, HiChatAlt } from 'react-icons/hi'

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const toastId = toast.loading('Mengirim pesan...')

    try {
      await messageService.sendMessage(formData)
      toast.success('Pesan terkirim! Saya akan segera menghubungi Anda.', { id: toastId })
      setFormData({ name: '', email: '', subject: '', message: '' })
    } catch (err) {
      toast.error('Gagal mengirim pesan. Silakan coba lagi.', { id: toastId })
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="contact" className="py-24 bg-slate-900/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">Hubungi Saya</h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            Punya proyek menarik atau sekadar ingin menyapa? Silakan isi formulir di bawah ini.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <GlassCard className="p-8 md:p-12">
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="relative">
                  <HiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-xl" />
                  <input
                    type="text"
                    placeholder="Nama Lengkap"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-slate-950 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white focus:border-brand outline-none transition-all"
                  />
                </div>
                <div className="relative">
                  <HiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-xl" />
                  <input
                    type="email"
                    placeholder="Email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-slate-950 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white focus:border-brand outline-none transition-all"
                  />
                </div>
                <div className="relative">
                  <HiChatAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-xl" />
                  <input
                    type="text"
                    placeholder="Subjek"
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    className="w-full bg-slate-950 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white focus:border-brand outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-6 flex flex-col">
                <textarea
                  placeholder="Pesan Anda..."
                  required
                  rows={6}
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  className="w-full flex-1 bg-slate-950 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-brand outline-none transition-all resize-none"
                />
                <Button type="submit" disabled={loading} className="py-4 text-lg">
                  {loading ? 'Mengirim...' : 'Kirim Pesan'}
                </Button>
              </div>
            </form>
          </GlassCard>
        </div>
      </div>
    </section>
  )
}
