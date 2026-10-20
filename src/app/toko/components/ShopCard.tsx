'use client'

import { getShopImage, isShopActive, type Shop } from './shopData'

interface ShopCardProps {
  shop: Shop
  deleting: boolean
  onEdit: (shop: Shop) => void
  onDelete: (shop: Shop) => void
}

export default function ShopCard({
  shop,
  deleting,
  onEdit,
  onDelete,
}: ShopCardProps) {
  const image = getShopImage(shop)

  return (
    <div className="shop-card">
      <div className="shop-image">
        {image ? (
          <img
            src={image}
            alt={shop.name}
            onError={(event) => {
              const fallback = `/images/${shop.name
                .toLowerCase()
                .replaceAll(' ', '-')}.jpg`

              if (
                event.currentTarget.dataset.fallbackTried !== 'true' &&
                image !== fallback
              ) {
                event.currentTarget.dataset.fallbackTried = 'true'

                const knownFallback = getShopImage({
                  ...shop,
                  image: null,
                })

                if (knownFallback && knownFallback !== image) {
                  event.currentTarget.src = knownFallback
                  return
                }
              }

              event.currentTarget.style.display = 'none'
            }}
          />
        ) : (
          <div className="image-placeholder">
            Tidak ada gambar
          </div>
        )}
      </div>

      <div className="shop-content">
        <div className="shop-title-row">
          <h3>{shop.name}</h3>

          <span
            className={
              isShopActive(shop)
                ? 'status active'
                : 'status inactive'
            }
          >
            {isShopActive(shop) ? 'Aktif' : 'Nonaktif'}
          </span>
        </div>

        {shop.description && (
          <p className="description">{shop.description}</p>
        )}

        {shop.address && (
          <p className="address">📍 {shop.address}</p>
        )}

        <div className="socials">
          {shop.instagram && <span>Instagram</span>}
          {shop.tiktok && <span>TikTok</span>}
          {shop.whatsapp && <span>WhatsApp</span>}
        </div>

        <div className="actions">
          <button
            type="button"
            className="edit-button"
            onClick={() => onEdit(shop)}
          >
            Edit
          </button>

          <button
            type="button"
            className="delete-button"
            disabled={deleting}
            onClick={() => onDelete(shop)}
          >
            {deleting ? 'Menghapus...' : 'Hapus'}
          </button>
        </div>
      </div>
    </div>
  )
}