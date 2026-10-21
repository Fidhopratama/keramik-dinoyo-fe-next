'use client'

import { useState } from 'react'
import { MapPin, Pencil, Store, Trash2 } from 'lucide-react'

import { getShopImage, isShopActive } from '../../../lib/shop'
import type { Shop } from '../../../types/shop'

type Props = {
  shop: Shop
  deleting: boolean
  highlighted?: boolean
  onEdit: (shop: Shop) => void
  onDelete: (shop: Shop) => void
}

function handleOf(value?: string | null) {
  return String(value || '').trim().replace(/^@/, '')
}

function whatsappLink(value?: string | null) {
  let digits = String(value || '').replace(/\D/g, '')

  if (!digits) return ''
  if (digits.startsWith('0')) digits = `62${digits.slice(1)}`

  return `https://wa.me/${digits}`
}

export default function ShopCard({
  shop,
  deleting,
  highlighted,
  onEdit,
  onDelete,
}: Props) {
  const [failed, setFailed] = useState(false)

  const image = getShopImage(shop)
  const active = isShopActive(shop)

  const instagram = handleOf(shop.instagram)
  const tiktok = handleOf(shop.tiktok)
  const whatsapp = whatsappLink(shop.whatsapp)

  return (
    <div
      id={`shop-${shop.id}`}
      className={`sh-card ${highlighted ? 'highlight' : ''}`}
    >
      <div className="sh-img">
        {image && !failed ? (
          <img src={image} alt={shop.name} onError={() => setFailed(true)} />
        ) : (
          <Store size={40} aria-hidden="true" />
        )}
      </div>

      <div className="sh-body">
        <div className="sh-title-row">
          <h3 className="sh-name">{shop.name}</h3>
          <span className={`sh-badge ${active ? 'on' : 'off'}`}>
            {active ? 'Aktif' : 'Nonaktif'}
          </span>
        </div>

        <p className="sh-desc">{shop.description || 'Belum ada deskripsi.'}</p>

        <p className="sh-loc">
          <MapPin size={16} aria-hidden="true" />
          <span>{shop.address || 'Alamat belum diisi.'}</span>
        </p>

        {(instagram || tiktok || whatsapp) && (
          <div className="sh-links">
            {instagram && (
              <a
                className="sh-chip"
                href={`https://instagram.com/${instagram}`}
                target="_blank"
                rel="noreferrer"
              >
                Instagram
              </a>
            )}
            {tiktok && (
              <a
                className="sh-chip"
                href={`https://www.tiktok.com/@${tiktok}`}
                target="_blank"
                rel="noreferrer"
              >
                TikTok
              </a>
            )}
            {whatsapp && (
              <a className="sh-chip" href={whatsapp} target="_blank" rel="noreferrer">
                WhatsApp
              </a>
            )}
          </div>
        )}

        <div className="sh-actions">
          <button type="button" className="sh-btn edit" onClick={() => onEdit(shop)}>
            <Pencil size={16} aria-hidden="true" />
            Edit
          </button>
          <button
            type="button"
            className="sh-btn remove"
            disabled={deleting}
            onClick={() => onDelete(shop)}
          >
            <Trash2 size={16} aria-hidden="true" />
            {deleting ? 'Menghapus...' : 'Hapus'}
          </button>
        </div>
      </div>
    </div>
  )
}
