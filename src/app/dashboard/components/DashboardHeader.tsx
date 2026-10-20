'use client'

import { useEffect, useState } from 'react'
import { CalendarDays } from 'lucide-react'

export default function DashboardHeader() {
  const [now, setNow] = useState(() => new Date())

  // Tanggal ikut berganti otomatis saat lewat tengah malam.
  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 60000)
    return () => window.clearInterval(timer)
  }, [])

  const today = now.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <div className="d-head">
      <div>
        <h2 className="d-title">Overview</h2>
        <p className="d-sub">Pantau aktivitas Kampung Keramik Dinoyo.</p>
      </div>

      <div className="d-date">
        <CalendarDays size={18} aria-hidden="true" />
        <span>{today}</span>
      </div>
    </div>
  )
}
