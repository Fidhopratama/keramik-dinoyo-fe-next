'use client'

import { Search } from 'lucide-react'

import type { TabKey } from '../../../types/verification'

const tabs: { key: TabKey; label: string }[] = [
  { key: 'all', label: 'Semua' },
  { key: 'wait', label: 'Menunggu' },
  { key: 'good', label: 'Lolos' },
  { key: 'bad', label: 'Perlu dicek' },
]

type Props = {
  query: string
  onQuery: (value: string) => void
  tab: TabKey
  onTab: (value: TabKey) => void
}

export default function VerificationToolbar({ query, onQuery, tab, onTab }: Props) {
  return (
    <div className="v-toolbar">
      <div>
        <h3>Daftar Pemeriksaan</h3>
        <p>Klik salah satu baris untuk melihat detail analisis.</p>
      </div>

      <div className="v-controls">
        <label className="v-search">
          <Search size={16} aria-hidden="true" />
          <input
            type="text"
            placeholder="Cari nama produk"
            value={query}
            onChange={(e) => onQuery(e.target.value)}
          />
        </label>

        <div className="v-tabs" role="tablist">
          {tabs.map((t) => (
            <button
              key={t.key}
              type="button"
              role="tab"
              aria-selected={tab === t.key}
              className={tab === t.key ? 'active' : ''}
              onClick={() => onTab(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}