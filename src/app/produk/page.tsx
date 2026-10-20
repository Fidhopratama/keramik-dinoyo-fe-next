'use client'

import { useCallback, useEffect, useState } from 'react'
import type {
  ChangeEvent,
  FormEvent,
} from 'react'

import AdminLayout from '../../components/AdminLayout'

import {
  createProduct,
  deleteProduct,
  getProducts,
  getShops,
  updateProduct,
} from '../../services/api'

import ProductCard from './components/ProductCard'
import ProductModal from './components/ProductModal'
import ProductStyles from './components/ProductStyles'
import ProductToolbar from './components/ProductToolbar'

import {
  initialForm,
  type Product,
  type ProductFormData,
  type Shop,
} from './components/productData'

type ApiError = {
  response?: {
    data?: {
      message?: string
      errors?: unknown
    }
  }
}

function getErrorMessage(error: unknown, fallback: string): string {
  const apiError = error as ApiError
  const responseData = apiError.response?.data

  if (responseData?.errors) {
    const errors = responseData.errors

    if (Array.isArray(errors)) {
      return errors.map(String).join('\n')
    }

    if (typeof errors === 'object' && errors !== null) {
      return Object.values(errors)
        .flatMap((value) => Array.isArray(value) ? value : [value])
        .map(String)
        .join('\n')
    }
  }

  return responseData?.message || fallback
}

function getProductList(response: any): Product[] {
  const data = response?.data?.data

  if (Array.isArray(data)) {
    return data
  }

  if (Array.isArray(data?.data)) {
    return data.data
  }

  if (Array.isArray(response?.data?.products)) {
    return response.data.products
  }

  return []
}

function getShopList(response: any): Shop[] {
  const data = response?.data?.data

  if (Array.isArray(data)) {
    return data
  }

  if (Array.isArray(data?.data)) {
    return data.data
  }

  if (Array.isArray(response?.data?.shops)) {
    return response.data.shops
  }

  return []
}

