import { API_ORIGIN } from './common'
import type { Workshop, WorkshopFormData } from '../types/workshop'

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

export const API_URL = API_ORIGIN

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
  if (value.startsWith('/uploads/workshops/')) return `${API_URL}${value}`
  if (value.startsWith('uploads/workshops/')) return `${API_URL}/${value}`
  if (value.startsWith('/workshops/')) return `${API_URL}/uploads${value}`
  if (value.startsWith('workshops/')) return `${API_URL}/uploads/${value}`

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

// Foto kartu: dari server, atau foto lokal sebagai cadangan.
export function getImageForWorkshop(workshop: Workshop, index: number): string {
  if (typeof workshop.image_url === 'string' && workshop.image_url) {
    return getWorkshopImageUrl(workshop.image_url)
  }

  if (typeof workshop.image === 'string' && workshop.image) {
    return getWorkshopImageUrl(workshop.image)
  }

  return localWorkshopImages[index % localWorkshopImages.length] || ''
}

// Isi form dan pratinjau foto saat mengedit kegiatan.
export function formFromWorkshop(
  workshop: Workshop,
  index: number,
): { form: WorkshopFormData; preview: string } {
  const existingImage =
    workshop.image_url ||
    workshop.image ||
    localWorkshopImages[index % localWorkshopImages.length]

  return {
    form: {
      title: workshop.title || '',
      description: workshop.description || '',
      instructor: workshop.instructor || '',
      date: workshop.date ? String(workshop.date).substring(0, 10) : '',
      start_time: workshop.start_time
        ? String(workshop.start_time).substring(0, 5)
        : '',
      end_time: workshop.end_time
        ? String(workshop.end_time).substring(0, 5)
        : '',
      capacity: workshop.capacity ?? 10,
      location: workshop.location || '',
      status: workshop.status || 'upcoming',
    },
    preview: existingImage ? getWorkshopImageUrl(existingImage) : '',
  }
}

// Foto: maksimal 2 MB, format JPG, PNG, atau WEBP.
export function validateWorkshopImage(file: File): string {
  const allowed = ['image/jpeg', 'image/png', 'image/webp']

  if (!allowed.includes(file.type)) {
    return 'Format gambar harus JPG, JPEG, PNG, atau WEBP.'
  }

  if (file.size > 2 * 1024 * 1024) return 'Ukuran gambar maksimal 2 MB.'

  return ''
}

export function buildWorkshopFormData(
  form: WorkshopFormData,
  imageFile: File | null,
): FormData {
  const data = new FormData()

  data.append('title', form.title.trim())
  data.append('description', form.description.trim())
  data.append('instructor', form.instructor.trim())
  data.append('date', form.date)
  data.append('start_time', form.start_time)
  data.append('end_time', form.end_time)
  data.append('capacity', String(form.capacity))
  data.append('location', form.location.trim())
  data.append('status', form.status)

  if (imageFile) data.append('image', imageFile)

  return data
}

// Pesan galat: error validasi pertama dari server, atau pesan umum.
export function getWorkshopFormMessage(err: any): string {
  const validationErrors = err?.response?.data?.errors

  if (validationErrors) {
    const firstError = Object.values(validationErrors).flat().find(Boolean)
    return String(firstError || 'Data kegiatan tidak valid.')
  }

  return err?.response?.data?.message || 'Gagal menyimpan kegiatan.'
}

export function filterWorkshops(
  workshops: Workshop[],
  search: string,
  statusFilter: string,
): Workshop[] {
  const keyword = search.toLowerCase().trim()

  return workshops.filter((workshop) => {
    const matchesSearch =
      !keyword ||
      workshop.title?.toLowerCase().includes(keyword) ||
      workshop.instructor?.toLowerCase().includes(keyword) ||
      workshop.location?.toLowerCase().includes(keyword)

    const matchesStatus =
      statusFilter === 'all' || workshop.status === statusFilter

    return Boolean(matchesSearch && matchesStatus)
  })
}
