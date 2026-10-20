'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import {
  ArrowRight,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronRight,
  Shapes,
  Sparkles,
  Store,
} from 'lucide-react'

import AdminLayout from '../components/AdminLayout'
import api, { getAiAnalysisResults, getShops } from '../services/api'

const API_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/?$/, '') ||
  'http://127.0.0.1:5050'

const localShopImages: Record<string, string> = {
  'Keramik Brawijaya': '/images/keramik-brawijaya.jpg',
  'Keramik Dinoyo Makmur': '/images/keramik-dinoyo-makmur.jpg',
  'Dinoyo Ceramic House': '/images/dinoyo-ceramic-house.jpg',
}

function getShopImageUrl(image?: string | null) {
  const value = String(image || '').trim()
  if (!value) return ''
  if (/^(https?:|blob:)/.test(value)) return value
  if (value.startsWith('/images/')) return value
  if (value.startsWith('/uploads/')) return `${API_URL}${value}`
  if (value.startsWith('uploads/')) return `${API_URL}/${value}`
  if (value.startsWith('/shops/')) return `${API_URL}/uploads${value}`
  if (value.startsWith('shops/')) return `${API_URL}/uploads/${value}`
  return `${API_URL}/uploads/shops/${value}`
}

// Data contoh grafik, dipakai kalau BE belum mengirim `monthly_activity`.
const sampleValues = [8, 14, 10, 16, 12, 18, 15, 21, 19, 26, 23, 30]
const sampleActivity = sampleValues.map((value, i) => {
  const d = new Date()
  d.setDate(1)
  d.setMonth(d.getMonth() - (11 - i))
  const month = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
  return { month, value }
})

const periods = [
  { value: 3, label: '3 Bulan' },
  { value: 6, label: '6 Bulan' },
  { value: 12, label: '12 Bulan' },
]

function monthLabel(value: string) {
  const d = new Date(`${value}-01T00:00:00`)
  if (Number.isNaN(d.getTime())) return String(value)
  return d.toLocaleDateString('id-ID', { month: 'short' })
}

// Badge persen hanya tampil kalau BE mengirim angkanya.
function trendLabel(value: unknown) {
  if (typeof value !== 'number' || Number.isNaN(value)) return null
  return `${value > 0 ? '+' : ''}${value}%`
}

function toList(response: any): any[] {
  const body = response?.data?.data ?? response?.data
  if (Array.isArray(body)) return body
  if (Array.isArray(body?.items)) return body.items
  return []
}

function aiLabel(item: any) {
  const raw = String(item?.status ?? item?.verdict ?? '').toLowerCase()
  if (/(approve|valid|lolos|sesuai|success|verified|asli|selesai|ok)/.test(raw)) return 'Lolos'
  if (/(reject|tolak|gagal|invalid|fail|palsu|error)/.test(raw)) return 'Perlu dicek'
  return 'Menunggu'
}

function ShopThumb({ image, name }: { image?: string | null; name?: string }) {
  const [stage, setStage] = useState(0)
  const sources = [
    getShopImageUrl(image),
    name ? localShopImages[name] : '',
  ].filter(Boolean) as string[]
  const src = sources[stage]

  return (
    <div className="d-thumb">
      {src ? (
        <img
          src={src}
          alt={name || 'Toko keramik'}
          onError={() => setStage((v) => v + 1)}
        />
      ) : (
        <Store size={26} aria-hidden="true" />
      )}
    </div>
  )
}

