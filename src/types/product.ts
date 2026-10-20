export type Shop = {
  id: number | string
  name: string
}

export type Product = {
  id: number | string
  shop_id?: number | string
  category_id?: number | string
  shop?: { id?: number | string; name?: string }
  category?: { id?: number | string }
  name: string
  slug?: string
  description?: string
  price?: number | string
  stock?: number | string
  status?: string
  image?: string
}

export type ProductForm = {
  shop_id: string
  category_id: string
  name: string
  description: string
  price: string
  stock: string
  status: string
  imageFile: File | null
  imagePreview: string
}
