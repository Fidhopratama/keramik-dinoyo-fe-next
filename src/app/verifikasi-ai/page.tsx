'use client'

import { useEffect, useMemo, useState } from 'react'
import { CheckCircle2, Clock, Search, Sparkles, TriangleAlert } from 'lucide-react'

import AdminLayout from '../../components/AdminLayout'
import { getAiAnalysisResults } from '../../services/api'

type Tone = 'good' | 'bad' | 'wait'

const css = `
.v { display: flex; flex-direction: column; gap: 24px; width: 100%; color: #25211e; }
.v-head h2 { margin: 0; font-size: 30px; line-height: 1.2; font-weight: 700; letter-spacing: -0.02em; }
.v-head p { margin: 6px 0 0; color: #8b827b; font-size: 15px; }
.v-note { display: flex; align-items: flex-start; gap: 12px; padding: 14px 18px; border: 1px solid #f3dcb8; border-radius: 14px; background: #fff8ec; color: #8a5a1f; font-size: 14px; line-height: 1.5; }
.v-note svg { flex-shrink: 0; margin-top: 2px; }
.v-stats { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 20px; }
.v-stat { display: flex; align-items: center; gap: 16px; padding: 20px 22px; border: 1px solid #ece6df; border-radius: 20px; background: #fff; }
.v-stat-icon { display: flex; flex-shrink: 0; align-items: center; justify-content: center; width: 46px; height: 46px; border-radius: 14px; background: #fbeee4; color: #d27a45; }
.v-stat-icon.good { background: #e8f5ec; color: #237a45; }
.v-stat-icon.bad { background: #fdecec; color: #b42318; }
.v-stat-icon.wait { background: #fff4e3; color: #b9722b; }
.v-stat strong { display: block; font-size: 30px; line-height: 1; font-weight: 700; }
.v-stat span { display: block; margin-top: 6px; color: #8b827b; font-size: 14px; }
.v-card { padding: 28px; border: 1px solid #ece6df; border-radius: 20px; background: #fff; }
.v-toolbar { display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap; }
.v-toolbar h3 { margin: 0; font-size: 20px; font-weight: 700; }
.v-toolbar p { margin: 6px 0 0; color: #8b827b; font-size: 15px; }
.v-controls { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
.v-search { display: flex; align-items: center; gap: 10px; width: 260px; height: 44px; padding: 0 14px; border: 1px solid #ece6df; border-radius: 12px; background: #fff; color: #a59c95; }
.v-search input { flex: 1; min-width: 0; border: 0; outline: none; background: transparent; color: #25211e; font-size: 14px; }
.v-search:focus-within { border-color: #c9562e; box-shadow: 0 0 0 3px rgba(201, 86, 46, 0.12); }
.v-tabs { display: flex; gap: 6px; padding: 4px; border: 1px solid #ece6df; border-radius: 12px; background: #faf8f6; }
.v-tabs button { padding: 8px 14px; border: 0; border-radius: 8px; background: transparent; color: #6f665f; font-size: 14px; cursor: pointer; }
.v-tabs button:hover { color: #25211e; }
.v-tabs button.active { background: #fff; color: #c4693a; font-weight: 600; box-shadow: 0 1px 3px rgba(46, 39, 34, 0.1); }
.v-list { display: flex; flex-direction: column; gap: 14px; margin-top: 24px; }
.v-item { border: 1px solid #ece6df; border-radius: 16px; background: #fff; }
.v-row { display: flex; align-items: center; gap: 18px; width: 100%; padding: 16px 20px; border: 0; background: transparent; text-align: left; cursor: pointer; font: inherit; color: inherit; }
.v-row:hover { background: #fdfbf9; border-radius: 16px; }
.v-ico { display: flex; flex-shrink: 0; align-items: center; justify-content: center; width: 50px; height: 50px; border-radius: 14px; background: #fbeee4; color: #d27a45; }
.v-main { flex: 1; min-width: 0; }
.v-main strong { display: block; overflow: hidden; font-size: 18px; font-weight: 600; text-overflow: ellipsis; white-space: nowrap; }
.v-main span { display: block; margin-top: 3px; overflow: hidden; color: #8b827b; font-size: 14px; text-overflow: ellipsis; white-space: nowrap; }
.v-score { width: 120px; flex-shrink: 0; }
.v-score small { display: block; margin-bottom: 6px; color: #8b827b; font-size: 12px; }
.v-bar { height: 8px; overflow: hidden; border-radius: 999px; background: #f1ece7; }
.v-bar i { display: block; height: 100%; border-radius: 999px; background: #dc9468; }
.v-date { flex-shrink: 0; width: 110px; color: #8b827b; font-size: 14px; text-align: right; }
.v-badge { flex-shrink: 0; min-width: 96px; padding: 6px 14px; border-radius: 8px; font-size: 14px; font-weight: 500; text-align: center; }
.v-badge.good { border: 1px solid #cfe8d7; background: #e8f5ec; color: #237a45; }
.v-badge.bad { border: 1px solid #f3cfcb; background: #fdecec; color: #b42318; }
.v-badge.wait { border: 1px solid #f3dcb8; background: #fff4e3; color: #b9722b; }
.v-detail { padding: 0 20px 20px 88px; color: #4a423d; font-size: 15px; line-height: 1.6; }
.v-detail p { margin: 0 0 8px; }
.v-detail small { color: #a59c95; font-size: 13px; }
.v-empty { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px; min-height: 220px; color: #a59c95; text-align: center; }
.v-empty strong { color: #4a423d; font-size: 18px; font-weight: 600; }
.v-empty p { margin: 0; max-width: 360px; font-size: 14px; line-height: 1.5; }
.v-error { padding: 14px 18px; border-radius: 12px; background: #fdecec; color: #b42318; font-size: 14px; }
@media (max-width: 1150px) { .v-stats { grid-template-columns: repeat(2, minmax(0, 1fr)); } .v-score, .v-date { display: none; } }
@media (max-width: 700px) { .v-stats { grid-template-columns: 1fr; } .v-search { width: 100%; } .v-detail { padding-left: 20px; } }
`

