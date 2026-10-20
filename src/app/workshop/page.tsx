'use client'

import { useCallback, useEffect, useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import AdminLayout from '../../components/AdminLayout'
import {
  createWorkshop,
  deleteWorkshop,
  getWorkshops,
  updateWorkshop,
} from '../../services/api'
import WorkshopCard from './components/WorkshopCard'
import WorkshopModal from './components/WorkshopModal'
import WorkshopStyles from './components/WorkshopStyles'
import WorkshopToolbar from './components/WorkshopToolbar'
import {
  getWorkshopImageUrl,
  initialForm,
  localWorkshopImages,
  type Workshop,
  type WorkshopFormData,
} from './components/workshopData'

export default function Workshop() {
  const [workshops, setWorkshops] = useState<Workshop[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingWorkshop, setEditingWorkshop] = useState<Workshop | null>(null)
  const [form, setForm] = useState<WorkshopFormData>({ ...initialForm })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState('')
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState<number | string | null>(null)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const fetchWorkshops = useCallback(async () => {
    try {
      setLoading(true)
      setError('')

      const response = await getWorkshops()
      const data = response.data?.data || []

      setWorkshops(Array.isArray(data) ? data : [])
    } catch (err: any) {
      console.error('GET WORKSHOP ERROR:', err)
      setError(err.response?.data?.message || 'Data kegiatan gagal dimuat.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void fetchWorkshops()
  }, [fetchWorkshops])

  const getImageForWorkshop = (workshop: Workshop, index: number) => {
    if (typeof workshop.image_url === 'string' && workshop.image_url) {
      return getWorkshopImageUrl(workshop.image_url)
    }

    if (typeof workshop.image === 'string' && workshop.image) {
      return getWorkshopImageUrl(workshop.image)
    }

    return localWorkshopImages[index % localWorkshopImages.length] || ''
  }

  const openCreateModal = () => {
    setEditingWorkshop(null)
    setForm({ ...initialForm })
    setImageFile(null)
    setImagePreview('')
    setShowModal(true)
  }

  const openEditModal = (workshop: Workshop, index: number) => {
    setEditingWorkshop(workshop)

    setForm({
      title: workshop.title || '',
      description: workshop.description || '',
      instructor: workshop.instructor || '',
      date: workshop.date ? String(workshop.date).substring(0, 10) : '',
      start_time: workshop.start_time
        ? String(workshop.start_time).substring(0, 5)
        : '',
      end_time: workshop.end_time
        ? String(workshop.end_time).substring(0, 5)
        : '',
      capacity: workshop.capacity ?? 10,
      location: workshop.location || '',
      status: workshop.status || 'upcoming',
    })

    setImageFile(null)

    const existingImage =
      workshop.image_url ||
      workshop.image ||
      localWorkshopImages[index % localWorkshopImages.length]

    setImagePreview(existingImage ? getWorkshopImageUrl(existingImage) : '')
    setShowModal(true)
  }

  const closeModal = () => {
    if (saving) return

    if (imagePreview.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreview)
    }

    setShowModal(false)
    setEditingWorkshop(null)
    setForm({ ...initialForm })
    setImageFile(null)
    setImagePreview('')
  }

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']

    if (!allowedTypes.includes(file.type)) {
      alert('Format gambar harus JPG, JPEG, PNG, atau WEBP.')
      event.target.value = ''
      return
    }

    if (file.size > 2 * 1024 * 1024) {
      alert('Ukuran gambar maksimal 2 MB.')
      event.target.value = ''
      return
    }

    if (imagePreview.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreview)
    }

    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (saving) return

    try {
      setSaving(true)

      const formData = new FormData()
      formData.append('title', form.title.trim())
      formData.append('description', form.description.trim())
      formData.append('instructor', form.instructor.trim())
      formData.append('date', form.date)
      formData.append('start_time', form.start_time)
      formData.append('end_time', form.end_time)
      formData.append('capacity', String(form.capacity))
      formData.append('location', form.location.trim())
      formData.append('status', form.status)

      if (imageFile) {
        formData.append('image', imageFile)
      }

      if (editingWorkshop) {
        await updateWorkshop(editingWorkshop.id, formData)
        alert('Kegiatan berhasil diperbarui.')
      } else {
        await createWorkshop(formData)
        alert('Kegiatan berhasil ditambahkan.')
      }

      if (imagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreview)
      }

      setShowModal(false)
      setEditingWorkshop(null)
      setForm({ ...initialForm })
      setImageFile(null)
      setImagePreview('')

      await fetchWorkshops()
    } catch (err: any) {
      console.error('SAVE WORKSHOP ERROR:', err)

      const validationErrors = err.response?.data?.errors

      if (validationErrors) {
        const firstError = Object.values(validationErrors).flat().find(Boolean)
        alert(String(firstError || 'Data kegiatan tidak valid.'))
      } else {
        alert(err.response?.data?.message || 'Gagal menyimpan kegiatan.')
      }
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (workshop: Workshop) => {
    if (deletingId !== null) return

    const confirmed = window.confirm(
      `Yakin ingin menghapus kegiatan "${workshop.title}"?`,
    )

    if (!confirmed) return

    try {
      setDeletingId(workshop.id)
      await deleteWorkshop(workshop.id)

      setWorkshops((prev) =>
        prev.filter((item) => item.id !== workshop.id),
      )

      alert('Kegiatan berhasil dihapus.')
    } catch (err: any) {
      console.error('DELETE WORKSHOP ERROR:', err)
      alert(err.response?.data?.message || 'Gagal menghapus kegiatan.')
    } finally {
      setDeletingId(null)
    }
  }

  const filteredWorkshops = workshops.filter((workshop) => {
    const keyword = search.toLowerCase().trim()

    const matchesSearch =
      !keyword ||
      workshop.title?.toLowerCase().includes(keyword) ||
      workshop.instructor?.toLowerCase().includes(keyword) ||
      workshop.location?.toLowerCase().includes(keyword)

    const matchesStatus =
      statusFilter === 'all' || workshop.status === statusFilter

    return Boolean(matchesSearch && matchesStatus)
  })

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
              <div className="workshop-empty-icon">▣</div>

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