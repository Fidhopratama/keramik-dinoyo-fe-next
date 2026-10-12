'use client'

import { useEffect, useState } from 'react'

import AdminLayout from '../../components/AdminLayout'

import {
  createShop,
  deleteShop,
  getShops,
  updateShop,
} from '../../services/api'

const API_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') ||
  'http://127.0.0.1:5050'

const shopImages = {
  'Keramik Brawijaya':
    '/images/keramik-brawijaya.jpg',

  'Keramik Dinoyo Makmur':
    '/images/keramik-dinoyo-makmur.jpg',

  'Dinoyo Ceramic House':
    '/images/dinoyo-ceramic-house.jpg',
}

const emptyForm = {
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

function getShopImage(shop) {
  if (!shop) {
    return ''
  }

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

function getResponseData(response) {
  return response?.data?.data || response?.data || []
}

export default function TokoPage() {
  const [shops, setShops] = useState([])

  const [loading, setLoading] = useState(true)

  const [saving, setSaving] = useState(false)

  const [deletingId, setDeletingId] = useState(null)

  const [showForm, setShowForm] = useState(false)

  const [editingShop, setEditingShop] = useState(null)

  const [form, setForm] = useState(emptyForm)

  const [error, setError] = useState('')

  const [success, setSuccess] = useState('')

  async function fetchShops() {
    try {
      setLoading(true)

      setError('')

      const response = await getShops()

      const data = getResponseData(response)

      setShops(
        Array.isArray(data)
          ? data
          : [],
      )
    } catch (err) {
      console.error(
        'Fetch shops error:',
        err,
      )

      setError(
        err?.response?.data?.message ||
          'Gagal mengambil data toko.',
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchShops()
  }, [])

  function openAddForm() {
    setEditingShop(null)

    setForm({
      ...emptyForm,
    })

    setError('')

    setSuccess('')

    setShowForm(true)
  }

  function openEditForm(shop) {
    setEditingShop(shop)

    setForm({
      name: shop.name || '',

      description:
        shop.description || '',

      instagram:
        shop.instagram || '',

      tiktok:
        shop.tiktok || '',

      whatsapp:
        shop.whatsapp || '',

      address:
        shop.address || '',

      is_active:
        shop.is_active === true ||
        shop.is_active === 1 ||
        shop.is_active === '1',

      imageFile: null,

      imagePreview:
        getShopImage(shop),
    })

    setError('')

    setSuccess('')

    setShowForm(true)
  }

  function closeForm() {
    if (saving) {
      return
    }

    setShowForm(false)

    setEditingShop(null)

    setForm({
      ...emptyForm,
    })
  }

  function handleChange(event) {
    const {
      name,
      value,
      type,
      checked,
    } = event.target

    setForm((current) => ({
      ...current,

      [name]:
        type === 'checkbox'
          ? checked
          : value,
    }))
  }

  function handleImageChange(event) {
    const file =
      event.target.files?.[0]

    if (!file) {
      return
    }

    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
    ]

    if (
      !allowedTypes.includes(
        file.type,
      )
    ) {
      setError(
        'Format gambar harus JPG, PNG, atau WEBP.',
      )

      event.target.value = ''

      return
    }

    if (
      file.size >
      2 * 1024 * 1024
    ) {
      setError(
        'Ukuran gambar maksimal 2 MB.',
      )

      event.target.value = ''

      return
    }

    setError('')

    const previewUrl =
      URL.createObjectURL(file)

    setForm((current) => ({
      ...current,

      imageFile: file,

      imagePreview: previewUrl,
    }))
  }

  async function handleSubmit(event) {
    event.preventDefault()

    if (!form.name.trim()) {
      setError(
        'Nama toko wajib diisi.',
      )

      return
    }

    try {
      setSaving(true)

      setError('')

      setSuccess('')

      const formData =
        new FormData()

      formData.append(
        'name',
        form.name.trim(),
      )

      formData.append(
        'description',
        form.description || '',
      )

      formData.append(
        'instagram',
        form.instagram || '',
      )

      formData.append(
        'tiktok',
        form.tiktok || '',
      )

      formData.append(
        'whatsapp',
        form.whatsapp || '',
      )

      formData.append(
        'address',
        form.address || '',
      )

      formData.append(
        'is_active',
        form.is_active
          ? '1'
          : '0',
      )

      if (form.imageFile) {
        formData.append(
          'image',
          form.imageFile,
        )
      }

      if (editingShop) {
        await updateShop(
          editingShop.id,
          formData,
        )

        setSuccess(
          'Toko berhasil diperbarui.',
        )
      } else {
        await createShop(
          formData,
        )

        setSuccess(
          'Toko berhasil ditambahkan.',
        )
      }

      await fetchShops()

      setShowForm(false)

      setEditingShop(null)

      setForm({
        ...emptyForm,
      })
    } catch (err) {
      console.error(
        'Save shop error:',
        err,
      )

      setError(
        err?.response?.data?.message ||
          'Gagal menyimpan data toko.',
      )
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(shop) {
    const confirmed =
      window.confirm(
        `Apakah kamu yakin ingin menghapus toko "${shop.name}"?`,
      )

    if (!confirmed) {
      return
    }

    try {
      setDeletingId(shop.id)

      setError('')

      setSuccess('')

      await deleteShop(shop.id)

      setShops((current) =>
        current.filter(
          (item) =>
            item.id !== shop.id,
        ),
      )

      setSuccess(
        'Toko berhasil dihapus.',
      )
    } catch (err) {
      console.error(
        'Delete shop error:',
        err,
      )

      setError(
        err?.response?.data?.message ||
          'Gagal menghapus toko.',
      )
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <AdminLayout>
      <div className="page">
        <div className="page-header">
          <div>
            <h1>Toko</h1>

            <p>
              Kelola data toko keramik
              Dinoyo.
            </p>
          </div>

          <button
            type="button"
            className="primary-button"
            onClick={openAddForm}
          >
            + Tambah Toko
          </button>
        </div>

        {success && (
          <div className="alert success">
            {success}
          </div>
        )}

        {error && !showForm && (
          <div className="alert error">
            {error}
          </div>
        )}

        {loading ? (
          <div className="loading">
            Memuat data toko...
          </div>
        ) : shops.length === 0 ? (
          <div className="empty">
            <div className="empty-icon">
              🏪
            </div>

            <h3>
              Belum ada data toko
            </h3>

            <p>
              Tambahkan toko untuk mulai
              mengelola data.
            </p>

            <button
              type="button"
              className="primary-button"
              onClick={openAddForm}
            >
              + Tambah Toko
            </button>
          </div>
        ) : (
          <div className="shop-grid">
            {shops.map((shop) => {
              const image =
                getShopImage(shop)

              return (
                <div
                  className="shop-card"
                  key={shop.id}
                >
                  <div className="shop-image">
                    {image ? (
                      <img
                        src={image}
                        alt={shop.name}
                        onError={(event) => {
                          const fallback =
                            shopImages[
                              shop.name
                            ]

                          if (
                            fallback &&
                            event
                              .currentTarget
                              .src !==
                              window.location
                                .origin +
                                fallback
                          ) {
                            event.currentTarget.src =
                              fallback
                          } else {
                            event.currentTarget.style.display =
                              'none'
                          }
                        }}
                      />
                    ) : (
                      <div className="image-placeholder">
                        Tidak ada gambar
                      </div>
                    )}
                  </div>

                  <div className="shop-content">
                    <div className="shop-title-row">
                      <h3>
                        {shop.name}
                      </h3>

                      <span
                        className={
                          shop.is_active
                            ? 'status active'
                            : 'status inactive'
                        }
                      >
                        {shop.is_active
                          ? 'Aktif'
                          : 'Nonaktif'}
                      </span>
                    </div>

                    {shop.description && (
                      <p className="description">
                        {shop.description}
                      </p>
                    )}

                    {shop.address && (
                      <p className="address">
                        📍 {shop.address}
                      </p>
                    )}

                    <div className="socials">
                      {shop.instagram && (
                        <span>
                          Instagram
                        </span>
                      )}

                      {shop.tiktok && (
                        <span>
                          TikTok
                        </span>
                      )}

                      {shop.whatsapp && (
                        <span>
                          WhatsApp
                        </span>
                      )}
                    </div>

                    <div className="actions">
                      <button
                        type="button"
                        className="edit-button"
                        onClick={() =>
                          openEditForm(
                            shop,
                          )
                        }
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        className="delete-button"
                        disabled={
                          deletingId ===
                          shop.id
                        }
                        onClick={() =>
                          handleDelete(
                            shop,
                          )
                        }
                      >
                        {deletingId ===
                        shop.id
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
          <div
            className="modal-overlay"
            onMouseDown={(event) => {
              if (
                event.target ===
                event.currentTarget
              ) {
                closeForm()
              }
            }}
          >
            <div className="modal">
              <div className="modal-header">
                <div>
                  <h2>
                    {editingShop
                      ? 'Edit Toko'
                      : 'Tambah Toko'}
                  </h2>

                  <p>
                    Lengkapi informasi toko
                    keramik.
                  </p>
                </div>

                <button
                  type="button"
                  className="close-button"
                  onClick={closeForm}
                >
                  ×
                </button>
              </div>

              {error && (
                <div className="alert error">
                  {error}
                </div>
              )}

              <form
                onSubmit={handleSubmit}
              >
                <div className="form-group">
                  <label>
                    Nama Toko
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={
                      handleChange
                    }
                    placeholder="Nama toko"
                  />
                </div>

                <div className="form-group">
                  <label>
                    Deskripsi
                  </label>

                  <textarea
                    name="description"
                    value={
                      form.description
                    }
                    onChange={
                      handleChange
                    }
                    rows={4}
                    placeholder="Deskripsi toko"
                  />
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label>
                      Instagram
                    </label>

                    <input
                      type="text"
                      name="instagram"
                      value={
                        form.instagram
                      }
                      onChange={
                        handleChange
                      }
                      placeholder="@username"
                    />
                  </div>

                  <div className="form-group">
                    <label>
                      TikTok
                    </label>

                    <input
                      type="text"
                      name="tiktok"
                      value={
                        form.tiktok
                      }
                      onChange={
                        handleChange
                      }
                      placeholder="@username"
                    />
                  </div>
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label>
                      WhatsApp
                    </label>

                    <input
                      type="text"
                      name="whatsapp"
                      value={
                        form.whatsapp
                      }
                      onChange={
                        handleChange
                      }
                      placeholder="08xxxxxxxxxx"
                    />
                  </div>

                  <div className="form-group">
                    <label>
                      Status
                    </label>

                    <label className="checkbox">
                      <input
                        type="checkbox"
                        name="is_active"
                        checked={
                          form.is_active
                        }
                        onChange={
                          handleChange
                        }
                      />

                      <span>
                        Toko aktif
                      </span>
                    </label>
                  </div>
                </div>

                <div className="form-group">
                  <label>
                    Alamat
                  </label>

                  <textarea
                    name="address"
                    value={
                      form.address
                    }
                    onChange={
                      handleChange
                    }
                    rows={3}
                    placeholder="Alamat toko"
                  />
                </div>

                <div className="form-group">
                  <label>
                    Gambar Toko
                  </label>

                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={
                      handleImageChange
                    }
                  />

                  <small>
                    JPG, PNG, atau WEBP.
                    Maksimal 2 MB.
                  </small>

                  {form.imagePreview && (
                    <div className="preview">
                      <img
                        src={
                          form.imagePreview
                        }
                        alt="Preview toko"
                      />
                    </div>
                  )}
                </div>

                <div className="modal-actions">
                  <button
                    type="button"
                    className="cancel-button"
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
                      : editingShop
                        ? 'Simpan Perubahan'
                        : 'Simpan Toko'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .page {
          padding: 24px;
        }

        .page-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 24px;
        }

        .page-header h1 {
          margin: 0 0 6px;
          font-size: 28px;
          font-weight: 700;
        }

        .page-header p {
          margin: 0;
          color: #6b7280;
        }

        .primary-button {
          border: none;
          border-radius: 8px;
          padding: 11px 18px;
          background: #2563eb;
          color: white;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
        }

        .primary-button:hover {
          background: #1d4ed8;
        }

        .primary-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .alert {
          border-radius: 8px;
          padding: 12px 14px;
          margin-bottom: 18px;
          font-size: 14px;
        }

        .alert.success {
          background: #ecfdf5;
          color: #047857;
          border: 1px solid #a7f3d0;
        }

        .alert.error {
          background: #fef2f2;
          color: #b91c1c;
          border: 1px solid #fecaca;
        }

        .loading {
          padding: 60px 20px;
          text-align: center;
          color: #6b7280;
        }

        .empty {
          padding: 70px 20px;
          text-align: center;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
        }

        .empty-icon {
          font-size: 42px;
          margin-bottom: 12px;
        }

        .empty h3 {
          margin: 0 0 6px;
        }

        .empty p {
          color: #6b7280;
          margin: 0 0 20px;
        }

        .shop-grid {
          display: grid;
          grid-template-columns: repeat(
            3,
            minmax(0, 1fr)
          );
          gap: 20px;
        }

        .shop-card {
          overflow: hidden;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
        }

        .shop-image {
          width: 100%;
          height: 220px;
          background: #f3f4f6;
          overflow: hidden;
        }

        .shop-image img {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .image-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #9ca3af;
        }

        .shop-content {
          padding: 18px;
        }

        .shop-title-row {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 10px;
        }

        .shop-title-row h3 {
          margin: 0;
          font-size: 18px;
          font-weight: 700;
        }

        .status {
          flex-shrink: 0;
          padding: 4px 8px;
          border-radius: 999px;
          font-size: 11px;
          font-weight: 600;
        }

        .status.active {
          background: #dcfce7;
          color: #15803d;
        }

        .status.inactive {
          background: #f3f4f6;
          color: #6b7280;
        }

        .description {
          margin: 12px 0 8px;
          color: #6b7280;
          font-size: 14px;
          line-height: 1.6;
        }

        .address {
          margin: 8px 0;
          color: #4b5563;
          font-size: 13px;
          line-height: 1.5;
        }

        .socials {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-top: 12px;
        }

        .socials span {
          padding: 5px 8px;
          border-radius: 6px;
          background: #f3f4f6;
          color: #4b5563;
          font-size: 11px;
        }

        .actions {
          display: flex;
          gap: 8px;
          margin-top: 18px;
        }

        .edit-button,
        .delete-button {
          flex: 1;
          border-radius: 7px;
          padding: 9px 12px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
        }

        .edit-button {
          border: 1px solid #dbeafe;
          background: #eff6ff;
          color: #2563eb;
        }

        .delete-button {
          border: 1px solid #fecaca;
          background: #fef2f2;
          color: #dc2626;
        }

        .delete-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .modal-overlay {
          position: fixed;
          inset: 0;
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          background: rgba(0, 0, 0, 0.45);
        }

        .modal {
          width: min(700px, 100%);
          max-height: 90vh;
          overflow-y: auto;
          background: white;
          border-radius: 14px;
          padding: 24px;
        }

        .modal-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 20px;
        }

        .modal-header h2 {
          margin: 0 0 5px;
          font-size: 22px;
        }

        .modal-header p {
          margin: 0;
          color: #6b7280;
          font-size: 14px;
        }

        .close-button {
          border: none;
          background: transparent;
          color: #6b7280;
          font-size: 28px;
          line-height: 1;
          cursor: pointer;
        }

        .form-group {
          margin-bottom: 16px;
        }

        .form-group label {
          display: block;
          margin-bottom: 7px;
          color: #374151;
          font-size: 13px;
          font-weight: 600;
        }

        .form-group input[type='text'],
        .form-group input[type='file'],
        .form-group textarea {
          width: 100%;
          box-sizing: border-box;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          padding: 10px 12px;
          font-family: inherit;
          font-size: 14px;
          outline: none;
        }

        .form-group input[type='text']:focus,
        .form-group textarea:focus {
          border-color: #2563eb;
        }

        .form-group textarea {
          resize: vertical;
        }

        .form-group small {
          display: block;
          margin-top: 6px;
          color: #6b7280;
          font-size: 12px;
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .checkbox {
          display: flex !important;
          align-items: center;
          gap: 8px;
          min-height: 40px;
          margin: 0 !important;
          cursor: pointer;
        }

        .checkbox input {
          width: 16px;
          height: 16px;
        }

        .preview {
          width: 180px;
          height: 120px;
          margin-top: 12px;
          overflow: hidden;
          border-radius: 8px;
          background: #f3f4f6;
        }

        .preview img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          margin-top: 24px;
        }

        .cancel-button {
          border: 1px solid #d1d5db;
          border-radius: 8px;
          padding: 10px 18px;
          background: white;
          color: #374151;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
        }

        .cancel-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        @media (max-width: 1000px) {
          .shop-grid {
            grid-template-columns: repeat(
              2,
              minmax(0, 1fr)
            );
          }
        }

        @media (max-width: 700px) {
          .page {
            padding: 16px;
          }

          .page-header {
            align-items: flex-start;
            flex-direction: column;
          }

          .shop-grid {
            grid-template-columns: 1fr;
          }

          .form-grid {
            grid-template-columns: 1fr;
            gap: 0;
          }

          .modal {
            padding: 18px;
          }
        }
      `}</style>
    </AdminLayout>
  )
}