export interface Shop {
  id: number | string
  name: string
  description?: string | null
  instagram?: string | null
  tiktok?: string | null
  whatsapp?: string | null
  address?: string | null
  is_active: boolean | number | string
  image?: string | null
}

export interface ShopFormData {
  name: string
  description: string
  instagram: string
  tiktok: string
  whatsapp: string
  address: string
  is_active: boolean
  imageFile: File | null
  imagePreview: string
}

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') ||
  'http://127.0.0.1:5050'

export const shopImages: Record<string, string> = {
  'Keramik Brawijaya': '/images/keramik-brawijaya.jpg',
  'Keramik Dinoyo Makmur': '/images/keramik-dinoyo-makmur.jpg',
  'Dinoyo Ceramic House': '/images/dinoyo-ceramic-house.jpg',
}

export const emptyForm: ShopFormData = {
  name: '',
  description: '',
  instagram: '',
  tiktok: '',
  whatsapp: '',
  address: '',
  is_active: true,
  imageFile: null,
  imagePreview: '',
}

export function getShopImage(shop: Shop | null): string {
  if (!shop) return ''

  if (!shop.image) {
    return shopImages[shop.name] || ''
  }

  if (
    shop.image.startsWith('http://') ||
    shop.image.startsWith('https://')
  ) {
    return shop.image
  }

  if (shop.image.startsWith('/uploads/')) {
    return `${API_URL}${shop.image}`
  }

  if (shop.image.startsWith('/images/')) {
    return shop.image
  }

  if (shop.image.startsWith('/')) {
    return `${API_URL}${shop.image}`
  }

  return `${API_URL}/uploads/shops/${shop.image}`
}

export function isShopActive(shop: Shop): boolean {
  return (
    shop.is_active === true ||
    shop.is_active === 1 ||
    shop.is_active === '1'
  )
}

export function getResponseData(response: unknown): Shop[] {
  const result = response as {
    data?: {
      data?: Shop[]
    } & Shop[]
  }

  const data = result?.data?.data || result?.data || []

  return Array.isArray(data) ? data : []
}