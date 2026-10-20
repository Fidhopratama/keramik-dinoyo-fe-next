'use client'

import type { ChangeEvent, FormEvent } from 'react'
import type { WorkshopFormData } from './workshopData'

type WorkshopFormProps = {
  form: WorkshopFormData
  setForm: (
    value:
      | WorkshopFormData
      | ((prev: WorkshopFormData) => WorkshopFormData),
  ) => void
  imagePreview: string
  saving: boolean
  onImageChange: (event: ChangeEvent<HTMLInputElement>) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
  onCancel: () => void
  editing: boolean
}

export default function WorkshopForm({
  form,
  setForm,
  imagePreview,
  saving,
  onImageChange,
  onSubmit,
  onCancel,
  editing,
}: WorkshopFormProps) {
  const handleChange = (
    event: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="workshop-form-group">
        <label>
          Judul Kegiatan<span>*</span>
        </label>
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Contoh: Workshop Membuat Keramik"
          required
          disabled={saving}
        />
      </div>

      <div className="workshop-form-group">
        <label>Deskripsi</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Deskripsi singkat kegiatan..."
          rows={4}
          disabled={saving}
        />
      </div>

      <div className="workshop-form-row">
        <div className="workshop-form-group">
          <label>Instruktur</label>
          <input
            type="text"
            name="instructor"
            value={form.instructor}
            onChange={handleChange}
            placeholder="Nama instruktur"
            disabled={saving}
          />
        </div>

        <div className="workshop-form-group">
          <label>Kapasitas</label>
          <input
            type="number"
            name="capacity"
            value={form.capacity}
            onChange={handleChange}
            min={1}
            required
            disabled={saving}
          />
        </div>
      </div>

      <div className="workshop-form-row">
        <div className="workshop-form-group">
          <label>
            Tanggal<span>*</span>
          </label>
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            required
            disabled={saving}
          />
        </div>

        <div className="workshop-form-group">
          <label>
            Status<span>*</span>
          </label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            required
            disabled={saving}
          >
            <option value="upcoming">Akan Datang</option>
            <option value="ongoing">Berlangsung</option>
            <option value="completed">Selesai</option>
            <option value="cancelled">Dibatalkan</option>
          </select>
        </div>
      </div>

      <div className="workshop-form-row">
        <div className="workshop-form-group">
          <label>
            Jam Mulai<span>*</span>
          </label>
          <input
            type="time"
            name="start_time"
            value={form.start_time}
            onChange={handleChange}
            required
            disabled={saving}
          />
        </div>

        <div className="workshop-form-group">
          <label>
            Jam Selesai<span>*</span>
          </label>
          <input
            type="time"
            name="end_time"
            value={form.end_time}
            onChange={handleChange}
            required
            disabled={saving}
          />
        </div>
      </div>

      <div className="workshop-form-group">
        <label>Lokasi</label>
        <input
          type="text"
          name="location"
          value={form.location}
          onChange={handleChange}
          placeholder="Contoh: Studio Keramik Dinoyo"
          disabled={saving}
        />
      </div>

      <div className="workshop-form-group">
        <label>Foto Kegiatan</label>
        <input
          id="workshop-image-input"
          className="workshop-file"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={onImageChange}
          disabled={saving}
        />

        <label htmlFor="workshop-image-input" className="workshop-upload">
          {imagePreview ? (
            <img src={imagePreview} alt="Preview kegiatan" />
          ) : (
            <>
              <span className="workshop-upload-icon">↑</span>
              <strong>Klik untuk memilih gambar</strong>
              <small>JPG, PNG, WEBP — maksimal 2 MB</small>
            </>
          )}
        </label>
      </div>

      <div className="workshop-modal-actions">
        <button
          type="button"
          className="workshop-cancel"
          onClick={onCancel}
          disabled={saving}
        >
          Batal
        </button>

        <button type="submit" className="workshop-save" disabled={saving}>
          {saving
            ? 'Menyimpan...'
            : editing
              ? 'Simpan Perubahan'
              : 'Tambah Kegiatan'}
        </button>
      </div>
    </form>
  )
}