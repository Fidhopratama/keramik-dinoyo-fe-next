
'use client'

import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Sidebar from './Sidebar'
import Navbar from './Navbar'
import { getMe } from '../services/api'

const TOKEN_KEY = 'keramik_dinoyo_token'

const titleMap: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/toko': 'Toko',
  '/produk': 'Produk',
  '/workshop': 'Workshop',
  '/verifikasi-ai': 'Verifikasi AI',
  '/pengaturan': 'Pengaturan',
  '/profil': 'Profil Admin',
  '/ganti-password': 'Ganti Password',
}

const routes: Record<string, string> = {
  Dashboard: '/dashboard',
  Toko: '/toko',
  Produk: '/produk',
  Workshop: '/workshop',
  'Verifikasi AI': '/verifikasi-ai',
  Pengaturan: '/pengaturan',
  'Profil Admin': '/profil',
  'Ganti Password': '/ganti-password',
}

function getTitle(pathname: string) {
  if (titleMap[pathname]) return titleMap[pathname]

  const root = `/${pathname.split('/')[1] || ''}`
  return titleMap[root] || 'Dashboard'
}

function AdminLayout({ children }: { children: ReactNode }) {
  const router = useRouter()
  const pathname = usePathname() || '/'
  const [authorized, setAuthorized] = useState(false)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    let active = true

    const checkAdmin = async () => {
      setChecking(true)
      setAuthorized(false)

      const redirectToLogin = () => {
        const next = encodeURIComponent(pathname)
        router.replace(`/login?next=${next}`)
      }

      try {
        const token = localStorage.getItem(TOKEN_KEY)

        if (!token) {
          redirectToLogin()
          return
        }

        const response = await getMe()
        const user = response.data?.data?.user

        if (
          user?.role?.name !== 'admin' ||
          user?.is_active !== true
        ) {
          localStorage.removeItem(TOKEN_KEY)
          redirectToLogin()
          return
        }

        if (active) {
          setAuthorized(true)
        }
      } catch (error) {
        console.error('Pemeriksaan sesi admin gagal:', error)

        if (active) {
          localStorage.removeItem(TOKEN_KEY)
          redirectToLogin()
        }
      } finally {
        if (active) {
          setChecking(false)
        }
      }
    }

    checkAdmin()

    return () => {
      active = false
    }
  }, [pathname, router])

  const title = getTitle(pathname)

  const handleMenuChange = (menu: string) => {
    const route = routes[menu]

    if (route && route !== pathname) {
      router.push(route)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem(TOKEN_KEY)
    router.replace('/login')
  }

  if (checking || !authorized) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        Memeriksa sesi admin...
      </div>
    )
  }

  return (
    <div className="app">
      <Sidebar onLogout={handleLogout} />

      <main className="main-content">
        <Navbar
          title={title}
          onLogout={handleLogout}
          onMenuChange={handleMenuChange}
        />

        <section className="content">{children}</section>
      </main>
    </div>
  )
}

export default AdminLayout
