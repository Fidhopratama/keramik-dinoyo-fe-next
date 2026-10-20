'use client'

import { useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'

import AdminLayout from '../../components/AdminLayout'
import useProducts from '../../hooks/useProducts'
import {
  formFromProduct,
  initialForm,
  validateForm,
  validateImage,
} from '../../lib/product'
import type { Product, ProductForm } from '../../types/product'
import DeleteConfirm from './components/DeleteConfirm'
import ProductFormModal from './components/ProductFormModal'
import ProductGrid from './components/ProductGrid'
import ProductHeader from './components/ProductHeader'
import ProductStyles from './components/ProductStyles'
import ProductToolbar from './components/ProductToolbar'

export default function ProdukPage() {
  const {
    products,
    shops,
    loading,
    saving,
    deletingId,
    error,
    search,
    setSearch,
    fetchData,
    save,
    remove,
  } = useProducts()

  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Product | null>(null)
  const [form, setForm] = useState<ProductForm>({ ...initialForm })
  const [formError, setFormError] = useState('')
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null)

  const resetForm = () => {
    setShowForm(false)
    setEditing(null)
    setForm({ ...initialForm })
    setFormError('')
  }

  const openAddForm = () => {
    setEditing(null)
    setForm({ ...initialForm })
    setFormError('')
    setShowForm(true)
  }

  const openEditForm = (product: Product) => {
    setEditing(product)
    setForm(formFromProduct(product))
    setFormError('')
    setShowForm(true)
  }

  const closeForm = () => {
    if (saving) return
    resetForm()
  }

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const problem = validateImage(file)

    if (problem) {
      setFormError(problem)
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

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setFormError('')

    const problem = validateForm(form)

    if (problem) {
      setFormError(problem)
      return
    }

    const message = await save(form, editing)

    if (message) {
      setFormError(message)
      return
    }

    resetForm()
  }

  const confirmDelete = async () => {
    if (!deleteTarget) return

    await remove(deleteTarget)
    setDeleteTarget(null)
  }

  return (
    <AdminLayout>
      <ProductStyles />

      <div className="pr">
        <ProductHeader onAdd={openAddForm} />

        <ProductToolbar value={search} onChange={setSearch} onSearch={fetchData} />

        {error && <div className="pr-error">{error}</div>}

        <ProductGrid
          products={products}
          loading={loading}
          deletingId={deletingId}
          onAdd={openAddForm}
          onEdit={openEditForm}
          onDelete={setDeleteTarget}
        />

        {showForm && (
          <ProductFormModal
            editing={Boolean(editing)}
            form={form}
            shops={shops}
            saving={saving}
            error={formError}
            onChange={handleChange}
            onImage={handleImageChange}
            onSubmit={handleSubmit}
            onClose={closeForm}
          />
        )}

        {deleteTarget && (
          <DeleteConfirm
            name={deleteTarget.name}
            deleting={deletingId === deleteTarget.id}
            onConfirm={confirmDelete}
            onCancel={() => setDeleteTarget(null)}
          />
        )}
      </div>
    </AdminLayout>
  )
}
