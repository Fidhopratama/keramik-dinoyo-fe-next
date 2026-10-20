'use client'

import { useEffect, useRef, useState } from 'react'
import { ChevronDown } from 'lucide-react'

import { makeSampleActivity, monthLabel } from '../../../lib/dashboard'
import type { ActivityItem } from '../../../types/dashboard'

const periods = [
  { value: 3, label: '3 Bulan' },
  { value: 6, label: '6 Bulan' },
  { value: 12, label: '12 Bulan' },
]

export default function ActivityChart({ activity }: { activity?: ActivityItem[] }) {
  const [period, setPeriod] = useState(6)
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
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

  const isReal = Array.isArray(activity) && activity.length > 0
  const source: ActivityItem[] = isReal ? (activity as ActivityItem[]) : makeSampleActivity()

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

  return (
    <section className="d-card">
      <div className="d-card-head">
        <div>
          <h3>Aktivitas Toko</h3>
          <p>Data toko dalam beberapa bulan terakhir</p>
          {!isReal && <p className="d-sample">Menampilkan data contoh.</p>}
        </div>

        <div className="d-period" ref={ref}>
          <button
            type="button"
            className="d-period-btn"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
          >
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
                  onClick={() => {
                    setPeriod(p.value)
                    setOpen(false)
                  }}
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
          {yTicks.map((t, i) => (
            <span key={`${t}-${i}`}>{t}</span>
          ))}
        </div>

        <div className="d-chart-area">
          <div className="d-chart-grid">
            <span /><span /><span /><span /><span />
          </div>

          <div
            className="d-bars"
            style={{ gridTemplateColumns: `repeat(${bars.length || 1}, minmax(0, 1fr))` }}
          >
            {bars.map((b, i) => (
              <div className="d-bar-item" key={`${b.label}-${i}`}>
                <div className="d-bar-wrap">
                  <div
                    className="d-bar"
                    style={{ height: `${b.height}%` }}
                    title={`${b.label}: ${b.value}`}
                  />
                </div>
                <span>{b.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
