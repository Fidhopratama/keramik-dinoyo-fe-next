import Link from 'next/link'
import { ArrowRight, Sparkles } from 'lucide-react'

import { aiStatus } from '../../../lib/dashboard'

export default function AiSummary({ latest }: { latest: any | null }) {
  const status = latest ? aiStatus(latest) : { label: 'Menunggu', tone: '' }

  return (
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
        <div className="d-ai-icon">
          <Sparkles size={22} aria-hidden="true" />
        </div>

        <div className="d-ai-text">
          <strong>
            {latest
              ? latest.product?.name || latest.product_name || latest.title || 'Hasil analisis'
              : 'Belum ada pemeriksaan'}
          </strong>
          <span>
            {latest
              ? latest.summary || latest.analysis || 'Hasil analisis AI'
              : 'Belum ada hasil analisis AI'}
          </span>
        </div>

        <span className={`d-badge ${status.tone}`}>{status.label}</span>
      </div>
    </section>
  )
}