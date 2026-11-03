export const API_ORIGIN =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/?$/, '') ||
  'http://127.0.0.1:5050'

export function validateIndonesianMobileNumber(value: string): string {
  const phone = value.replace(/[\s()-]/g, '')

  if (!/^(?:\+?62|0)8[1-9]\d{7,10}$/.test(phone)) {
    return 'Nomor WhatsApp harus berupa nomor HP Indonesia yang valid, maksimal 14 angka.'
  }

  return ''
}

export function validateDetailedAddress(
  value: string,
  label = 'Alamat',
): string {
  const address = value.trim()

  if (address.length < 15 || address.split(/\s+/).length < 3) {
    return `${label} harus detail: minimal 15 karakter dan 3 kata.`
  }

  return ''
}

export function validateImageFile(file: File): string {
  const allowedExtensions = ['jpg', 'jpeg', 'png', 'webp']
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  const extension = file.name.split('.').pop()?.toLowerCase()

  if (
    !extension ||
    !allowedExtensions.includes(extension) ||
    (file.type !== '' && !allowedTypes.includes(file.type.toLowerCase()))
  ) {
    return 'Format gambar harus JPG/JPEG, PNG, atau WEBP.'
  }

  if (file.size > 5 * 1024 * 1024) return 'Ukuran gambar maksimal 5 MB.'

  return ''
}

// Ambil daftar dari berbagai bentuk balasan API.
export function toList(response: any): any[] {
  const body = response?.data?.data ?? response?.data

  if (Array.isArray(body)) return body
  if (Array.isArray(body?.items)) return body.items

  return []
}

export function getMessage(err: any, fallback: string): string {
  return err?.response?.data?.message || fallback
}
