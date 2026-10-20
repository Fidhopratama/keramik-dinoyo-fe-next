export type ProductStatus = 'active' | 'inactive'

export type Product = {
  id: number | string
  shop_id?: number | string
  category_id?: number | string | null
  name: string
  slug?: string
  description?: string | null
  price?: number | string | null
  stock?: number | string | null
  status?: ProductStatus | string
  image?: string | null
  shop?: {
    id?: number | string
    name?: string
  } | null
  category?: {
    id?: number | string
    name?: string
  } | null
}

export type Shop = {
  id: number | string
  name: string
}

export type ProductFormData = {
  shop_id: string
  category_id: string
  name: string
  description: string
  price: string
  stock: string
  status: ProductStatus
  imageFile: File | null
  imagePreview: string
}

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/?$/, '') ||
  'http://127.0.0.1:5050'

export const initialForm: ProductFormData = {
  shop_id: '',
  category_id: '',
  name: '',
  description: '',
  price: '',
  stock: '',
  status: 'active',
  imageFile: null,
  imagePreview: '',
}

export function getProductImage(product?: Product | null): string {
  if (!product?.image) return ''

  const image = product.image.trim()

  if (image.startsWith('http://') || image.startsWith('https://')) {
    return image
  }

  if (image.startsWith('/images/')) {
    return image
  }

  if (image.startsWith('/uploads/')) {
    return `${API_URL}${image}`
  }

  if (image.startsWith('uploads/')) {
    return `${API_URL}/${image}`
  }

  if (image.startsWith('/')) {
    return `${API_URL}${image}`
  }

  if (image.startsWith('products/')) {
    return `${API_URL}/uploads/${image}`
  }

  return `${API_URL}/uploads/products/${image}`
}

export function formatPrice(price: number | string | null | undefined): string {
  return `Rp ${Number(price || 0).toLocaleString('id-ID')}`
}