'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

import {
  ArrowRight,
  CalendarDays,
  Check,
  ChevronDown,
  Sparkles,
  Store,
} from 'lucide-react'

import AdminLayout from '../components/AdminLayout'
import StatCard from '../components/StatCard'
import api, { getShops } from '../services/api'

const API_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/?$/, '') ||
  'http://127.0.0.1:5050'

const shopImages = {
  'Keramik Brawijaya': '/images/keramik-brawijaya.jpg',
  'Keramik Dinoyo Makmur': '/images/keramik-dinoyo-makmur.jpg',
  'Dinoyo Ceramic House': '/images/dinoyo-ceramic-house.jpg',
}

function getShopImageUrl(image) {
  if (!image) return ''

  const value = String(image).trim()

  if (!value) return ''

  if (
    value.startsWith('http://') ||
    value.startsWith('https://') ||
    value.startsWith('blob:')
  ) {
    return value
  }

  if (value.startsWith('/images/')) {
    return value
  }

  if (value.startsWith('/uploads/shops/')) {
    return `${API_URL}${value}`
  }

  if (value.startsWith('uploads/shops/')) {
    return `${API_URL}/${value}`
  }

  if (value.startsWith('/uploads/')) {
    return `${API_URL}${value}`
  }

  if (value.startsWith('uploads/')) {
    return `${API_URL}/${value}`
  }

  if (value.startsWith('/shops/')) {
    return `${API_URL}/uploads${value}`
  }

  if (value.startsWith('shops/')) {
    return `${API_URL}/uploads/${value}`
  }

  return `${API_URL}/uploads/shops/${value}`
}

const monthlyActivity = [
  { month: 'Okt', height: 40 },
  { month: 'Nov', height: 52 },
  { month: 'Des', height: 45 },
  { month: 'Jan', height: 58 },
  { month: 'Feb', height: 50 },
  { month: 'Mar', height: 62 },
  { month: 'Apr', height: 48 },
  { month: 'Mei', height: 64 },
  { month: 'Jun', height: 54 },
  { month: 'Jul', height: 78 },
  { month: 'Agu', height: 66 },
  { month: 'Sep', height: 88 },
]

const periodOptions = [
  { value: 3, label: '3 Bulan' },
  { value: 6, label: '6 Bulan' },
  { value: 12, label: '12 Bulan' },
]

