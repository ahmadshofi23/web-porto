'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { authService } from '@/services/authService'

export function useAuth(requireAuth = true) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    async function checkUser() {
      try {
        const currentUser = await authService.getCurrentUser()
        setUser(currentUser)
        
        if (requireAuth && !currentUser && pathname.startsWith('/admin') && pathname !== '/admin/login') {
          router.push('/admin/login')
        }
        
        if (!requireAuth && currentUser && pathname === '/admin/login') {
          router.push('/admin')
        }
      } catch (error) {
        console.error('Auth error:', error)
      } finally {
        setLoading(false)
      }
    }

    checkUser()

    const { data: { subscription } } = authService.onAuthStateChange((event, session) => {
      setUser(session?.user || null)
      if (event === 'SIGNED_OUT' && requireAuth) {
        router.push('/admin/login')
      }
    })

    return () => subscription.unsubscribe()
  }, [requireAuth, router, pathname])

  return { user, loading }
}
