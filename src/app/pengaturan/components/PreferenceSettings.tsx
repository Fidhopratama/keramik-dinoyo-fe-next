'use client'

import { SlidersHorizontal } from 'lucide-react'

import type { Prefs } from '../../../types/preferences'

type Props = {
  prefs: Prefs
  onChange: (patch: Partial<Prefs>) => void
}

export default function PreferenceSettings({ prefs, onChange }: Props) {
  return (
    <section className="st-card">
      <header className="st-card-head">
        <div className="st-icon">
          <SlidersHorizontal size={20} aria-hidden="true" />
        </div>
        <div>
          <h3>Preferensi</h3>
          <p>Atur preferensi penggunaan dashboard.</p>
        </div>
      </header>

      <div className="st-body">
        <div className="st-row line">
          <div>
            <strong>Bahasa</strong>
            <p>Pilih bahasa tampilan antarmuka sistem.</p>
          </div>
          <select
            className="st-select"
            value={prefs.language}
            onChange={(e) => onChange({ language: e.target.value })}
          >
            <option value="id">Bahasa Indonesia</option>
            <option value="en" disabled>
              English (segera hadir)
            </option>
          </select>
        </div>

        <div className="st-row">
          <div>
            <strong>Data per halaman</strong>
            <p>Jumlah baris yang ditampilkan pada daftar.</p>
          </div>
          <select
            className="st-select"
            value={prefs.perPage}
            onChange={(e) => onChange({ perPage: e.target.value })}
          >
            <option value="10">10 data</option>
            <option value="25">25 data</option>
            <option value="50">50 data</option>
          </select>
        </div>
      </div>
    </section>
  )
}