function pickName(item: any) {
  return (
    item?.product?.name ||
    item?.product_name ||
    item?.title ||
    (item?.product_id ? `Produk #${item.product_id}` : 'Hasil analisis')
  )
}

function pickSummary(item: any) {
  const value =
    item?.summary ||
    item?.analysis ||
    item?.result_text ||
    item?.notes ||
    item?.description ||
    (typeof item?.result === 'string' ? item.result : '')
  return String(value || '')
}

function pickScore(item: any): number | null {
  const raw = item?.score ?? item?.confidence ?? item?.accuracy ?? item?.result?.score
  const n = Number(raw)
  if (raw === undefined || raw === null || Number.isNaN(n)) return null
  const pct = n <= 1 ? n * 100 : n
  return Math.max(0, Math.min(100, Math.round(pct)))
}

function pickTone(item: any): Tone {
  const raw = String(item?.status ?? item?.verdict ?? item?.result_status ?? '').toLowerCase()
  if (/(approve|valid|lolos|sesuai|success|verified|asli|authentic|selesai|ok)/.test(raw)) return 'good'
  if (/(reject|tolak|gagal|invalid|fail|palsu|error)/.test(raw)) return 'bad'
  return 'wait'
}

const toneLabel: Record<Tone, string> = {
  good: 'Lolos',
  bad: 'Perlu dicek',
  wait: 'Menunggu',
}

function formatDate(value: any) {
  if (!value) return ''
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
}

const tabs: { key: 'all' | Tone; label: string }[] = [
  { key: 'all', label: 'Semua' },
  { key: 'wait', label: 'Menunggu' },
  { key: 'good', label: 'Lolos' },
  { key: 'bad', label: 'Perlu dicek' },
]

