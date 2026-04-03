'use client'

import { motion } from 'framer-motion'
import Button from '@/components/ui/Button'

export default function Hero() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  }

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center pt-20 overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-1/4 -left-20 w-72 h-72 bg-brand/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 -right-20 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-700" />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="container mx-auto px-6 text-center relative z-10"
      >
        <motion.div variants={item} className="inline-block px-4 py-1 rounded-full border border-brand/30 bg-brand/5 text-brand text-sm font-medium mb-6">
          Flutter Developer Expert
        </motion.div>
        
        <motion.h1 
          variants={item}
          className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight"
        >
          Membangun Aplikasi <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand to-cyan-300">
            Cepat, Kuat & Skalabel
          </span>
        </motion.h1>

        <motion.p 
          variants={item}
          className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10"
        >
          Berpengalaman dalam pengembangan aplikasi mobile multi-platform menggunakan Flutter. 
          Fokus pada performa tinggi, desain UI yang bersih, dan pengalaman pengguna yang luar biasa.
        </motion.p>

        <motion.div variants={item} className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button variant="primary" className="w-full sm:w-auto px-10 py-4 text-lg">
            Lihat Project
          </Button>
          <Button variant="outline" className="w-full sm:w-auto px-10 py-4 text-lg">
            Unduh CV
          </Button>
        </motion.div>
      </motion.div>
    </section>
  )
}
