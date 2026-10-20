'use client'

import type { ReactNode } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Sidebar from './Sidebar'
import Navbar from './Navbar'

const titleMap: Record<string, string> = {
  '/': 'Dashboard',
  '/toko': 'Toko',
  '/produk': 'Produk',
  '/workshop': 'Workshop',
  '/verifikasi-ai': 'Verifikasi AI',
  '/pengaturan': 'Pengaturan',
  '/profil': 'Profil Admin',
  '/ganti-password': 'Ganti Password',
}

const routes: Record<string, string> = {
  Dashboard: '/',
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

  // Halaman turunan, mis. /toko/tambah atau /produk/1/edit -> judul menu induk
  const root = `/${pathname.split('/')[1] || ''}`
  return titleMap[root] || 'Dashboard'
}

function AdminLayout({ children }: { children: ReactNode }) {
  const router = useRouter()
  const pathname = usePathname() || '/'

  const title = getTitle(pathname)

  const handleMenuChange = (menu: string) => {
    const route = routes[menu]

    if (route) {
      router.push(route)
    }
  }

  const handleLogout = () => {
    try {
      localStorage.removeItem('keramik_dinoyo_token')
    } catch {}

    router.push('/login')
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