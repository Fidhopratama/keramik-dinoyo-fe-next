import { API_ORIGIN } from './common'
import type { ActivityItem, AiStatus } from '../types/dashboard'

export const localShopImages: Record<string, string> = {
  'Keramik Brawijaya': '/images/keramik-brawijaya.jpg',
  'Keramik Dinoyo Makmur': '/images/keramik-dinoyo-makmur.jpg',
  'Dinoyo Ceramic House': '/images/dinoyo-ceramic-house.jpg',
}

export function getShopImageUrl(image?: string | null) {
  const value = String(image || '').trim()

  if (!value) return ''
  if (/^(https?:|blob:)/.test(value)) return value
  if (value.startsWith('/images/')) return value
  if (value.startsWith('/uploads/')) return `${API_ORIGIN}${value}`
  if (value.startsWith('uploads/')) return `${API_ORIGIN}/${value}`
  if (value.startsWith('/shops/')) return `${API_ORIGIN}/uploads${value}`
  if (value.startsWith('shops/')) return `${API_ORIGIN}/uploads/${value}`

  return `${API_ORIGIN}/uploads/shops/${value}`
}

// Badge persen hanya tampil kalau BE mengirim angkanya.
export function trendLabel(value: unknown) {
  if (typeof value !== 'number' || Number.isNaN(value)) return null
  return `${value > 0 ? '+' : ''}${value}%`
}

export function monthLabel(value: string) {
  const d = new Date(`${value}-01T00:00:00`)
  if (Number.isNaN(d.getTime())) return String(value)
  return d.toLocaleDateString('id-ID', { month: 'short' })
}

// Data contoh grafik, dipakai kalau BE belum mengirim `monthly_activity`.
export function makeSampleActivity(): ActivityItem[] {
  const values = [8, 14, 10, 16, 12, 18, 15, 21, 19, 26, 23, 30]

  return values.map((value, i) => {
    const d = new Date()
    d.setDate(1)
    d.setMonth(d.getMonth() - (values.length - 1 - i))
    const month = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`

    return { month, value }
  })
}

export function aiStatus(item: any): AiStatus {
  const raw = String(item?.status ?? item?.verdict ?? '').toLowerCase()

  if (/(approve|valid|lolos|sesuai|success|verified|asli|selesai|ok)/.test(raw)) {
    return { label: 'Lolos', tone: 'good' }
  }

  if (/(reject|tolak|gagal|invalid|fail|palsu|error)/.test(raw)) {
    return { label: 'Perlu dicek', tone: 'bad' }
  }

  return { label: 'Menunggu', tone: '' }
}

// Hasil analisis terbaru: dari daftar AI, atau cadangan dari data dashboard.
export function pickLatestAi(list: any[], fallback?: any): any | null {
  const sorted = [...list].sort(
    (a, b) =>
      (new Date(b?.created_at ?? 0).getTime() || 0) -
      (new Date(a?.created_at ?? 0).getTime() || 0),
  )

  return sorted[0] ?? (Array.isArray(fallback) ? fallback[0] : null) ?? null
}