export default function ProdukPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [shops, setShops] = useState<Shop[]>([])

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [error, setError] = useState('')
  const [formError, setFormError] = useState('')

  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

  const [form, setForm] = useState<ProductFormData>({
    ...initialForm,
  })

  const [deletingId, setDeletingId] = useState<number | string | null>(null)
  const [search, setSearch] = useState('')

  const fetchData = useCallback(async (searchTerm = '') => {
    try {
      setLoading(true)
      setError('')

      const [productsResponse, shopsResponse] = await Promise.all([
        getProducts({
          search: searchTerm.trim() || undefined,
        }),
        getShops(),
      ])

      setProducts(getProductList(productsResponse))
      setShops(getShopList(shopsResponse))
    } catch (err) {
      console.error(err)
      setError(getErrorMessage(err, 'Gagal mengambil data produk.'))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void fetchData()
  }, [fetchData])

  const handleSearch = () => {
    void fetchData(search)
  }

  const openAddForm = () => {
    setEditingProduct(null)
    setForm({ ...initialForm })
    setFormError('')
    setShowForm(true)
  }

  const openEditForm = (product: Product) => {
    setEditingProduct(product)

    setForm({
      shop_id: String(product.shop_id ?? product.shop?.id ?? ''),
      category_id: String(
        product.category_id ?? product.category?.id ?? '',
      ),
      name: product.name || '',
      description: product.description || '',
      price: product.price == null ? '' : String(product.price),
      stock: product.stock == null ? '' : String(product.stock),
      status: product.status === 'inactive' ? 'inactive' : 'active',
      imageFile: null,
      imagePreview: getProductImageUrl(product),
    })

    setFormError('')
    setShowForm(true)
  }

  const closeForm = () => {
    if (saving) return

    setShowForm(false)
    setEditingProduct(null)
    setForm({ ...initialForm })
    setFormError('')
  }

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target

    setForm((current) => ({
      ...current,
      [name]: value,
    }))
  }

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (!file) return

    if (file.size > 2 * 1024 * 1024) {
      setFormError('Ukuran foto maksimal 2 MB.')
      event.target.value = ''
      return
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']

    if (!allowedTypes.includes(file.type)) {
      setFormError('Format foto harus JPG, JPEG, atau WEBP.')
      event.target.value = ''
      return
    }

    setForm((current) => ({
      ...current,
      imageFile: file,
      imagePreview: URL.createObjectURL(file),
    }))

    setFormError('')
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setFormError('')

    if (!form.shop_id) {
      setFormError('Toko wajib dipilih.')
      return
    }

    if (!form.name.trim()) {
      setFormError('Nama produk wajib diisi.')
      return
    }

    if (form.price.trim() === '' || !Number.isFinite(Number(form.price)) || Number(form.price) < 0) {
      setFormError('Harga produk tidak valid.')
      return
    }

    if (form.stock.trim() === '' || !Number.isFinite(Number(form.stock)) || Number(form.stock) < 0) {
      setFormError('Stok produk tidak valid.')
      return
    }

    try {
      setSaving(true)

      const formData = new FormData()

      formData.append('shop_id', form.shop_id)

      if (form.category_id) {
        formData.append('category_id', form.category_id)
      }

      formData.append('name', form.name.trim())

      const baseSlug = form.name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')

      const productSlug = editingProduct?.slug
        ? editingProduct.slug
        : `${baseSlug}-${Date.now()}`

      formData.append('slug', productSlug)
      formData.append('description', form.description)
      formData.append('price', form.price)
      formData.append('stock', form.stock)
      formData.append('status', form.status)

      if (form.imageFile) {
        formData.append('image', form.imageFile)
      }

      if (editingProduct) {
        await updateProduct(editingProduct.id, formData)
      } else {
        await createProduct(formData)
      }

      setShowForm(false)
      setEditingProduct(null)
      setForm({ ...initialForm })

      await fetchData(search)
    } catch (err) {
      console.error(err)
      setFormError(getErrorMessage(err, 'Gagal menyimpan produk.'))
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (product: Product) => {
    const confirmed = window.confirm(
      `Yakin ingin menghapus produk "${product.name}"?`,
    )

    if (!confirmed) return

    try {
      setDeletingId(product.id)
      setError('')

      await deleteProduct(product.id)
      await fetchData(search)
    } catch (err) {
      console.error(err)
      setError(getErrorMessage(err, 'Produk tidak bisa dihapus.'))
    } finally {
      setDeletingId(null)
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <ProductStyles />

        <div className="page-container">
          <div className="page-header">
            <div>
              <h1>Produk</h1>
              <p>Kelola produk keramik dari seluruh toko.</p>
            </div>
          </div>

          <div className="loading-box">Memuat data produk...</div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <ProductStyles />

      <div className="page-container">
        <div className="page-header">
          <div>
            <h1>Produk</h1>
            <p>Kelola produk keramik dari seluruh toko.</p>
          </div>

          <button
            type="button"
            className="primary-button"
            onClick={openAddForm}
          >
            + Tambah Produk
          </button>
        </div>

        <ProductToolbar
          search={search}
          onSearchChange={setSearch}
          onSearch={handleSearch}
        />

        {error && <div className="error-box">{error}</div>}

        {products.length === 0 ? (
          <div className="empty-box">
            <h3>{search ? 'Produk tidak ditemukan' : 'Belum ada produk'}</h3>

            <p>
              {search
                ? 'Coba gunakan kata kunci pencarian lain.'
                : 'Tambahkan produk pertama.'}
            </p>

            {search ? (
              <button
                type="button"
                className="secondary-button"
                onClick={() => {
                  setSearch('')
                  void fetchData('')
                }}
              >
                Reset Pencarian
              </button>
            ) : (
              <button
                type="button"
                className="primary-button"
                onClick={openAddForm}
              >
                + Tambah Produk
              </button>
            )}
          </div>
        ) : (
          <div className="product-grid">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                deleting={deletingId === product.id}
                onEdit={openEditForm}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}

        {showForm && (
          <ProductModal
            form={form}
            shops={shops}
            editingProduct={editingProduct}
            saving={saving}
            formError={formError}
            onChange={handleChange}
            onImageChange={handleImageChange}
            onSubmit={handleSubmit}
            onClose={closeForm}
          />
        )}
      </div>
    </AdminLayout>
  )
}

function getProductImageUrl(product: Product): string {
  if (!product.image) return ''

  const image = product.image.trim()

  if (image.startsWith('http://') || image.startsWith('https://')) {
    return image
  }

  if (image.startsWith('/images/')) {
    return image
  }

  const apiUrl =
    process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/?$/, '') ||
    'http://127.0.0.1:5050'

  if (image.startsWith('/uploads/')) {
    return `${apiUrl}${image}`
  }

  if (image.startsWith('uploads/')) {
    return `${apiUrl}/${image}`
  }

  if (image.startsWith('/')) {
    return `${apiUrl}${image}`
  }

  if (image.startsWith('products/')) {
    return `${apiUrl}/uploads/${image}`
  }

  return `${apiUrl}/uploads/products/${image}`
}