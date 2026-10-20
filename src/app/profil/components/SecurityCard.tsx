'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { KeyRound, LogOut, ShieldCheck } from 'lucide-react'

export default function SecurityCard() {
  const router = useRouter()

  const logout = () => {
    try {
      localStorage.removeItem('keramik_dinoyo_token')
    } catch {}
    router.push('/login')
  }

  return (
    <section className="pf-card">
      <header className="pf-card-head">
        <div className="pf-icon">
          <ShieldCheck size={20} aria-hidden="true" />
        </div>
        <div>
          <h3>Keamanan Akun</h3>
          <p>Kelola password dan sesi login.</p>
        </div>
      </header>

      <div className="pf-body">
        <div className="pf-row line">
          <div>
            <strong>Password</strong>
            <p>Ubah password secara berkala untuk menjaga keamanan akun.</p>
          </div>
          <Link href="/ganti-password" className="pf-btn outline">
            <KeyRound size={16} aria-hidden="true" />
            Ganti Password
          </Link>
        </div>

        <div className="pf-row">
          <div>
            <strong>Keluar dari akun</strong>
            <p>Akhiri sesi login di perangkat ini.</p>
          </div>
          <button type="button" className="pf-btn danger" onClick={logout}>
            <LogOut size={16} aria-hidden="true" />
            Keluar
          </button>
        </div>
      </div>
    </section>
  )
}