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
  validateWorkshopForm,
} from '../../lib/workshop'
import type { Workshop, WorkshopFormData } from '../../types/workshop'
import WorkshopCard from './components/WorkshopCard'
import WorkshopModal from './components/WorkshopModal'
import WorkshopStyles from './components/WorkshopStyles'
import WorkshopToolbar from './components/WorkshopToolbar'

export default function Workshop() {
  const {
    workshops,
    loading,
    error,
    saving,
    deletingId,
    imageUploadStatus,
    imageUploadProgress,
    imageUploadMessage,
    fetchWorkshops,
    save,
    remove,
  } = useWorkshops()

  const [showModal, setShowModal] = useState(false)
  const [editingWorkshop, setEditingWorkshop] = useState<Workshop | null>(null)
  const [form, setForm] = useState<WorkshopFormData>({ ...initialForm })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState('')
  const [formError, setFormError] = useState('')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const updateForm = (
    value:
      | WorkshopFormData
      | ((prev: WorkshopFormData) => WorkshopFormData),
  ) => {
    setForm(value)
    setFormError('')
  }

  const openCreateModal = () => {
    setEditingWorkshop(null)
    setForm({ ...initialForm })
    setImageFile(null)
    setImagePreview('')
    setFormError('')
    setShowModal(true)
  }

  const openEditModal = (workshop: Workshop, index: number) => {
    const edit = formFromWorkshop(workshop, index)

    setEditingWorkshop(workshop)
    setForm(edit.form)
    setImageFile(null)
    setImagePreview(edit.preview)
    setFormError('')
    setShowModal(true)
  }

  const closeModal = () => {
    if (saving) return

    setShowModal(false)
    setEditingWorkshop(null)
    setForm({ ...initialForm })
    setImageFile(null)
    setImagePreview('')
    setFormError('')
  }

  const handleImageChange = (file: File | null) => {
    setImageFile(file)
    setFormError('')
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (saving) return

    const problem = validateWorkshopForm(form, imageFile)
    if (problem) {
      setFormError(problem)
      return
    }

    const result = await save(form, imageFile, editingWorkshop)

    alert(result.message)

    if (!result.ok) return

    setShowModal(false)
    setEditingWorkshop(null)
    setForm({ ...initialForm })
    setImageFile(null)
    setImagePreview('')
    setFormError('')

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
            imageUploadStatus={imageUploadStatus}
            imageUploadProgress={imageUploadProgress}
            imageUploadMessage={imageUploadMessage}
            form={form}
            setForm={updateForm}
            imageFile={imageFile}
            imagePreview={imagePreview}
            error={formError}
            onImageChange={handleImageChange}
            onSubmit={handleSubmit}
            onClose={closeModal}
          />
        )}
      </div>
    </AdminLayout>
  )
}
