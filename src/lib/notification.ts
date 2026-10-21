import type { AppNotification, NoticeKind } from '../types/notification'
import type { Prefs } from '../types/preferences'

export const READ_KEY = 'keramik_dinoyo_read_notifications'

const WINDOW_MS = 14 * 24 * 60 * 60 * 1000

// Nama menu yang dipakai AdminLayout untuk berpindah halaman.
export const MENU_OF: Record<NoticeKind, string> = {
  shop: 'Toko',
  product: 'Produk',
  workshop: 'Workshop',
  ai: 'Verifikasi AI',
}

// Ambil daftar dari berbagai bentuk balasan API.
export function listOf(response: any): any[] {
  const body = response?.data?.data ?? response?.data

  if (Array.isArray(body)) return body
  if (Array.isArray(body?.data)) return body.data
  if (Array.isArray(body?.items)) return body.items

  return []
}

function build(
  kind: NoticeKind,
  list: any[],
  title: string,
  textOf: (item: any) => string,
): AppNotification[] {
  const now = Date.now()
  const out: AppNotification[] = []

  list.forEach((item, index) => {
    const raw = item?.created_at ?? item?.createdAt
    const time = raw ? new Date(raw).getTime() : NaN

    if (Number.isNaN(time) || now - time > WINDOW_MS) return

    out.push({
      id: `${kind}-${item?.id ?? index}`,
      kind,
      title,
      text: textOf(item),
      time,
    })
  })

  return out
}

export function collectNotifications(
  shops: any[],
  products: any[],
  workshops: any[],
  analyses: any[],
): AppNotification[] {
  return [
    ...build('shop', shops, 'Toko baru terdaftar', (x) => x?.name || 'Toko'),
    ...build('product', products, 'Produk baru ditambahkan', (x) => x?.name || 'Produk'),
    ...build('workshop', workshops, 'Workshop baru', (x) => x?.title || x?.name || 'Workshop'),
    ...build('ai', analyses, 'Analisis AI selesai', (x) => x?.product?.name || x?.product_name || 'Hasil analisis'),
  ]
    .sort((a, b) => b.time - a.time)
    .slice(0, 8)
}

// Hormati saklar di halaman Pengaturan.
export function filterByPrefs(items: AppNotification[], prefs: Prefs): AppNotification[] {
  if (!prefs.notifications) return []

  return items.filter((item) => {
    if (item.kind === 'workshop') return prefs.notifWorkshop
    if (item.kind === 'product') return prefs.notifProduct
    if (item.kind === 'ai') return prefs.notifAi
    return true
  })
}

export function timeAgo(time: number): string {
  const minutes = Math.floor((Date.now() - time) / 60000)

  if (minutes < 1) return 'Baru saja'
  if (minutes < 60) return `${minutes} menit lalu`

  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} jam lalu`

  return `${Math.floor(hours / 24)} hari lalu`
}

export function readReadIds(): string[] {
  try {
    const raw = localStorage.getItem(READ_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function saveReadIds(ids: string[]) {
  try {
    localStorage.setItem(READ_KEY, JSON.stringify(ids.slice(-200)))
  } catch {}
}
