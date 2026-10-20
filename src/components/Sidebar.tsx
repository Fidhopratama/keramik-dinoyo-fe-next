'use client'

import {
  LayoutDashboard,
  LogOut,
  Package,
  Shapes,
  Settings,
  Sparkles,
  Store,
} from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'

const menuItems = [
  { label: 'Dashboard', path: '/', icon: LayoutDashboard },
  { label: 'Toko', path: '/toko', icon: Store },
  { label: 'Produk', path: '/produk', icon: Package },
  { label: 'Workshop', path: '/workshop', icon: Shapes },
  { label: 'Verifikasi AI', path: '/verifikasi-ai', icon: Sparkles },
]

const settingsPaths = ['/pengaturan', '/profil', '/ganti-password']

function Sidebar({ onLogout }: { onLogout?: () => void }) {
  const router = useRouter()
  const pathname = usePathname() || '/'

  const goTo = (path: string) => {
    router.push(path)
  }

  const isSettings = settingsPaths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  )

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-logo has-image">
          <img src="/images/logodinoyo.png" alt="Logo Keramik Dinoyo" />
        </div>

        <div>
          <h1>Keramik Dinoyo</h1>
          <span>Admin Dashboard</span>
        </div>
      </div>

      <nav className="sidebar-menu" aria-label="Menu utama">
        <p className="menu-title">MENU UTAMA</p>

        {menuItems.map(({ label, path, icon: Icon }) => {
          // Menu induk tetap menyala di halaman turunan (/toko/tambah, dst.)
          const active =
            path === '/' ? pathname === '/' : pathname.startsWith(path)

          return (
            <button
              key={label}
              type="button"
              className={`menu-item ${active ? 'active' : ''}`}
              aria-current={active ? 'page' : undefined}
              onClick={() => goTo(path)}
            >
              <span className="menu-icon">
                <Icon size={18} aria-hidden="true" />
              </span>

              <span>{label}</span>
            </button>
          )
        })}
      </nav>

      <div className="sidebar-bottom">
        <button
          type="button"
          className={`menu-item ${isSettings ? 'active' : ''}`}
          aria-current={isSettings ? 'page' : undefined}
          onClick={() => goTo('/pengaturan')}
        >
          <span className="menu-icon">
            <Settings size={18} aria-hidden="true" />
          </span>

          <span>Pengaturan</span>
        </button>

        <button
          type="button"
          className="logout-button"
          onClick={() => onLogout?.()}
        >
          <LogOut size={18} aria-hidden="true" />
          Keluar
        </button>
      </div>

      <style jsx>{`
        .brand-logo.has-image {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          width: 56px;
          height: 56px;
          padding: 6px;
          box-sizing: border-box;
          border-radius: 16px;
          background: #fbf3ec;
        }

        .brand-logo.has-image img {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        .menu-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        .logout-button {
          display: flex;
          align-items: center;
          gap: 10px;
        }
      `}</style>
    </aside>
  )
}

export default Sidebar