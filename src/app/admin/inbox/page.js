'use client'

import { useState, useEffect } from 'react'
import { messageService } from '@/services/messageService'
import GlassCard from '@/components/ui/GlassCard'
import { HiMail, HiMailOpen, HiTrash, HiClock } from 'react-icons/hi'
import { toast } from 'react-hot-toast'
import { formatDistanceToNow } from 'date-fns'

export default function InboxAdmin() {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)

  const loadMessages = async () => {
    try {
      const data = await messageService.getAllMessages()
      setMessages(data || [])
    } catch (err) {
      toast.error('Gagal memuat pesan')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadMessages()
  }, [])

  const handleMarkAsRead = async (id) => {
    try {
      await messageService.markAsRead(id)
      setMessages(messages.map(m => m.id === id ? { ...m, is_read: true } : m))
    } catch (err) {
      toast.error('Gagal memperbarui status')
    }
  }

  const handleDelete = async (id) => {
    if (confirm('Hapus pesan ini?')) {
      try {
        await messageService.deleteMessage(id)
        setMessages(messages.filter(m => m.id !== id))
        toast.success('Pesan dihapus')
      } catch (err) {
        toast.error('Gagal menghapus pesan')
      }
    }
  }

  if (loading) return <div className="p-12 text-white">Loading Inbox...</div>

  return (
    <div className="p-6 md:p-12">
      <header className="mb-12">
        <h1 className="text-3xl font-bold text-white mb-2">Inbox Masuk</h1>
        <p className="text-slate-400">Anda memiliki {messages.filter(m => !m.is_read).length} pesan baru.</p>
      </header>

      <div className="space-y-6">
        {messages.length > 0 ? messages.map((msg) => (
          <GlassCard 
            key={msg.id} 
            className={`p-6 transition-all duration-300 border-l-4 ${msg.is_read ? 'border-l-transparent' : 'border-l-brand'}`}
          >
            <div className="flex flex-col md:flex-row justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-bold text-white">{msg.name}</h3>
                  <span className="text-slate-500 text-sm flex items-center gap-1">
                    <HiClock /> {formatDistanceToNow(new Date(msg.created_at), { addSuffix: true })}
                  </span>
                </div>
                <p className="text-brand text-sm mb-4">{msg.email}</p>
                <div className="bg-slate-950/50 p-4 rounded-xl text-slate-300 whitespace-pre-wrap italic">
                   "{msg.message}"
                </div>
              </div>

              <div className="flex md:flex-col gap-3 justify-end">
                {!msg.is_read && (
                  <button 
                    onClick={() => handleMarkAsRead(msg.id)}
                    className="p-3 bg-brand/10 border border-brand/20 rounded-xl text-brand hover:bg-brand/20 transition-all flex items-center gap-2"
                    title="Tandai sudah dibaca"
                  >
                    <HiMailOpen className="text-xl" />
                  </button>
                )}
                <button 
                  onClick={() => handleDelete(msg.id)}
                  className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 hover:bg-red-500/20 transition-all flex items-center gap-2"
                  title="Hapus pesan"
                >
                  <HiTrash className="text-xl" />
                </button>
              </div>
            </div>
          </GlassCard>
        )) : (
          <div className="text-center py-24 text-slate-500">
            <HiMail className="text-6xl mx-auto mb-4 opacity-10" />
            <p className="text-xl font-medium">Kotak masuk kosong</p>
          </div>
        )}
      </div>
    </div>
  )
}
