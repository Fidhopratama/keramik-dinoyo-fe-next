export type WorkshopStatus =
  | 'upcoming'
  | 'ongoing'
  | 'completed'
  | 'cancelled'

export type Workshop = {
  id: number | string
  title?: string
  description?: string
  instructor?: string
  date?: string
  start_time?: string
  end_time?: string
  capacity?: number
  location?: string
  status?: WorkshopStatus | string
  image?: string | null
  image_url?: string | null
}

export type WorkshopFormData = {
  title: string
  description: string
  instructor: string
  date: string
  start_time: string
  end_time: string
  capacity: number | string
  location: string
  status: string
}

export const localWorkshopImages = [
  '/images/workshop-keramik-1.jpg',
  '/images/workshop-keramik-2.jpg',
  '/images/workshop-keramik-3.jpg',
]

export const initialForm: WorkshopFormData = {
  title: '',
  description: '',
  instructor: '',
  date: '',
  start_time: '',
  end_time: '',
  capacity: 10,
  location: '',
  status: 'upcoming',
}

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') ||
  'http://127.0.0.1:5050'

export function getWorkshopImageUrl(image?: string | null): string {
  if (!image) return ''

  const value = String(image).trim()
  if (!value) return ''

  if (
    value.startsWith('http://') ||
    value.startsWith('https://') ||
    value.startsWith('blob:')
  ) {
    return value
  }

  if (value.startsWith('/images/')) return value

  if (value.startsWith('/uploads/workshops/')) {
    return `${API_URL}${value}`
  }

  if (value.startsWith('uploads/workshops/')) {
    return `${API_URL}/${value}`
  }

  if (value.startsWith('/workshops/')) {
    return `${API_URL}/uploads${value}`
  }

  if (value.startsWith('workshops/')) {
    return `${API_URL}/uploads/${value}`
  }

  return `${API_URL}/uploads/workshops/${value}`
}

export function getWorkshopStatusLabel(status?: string): string {
  const labels: Record<string, string> = {
    upcoming: 'Akan Datang',
    ongoing: 'Berlangsung',
    completed: 'Selesai',
    cancelled: 'Dibatalkan',
  }

  return labels[status || ''] || status || 'Akan Datang'
}

export function getWorkshopStatusClass(status?: string): string {
  const classes: Record<string, string> = {
    upcoming: 'upcoming',
    ongoing: 'ongoing',
    completed: 'completed',
    cancelled: 'cancelled',
  }

  return classes[status || ''] || 'upcoming'
}

export function formatWorkshopDate(date?: string): string {
  if (!date) return '-'

  const parsedDate = new Date(`${date}T00:00:00`)
  if (Number.isNaN(parsedDate.getTime())) return '-'

  return parsedDate.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function formatWorkshopTime(time?: string): string {
  return time ? String(time).substring(0, 5) : '--:--'
}