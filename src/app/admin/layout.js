'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { authService } from '@/services/authService'
import { HiCollection, HiUserCircle, HiInbox, HiLogout, HiGlobeAlt } from 'react-icons/hi'
import { cn } from '@/utils/cn'
import { Toaster } from 'react-hot-toast'

const menuItems = [
  { name: 'Projects', href: '/admin', icon: <HiCollection /> },
  { name: 'Profile', href: '/admin/profile', icon: <HiUserCircle /> },
  { name: 'Inbox', href: '/admin/inbox', icon: <HiInbox /> },
]

export default function AdminLayout({ children }) {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    await authService.logout()
    router.push('/admin/login')
  }

  if (pathname === '/admin/login') return children

  return (
    <div className="flex min-h-screen bg-slate-950 text-white font-inter">
      <Toaster position="top-right" />
      
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/5 bg-slate-900/50 backdrop-blur-xl fixed h-full z-20">
        <div className="p-6">
          <Link href="/" className="text-xl font-bold flex items-center gap-2 mb-10">
            <span className="text-brand">Admin</span>.porto
          </Link>

          <nav className="space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                  pathname === item.href 
                    ? "bg-brand text-slate-900 font-bold shadow-[0_0_15px_rgba(56,189,248,0.3)]" 
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                )}
              >
                <span className="text-xl">{item.icon}</span>
                {item.name}
              </Link>
            ))}
          </nav>
        </div>

        <div className="absolute bottom-0 w-full p-6 space-y-2 border-t border-white/5">
          <Link 
            href="/" 
            className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white transition-colors"
          >
            <HiGlobeAlt className="text-xl" /> View Website
          </Link>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
          >
            <HiLogout className="text-xl" /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 min-h-screen overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