export default function VerifikasiAiPage() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')
  const [tab, setTab] = useState<'all' | Tone>('all')
  const [openId, setOpenId] = useState<string | number | null>(null)

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      try {
        setLoading(true)
        setError('')
        const response = await getAiAnalysisResults()
        if (cancelled) return

        const body = response.data?.data ?? response.data
        const list = Array.isArray(body) ? body : Array.isArray(body?.items) ? body.items : []
        setItems(list)
      } catch (err: any) {
        if (cancelled) return
        console.error('AI results error:', err)
        setError(err?.response?.data?.message || 'Hasil verifikasi AI gagal dimuat.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  const rows = useMemo(
    () =>
      items.map((item, index) => ({
        key: item?.id ?? index,
        name: pickName(item),
        summary: pickSummary(item),
        score: pickScore(item),
        tone: pickTone(item),
        date: formatDate(item?.created_at ?? item?.createdAt ?? item?.date),
      })),
    [items],
  )

  const counts = {
    all: rows.length,
    good: rows.filter((r) => r.tone === 'good').length,
    bad: rows.filter((r) => r.tone === 'bad').length,
    wait: rows.filter((r) => r.tone === 'wait').length,
  }

  const filtered = rows.filter((r) => {
    if (tab !== 'all' && r.tone !== tab) return false
    const q = query.trim().toLowerCase()
    return !q || r.name.toLowerCase().includes(q)
  })

  const stats = [
    { label: 'Total analisis', value: counts.all, Icon: Sparkles, cls: '' },
    { label: 'Menunggu', value: counts.wait, Icon: Clock, cls: 'wait' },
    { label: 'Lolos', value: counts.good, Icon: CheckCircle2, cls: 'good' },
    { label: 'Perlu dicek', value: counts.bad, Icon: TriangleAlert, cls: 'bad' },
  ]

  return (
    <AdminLayout>
      <style dangerouslySetInnerHTML={{ __html: css }} />

      <div className="v">
        <div className="v-head">
          <h2>Verifikasi AI</h2>
          <p>Hasil analisis kualitas produk keramik.</p>
        </div>

        <div className="v-note">
          <TriangleAlert size={18} aria-hidden="true" />
          <span>
            Hasil analisis AI hanya berupa saran untuk membantu admin. Keputusan
            akhir tetap ditentukan oleh admin setelah memeriksa produknya.
          </span>
        </div>

        <div className="v-stats">
          {stats.map(({ label, value, Icon, cls }) => (
            <div className="v-stat" key={label}>
              <div className={`v-stat-icon ${cls}`}>
                <Icon size={22} aria-hidden="true" />
              </div>
              <div>
                <strong>{value}</strong>
                <span>{label}</span>
              </div>
            </div>
          ))}
        </div>

        <section className="v-card">
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
                  onChange={(e) => setQuery(e.target.value)}
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
                    onClick={() => setTab(t.key)}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {error && <div className="v-error" style={{ marginTop: 20 }}>{error}</div>}

          {loading ? (
            <div className="v-empty">
              <p>Memuat hasil verifikasi...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="v-empty">
              <Sparkles size={32} aria-hidden="true" />
              <strong>{rows.length === 0 ? 'Belum ada pemeriksaan' : 'Tidak ada hasil'}</strong>
              <p>
                {rows.length === 0
                  ? 'Hasil analisis AI akan muncul di sini setelah produk diperiksa.'
                  : 'Coba ubah kata kunci atau filter status.'}
              </p>
            </div>
          ) : (
            <div className="v-list">
              {filtered.map((r) => (
                <div className="v-item" key={r.key}>
                  <button
                    type="button"
                    className="v-row"
                    onClick={() => setOpenId(openId === r.key ? null : r.key)}
                    aria-expanded={openId === r.key}
                  >
                    <div className="v-ico">
                      <Sparkles size={22} aria-hidden="true" />
                    </div>

                    <div className="v-main">
                      <strong>{r.name}</strong>
                      <span>{r.summary || 'Belum ada ringkasan analisis.'}</span>
                    </div>

                    {r.score !== null && (
                      <div className="v-score">
                        <small>Skor {r.score}%</small>
                        <div className="v-bar"><i style={{ width: `${r.score}%` }} /></div>
                      </div>
                    )}

                    <div className="v-date">{r.date}</div>
                    <span className={`v-badge ${r.tone}`}>{toneLabel[r.tone]}</span>
                  </button>

                  {openId === r.key && (
                    <div className="v-detail">
                      <p>{r.summary || 'Belum ada ringkasan analisis untuk produk ini.'}</p>
                      <small>Ini adalah saran dari AI. Periksa produknya secara langsung sebelum mengambil keputusan.</small>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </AdminLayout>
  )
}