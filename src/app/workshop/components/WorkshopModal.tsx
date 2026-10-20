'use client'

import type { ChangeEvent, FormEvent } from 'react'
import type { WorkshopFormData } from './workshopData'
import WorkshopForm from './WorkshopForm'

type WorkshopModalProps = {
  editing: boolean
  saving: boolean
  form: WorkshopFormData
  setForm: (
    value:
      | WorkshopFormData
      | ((prev: WorkshopFormData) => WorkshopFormData),
  ) => void
  imagePreview: string
  onImageChange: (event: ChangeEvent<HTMLInputElement>) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
  onClose: () => void
}

export default function WorkshopModal({
  editing,
  saving,
  form,
  setForm,
  imagePreview,
  onImageChange,
  onSubmit,
  onClose,
}: WorkshopModalProps) {
  return (
    <div
      className="workshop-modal-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !saving) {
          onClose()
        }
      }}
    >
      <div className="workshop-modal">
        <div className="workshop-modal-header">
          <div>
            <h2>{editing ? 'Edit Kegiatan' : 'Tambah Kegiatan'}</h2>
            <p>
              {editing
                ? 'Perbarui informasi kegiatan.'
                : 'Isi informasi kegiatan workshop.'}
            </p>
          </div>

          <button
            type="button"
            className="workshop-close"
            onClick={onClose}
            disabled={saving}
            aria-label="Tutup modal"
          >
            ×
          </button>
        </div>

        <WorkshopForm
          form={form}
          setForm={setForm}
          imagePreview={imagePreview}
          saving={saving}
          onImageChange={onImageChange}
          onSubmit={onSubmit}
          onCancel={onClose}
          editing={editing}
        />
      </div>
    </div>
  )
}