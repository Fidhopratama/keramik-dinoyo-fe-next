import type { Row, Tone } from '../types/verification'

export const toneLabel: Record<Tone, string> = {
  good: 'Lolos',
  bad: 'Perlu dicek',
  wait: 'Menunggu',
}

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

function formatDate(value: any) {
  if (!value) return ''

  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return ''

  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
}

export function toRow(item: any, index: number): Row {
  return {
    key: item?.id ?? index,
    name: pickName(item),
    summary: pickSummary(item),
    score: pickScore(item),
    tone: pickTone(item),
    date: formatDate(item?.created_at ?? item?.createdAt ?? item?.date),
  }
}
