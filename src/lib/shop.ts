import { API_ORIGIN, toList } from './common'
import type { Shop, ShopFormData } from '../types/shop'

export const API_URL = API_ORIGIN

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

  if (shop.image.startsWith('http://') || shop.image.startsWith('https://')) {
    return shop.image
  }

  if (shop.image.startsWith('/uploads/')) return `${API_URL}${shop.image}`
  if (shop.image.startsWith('/images/')) return shop.image
  if (shop.image.startsWith('/')) return `${API_URL}${shop.image}`

  return `${API_URL}/uploads/shops/${shop.image}`
}

// Pratinjau di form: hanya foto milik toko itu sendiri, tanpa foto cadangan.
export function getShopPreview(shop: Shop): string {
  return shop.image ? getShopImage(shop) : ''
}

export function isShopActive(shop: Shop): boolean {
  return (
    shop.is_active === true ||
    shop.is_active === 1 ||
    shop.is_active === '1'
  )
}

// Ambil daftar toko dari berbagai bentuk balasan API.
export function getResponseData(response: unknown): Shop[] {
  return toList(response) as Shop[]
}

export function formFromShop(shop: Shop): ShopFormData {
  return {
    name: shop.name || '',
    description: shop.description || '',
    instagram: shop.instagram || '',
    tiktok: shop.tiktok || '',
    whatsapp: shop.whatsapp || '',
    address: shop.address || '',
    is_active: isShopActive(shop),
    imageFile: null,
    imagePreview: getShopPreview(shop),
  }
}

// Foto: maksimal 2 MB, format JPG, PNG, atau WEBP.
export function validateShopImage(file: File): string {
  const allowed = ['image/jpeg', 'image/png', 'image/webp']

  if (!allowed.includes(file.type)) return 'Format gambar harus JPG, PNG, atau WEBP.'
  if (file.size > 2 * 1024 * 1024) return 'Ukuran gambar maksimal 2 MB.'

  return ''
}

export function validateShopForm(form: ShopFormData): string {
  if (!form.name.trim()) return 'Nama toko wajib diisi.'

  return ''
}

export function buildShopFormData(form: ShopFormData): FormData {
  const data = new FormData()

  data.append('name', form.name.trim())
  data.append('description', form.description || '')
  data.append('instagram', form.instagram || '')
  data.append('tiktok', form.tiktok || '')
  data.append('whatsapp', form.whatsapp || '')
  data.append('address', form.address || '')
  data.append('is_active', form.is_active ? '1' : '0')

  if (form.imageFile) data.append('image', form.imageFile)

  return data
}
