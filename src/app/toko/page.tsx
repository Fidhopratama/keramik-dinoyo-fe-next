'use client'

import { useEffect, useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { Plus } from 'lucide-react'

import AdminLayout from '../../components/AdminLayout'
import useShops from '../../hooks/useShops'
import {
  emptyForm,
  formFromShop,
  validateShopForm,
  validateShopImage,
} from '../../lib/shop'
import type { Shop, ShopFormData } from '../../types/shop'
import ShopModal from './components/ShopModal'
import ShopStyles from './components/ShopStyles'
import ShopTable from './components/ShopTable'

export default function TokoPage() {
  const {
    shops,
    loading,
    saving,
    deletingId,
    error,
    success,
    setError,
    setSuccess,
    save,
    remove,
  } = useShops()

  const [showForm, setShowForm] = useState(false)
  const [editingShop, setEditingShop] = useState<Shop | null>(null)
  const [form, setForm] = useState<ShopFormData>({ ...emptyForm })
  const [highlightId, setHighlightId] = useState('')

  function openAddForm() {
    setEditingShop(null)
    setForm({ ...emptyForm })
    setError('')
    setSuccess('')
    setShowForm(true)
  }

  function openEditForm(shop: Shop) {
    setEditingShop(shop)
    setForm(formFromShop(shop))
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

  // Dari dashboard: /toko?shop=ID menyorot dan menggulung ke kartu toko itu.
  useEffect(() => {
    if (loading || shops.length === 0) return

    const id = new URLSearchParams(window.location.search).get('shop')
    if (!id) return

    const target = shops.find((item) => String(item.id) === id)

    window.history.replaceState(null, '', window.location.pathname)

    if (!target) return

    setHighlightId(String(target.id))

    window.setTimeout(() => {
      document
        .getElementById(`shop-${target.id}`)
        ?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, 150)

    const timer = window.setTimeout(() => setHighlightId(''), 4000)

    return () => window.clearTimeout(timer)
  }, [loading, shops])

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

    const problem = validateShopImage(file)

    if (problem) {
      setError(problem)
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

    const problem = validateShopForm(form)

    if (problem) {
      setError(problem)
      return
    }

    const ok = await save(form, editingShop)
    if (!ok) return

    setShowForm(false)
    setEditingShop(null)
    setForm({ ...emptyForm })
  }

  async function handleDelete(shop: Shop) {
    const confirmed = window.confirm(
      `Apakah kamu yakin ingin menghapus toko "${shop.name}"?`,
    )

    if (!confirmed) return

    await remove(shop)
  }

  return (
    <AdminLayout>
      <ShopStyles />

      <div className="sh">
        <div className="sh-head">
          <div>
            <h2>Data Toko</h2>
            <p>Kelola data toko keramik di Kampung Keramik Dinoyo.</p>
          </div>

          <button type="button" className="sh-btn primary" onClick={openAddForm}>
            <Plus size={18} aria-hidden="true" />
            Tambah Toko
          </button>
        </div>

        {success && <div className="sh-alert success">{success}</div>}

        {error && !showForm && <div className="sh-alert error">{error}</div>}

        {loading ? (
          <div className="sh-loading">Memuat data toko...</div>
        ) : (
          <ShopTable
            shops={shops}
            deletingId={deletingId}
            highlightId={highlightId}
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
    </AdminLayout>
  )
}
