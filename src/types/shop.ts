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
