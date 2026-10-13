'use client'

import { usePathname, useRouter } from 'next/navigation'
import Sidebar from './Sidebar'
import Navbar from './Navbar'

const titleMap = {
  '/': 'Dashboard',
  '/toko': 'Toko',
  '/produk': 'Produk',
  '/workshop': 'Workshop',
  '/verifikasi-ai': 'Verifikasi AI',
  '/pengaturan': 'Pengaturan',
}

function AdminLayout({ children }) {
  const router = useRouter()
  const pathname = usePathname()

  const title =
    titleMap[pathname] || 'Dashboard'

  const handleMenuChange = (menu) => {
    const routes = {
      Dashboard: '/',
      Toko: '/toko',
      Produk: '/produk',
      Workshop: '/workshop',
      'Verifikasi AI': '/verifikasi-ai',
      Pengaturan: '/pengaturan',
      'Profil Admin':
        '/pengaturan?section=profil',
      'Ganti Password':
        '/pengaturan?section=keamanan',
    }

    const route = routes[menu]

    if (route) {
      router.push(route)
    }
  }

  const handleLogout = () => {
    try {
      localStorage.removeItem(
        'keramik_dinoyo_token',
      )
    } catch {}

    router.push('/login')
  }

  return (
    <div className="app">
      <Sidebar
        onLogout={handleLogout}
      />

      <main className="main-content">
        <Navbar
          title={title}
          onLogout={handleLogout}
          onMenuChange={handleMenuChange}
        />

        <section className="content">
          {children}
        </section>
      </main>
    </div>
  )
}

export default AdminLayout