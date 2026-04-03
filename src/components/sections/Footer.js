import Link from 'next/link'
import { FaGithub, FaLinkedin, FaTwitter, FaEnvelope } from 'react-icons/fa'

export default function Footer() {
  const socialLinks = [
    { icon: <FaGithub />, href: 'https://github.com/ahmadshofi23' },
    { icon: <FaLinkedin />, href: 'https://linkedin.com/in/ahmadshofi23' },
    { icon: <FaTwitter />, href: 'https://twitter.com/ahmadshofi23' },
    { icon: <FaEnvelope />, href: 'mailto:contact@ahmadshofi.dev' },
  ]

  return (
    <footer className="py-12 bg-slate-950 border-t border-white/5">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
          <Link href="/" className="text-2xl font-bold text-white flex items-center gap-2">
            <span className="text-brand">Porto</span>.dev
          </Link>
          
          <div className="flex items-center gap-6">
            {socialLinks.map((link, i) => (
              <a 
                key={i} 
                href={link.href} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-2xl text-slate-400 hover:text-brand transition-colors duration-300"
              >
                {link.icon}
              </a>
            ))}
          </div>
        </div>
        
        <div className="text-center md:text-left text-slate-500 text-sm border-t border-white/5 pt-8">
          <p>© {new Date().getFullYear()} Ahmad Shofi. All rights reserved. Built with Next.js & Flutter Identity.</p>
        </div>
      </div>
    </footer>
  )
}
