'use client'

import { useEffect, useRef, useState } from 'react'
import type { ChangeEvent } from 'react'
import { ImagePlus, LoaderCircle, X } from 'lucide-react'

import { validateImageFile } from '../lib/common'

export type ImageUploadStatus =
  | 'idle'
  | 'ready'
  | 'authorizing'
  | 'uploading'
  | 'complete'
  | 'error'

type Props = {
  id: string
  label: string
  file: File | null
  imageUrl?: string
  disabled?: boolean
  status?: ImageUploadStatus
  progress?: number
  statusMessage?: string
  onChange: (file: File | null) => void
}

const statusLabels: Partial<Record<ImageUploadStatus, string>> = {
  authorizing: 'Meminta izin upload...',
  uploading: 'Mengunggah gambar...',
  complete: 'Upload selesai.',
}

export default function ImageUploadField({
  id,
  label,
  file,
  imageUrl = '',
  disabled = false,
  status = 'idle',
  progress = 0,
  statusMessage,
  onChange,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [localError, setLocalError] = useState('')
  const [localPreview, setLocalPreview] = useState('')
  const preview = localPreview || imageUrl
  const busy = status === 'authorizing' || status === 'uploading'
  const message =
    statusMessage ||
    (file && (status === 'idle' || status === 'ready')
      ? 'Foto dipilih dan siap diproses saat data disimpan.'
      : '')
  const safeProgress = Math.max(0, Math.min(100, progress))

  useEffect(() => {
    if (!file) {
      setLocalPreview('')
      return
    }

    const objectUrl = URL.createObjectURL(file)
    setLocalPreview(objectUrl)

    return () => URL.revokeObjectURL(objectUrl)
  }, [file])

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (!selectedFile) return

    const problem = validateImageFile(selectedFile)

    if (problem) {
      setLocalError(problem)
      event.target.value = ''
      return
    }

    setLocalError('')
    onChange(selectedFile)
    event.target.value = ''
  }

  const clearFile = () => {
    setLocalError('')
    if (inputRef.current) inputRef.current.value = ''
    onChange(null)
  }

  return (
    <div className="image-upload-field">
      <label className="image-upload-label" htmlFor={id}>
        {label}
      </label>

      <div className={`image-upload-dropzone${preview ? ' has-preview' : ''}`}>
        {preview ? (
          <img className="image-upload-preview" src={preview} alt={`Pratinjau ${label.toLowerCase()}`} />
        ) : (
          <div className="image-upload-empty">
            <ImagePlus size={28} aria-hidden="true" />
            <strong>Pilih gambar</strong>
            <span>JPG/JPEG, PNG, atau WEBP — maksimal 5 MB</span>
          </div>
        )}

        <input
          ref={inputRef}
          id={id}
          className="image-upload-input"
          type="file"
          accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
          onChange={handleChange}
          disabled={disabled || busy}
          aria-invalid={Boolean(localError || status === 'error')}
          aria-describedby={`${id}-help${localError ? ` ${id}-error` : ''}`}
        />
      </div>

      <div className="image-upload-controls">
        <label className="image-upload-button" htmlFor={id}>
          {preview ? 'Ganti gambar' : 'Pilih gambar'}
        </label>
        {file && (
          <button
            type="button"
            className="image-upload-clear"
            onClick={clearFile}
            disabled={disabled || busy}
          >
            <X size={14} aria-hidden="true" />
            Hapus pilihan
          </button>
        )}
        {busy && <LoaderCircle className="image-upload-spinner" size={16} aria-hidden="true" />}
      </div>

      <small id={`${id}-help`} className="image-upload-help">
        JPG/JPEG, PNG, atau WEBP. Maksimal 5 MB.
      </small>

      {status === 'uploading' && (
        <div
          className="image-upload-progress"
          role="progressbar"
          aria-label="Progress upload gambar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={safeProgress}
        >
          <span style={{ width: `${safeProgress}%` }} />
        </div>
      )}

      {(message || statusLabels[status]) && status !== 'error' && (
        <small className="image-upload-status" role="status">
          {message || statusLabels[status]}
        </small>
      )}

      {(localError || (status === 'error' && statusMessage)) && (
        <small id={`${id}-error`} className="image-upload-error" role="alert">
          {localError || statusMessage}
        </small>
      )}

      <style jsx>{`
        .image-upload-field {
          display: flex;
          flex-direction: column;
          gap: 8px;
          width: 100%;
        }
        .image-upload-label {
          color: #3d342e;
          font-size: 13px;
          font-weight: 600;
        }
        .image-upload-dropzone {
          position: relative;
          display: flex;
          min-height: 158px;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          border: 1.5px dashed #ded4ca;
          border-radius: 12px;
          background: #faf8f6;
        }
        .image-upload-dropzone:focus-within {
          border-color: #c9562e;
          box-shadow: 0 0 0 3px rgba(201, 86, 46, 0.12);
        }
        .image-upload-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 7px;
          padding: 18px;
          color: #8b827b;
          text-align: center;
        }
        .image-upload-empty :global(svg) {
          color: #c9562e;
        }
        .image-upload-empty strong {
          color: #4a423d;
          font-size: 14px;
        }
        .image-upload-empty span {
          font-size: 12px;
        }
        .image-upload-preview {
          display: block;
          width: 100%;
          max-height: 230px;
          object-fit: contain;
        }
        .image-upload-input {
          position: absolute;
          width: 1px;
          height: 1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          clip-path: inset(50%);
        }
        .image-upload-controls {
          display: flex;
          align-items: center;
          gap: 10px;
          min-height: 30px;
        }
        .image-upload-button,
        .image-upload-clear {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 5px 10px;
          border: 1px solid #e7e0d9;
          border-radius: 8px;
          background: #fff;
          color: #6f4a38;
          cursor: pointer;
          font: inherit;
          font-size: 12px;
        }
        .image-upload-button:hover,
        .image-upload-clear:hover:not(:disabled) {
          border-color: #c9562e;
          color: #b24a27;
        }
        .image-upload-clear:disabled {
          cursor: not-allowed;
          opacity: 0.6;
        }
        .image-upload-help,
        .image-upload-status {
          color: #8b827b;
          font-size: 12px;
          line-height: 1.45;
        }
        .image-upload-error {
          color: #b42318;
          font-size: 12px;
        }
        .image-upload-progress {
          height: 6px;
          overflow: hidden;
          border-radius: 99px;
          background: #f0e9e2;
        }
        .image-upload-progress span {
          display: block;
          height: 100%;
          border-radius: inherit;
          background: #c9562e;
          transition: width 180ms ease;
        }
        .image-upload-spinner {
          color: #c9562e;
          animation: image-upload-spin 1s linear infinite;
        }
        @keyframes image-upload-spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  )
}