const css = `
.d { display: flex; flex-direction: column; gap: 24px; width: 100%; color: #25211e; }
.d-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 20px; }
.d-title { margin: 0; font-size: 30px; line-height: 1.2; font-weight: 700; letter-spacing: -0.02em; }
.d-sub { margin: 6px 0 0; color: #8b827b; font-size: 15px; }
.d-date { display: inline-flex; align-items: center; gap: 10px; padding: 11px 16px; border: 1px solid #ece6df; border-radius: 12px; background: #fff; color: #4a423d; font-size: 15px; white-space: nowrap; }
.d-stats { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 20px; }
.d-stat { display: flex; flex-direction: column; padding: 22px 24px; border: 1px solid #ece6df; border-radius: 20px; background: #fff; color: inherit; text-decoration: none; transition: border-color 0.15s ease, box-shadow 0.15s ease; }
.d-stat:hover { border-color: #e3c3ab; box-shadow: 0 6px 18px rgba(46, 39, 34, 0.06); }
.d-stat-top { display: flex; align-items: center; justify-content: space-between; }
.d-stat-icon { display: flex; align-items: center; justify-content: center; width: 46px; height: 46px; border-radius: 14px; background: #fbeee4; color: #d27a45; }
.d-trend { padding: 4px 12px; border-radius: 999px; background: #e8f5ec; color: #237a45; font-size: 13px; font-weight: 600; }
.d-stat-value { margin-top: 26px; font-size: 36px; line-height: 1; font-weight: 700; }
.d-stat-title { margin-top: 12px; font-size: 17px; font-weight: 600; }
.d-stat-note { margin-top: 4px; color: #a59c95; font-size: 14px; }
.d-grid { display: grid; grid-template-columns: minmax(0, 1.45fr) minmax(0, 1fr); gap: 24px; align-items: stretch; }
.d-card { display: flex; flex-direction: column; padding: 28px; border: 1px solid #ece6df; border-radius: 20px; background: #fff; }
.d-card-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; }
.d-card-head h3 { margin: 0; font-size: 20px; font-weight: 700; }
.d-card-head p { margin: 6px 0 0; color: #8b827b; font-size: 15px; }
.d-card-head p.d-sample { color: #b45309; font-size: 13px; }
.d-link { display: inline-flex; align-items: center; gap: 6px; color: #d27a45; font-size: 15px; font-weight: 500; text-decoration: none; }
.d-link:hover { text-decoration: underline; }
.d-period { position: relative; }
.d-period-btn { display: inline-flex; align-items: center; justify-content: space-between; gap: 10px; min-width: 120px; padding: 9px 14px; border: 1px solid #ece6df; border-radius: 10px; background: #fff; color: #4a423d; font-size: 14px; cursor: pointer; }
.d-period-btn:hover { background: #faf8f6; }
.d-period-menu { position: absolute; z-index: 20; right: 0; top: calc(100% + 6px); min-width: 140px; padding: 6px; border: 1px solid #ece6df; border-radius: 12px; background: #fff; box-shadow: 0 10px 24px rgba(46, 39, 34, 0.1); }
.d-period-menu button { display: block; width: 100%; padding: 9px 12px; border: 0; border-radius: 8px; background: transparent; color: #4a423d; text-align: left; font-size: 14px; cursor: pointer; }
.d-period-menu button:hover, .d-period-menu button.active { background: #fbeee4; color: #c4693a; }
.d-chart { display: flex; gap: 14px; height: 270px; margin-top: 28px; }
.d-chart-y { display: flex; flex-direction: column; justify-content: space-between; padding-bottom: 28px; min-width: 24px; color: #a59c95; font-size: 13px; text-align: right; }
.d-chart-area { position: relative; flex: 1; min-width: 0; }
.d-chart-grid { position: absolute; inset: 8px 0 28px; display: flex; flex-direction: column; justify-content: space-between; }
.d-chart-grid span { display: block; width: 100%; border-top: 1px dashed #ece6df; }
.d-bars { position: absolute; inset: 0; display: grid; align-items: end; gap: 12px; }
.d-bar-item { height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: flex-end; gap: 10px; }
.d-bar-wrap { width: 100%; height: calc(100% - 38px); display: flex; align-items: flex-end; justify-content: center; }
.d-bar { width: min(38px, 60%); min-height: 4px; border-radius: 5px 5px 0 0; background: #dc9468; transition: height 0.3s ease, background 0.2s ease; }
.d-bar:hover { background: #c97b4a; }
.d-bar-item > span { color: #a59c95; font-size: 13px; }
.d-ai-item { display: flex; align-items: center; gap: 16px; margin-top: 26px; }
.d-ai-icon { display: flex; flex-shrink: 0; align-items: center; justify-content: center; width: 50px; height: 50px; border-radius: 14px; background: #fbeee4; color: #d27a45; }
.d-ai-text { flex: 1; min-width: 0; }
.d-ai-text strong { display: block; overflow: hidden; font-size: 18px; font-weight: 500; text-overflow: ellipsis; white-space: nowrap; }
.d-ai-text span { display: block; margin-top: 3px; overflow: hidden; color: #8b827b; font-size: 15px; text-overflow: ellipsis; white-space: nowrap; }
.d-badge { flex-shrink: 0; padding: 6px 14px; border: 1px solid #f3dcb8; border-radius: 8px; background: #fff4e3; color: #b9722b; font-size: 14px; }
.d-badge.good { border-color: #cfe8d7; background: #e8f5ec; color: #237a45; }
.d-badge.bad { border-color: #f3cfcb; background: #fdecec; color: #b42318; }
.d-shops { display: flex; flex-direction: column; gap: 14px; margin-top: 24px; }
.d-shop { display: flex; align-items: center; gap: 18px; padding: 16px 20px; border: 1px solid #ece6df; border-radius: 16px; background: #fff; color: inherit; text-decoration: none; transition: border-color 0.15s ease, background 0.15s ease; }
.d-shop:hover { border-color: #e3c3ab; background: #fdfbf9; }
.d-shop-go { flex-shrink: 0; color: #c9b8aa; transition: color 0.15s ease, transform 0.15s ease; }
.d-shop:hover .d-shop-go { color: #c9562e; transform: translateX(2px); }
.d-thumb { display: flex; flex: 0 0 64px; align-items: center; justify-content: center; width: 64px; height: 64px; overflow: hidden; border-radius: 8px; background: #f3efeb; color: #a59c95; }
.d-thumb img { width: 100%; height: 100%; object-fit: cover; }
.d-shop-info { flex: 1; min-width: 0; }
.d-shop-info h4 { margin: 0; overflow: hidden; font-size: 19px; font-weight: 600; text-overflow: ellipsis; white-space: nowrap; }
.d-shop-info p { margin: 4px 0 0; overflow: hidden; color: #6f665f; font-size: 15px; text-overflow: ellipsis; white-space: nowrap; }
.d-shop-info small { display: block; margin-top: 3px; color: #a59c95; font-size: 14px; }
.d-pill { flex-shrink: 0; padding: 6px 14px; border-radius: 8px; font-size: 14px; font-weight: 500; }
.d-pill.on { border: 1px solid #cfe8d7; background: #e8f5ec; color: #237a45; }
.d-pill.off { border: 1px solid #e5dfd9; background: #f3efeb; color: #7d746d; }
.d-empty { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; min-height: 120px; color: #a59c95; }
.d-empty p { margin: 0; font-size: 14px; }
@media (max-width: 1150px) { .d-stats { grid-template-columns: repeat(2, minmax(0, 1fr)); } .d-grid { grid-template-columns: 1fr; } }
@media (max-width: 700px) { .d-head { flex-direction: column; } .d-stats { grid-template-columns: 1fr; } .d-card-head { flex-direction: column; } }
`

