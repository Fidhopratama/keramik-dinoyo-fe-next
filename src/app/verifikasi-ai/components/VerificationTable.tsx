'use client'

import { Fragment } from 'react'
import { Sparkles } from 'lucide-react'

import { toneLabel } from '../../../lib/verification'
import type { Row } from '../../../types/verification'

type Props = {
  rows: Row[]
  total: number
  loading: boolean
  openId: string | number | null
  onToggle: (id: string | number) => void
}

export default function VerificationTable({ rows, total, loading, openId, onToggle }: Props) {
  if (loading) {
    return (
      <div className="v-empty">
        <p>Memuat hasil verifikasi...</p>
      </div>
    )
  }

  if (rows.length === 0) {
    return (
      <div className="v-empty">
        <Sparkles size={32} aria-hidden="true" />
        <strong>{total === 0 ? 'Belum ada pemeriksaan' : 'Tidak ada hasil'}</strong>
        <p>
          {total === 0
            ? 'Hasil analisis AI akan muncul di sini setelah produk diperiksa.'
            : 'Coba ubah kata kunci atau filter status.'}
        </p>
      </div>
    )
  }

  return (
    <div className="v-table-wrap">
      <table className="v-table">
        <thead>
          <tr>
            <th>Produk</th>
            <th>Ringkasan</th>
            <th>Skor</th>
            <th>Tanggal</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {rows.map((r) => (
            <Fragment key={r.key}>
              <tr
                className="v-tr"
                tabIndex={0}
                aria-expanded={openId === r.key}
                onClick={() => onToggle(r.key)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    onToggle(r.key)
                  }
                }}
              >
                <td>
                  <div className="v-name">
                    <span className="v-ico">
                      <Sparkles size={18} aria-hidden="true" />
                    </span>
                    <strong>{r.name}</strong>
                  </div>
                </td>

                <td>
                  <div className="v-sum">{r.summary || 'Belum ada ringkasan analisis.'}</div>
                </td>

                <td>
                  {r.score !== null ? (
                    <div className="v-score">
                      <small>Skor {r.score}%</small>
                      <div className="v-bar">
                        <i style={{ width: `${r.score}%` }} />
                      </div>
                    </div>
                  ) : (
                    <span className="v-date">-</span>
                  )}
                </td>

                <td className="v-date">{r.date || '-'}</td>

                <td>
                  <span className={`v-badge ${r.tone}`}>{toneLabel[r.tone]}</span>
                </td>
              </tr>

              {openId === r.key && (
                <tr className="v-detail">
                  <td colSpan={5}>
                    <p>{r.summary || 'Belum ada ringkasan analisis untuk produk ini.'}</p>
                    <small>
                      Ini adalah saran dari AI. Periksa produknya secara langsung
                      sebelum mengambil keputusan.
                    </small>
                  </td>
                </tr>
              )}
            </Fragment>
          ))}
        </tbody>
      </table>
    </div>
  )
}