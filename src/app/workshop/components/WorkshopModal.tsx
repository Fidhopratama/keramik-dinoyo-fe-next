'use client'

import type { FormEvent } from 'react'
import type { WorkshopFormData } from '../../../types/workshop'
import type { ImageUploadPhase } from '../../../lib/imageUpload'
import WorkshopForm from './WorkshopForm'

type WorkshopModalProps = {
  editing: boolean
  saving: boolean
  imageUploadStatus: ImageUploadPhase
  imageUploadProgress: number
  imageUploadMessage: string
  form: WorkshopFormData
  setForm: (
    value:
      | WorkshopFormData
      | ((prev: WorkshopFormData) => WorkshopFormData),
  ) => void
  imageFile: File | null
  imagePreview: string
  error: string
  onImageChange: (file: File | null) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
  onClose: () => void
}

export default function WorkshopModal({
  editing,
  saving,
  imageUploadStatus,
  imageUploadProgress,
  imageUploadMessage,
  form,
  setForm,
  imageFile,
  imagePreview,
  error,
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
          imageFile={imageFile}
          imagePreview={imagePreview}
          error={error}
          saving={saving}
          imageUploadStatus={imageUploadStatus}
          imageUploadProgress={imageUploadProgress}
          imageUploadMessage={imageUploadMessage}
          onImageChange={onImageChange}
          onSubmit={onSubmit}
          onCancel={onClose}
          editing={editing}
        />
      </div>
    </div>
  )
}