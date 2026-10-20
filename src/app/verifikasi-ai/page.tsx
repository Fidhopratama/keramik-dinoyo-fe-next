'use client'

import { useState } from 'react'

import AdminLayout from '../../components/AdminLayout'
import useVerificationResults from '../../hooks/useVerificationResults'
import type { TabKey } from '../../types/verification'
import VerificationNotice from './components/VerificationNotice'
import VerificationStats from './components/VerificationStats'
import VerificationStyles from './components/VerificationStyles'
import VerificationTable from './components/VerificationTable'
import VerificationToolbar from './components/VerificationToolbar'

export default function VerifikasiAiPage() {
  const { rows, loading, error } = useVerificationResults()

  const [query, setQuery] = useState('')
  const [tab, setTab] = useState<TabKey>('all')
  const [openId, setOpenId] = useState<string | number | null>(null)

  const filtered = rows.filter((r) => {
    if (tab !== 'all' && r.tone !== tab) return false

    const q = query.trim().toLowerCase()
    return !q || r.name.toLowerCase().includes(q)
  })

  return (
    <AdminLayout>
      <VerificationStyles />

      <div className="v">
        <div className="v-head">
          <h2>Verifikasi AI</h2>
          <p>Hasil analisis kualitas produk keramik.</p>
        </div>

        <VerificationNotice />

        <VerificationStats
          total={rows.length}
          waiting={rows.filter((r) => r.tone === 'wait').length}
          good={rows.filter((r) => r.tone === 'good').length}
          bad={rows.filter((r) => r.tone === 'bad').length}
        />

        <section className="v-card">
          <VerificationToolbar query={query} onQuery={setQuery} tab={tab} onTab={setTab} />

          {error && <div className="v-error">{error}</div>}

          <VerificationTable
            rows={filtered}
            total={rows.length}
            loading={loading}
            openId={openId}
            onToggle={(id) => setOpenId(openId === id ? null : id)}
          />
        </section>
      </div>
    </AdminLayout>
  )
}
