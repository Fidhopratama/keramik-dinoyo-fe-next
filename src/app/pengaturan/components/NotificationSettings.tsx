'use client'

import { Bell } from 'lucide-react'

import type { Prefs } from '../../../types/preferences'
import Toggle from './Toggle'

type Props = {
  prefs: Prefs
  onChange: (patch: Partial<Prefs>) => void
}

export default function NotificationSettings({ prefs, onChange }: Props) {
  const off = !prefs.notifications

  const items = [
    { key: 'notifWorkshop', title: 'Workshop baru', text: 'Saat ada pendaftaran atau perubahan workshop.' },
    { key: 'notifProduct', title: 'Produk baru', text: 'Saat toko menambah atau mengubah produk.' },
    { key: 'notifAi', title: 'Hasil verifikasi AI', text: 'Saat ada hasil analisis produk yang perlu diperiksa.' },
  ] as const

  return (
    <section className="st-card">
      <header className="st-card-head">
        <div className="st-icon">
          <Bell size={20} aria-hidden="true" />
        </div>
        <div>
          <h3>Notifikasi</h3>
          <p>Pilih jenis pemberitahuan yang ingin kamu terima.</p>
        </div>
      </header>

      <div className="st-body">
        <div className="st-row line">
          <div>
            <strong>Aktifkan notifikasi</strong>
            <p>Terima notifikasi aktivitas workshop dan sistem.</p>
          </div>
          <Toggle
            label="Aktifkan notifikasi"
            checked={prefs.notifications}
            onChange={(value) => onChange({ notifications: value })}
          />
        </div>

        {items.map((item) => (
          <div className="st-row sub" key={item.key}>
            <div>
              <strong>{item.title}</strong>
              <p>{item.text}</p>
            </div>
            <Toggle
              label={item.title}
              disabled={off}
              checked={!off && prefs[item.key]}
              onChange={(value) => onChange({ [item.key]: value })}
            />
          </div>
        ))}
      </div>
    </section>
  )
}