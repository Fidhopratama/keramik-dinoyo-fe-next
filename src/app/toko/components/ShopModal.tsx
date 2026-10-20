'use client'

import type { ChangeEvent, FormEvent } from 'react'
import ShopForm from './ShopForm'
import type { ShopFormData } from './shopData'

interface ShopModalProps {
  show: boolean
  editing: boolean
  form: ShopFormData
  saving: boolean
  error: string
  onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  onImageChange: (event: ChangeEvent<HTMLInputElement>) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
  onClose: () => void
}

export default function ShopModal({
  show,
  editing,
  form,
  saving,
  error,
  onChange,
  onImageChange,
  onSubmit,
  onClose,
}: ShopModalProps) {
  if (!show) return null

  return (
    <div
      className="modal-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !saving) {
          onClose()
        }
      }}
    >
      <div className="modal">
        <div className="modal-header">
          <div>
            <h2>{editing ? 'Edit Toko' : 'Tambah Toko'}</h2>
            <p>Lengkapi informasi toko keramik.</p>
          </div>

          <button
            type="button"
            className="close-button"
            onClick={onClose}
            disabled={saving}
            aria-label="Tutup formulir"
          >
            ×
          </button>
        </div>

        <ShopForm
          form={form}
          saving={saving}
          editing={editing}
          error={error}
          onChange={onChange}
          onImageChange={onImageChange}
          onSubmit={onSubmit}
          onCancel={onClose}
        />
      </div>
    </div>
  )
}
