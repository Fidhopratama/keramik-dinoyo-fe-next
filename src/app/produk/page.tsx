'use client'

import { useEffect, useState } from 'react'
import AdminLayout from '../../components/AdminLayout'

import {
  createProduct,
  deleteProduct,
  getProducts,
  getShops,
  updateProduct,
} from '../../services/api'

const API_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') ||
  'http://127.0.0.1:5050'

function getProductImage(product) {
  if (!product) {
    return ''
  }

  if (!product.image) {
    return ''
  }

  if (
    product.image.startsWith('http://') ||
    product.image.startsWith('https://')
  ) {
    return product.image
  }

  if (product.image.startsWith('/uploads/')) {
    return `${API_URL}${product.image}`
  }

  if (product.image.startsWith('uploads/')) {
    return `${API_URL}/${product.image}`
  }

  if (product.image.startsWith('/images/')) {
    return product.image
  }

  if (product.image.startsWith('/')) {
    return `${API_URL}${product.image}`
  }

  if (product.image.startsWith('products/')) {
    return `${API_URL}/uploads/${product.image}`
  }

  return `${API_URL}/uploads/products/${product.image}`
}

const initialForm = {
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

export default function ProdukPage() {
  const [products, setProducts] = useState([])
  const [shops, setShops] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [error, setError] = useState('')
  const [formError, setFormError] = useState('')

  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] =
    useState(null)

  const [form, setForm] = useState({
    ...initialForm,
  })

  const [deletingId, setDeletingId] =
    useState(null)

  const [search, setSearch] = useState('')

  const fetchData = async () => {
    try {
      setLoading(true)
      setError('')

      const [
        productsResponse,
        shopsResponse,
      ] = await Promise.all([
        getProducts({
          search: search || undefined,
        }),
        getShops(),
      ])

      setProducts(
        productsResponse.data?.data?.data ||
          productsResponse.data?.data ||
          [],
      )

      setShops(
        shopsResponse.data?.data || [],
      )
    } catch (err) {
      console.error(err)

      setError(
        err.response?.data?.message ||
          'Gagal mengambil data produk.',
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleSearch = async () => {
    await fetchData()
  }

  const openAddForm = () => {
    setEditingProduct(null)

    setForm({
      ...initialForm,
    })

    setFormError('')
    setShowForm(true)
  }

  const openEditForm = (product) => {
    setEditingProduct(product)

    setForm({
      shop_id:
        product.shop_id ||
        product.shop?.id ||
        '',

      category_id:
        product.category_id ||
        product.category?.id ||
        '',

      name: product.name || '',

      description:
        product.description || '',

      price: product.price ?? '',

      stock: product.stock ?? '',

      status:
        product.status || 'active',

      imageFile: null,

      imagePreview:
        getProductImage(product),
    })

    setFormError('')
    setShowForm(true)
  }

  const closeForm = () => {
    if (saving) {
      return
    }

    setShowForm(false)
    setEditingProduct(null)

    setForm({
      ...initialForm,
    })

    setFormError('')
  }

  const handleChange = (event) => {
    const {
      name,
      value,
    } = event.target

    setForm((current) => ({
      ...current,
      [name]: value,
    }))
  }

  const handleImageChange = (event) => {
    const file =
      event.target.files?.[0]

    if (!file) {
      return
    }

    if (
      file.size >
      2 * 1024 * 1024
    ) {
      setFormError(
        'Ukuran foto maksimal 2 MB.',
      )

      event.target.value = ''

      return
    }

    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
    ]

    if (
      !allowedTypes.includes(file.type)
    ) {
      setFormError(
        'Format foto harus JPG, JPEG, atau WEBP.',
      )

      event.target.value = ''

      return
    }

    setForm((current) => ({
      ...current,
      imageFile: file,
      imagePreview:
        URL.createObjectURL(file),
    }))

    setFormError('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    setFormError('')

    if (!form.shop_id) {
      setFormError(
        'Toko wajib dipilih.',
      )

      return
    }

    if (!form.name.trim()) {
      setFormError(
        'Nama produk wajib diisi.',
      )

      return
    }

    if (
      form.price === '' ||
      Number(form.price) < 0
    ) {
      setFormError(
        'Harga produk tidak valid.',
      )

      return
    }

    if (
      form.stock === '' ||
      Number(form.stock) < 0
    ) {
      setFormError(
        'Stok produk tidak valid.',
      )

      return
    }

    try {
      setSaving(true)

      const formData = new FormData()

      formData.append(
        'shop_id',
        form.shop_id,
      )

      if (form.category_id) {
        formData.append(
          'category_id',
          form.category_id,
        )
      }

      formData.append(
        'name',
        form.name,
      )

      // Saat tambah produk, buat slug unik.
      // Saat edit, pertahankan slug produk lama.
      const baseSlug = form.name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')

      const productSlug = editingProduct?.slug
        ? editingProduct.slug
        : `${baseSlug}-${Date.now()}`

      formData.append(
        'slug',
        productSlug,
      )

      formData.append(
        'description',
        form.description,
      )

      formData.append(
        'price',
        form.price,
      )

      formData.append(
        'stock',
        form.stock,
      )

      formData.append(
        'status',
        form.status,
      )

      if (form.imageFile) {
        formData.append(
          'image',
          form.imageFile,
        )
      }

      if (editingProduct) {
        await updateProduct(
          editingProduct.id,
          formData,
        )
      } else {
        await createProduct(formData)
      }

      setShowForm(false)
      setEditingProduct(null)

      setForm({
        ...initialForm,
      })

      await fetchData()
    } catch (err) {
      console.error(err)

      const responseData =
        err.response?.data

      let message =
        responseData?.message ||
        'Gagal menyimpan produk.'

      if (
        responseData?.errors
      ) {
        const errors =
          responseData.errors

        if (
          Array.isArray(errors)
        ) {
          message =
            errors.join('\n')
        } else if (
          typeof errors ===
          'object'
        ) {
          message =
            Object.values(errors)
              .flat()
              .join('\n')
        }
      }

      setFormError(message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (product) => {
    const confirmed =
      window.confirm(
        `Yakin ingin menghapus produk "${product.name}"?`,
      )

    if (!confirmed) {
      return
    }

    try {
      setDeletingId(product.id)
      setError('')

      await deleteProduct(product.id)

      await fetchData()
    } catch (err) {
      console.error(err)

      const responseData =
        err.response?.data

      setError(
        responseData?.message ||
          'Produk tidak bisa dihapus.',
      )
    } finally {
      setDeletingId(null)
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="page-container">
          <div className="page-header">
            <div>
              <h1>Produk</h1>

              <p>
                Kelola produk keramik dari
                seluruh toko.
              </p>
            </div>
          </div>

          <div className="loading-box">
            Memuat data produk...
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="page-container">
        <style jsx>{`
          .page-container {
            width: 100%;
          }

          .page-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            gap: 20px;
            margin-bottom: 22px;
          }

          .page-header h1 {
            margin: 0;
            color: #2f2119;
            font-size: 28px;
            font-weight: 700;
          }

          .page-header p {
            margin: 7px 0 0;
            color: #766458;
            font-size: 14px;
          }

          .primary-button {
            border: none;
            background: #c87842;
            color: #fff;
            padding: 11px 18px;
            border-radius: 9px;
            font-size: 14px;
            font-weight: 600;
            font-family: inherit;
            cursor: pointer;
          }

          .primary-button:disabled {
            opacity: 0.6;
            cursor: not-allowed;
          }

          .product-toolbar {
            display: flex;
            gap: 10px;
            width: 100%;
            max-width: 560px;
            margin-bottom: 24px;
          }

          .product-toolbar input {
            flex: 1;
            height: 50px;
            box-sizing: border-box;
            border: 1px solid #d9d1cb;
            border-radius: 9px;
            padding: 0 14px;
            font-family: inherit;
            font-size: 15px;
            outline: none;
          }

          .secondary-button {
            height: 40px;
            padding: 0 16px;
            background: #fff;
            color: #333;
            border: 1px solid #aaa;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 500;
            font-family: inherit;
            cursor: pointer;
          }

          .product-toolbar .secondary-button {
            height: 50px;
          }

          .error-box {
            margin-bottom: 20px;
            padding: 12px 15px;
            border-radius: 9px;
            background: #fff1f1;
            border: 1px solid #efc2c2;
            color: #c0392b;
            font-size: 14px;
            white-space: pre-line;
          }

          .loading-box,
          .empty-box {
            background: #fff;
            border: 1px solid #eee2d8;
            border-radius: 14px;
            padding: 60px 20px;
            text-align: center;
            color: #8a7769;
          }

          .empty-box h3 {
            margin: 0 0 8px;
            color: #3d2b1f;
          }

          .empty-box p {
            margin: 0 0 20px;
          }

          .product-grid {
            display: grid;
            grid-template-columns:
              repeat(3, minmax(0, 1fr));
            gap: 24px;
          }

          .product-card {
            background: #fff;
            border: 1px solid #eee2d8;
            border-radius: 15px;
            overflow: hidden;
            box-shadow:
              0 4px 14px
              rgba(74, 52, 39, 0.06);
          }

          .product-image {
            width: 100%;
            height: 225px;
            background: #f5f5f7;
            overflow: hidden;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .product-image img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            display: block;
          }

          .product-image-placeholder {
            color: #aaa;
            font-size: 14px;
          }

          .product-content {
            padding: 20px;
          }

          .product-title-row {
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
            gap: 12px;
          }

          .product-title-row h3 {
            margin: 0;
            color: #171717;
            font-size: 19px;
            font-weight: 700;
          }

          .status-badge {
            flex-shrink: 0;
            padding: 7px 11px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
          }

          .status-badge.active {
            background: #dcf8e7;
            color: #16834a;
          }

          .status-badge.inactive {
            background: #fbecec;
            color: #c0392b;
          }

          .product-shop {
            margin: 10px 0 0;
            color: #5f7185;
            font-size: 14px;
          }

          .product-description {
            margin: 13px 0 0;
            color: #687789;
            font-size: 14px;
            line-height: 1.6;
            min-height: 45px;
          }

          .product-meta {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
            margin-top: 18px;
          }

          .product-meta > div {
            background: #f8f9fa;
            border-radius: 9px;
            padding: 13px 12px;
          }

          .product-meta span {
            display: block;
            color: #718096;
            font-size: 13px;
            margin-bottom: 7px;
          }

          .product-meta strong {
            display: block;
            color: #171717;
            font-size: 14px;
          }

          .product-actions {
            display: flex;
            gap: 10px;
            margin-top: 22px;
          }

          .edit-product-button,
          .delete-product-button {
            flex: 1;
            height: 40px;
            border-radius: 9px;
            font-size: 14px;
            font-weight: 600;
            font-family: inherit;
            cursor: pointer;
          }

          .edit-product-button {
            background: #fff7ed;
            color: #c87842;
            border: 1px solid #e8c7aa;
          }

          .delete-product-button {
            background: #fff5f5;
            color: #d9534f;
            border: 1px solid #edc4c4;
          }

          .delete-product-button:disabled {
            opacity: 0.6;
            cursor: not-allowed;
          }

          .modal-overlay {
            position: fixed;
            inset: 0;
            z-index: 9999;
            background: rgba(35, 25, 19, 0.48);
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
          }

          .modal-card {
            width: 100%;
            max-width: 650px;
            max-height: 90vh;
            overflow-y: auto;
            background: #fff;
            border-radius: 16px;
            padding: 25px;
          }

          .modal-header {
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
            gap: 20px;
            margin-bottom: 22px;
          }

          .modal-header h2 {
            margin: 0;
            color: #3d2b1f;
            font-size: 21px;
          }

          .modal-header p {
            margin: 5px 0 0;
            color: #8a7769;
            font-size: 13px;
          }

          .modal-close {
            width: 34px;
            height: 34px;
            border: none;
            border-radius: 50%;
            background: #f5eee8;
            color: #6e5c50;
            font-size: 20px;
            cursor: pointer;
          }

          .form-group {
            margin-bottom: 16px;
          }

          .form-group label {
            display: block;
            margin-bottom: 7px;
            color: #4d3b2f;
            font-size: 13px;
            font-weight: 600;
          }

          .form-group input,
          .form-group select,
          .form-group textarea {
            width: 100%;
            box-sizing: border-box;
            border: 1px solid #ded2c9;
            border-radius: 8px;
            padding: 10px 12px;
            font-family: inherit;
            font-size: 14px;
            outline: none;
            background: #fff;
          }

          .form-group input,
          .form-group select {
            height: 42px;
          }

          .form-group textarea {
            min-height: 90px;
            resize: vertical;
          }

          .form-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 14px;
          }

          .file-help {
            display: block;
            margin-top: 6px;
            color: #8a7769;
            font-size: 12px;
          }

          .image-preview {
            width: 100%;
            height: 190px;
            margin-top: 10px;
            border-radius: 10px;
            overflow: hidden;
            background: #f5eee8;
          }

          .image-preview img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }

          .form-error {
            margin-bottom: 15px;
            padding: 10px 12px;
            background: #fff1f1;
            border: 1px solid #efc2c2;
            color: #c0392b;
            border-radius: 8px;
            font-size: 13px;
            white-space: pre-line;
          }

          .modal-actions {
            display: flex;
            justify-content: flex-end;
            gap: 10px;
            margin-top: 24px;
          }

          @media (max-width: 1100px) {
            .product-grid {
              grid-template-columns:
                repeat(2, minmax(0, 1fr));
            }
          }

          @media (max-width: 700px) {
            .page-header {
              flex-direction: column;
            }

            .product-grid {
              grid-template-columns: 1fr;
            }

            .form-row {
              grid-template-columns: 1fr;
            }
          }
        `}</style>

        <div className="page-header">
          <div>
            <h1>Produk</h1>

            <p>
              Kelola produk keramik dari seluruh toko.
            </p>
          </div>

          <button
            className="primary-button"
            onClick={openAddForm}
          >
            + Tambah Produk
          </button>
        </div>

        <div className="product-toolbar">
          <input
            type="text"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                handleSearch()
              }
            }}
            placeholder="Cari nama produk..."
          />

          <button
            className="secondary-button"
            onClick={handleSearch}
          >
            Cari
          </button>
        </div>

        {error && (
          <div className="error-box">
            {error}
          </div>
        )}

        {products.length === 0 ? (
          <div className="empty-box">
            <h3>Belum ada produk</h3>

            <p>
              Tambahkan produk pertama.
            </p>

            <button
              className="primary-button"
              onClick={openAddForm}
            >
              + Tambah Produk
            </button>
          </div>
        ) : (
          <div className="product-grid">
            {products.map((product) => {
              const imageUrl =
                getProductImage(product)

              return (
                <div
                  className="product-card"
                  key={product.id}
                >
                  <div className="product-image">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={product.name}
                        onError={(event) => {
                          event.currentTarget.style.display =
                            'none'
                        }}
                      />
                    ) : (
                      <div className="product-image-placeholder">
                        Tidak ada foto
                      </div>
                    )}
                  </div>

                  <div className="product-content">
                    <div className="product-title-row">
                      <h3>
                        {product.name}
                      </h3>

                      <span
                        className={
                          product.status ===
                          'active'
                            ? 'status-badge active'
                            : 'status-badge inactive'
                        }
                      >
                        {product.status ===
                        'active'
                          ? 'Aktif'
                          : 'Nonaktif'}
                      </span>
                    </div>

                    <p className="product-shop">
                      {product.shop?.name ||
                        'Toko tidak diketahui'}
                    </p>

                    <p className="product-description">
                      {product.description ||
                        'Belum ada deskripsi.'}
                    </p>

                    <div className="product-meta">
                      <div>
                        <span>Harga</span>

                        <strong>
                          Rp{' '}
                          {Number(
                            product.price || 0,
                          ).toLocaleString(
                            'id-ID',
                          )}
                        </strong>
                      </div>

                      <div>
                        <span>Stok</span>

                        <strong>
                          {product.stock ?? 0}
                        </strong>
                      </div>
                    </div>

                    <div className="product-actions">
                      <button
                        type="button"
                        className="edit-product-button"
                        onClick={() =>
                          openEditForm(
                            product,
                          )
                        }
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        className="delete-product-button"
                        disabled={
                          deletingId ===
                          product.id
                        }
                        onClick={() =>
                          handleDelete(
                            product,
                          )
                        }
                      >
                        {deletingId ===
                        product.id
                          ? 'Menghapus...'
                          : 'Hapus'}
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {showForm && (
          <div className="modal-overlay">
            <div className="modal-card">
              <div className="modal-header">
                <div>
                  <h2>
                    {editingProduct
                      ? 'Edit Produk'
                      : 'Tambah Produk'}
                  </h2>

                  <p>
                    Isi informasi produk di bawah.
                  </p>
                </div>

                <button
                  type="button"
                  className="modal-close"
                  onClick={closeForm}
                  disabled={saving}
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="shop_id">
                    Toko
                  </label>

                  <select
                    id="shop_id"
                    name="shop_id"
                    value={form.shop_id}
                    onChange={handleChange}
                    required
                  >
                    <option value="">
                      Pilih toko
                    </option>

                    {shops.map((shop) => (
                      <option
                        key={shop.id}
                        value={shop.id}
                      >
                        {shop.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="category_id">
                    Category ID
                  </label>

                  <input
                    id="category_id"
                    name="category_id"
                    type="number"
                    min="1"
                    value={form.category_id}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="name">
                    Nama Produk
                  </label>

                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="image">
                    Foto Produk
                  </label>

                  <input
                    id="image"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleImageChange}
                  />

                  <small className="file-help">
                    JPG, JPEG, atau WEBP. Maksimal
                    2 MB.
                  </small>

                  {form.imagePreview && (
                    <div className="image-preview">
                      <img
                        src={form.imagePreview}
                        alt="Preview produk"
                      />
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="description">
                    Deskripsi
                  </label>

                  <textarea
                    id="description"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows="4"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="price">
                      Harga
                    </label>

                    <input
                      id="price"
                      name="price"
                      type="number"
                      min="0"
                      value={form.price}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="stock">
                      Stok
                    </label>

                    <input
                      id="stock"
                      name="stock"
                      type="number"
                      min="0"
                      value={form.stock}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="status">
                    Status
                  </label>

                  <select
                    id="status"
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                  >
                    <option value="active">
                      Aktif
                    </option>

                    <option value="inactive">
                      Nonaktif
                    </option>
                  </select>
                </div>

                {formError && (
                  <div className="form-error">
                    {formError}
                  </div>
                )}

                <div className="modal-actions">
                  <button
                    type="button"
                    className="secondary-button"
                    onClick={closeForm}
                    disabled={saving}
                  >
                    Batal
                  </button>

                  <button
                    type="submit"
                    className="primary-button"
                    disabled={saving}
                  >
                    {saving
                      ? 'Menyimpan...'
                      : editingProduct
                        ? 'Simpan Perubahan'
                        : 'Tambah Produk'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}