'use client'

import {
  CalendarDays,
  Clock3,
  MapPin,
  UserRound,
  UsersRound,
} from 'lucide-react'
import {
  formatWorkshopDate,
  formatWorkshopTime,
  getWorkshopStatusClass,
  getWorkshopStatusLabel,
  type Workshop,
} from './workshopData'

type WorkshopCardProps = {
  workshop: Workshop
  imageUrl: string
  deleting: boolean
  disabled: boolean
  onEdit: () => void
  onDelete: () => void
}

export default function WorkshopCard({
  workshop,
  imageUrl,
  deleting,
  disabled,
  onEdit,
  onDelete,
}: WorkshopCardProps) {
  return (
    <div className="workshop-card">
      <div className="workshop-image">
        {imageUrl && (
          <img
            src={imageUrl}
            alt={workshop.title || 'Workshop'}
            onError={(event) => {
              event.currentTarget.style.display = 'none'

              const placeholder = event.currentTarget.parentElement?.querySelector(
                '.workshop-image-placeholder',
              ) as HTMLElement | null

              if (placeholder) {
                placeholder.style.display = 'flex'
              }
            }}
          />
        )}

        <div
          className="workshop-image-placeholder"
          style={{ display: imageUrl ? 'none' : 'flex' }}
        >
          ▣
        </div>

        <span
          className={`workshop-status ${getWorkshopStatusClass(workshop.status)}`}
        >
          {getWorkshopStatusLabel(workshop.status)}
        </span>
      </div>

      <div className="workshop-content">
        <h3>{workshop.title || 'Kegiatan Workshop'}</h3>

        <p className="workshop-description">
          {workshop.description || 'Tidak ada deskripsi kegiatan.'}
        </p>

        <div className="workshop-info">
          <div className="workshop-info-row">
            <span className="workshop-info-icon">
              <CalendarDays size={15} strokeWidth={1.8} aria-hidden="true" />
            </span>
            <strong>{formatWorkshopDate(workshop.date)}</strong>
          </div>

          <div className="workshop-info-row">
            <span className="workshop-info-icon">
              <Clock3 size={15} strokeWidth={1.8} aria-hidden="true" />
            </span>
            <strong>
              {formatWorkshopTime(workshop.start_time)} -{' '}
              {formatWorkshopTime(workshop.end_time)}
            </strong>
          </div>

          <div className="workshop-info-row">
            <span className="workshop-info-icon">
              <UserRound size={15} strokeWidth={1.8} aria-hidden="true" />
            </span>
            <strong>{workshop.instructor || 'Instruktur belum diisi'}</strong>
          </div>

          <div className="workshop-info-row">
            <span className="workshop-info-icon">
              <MapPin size={15} strokeWidth={1.8} aria-hidden="true" />
            </span>
            <strong>{workshop.location || 'Lokasi belum diisi'}</strong>
          </div>

          <div className="workshop-info-row">
            <span className="workshop-info-icon">
              <UsersRound size={15} strokeWidth={1.8} aria-hidden="true" />
            </span>
            <strong>Kapasitas {workshop.capacity ?? 0} orang</strong>
          </div>
        </div>

        <div className="workshop-actions">
          <button
            type="button"
            className="workshop-edit-btn"
            onClick={onEdit}
            disabled={disabled}
          >
            <span className="workshop-button-icon">✎</span>
            Edit
          </button>

          <button
            type="button"
            className="workshop-delete-btn"
            onClick={onDelete}
            disabled={disabled}
          >
            <span className="workshop-button-icon">🗑</span>
            {deleting ? 'Menghapus...' : 'Hapus'}
          </button>
        </div>
      </div>
    </div>
  )
}