function Dashboard() {
  const [dashboard, setDashboard] = useState(null)
  const [recentShops, setRecentShops] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [period, setPeriod] = useState(6)
  const [periodOpen, setPeriodOpen] = useState(false)

  const periodRef = useRef(null)

  useEffect(() => {
    let cancelled = false

    const fetchDashboard = async () => {
      try {
        setLoading(true)
        setError('')

        const [dashboardResponse, shopsResponse] = await Promise.all([
          api.get('/dashboard'),
          getShops(),
        ])

        if (cancelled) return

        const dashboardData = dashboardResponse.data?.data || {}
        const dashboardRecentShops = dashboardData.recent_shops
        const shopsData = shopsResponse.data?.data || []

        setDashboard(dashboardData)

        if (
          Array.isArray(dashboardRecentShops) &&
          dashboardRecentShops.length > 0
        ) {
          setRecentShops(dashboardRecentShops.slice(0, 5))
        } else if (Array.isArray(shopsData)) {
          setRecentShops(shopsData.slice(0, 5))
        } else {
          setRecentShops([])
        }
      } catch (err) {
        if (cancelled) return

        console.error('Dashboard error:', err)

        setError(
          err.response?.data?.message ||
            'Data dashboard gagal dimuat.',
        )
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    fetchDashboard()

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    const handleClick = (event) => {
      if (
        periodRef.current &&
        !periodRef.current.contains(event.target)
      ) {
        setPeriodOpen(false)
      }
    }

    const handleKey = (event) => {
      if (event.key === 'Escape') {
        setPeriodOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClick)
    document.addEventListener('keydown', handleKey)

    return () => {
      document.removeEventListener('mousedown', handleClick)
      document.removeEventListener('keydown', handleKey)
    }
  }, [])

  if (loading) {
    return (
      <AdminLayout>
        <div className="card">
          <p>Memuat data dashboard...</p>
        </div>
      </AdminLayout>
    )
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="card">
          <p role="alert">{error}</p>
        </div>
      </AdminLayout>
    )
  }

  const statistics = dashboard?.statistics || {}
  const chartBars = monthlyActivity.slice(-period)

  const periodLabel =
    periodOptions.find((option) => option.value === period)?.label ||
    '6 Bulan'

  return (
    <AdminLayout>
      <div className="dashboard-page">
        <div className="dashboard-header">
          <div>
            <h1>Dashboard</h1>
            <p>Ringkasan aktivitas Kampung Keramik Dinoyo.</p>
          </div>

          <div className="dashboard-date">
            <CalendarDays size={18} aria-hidden="true" />
            <span>
              {new Date().toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </span>
          </div>
        </div>

        <div className="dashboard-stats">
          <StatCard
            title="Total Toko"
            value={
              statistics.total_shops ??
              statistics.shops ??
              recentShops.length
            }
            icon={Store}
          />

          <StatCard
            title="Total Produk"
            value={
              statistics.total_products ??
              statistics.products ??
              0
            }
            icon={Sparkles}
          />

          <StatCard
            title="Workshop"
            value={
              statistics.total_workshops ??
              statistics.workshops ??
              0
            }
            icon={CalendarDays}
          />

          <StatCard
            title="Verifikasi AI"
            value={
              statistics.total_ai_verifications ??
              statistics.ai_verifications ??
              0
            }
            icon={Check}
          />
        </div>

        <div className="dashboard-main-grid">
          <div className="card dashboard-chart-card">
            <div className="dashboard-card-header">
              <div>
                <h2>Aktivitas</h2>
                <p>
                  Aktivitas kampung keramik berdasarkan periode.
                </p>
              </div>

              <div className="dashboard-period" ref={periodRef}>
                <button
                  type="button"
                  className="dashboard-period-button"
                  onClick={() => setPeriodOpen((value) => !value)}
                  aria-expanded={periodOpen}
                >
                  <span>{periodLabel}</span>
                  <ChevronDown size={16} aria-hidden="true" />
                </button>

                {periodOpen && (
                  <div className="dashboard-period-menu">
                    {periodOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        className={
                          option.value === period ? 'active' : ''
                        }
                        onClick={() => {
                          setPeriod(option.value)
                          setPeriodOpen(false)
                        }}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="dashboard-chart">
              <div className="dashboard-chart-y">
                <span>100</span>
                <span>75</span>
                <span>50</span>
                <span>25</span>
                <span>0</span>
              </div>

              <div className="dashboard-chart-area">
                <div className="dashboard-chart-grid">
                  <span />
                  <span />
                  <span />
                  <span />
                  <span />
                </div>

                <div
                  className="dashboard-bars"
                  style={{
                    gridTemplateColumns: `repeat(${chartBars.length}, minmax(0, 1fr))`,
                  }}
                >
                  {chartBars.map((item) => (
                    <div
                      className="dashboard-bar-item"
                      key={item.month}
                    >
                      <div className="dashboard-bar-wrapper">
                        <div
                          className="dashboard-bar"
                          style={{ height: `${item.height}%` }}
                          title={`${item.month}: ${item.height}`}
                        />
                      </div>

                      <span>{item.month}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="card dashboard-ai-card">
            <div className="dashboard-card-header">
              <div>
                <h2>Verifikasi AI</h2>
                <p>Ringkasan hasil verifikasi produk.</p>
              </div>

              <div className="dashboard-ai-icon">
                <Sparkles size={20} aria-hidden="true" />
              </div>
            </div>

            <div className="dashboard-ai-content">
              <div className="dashboard-ai-number">
                {statistics.total_ai_verifications ??
                  statistics.ai_verifications ??
                  0}
              </div>

              <div className="dashboard-ai-label">
                Total verifikasi
              </div>

              <div className="dashboard-ai-status">
                <span className="dashboard-ai-status-icon">
                  <Check size={14} aria-hidden="true" />
                </span>
                <span>Sistem verifikasi AI aktif</span>
              </div>
            </div>

            <div className="dashboard-ai-footer">
              <span>Analisis kualitas produk</span>
              <ArrowRight size={18} aria-hidden="true" />
            </div>
          </div>
        </div>

        <div className="card dashboard-shops-card">
          <div className="dashboard-card-header">
            <div>
              <h2>Toko Terbaru</h2>
              <p>
                Daftar toko yang terdaftar di Kampung Keramik Dinoyo.
              </p>
            </div>

            <Link href="/toko" className="dashboard-view-all">
              Lihat semua
              <ArrowRight size={17} aria-hidden="true" />
            </Link>
          </div>

          <div className="dashboard-shops-list">
            {recentShops.length === 0 ? (
              <div className="dashboard-empty">
                <Store size={32} aria-hidden="true" />
                <p>Belum ada data toko.</p>
              </div>
            ) : (
              recentShops.map((shop) => {
                const imageUrl = getShopImageUrl(shop.image)

                return (
                  <div
                    className="dashboard-shop-item"
                    key={shop.id}
                  >
                    <div className="dashboard-shop-image">
                      {imageUrl && (
                        <img
                          src={imageUrl}
                          alt={shop.name || 'Toko keramik'}
                          onError={(event) => {
                            event.currentTarget.style.display = 'none'

                            const fallback =
                              event.currentTarget.nextElementSibling

                            if (fallback) {
                              fallback.style.display = 'flex'
                            }
                          }}
                        />
                      )}

                      <div
                        className="dashboard-shop-image-fallback"
                        style={{
                          display: imageUrl ? 'none' : 'flex',
                        }}
                      >
                        {shopImages[shop.name] ? (
                          <img
                            src={shopImages[shop.name]}
                            alt={shop.name || 'Toko keramik'}
                          />
                        ) : (
                          <Store size={28} aria-hidden="true" />
                        )}
                      </div>
                    </div>

                    <div className="dashboard-shop-info">
                      <h3>{shop.name || 'Nama toko'}</h3>
                      <p>
                        {shop.address ||
                          shop.description ||
                          'Kampung Keramik Dinoyo'}
                      </p>
                    </div>

                    <div className="dashboard-shop-status">
                      {shop.is_active ? (
                        <span className="dashboard-status-active">
                          Aktif
                        </span>
                      ) : (
                        <span className="dashboard-status-inactive">
                          Tidak aktif
                        </span>
                      )}
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .dashboard-page {
          width: 100%;
        }

        .dashboard-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 24px;
          margin-bottom: 28px;
        }

        .dashboard-header h1 {
          margin: 0;
          font-size: 30px;
          line-height: 1.2;
          font-weight: 700;
          color: #1f2937;
        }

        .dashboard-header p {
          margin: 8px 0 0;
          color: #6b7280;
          font-size: 14px;
        }

        .dashboard-date {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 14px;
          border: 1px solid #e5e7eb;
          border-radius: 10px;
          background: #fff;
          color: #4b5563;
          font-size: 13px;
          white-space: nowrap;
        }

        .dashboard-stats {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 18px;
          margin-bottom: 20px;
        }

        .dashboard-main-grid {
          display: grid;
          grid-template-columns: minmax(0, 2fr) minmax(300px, 1fr);
          gap: 20px;
          margin-bottom: 20px;
        }

        .card {
          background: #fff;
          border: 1px solid #e5e7eb;
          border-radius: 14px;
          padding: 22px;
        }

        .dashboard-card-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 20px;
        }

        .dashboard-card-header h2 {
          margin: 0;
          color: #1f2937;
          font-size: 18px;
          font-weight: 700;
        }

        .dashboard-card-header p {
          margin: 6px 0 0;
          color: #9ca3af;
          font-size: 13px;
        }

        .dashboard-period {
          position: relative;
        }

        .dashboard-period-button {
          display: flex;
          align-items: center;
          gap: 8px;
          min-width: 112px;
          justify-content: space-between;
          padding: 8px 11px;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          background: #fff;
          color: #374151;
          font-size: 13px;
          cursor: pointer;
        }

        .dashboard-period-button:hover {
          background: #f9fafb;
        }

        .dashboard-period-menu {
          position: absolute;
          z-index: 20;
          right: 0;
          top: calc(100% + 6px);
          min-width: 130px;
          padding: 5px;
          border: 1px solid #e5e7eb;
          border-radius: 9px;
          background: #fff;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
        }

        .dashboard-period-menu button {
          display: block;
          width: 100%;
          padding: 8px 10px;
          border: 0;
          border-radius: 6px;
          background: transparent;
          color: #374151;
          text-align: left;
          font-size: 13px;
          cursor: pointer;
        }

        .dashboard-period-menu button:hover,
        .dashboard-period-menu button.active {
          background: #f3f4f6;
        }

        .dashboard-chart {
          display: flex;
          gap: 14px;
          height: 280px;
          margin-top: 26px;
        }

        .dashboard-chart-y {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding-bottom: 27px;
          color: #9ca3af;
          font-size: 11px;
          text-align: right;
        }

        .dashboard-chart-area {
          position: relative;
          flex: 1;
          min-width: 0;
        }

        .dashboard-chart-grid {
          position: absolute;
          inset: 0 0 28px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .dashboard-chart-grid span {
          display: block;
          width: 100%;
          border-top: 1px dashed #e5e7eb;
        }

        .dashboard-bars {
          position: absolute;
          inset: 0;
          display: grid;
          align-items: end;
          gap: 12px;
        }

        .dashboard-bar-item {
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-end;
          gap: 9px;
        }

        .dashboard-bar-wrapper {
          width: 100%;
          height: calc(100% - 28px);
          display: flex;
          align-items: flex-end;
          justify-content: center;
        }

        .dashboard-bar {
          width: min(28px, 70%);
          min-height: 8px;
          border-radius: 7px 7px 2px 2px;
          background: #c87941;
        }

        .dashboard-bar-item > span {
          color: #9ca3af;
          font-size: 11px;
        }

        .dashboard-ai-card {
          display: flex;
          flex-direction: column;
          min-height: 360px;
        }

        .dashboard-ai-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 38px;
          height: 38px;
          border-radius: 10px;
          background: #fff7ed;
          color: #c87941;
        }

        .dashboard-ai-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
        }

        .dashboard-ai-number {
          font-size: 48px;
          line-height: 1;
          font-weight: 700;
          color: #1f2937;
        }

        .dashboard-ai-label {
          margin-top: 9px;
          color: #9ca3af;
          font-size: 13px;
        }

        .dashboard-ai-status {
          display: flex;
          align-items: center;
          gap: 7px;
          margin-top: 22px;
          color: #6b7280;
          font-size: 12px;
        }

        .dashboard-ai-status-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: #dcfce7;
          color: #16a34a;
        }

        .dashboard-ai-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 16px;
          border-top: 1px solid #f3f4f6;
          color: #c87941;
          font-size: 13px;
        }

        .dashboard-shops-card {
          width: 100%;
        }

        .dashboard-view-all {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          color: #c87941;
          font-size: 13px;
          font-weight: 600;
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .dashboard-view-all:hover {
          color: #9a572b;
          text-decoration: underline;
        }

        .dashboard-shops-list {
          display: flex;
          flex-direction: column;
          margin-top: 18px;
        }

        .dashboard-shop-item {
          display: flex;
          align-items: center;
          gap: 14px;
          min-height: 76px;
          padding: 12px 0;
          border-bottom: 1px solid #f3f4f6;
        }

        .dashboard-shop-item:last-child {
          border-bottom: 0;
        }

        .dashboard-shop-image {
          position: relative;
          flex: 0 0 58px;
          width: 58px;
          height: 58px;
          overflow: hidden;
          border-radius: 10px;
          background: #f3f4f6;
        }

        .dashboard-shop-image > img,
        .dashboard-shop-image-fallback img {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .dashboard-shop-image-fallback {
          position: absolute;
          inset: 0;
          align-items: center;
          justify-content: center;
          background: #f3f4f6;
          color: #9ca3af;
        }

        .dashboard-shop-info {
          min-width: 0;
          flex: 1;
        }

        .dashboard-shop-info h3 {
          margin: 0;
          overflow: hidden;
          color: #1f2937;
          font-size: 14px;
          font-weight: 600;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .dashboard-shop-info p {
          margin: 5px 0 0;
          overflow: hidden;
          color: #9ca3af;
          font-size: 12px;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .dashboard-shop-status {
          flex: 0 0 auto;
        }

        .dashboard-status-active,
        .dashboard-status-inactive {
          display: inline-flex;
          align-items: center;
          padding: 5px 9px;
          border-radius: 999px;
          font-size: 11px;
          font-weight: 600;
        }

        .dashboard-status-active {
          background: #dcfce7;
          color: #15803d;
        }

        .dashboard-status-inactive {
          background: #f3f4f6;
          color: #6b7280;
        }

        .dashboard-empty {
          display: flex;
          min-height: 150px;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 10px;
          color: #9ca3af;
        }

        .dashboard-empty p {
          margin: 0;
          font-size: 13px;
        }

        @media (max-width: 1100px) {
          .dashboard-stats {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .dashboard-main-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 700px) {
          .dashboard-header {
            flex-direction: column;
          }

          .dashboard-date {
            width: fit-content;
          }

          .dashboard-stats {
            grid-template-columns: 1fr;
          }

          .dashboard-card-header {
            flex-direction: column;
          }

          .dashboard-period {
            align-self: flex-start;
          }

          .dashboard-shop-image {
            flex-basis: 50px;
            width: 50px;
            height: 50px;
          }
        }
      `}</style>
    </AdminLayout>
  )
}

export default Dashboard
