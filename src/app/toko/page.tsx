'use client'

import { useCallback, useEffect, useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import AdminLayout from '../../components/AdminLayout'
import {
  createShop,
  deleteShop,
  getShops,
  updateShop,
} from '../../services/api'

import ShopTable from './components/ShopTable'
import ShopModal from './components/ShopModal'

import {
  emptyForm,
  getResponseData,
  type Shop,
  type ShopFormData,
} from './components/shopData'

export default function TokoPage() {
  const [shops, setShops] = useState<Shop[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState<number | string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [editingShop, setEditingShop] = useState<Shop | null>(null)
  const [form, setForm] = useState<ShopFormData>({ ...emptyForm })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const fetchShops = useCallback(async () => {
    try {
      setLoading(true)
      setError('')

      const response = await getShops()
      setShops(getResponseData(response))
    } catch (err: unknown) {
      console.error('Fetch shops error:', err)

      const message = err as {
        response?: { data?: { message?: string } }
      }

      setError(
        message.response?.data?.message ||
          'Gagal mengambil data toko.',
      )
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void fetchShops()
  }, [fetchShops])

  function openAddForm() {
    setEditingShop(null)
    setForm({ ...emptyForm })
    setError('')
    setSuccess('')
    setShowForm(true)
  }

  function openEditForm(shop: Shop) {
    setEditingShop(shop)

    setForm({
      name: shop.name || '',
      description: shop.description || '',
      instagram: shop.instagram || '',
      tiktok: shop.tiktok || '',
      whatsapp: shop.whatsapp || '',
      address: shop.address || '',
      is_active:
        shop.is_active === true ||
        shop.is_active === 1 ||
        shop.is_active === '1',
      imageFile: null,
      imagePreview: shop.image
        ? shop.image.startsWith('http')
          ? shop.image
          : shop.image.startsWith('/images/')
            ? shop.image
            : shop.image.startsWith('/uploads/')
              ? `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://127.0.0.1:5050'}${shop.image}`
              : shop.image.startsWith('/')
                ? `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://127.0.0.1:5050'}${shop.image}`
                : `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://127.0.0.1:5050'}/uploads/shops/${shop.image}`
        : '',
    })

    setError('')
    setSuccess('')
    setShowForm(true)
  }

  function closeForm() {
    if (saving) return

    setShowForm(false)
    setEditingShop(null)
    setForm({ ...emptyForm })
    setError('')
  }

  function handleChange(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const target = event.target

    if (target instanceof HTMLInputElement && target.type === 'checkbox') {
      setForm((current) => ({
        ...current,
        [target.name]: target.checked,
      }))
      return
    }

    setForm((current) => ({
      ...current,
      [target.name]: target.value,
    }))
  }

  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']

    if (!allowedTypes.includes(file.type)) {
      setError('Format gambar harus JPG, PNG, atau WEBP.')
      event.target.value = ''
      return
    }

    if (file.size > 2 * 1024 * 1024) {
      setError('Ukuran gambar maksimal 2 MB.')
      event.target.value = ''
      return
    }

    setError('')

    setForm((current) => ({
      ...current,
      imageFile: file,
      imagePreview: URL.createObjectURL(file),
    }))
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!form.name.trim()) {
      setError('Nama toko wajib diisi.')
      return
    }

    try {
      setSaving(true)
      setError('')
      setSuccess('')

      const formData = new FormData()

      formData.append('name', form.name.trim())
      formData.append('description', form.description || '')
      formData.append('instagram', form.instagram || '')
      formData.append('tiktok', form.tiktok || '')
      formData.append('whatsapp', form.whatsapp || '')
      formData.append('address', form.address || '')
      formData.append('is_active', form.is_active ? '1' : '0')

      if (form.imageFile) {
        formData.append('image', form.imageFile)
      }

      if (editingShop) {
        await updateShop(editingShop.id, formData)
        setSuccess('Toko berhasil diperbarui.')
      } else {
        await createShop(formData)
        setSuccess('Toko berhasil ditambahkan.')
      }

      await fetchShops()

      setShowForm(false)
      setEditingShop(null)
      setForm({ ...emptyForm })
    } catch (err: unknown) {
      console.error('Save shop error:', err)

      const message = err as {
        response?: { data?: { message?: string } }
      }

      setError(
        message.response?.data?.message ||
          'Gagal menyimpan data toko.',
      )
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(shop: Shop) {
    const confirmed = window.confirm(
      `Apakah kamu yakin ingin menghapus toko "${shop.name}"?`,
    )

    if (!confirmed) return

    try {
      setDeletingId(shop.id)
      setError('')
      setSuccess('')

      await deleteShop(shop.id)

      setShops((current) =>
        current.filter((item) => item.id !== shop.id),
      )

      setSuccess('Toko berhasil dihapus.')
    } catch (err: unknown) {
      console.error('Delete shop error:', err)

      const message = err as {
        response?: { data?: { message?: string } }
      }

      setError(
        message.response?.data?.message ||
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
            <p>Kelola data toko keramik Dinoyo.</p>
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
          <div className="alert success">{success}</div>
        )}

        {error && !showForm && (
          <div className="alert error">{error}</div>
        )}

        {loading ? (
          <div className="loading">Memuat data toko...</div>
        ) : (
          <ShopTable
            shops={shops}
            deletingId={deletingId}
            onEdit={openEditForm}
            onDelete={handleDelete}
            onAdd={openAddForm}
          />
        )}

        <ShopModal
          show={showForm}
          editing={Boolean(editingShop)}
          form={form}
          saving={saving}
          error={error}
          onChange={handleChange}
          onImageChange={handleImageChange}
          onSubmit={handleSubmit}
          onClose={closeForm}
        />
      </div>

      {/* Pindahkan CSS lama ke sini dan gunakan jsx global. */}
      <style jsx global>{`
        /* CSS lama kamu tetap dipakai di sini.
           Salin semua aturan CSS dari page.tsx sebelumnya
           tanpa mengubah nama class-nya. */
      `}</style>
    </AdminLayout>
  )
}