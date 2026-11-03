import { API_ORIGIN, validateImageFile } from './common'
import type { Product, ProductForm } from '../types/product'

export function getProductImage(product?: Product | null) {
  const image = product?.image

  if (!image) return ''

  if (image.startsWith('http://') || image.startsWith('https://')) return image
  if (image.startsWith('/uploads/')) return `${API_ORIGIN}${image}`
  if (image.startsWith('uploads/')) return `${API_ORIGIN}/${image}`
  if (image.startsWith('/images/')) return image
  if (image.startsWith('/')) return `${API_ORIGIN}${image}`
  if (image.startsWith('products/')) return `${API_ORIGIN}/uploads/${image}`

  return `${API_ORIGIN}/uploads/products/${image}`
}

export const initialForm: ProductForm = {
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

export function formFromProduct(product: Product): ProductForm {
  return {
    shop_id: String(product.shop_id ?? product.shop?.id ?? ''),
    category_id: String(product.category_id ?? product.category?.id ?? ''),
    name: product.name || '',
    description: product.description || '',
    price: String(product.price ?? ''),
    stock: String(product.stock ?? ''),
    status: product.status || 'active',
    imageFile: null,
    imagePreview: getProductImage(product),
  }
}

export function formatPrice(value: unknown) {
  return Number(value || 0).toLocaleString('id-ID')
}

export function validateImage(file: File) {
  return validateImageFile(file)
}

export function validatePrice(value: string): string {
  const price = value.trim()

  if (!/^(?:Rp\s*)?(?:\d+|\d{1,3}(?:\.\d{3})+)$/i.test(price)) {
    return 'Format harga tidak valid. Gunakan angka seperti 15000 atau Rp 15.000.'
  }

  return ''
}

function normalizePrice(value: string): string {
  return value.trim().replace(/^Rp\s*/i, '').replace(/\./g, '')
}

export function validateForm(form: ProductForm) {
  if (!form.shop_id) return 'Toko wajib dipilih.'
  if (!form.name.trim()) return 'Nama produk wajib diisi.'
  if (!form.price.trim()) return 'Harga produk wajib diisi.'
  const priceProblem = validatePrice(form.price)
  if (priceProblem) return priceProblem
  const numericPrice = Number(normalizePrice(form.price))
  if (!Number.isFinite(numericPrice) || numericPrice < 0) {
    return 'Harga produk tidak valid.'
  }
  if (form.stock === '' || Number(form.stock) < 0) return 'Stok produk tidak valid.'
  if (form.imageFile) {
    const imageProblem = validateImage(form.imageFile)
    if (imageProblem) return imageProblem
  }

  return ''
}

// Saat tambah produk, slug dibuat unik. Saat edit, slug lama dipertahankan.
export function buildFormData(form: ProductForm, editing: Product | null) {
  const data = new FormData()

  data.append('shop_id', form.shop_id)
  if (form.category_id) data.append('category_id', form.category_id)
  data.append('name', form.name)

  const baseSlug = form.name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

  data.append('slug', editing?.slug ? editing.slug : `${baseSlug}-${Date.now()}`)
  data.append('description', form.description)
  data.append('price', normalizePrice(form.price))
  data.append('stock', form.stock)
  data.append('status', form.status)

  if (form.imageFile) data.append('image', form.imageFile)

  return data
}

// Pesan untuk form: gabungkan daftar error validasi dari server.
export function getFormMessage(err: any, fallback: string) {
  const body = err?.response?.data
  let message = body?.message || fallback

  if (body?.errors) {
    if (Array.isArray(body.errors)) {
      message = body.errors.join('\n')
    } else if (typeof body.errors === 'object') {
      message = Object.values(body.errors).flat().join('\n')
    }
  }

  return message
}
