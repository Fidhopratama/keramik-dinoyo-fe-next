'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Check } from 'lucide-react'

import AdminLayout from '../../components/AdminLayout'
import usePreferences from '../../hooks/usePreferences'
import type { Notice } from '../../types/common'
import NotificationSettings from './components/NotificationSettings'
import PreferenceSettings from './components/PreferenceSettings'
import SettingsStyles from './components/SettingsStyles'
import SystemStatus from './components/SystemStatus'

export default function PengaturanPage() {
  const { prefs, update, save } = usePreferences()
  const [message, setMessage] = useState<Notice | null>(null)

  const handleSave = () => {
    setMessage(
      save()
        ? { type: 'success', text: 'Pengaturan berhasil disimpan.' }
        : { type: 'error', text: 'Pengaturan gagal disimpan.' },
    )

    window.setTimeout(() => setMessage(null), 3000)
  }

  return (
    <AdminLayout>
      <SettingsStyles />

      <div className="st">
        <div className="st-head">
          <h2>Pengaturan</h2>
          <p>
            Atur notifikasi dan preferensi sistem. Data akun ada di{' '}
            <Link href="/profil">Profil Admin</Link>.
          </p>
        </div>

        {message && (
          <div className={`st-toast ${message.type}`} role="status">
            {message.type === 'success' && <Check size={15} />}
            {message.text}
          </div>
        )}

        <NotificationSettings prefs={prefs} onChange={update} />
        <PreferenceSettings prefs={prefs} onChange={update} />

        <div className="st-actions">
          <button type="button" className="st-btn primary" onClick={handleSave}>
            Simpan Pengaturan
          </button>
        </div>

        <SystemStatus />
      </div>
    </AdminLayout>
  )
}
