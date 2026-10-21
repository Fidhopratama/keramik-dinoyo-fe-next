'use client'

import { useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'

import AdminLayout from '../../components/AdminLayout'
import useWorkshops from '../../hooks/useWorkshops'
import {
  filterWorkshops,
  formFromWorkshop,
  getImageForWorkshop,
  initialForm,
  validateWorkshopImage,
} from '../../lib/workshop'
import type { Workshop, WorkshopFormData } from '../../types/workshop'
import WorkshopCard from './components/WorkshopCard'
import WorkshopModal from './components/WorkshopModal'
import WorkshopStyles from './components/WorkshopStyles'
import WorkshopToolbar from './components/WorkshopToolbar'

function revokePreview(url: string) {
  if (url.startsWith('blob:')) URL.revokeObjectURL(url)
}

export default function Workshop() {
  const {
    workshops,
    loading,
    error,
    saving,
    deletingId,
    fetchWorkshops,
    save,
    remove,
  } = useWorkshops()

  const [showModal, setShowModal] = useState(false)
  const [editingWorkshop, setEditingWorkshop] = useState<Workshop | null>(null)
  const [form, setForm] = useState<WorkshopFormData>({ ...initialForm })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState('')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const openCreateModal = () => {
    setEditingWorkshop(null)
    setForm({ ...initialForm })
    setImageFile(null)
    setImagePreview('')
    setShowModal(true)
  }

  const openEditModal = (workshop: Workshop, index: number) => {
    const edit = formFromWorkshop(workshop, index)

    setEditingWorkshop(workshop)
    setForm(edit.form)
    setImageFile(null)
    setImagePreview(edit.preview)
    setShowModal(true)
  }

  const closeModal = () => {
    if (saving) return

    revokePreview(imagePreview)

    setShowModal(false)
    setEditingWorkshop(null)
    setForm({ ...initialForm })
    setImageFile(null)
    setImagePreview('')
  }

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const problem = validateWorkshopImage(file)

    if (problem) {
      alert(problem)
      event.target.value = ''
      return
    }

    revokePreview(imagePreview)

    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (saving) return

    const result = await save(form, imageFile, editingWorkshop)

    alert(result.message)

    if (!result.ok) return

    revokePreview(imagePreview)

    setShowModal(false)
    setEditingWorkshop(null)
    setForm({ ...initialForm })
    setImageFile(null)
    setImagePreview('')

    await fetchWorkshops()
  }

  const handleDelete = async (workshop: Workshop) => {
    if (deletingId !== null) return

    const confirmed = window.confirm(
      `Yakin ingin menghapus kegiatan "${workshop.title}"?`,
    )

    if (!confirmed) return

    const result = await remove(workshop)

    alert(result.message)
  }

  const filteredWorkshops = filterWorkshops(workshops, search, statusFilter)

  if (loading) {
    return (
      <AdminLayout>
        <div className="workshop-page">
          <WorkshopStyles />
          <div className="workshop-loading">Memuat data kegiatan...</div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="workshop-page">
        <WorkshopStyles />

        <div className="workshop-heading">
          <div>
            <h1>Workshop &amp; Kegiatan</h1>
            <p>Kelola kegiatan dan workshop Kampung Keramik Dinoyo.</p>
          </div>

          <button
            type="button"
            className="workshop-add-button"
            onClick={openCreateModal}
          >
            + Tambah Kegiatan
          </button>
        </div>

        {error && <div className="workshop-error">{error}</div>}

        <WorkshopToolbar
          search={search}
          setSearch={setSearch}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
        />

        <div className="workshop-grid">
          {filteredWorkshops.length === 0 ? (
            <div className="workshop-empty">
              <div className="workshop-empty-icon">{'\u25A3'}</div>

              <h3>
                {workshops.length === 0
                  ? 'Belum ada kegiatan'
                  : 'Kegiatan tidak ditemukan'}
              </h3>

              <p>
                {workshops.length === 0
                  ? 'Tambahkan workshop atau kegiatan baru.'
                  : 'Coba gunakan kata kunci pencarian lain.'}
              </p>

              {workshops.length === 0 && (
                <button
                  type="button"
                  className="workshop-add-button"
                  onClick={openCreateModal}
                >
                  + Tambah Kegiatan
                </button>
              )}
            </div>
          ) : (
            filteredWorkshops.map((workshop) => {
              const originalIndex = workshops.findIndex(
                (item) => item.id === workshop.id,
              )

              return (
                <WorkshopCard
                  key={workshop.id}
                  workshop={workshop}
                  imageUrl={getImageForWorkshop(workshop, originalIndex)}
                  deleting={deletingId === workshop.id}
                  disabled={deletingId !== null || saving}
                  onEdit={() => openEditModal(workshop, originalIndex)}
                  onDelete={() => void handleDelete(workshop)}
                />
              )
            })
          )}
        </div>

        {showModal && (
          <WorkshopModal
            editing={Boolean(editingWorkshop)}
            saving={saving}
            form={form}
            setForm={setForm}
            imagePreview={imagePreview}
            onImageChange={handleImageChange}
            onSubmit={handleSubmit}
            onClose={closeModal}
          />
        )}
      </div>
    </AdminLayout>
  )
}