function Dashboard() {
  const [dashboard, setDashboard] = useState<any>(null)
  const [shops, setShops] = useState<any[]>([])
  const [aiList, setAiList] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [period, setPeriod] = useState(6)
  const [open, setOpen] = useState(false)
  const [now, setNow] = useState(() => new Date())
  const menuRef = useRef<HTMLDivElement>(null)

  // Tanggal ikut berganti otomatis saat lewat tengah malam.
  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 60000)
    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      try {
        setLoading(true)
        setError('')

        const [dash, shopRes, aiRes] = await Promise.all([
          api.get('/dashboard'),
          getShops(),
          getAiAnalysisResults().catch(() => null),
        ])
        if (cancelled) return

        const data = dash.data?.data || {}
        const recent = data.recent_shops
        const all = shopRes.data?.data || []

        setDashboard(data)
        setAiList(toList(aiRes))

        if (Array.isArray(recent) && recent.length > 0) {
          setShops(recent.slice(0, 3))
        } else if (Array.isArray(all)) {
          setShops(all.slice(0, 3))
        }
      } catch (err: any) {
        if (cancelled) return
        console.error('Dashboard error:', err)
        setError(err?.response?.data?.message || 'Data dashboard gagal dimuat.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [])

  if (loading) {
    return (
      <AdminLayout>
        <div style={{ padding: 24, color: '#8b827b' }}>Memuat data dashboard...</div>
      </AdminLayout>
    )
  }

  if (error) {
    return (
      <AdminLayout>
        <div style={{ padding: 24 }}>
          <p role="alert" style={{ color: '#b91c1c', marginBottom: 12 }}>{error}</p>
          <button type="button" onClick={() => window.location.reload()}>
            Coba lagi
          </button>
        </div>
      </AdminLayout>
    )
  }

  const s = dashboard?.statistics || {}
  const totalAi = s.total_ai_verifications ?? s.ai_verifications ?? aiList.length

  const cards = [
    { title: 'Total Toko', note: 'Toko aktif', href: '/toko', value: s.total_shops ?? s.shops ?? shops.length, trend: trendLabel(s.total_shops_growth), Icon: Store },
    { title: 'Total Produk', note: 'Produk terdaftar', href: '/produk', value: s.total_products ?? s.products ?? 0, trend: trendLabel(s.total_products_growth), Icon: Sparkles },
    { title: 'Workshop', note: 'Workshop tersedia', href: '/workshop', value: s.total_workshops ?? s.workshops ?? 0, trend: trendLabel(s.total_workshops_growth), Icon: Shapes },
    { title: 'Verifikasi AI', note: 'Data pemeriksaan', href: '/verifikasi-ai', value: totalAi, trend: trendLabel(s.total_ai_verifications_growth), Icon: Check },
  ]

  const apiActivity = dashboard?.monthly_activity
  const hasReal = Array.isArray(apiActivity) && apiActivity.length > 0
  const source: { month: string; value: number }[] = hasReal ? apiActivity : sampleActivity

  const sliced = source.slice(-period)
  const maxValue = Math.max(...sliced.map((i) => Number(i.value) || 0), 1)
  const niceMax = Math.ceil(maxValue / 4) * 4
  const yTicks = [1, 0.75, 0.5, 0.25, 0].map((r) => Math.round(niceMax * r))
  const bars = sliced.map((i) => ({
    label: monthLabel(i.month),
    value: Number(i.value) || 0,
    height: Math.round(((Number(i.value) || 0) / niceMax) * 100),
  }))
  const periodLabel = periods.find((p) => p.value === period)?.label || '6 Bulan'

  const aiSorted = [...aiList].sort((a, b) => {
    const ta = new Date(a?.created_at ?? 0).getTime() || 0
    const tb = new Date(b?.created_at ?? 0).getTime() || 0
    return tb - ta
  })
  const latestAi = aiSorted[0] ?? (Array.isArray(dashboard?.recent_ai_analyses) ? dashboard.recent_ai_analyses[0] : null)
  const aiBadge = latestAi ? aiLabel(latestAi) : 'Menunggu'
  const aiBadgeClass = aiBadge === 'Lolos' ? 'good' : aiBadge === 'Perlu dicek' ? 'bad' : ''

  const today = now.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <AdminLayout>
      <style dangerouslySetInnerHTML={{ __html: css }} />

      <div className="d">
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

        <div className="d-stats">
          {cards.map(({ title, note, href, value, trend, Icon }) => (
            <Link href={href} className="d-stat" key={title}>
              <div className="d-stat-top">
                <div className="d-stat-icon"><Icon size={22} aria-hidden="true" /></div>
                {trend && <span className="d-trend">{trend}</span>}
              </div>
              <strong className="d-stat-value">{value}</strong>
              <span className="d-stat-title">{title}</span>
              <span className="d-stat-note">{note}</span>
            </Link>
          ))}
        </div>

        <div className="d-grid">
          <section className="d-card">
            <div className="d-card-head">
              <div>
                <h3>Aktivitas Toko</h3>
                <p>Data toko dalam beberapa bulan terakhir</p>
                {!hasReal && <p className="d-sample">Menampilkan data contoh.</p>}
              </div>

              <div className="d-period" ref={menuRef}>
                <button type="button" className="d-period-btn" onClick={() => setOpen((v) => !v)} aria-expanded={open}>
                  <span>{periodLabel}</span>
                  <ChevronDown size={16} aria-hidden="true" />
                </button>
                {open && (
                  <div className="d-period-menu">
                    {periods.map((p) => (
                      <button
                        key={p.value}
                        type="button"
                        className={p.value === period ? 'active' : ''}
                        onClick={() => { setPeriod(p.value); setOpen(false) }}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="d-chart">
              <div className="d-chart-y">
                {yTicks.map((t, i) => <span key={`${t}-${i}`}>{t}</span>)}
              </div>
              <div className="d-chart-area">
                <div className="d-chart-grid"><span /><span /><span /><span /><span /></div>
                <div className="d-bars" style={{ gridTemplateColumns: `repeat(${bars.length || 1}, minmax(0, 1fr))` }}>
                  {bars.map((b, i) => (
                    <div className="d-bar-item" key={`${b.label}-${i}`}>
                      <div className="d-bar-wrap">
                        <div className="d-bar" style={{ height: `${b.height}%` }} title={`${b.label}: ${b.value}`} />
                      </div>
                      <span>{b.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="d-card">
            <div className="d-card-head">
              <div>
                <h3>Verifikasi AI</h3>
                <p>Status pemeriksaan terbaru</p>
              </div>
              <Link href="/verifikasi-ai" className="d-link">
                Lihat semua <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </div>

            <div className="d-ai-item">
              <div className="d-ai-icon"><Sparkles size={22} aria-hidden="true" /></div>
              <div className="d-ai-text">
                <strong>
                  {latestAi
                    ? latestAi.product?.name || latestAi.product_name || latestAi.title || 'Hasil analisis'
                    : 'Belum ada pemeriksaan'}
                </strong>
                <span>
                  {latestAi
                    ? latestAi.summary || latestAi.analysis || 'Hasil analisis AI'
                    : 'Belum ada hasil analisis AI'}
                </span>
              </div>
              <span className={`d-badge ${aiBadgeClass}`}>{aiBadge}</span>
            </div>
          </section>
        </div>

        <section className="d-card">
          <div className="d-card-head">
            <div>
              <h3>Toko Terbaru</h3>
              <p>Daftar toko yang terdaftar di Kampung Keramik Dinoyo</p>
            </div>
            <Link href="/toko" className="d-link">
              Lihat semua <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>

          <div className="d-shops">
            {shops.length === 0 ? (
              <div className="d-empty">
                <Store size={28} aria-hidden="true" />
                <p>Belum ada data toko.</p>
              </div>
            ) : (
              shops.map((shop) => (
                <Link href={`/toko?shop=${shop.id}`} className="d-shop" key={shop.id}>
                  <ShopThumb image={shop.image} name={shop.name} />
                  <div className="d-shop-info">
                    <h4>{shop.name || 'Nama toko'}</h4>
                    <p>{shop.address || shop.description || 'Kampung Keramik Dinoyo'}</p>
                    <small>{shop.is_active ? 'Toko aktif' : 'Toko tidak aktif'}</small>
                  </div>
                  <span className={`d-pill ${shop.is_active ? 'on' : 'off'}`}>
                    {shop.is_active ? 'Aktif' : 'Tidak aktif'}
                  </span>
                  <ChevronRight size={20} className="d-shop-go" aria-hidden="true" />
                </Link>
              ))
            )}
          </div>
        </section>
      </div>
    </AdminLayout>
  )
}

export default Dashboard