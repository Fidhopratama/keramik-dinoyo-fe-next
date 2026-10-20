import Link from 'next/link'
import { Check, Shapes, Sparkles, Store } from 'lucide-react'

import { trendLabel } from '../../../lib/dashboard'

type Props = {
  statistics: any
  shopCount: number
  aiCount: number
}

export default function StatCards({ statistics, shopCount, aiCount }: Props) {
  const s = statistics || {}

  const cards = [
    { title: 'Total Toko', note: 'Toko aktif', href: '/toko', value: s.total_shops ?? s.shops ?? shopCount, trend: trendLabel(s.total_shops_growth), Icon: Store },
    { title: 'Total Produk', note: 'Produk terdaftar', href: '/produk', value: s.total_products ?? s.products ?? 0, trend: trendLabel(s.total_products_growth), Icon: Sparkles },
    { title: 'Workshop', note: 'Workshop tersedia', href: '/workshop', value: s.total_workshops ?? s.workshops ?? 0, trend: trendLabel(s.total_workshops_growth), Icon: Shapes },
    { title: 'Verifikasi AI', note: 'Data pemeriksaan', href: '/verifikasi-ai', value: aiCount, trend: trendLabel(s.total_ai_verifications_growth), Icon: Check },
  ]

  return (
    <div className="d-stats">
      {cards.map(({ title, note, href, value, trend, Icon }) => (
        <Link href={href} className="d-stat" key={title}>
          <div className="d-stat-top">
            <div className="d-stat-icon">
              <Icon size={22} aria-hidden="true" />
            </div>
            {trend && <span className="d-trend">{trend}</span>}
          </div>

          <strong className="d-stat-value">{value}</strong>
          <span className="d-stat-title">{title}</span>
          <span className="d-stat-note">{note}</span>
        </Link>
      ))}
    </div>
  )
}