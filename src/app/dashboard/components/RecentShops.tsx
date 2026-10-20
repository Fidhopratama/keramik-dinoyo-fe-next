'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, ChevronRight, Store } from 'lucide-react'

import { getShopImageUrl, localShopImages } from '../../../lib/dashboard'

// Foto toko dengan fallback bertahap: foto dari BE -> foto lokal -> ikon.
function ShopThumb({ image, name }: { image?: string | null; name?: string }) {
  const [stage, setStage] = useState(0)

  const sources = [
    getShopImageUrl(image),
    name ? localShopImages[name] : '',
  ].filter(Boolean) as string[]

  const src = sources[stage]

  return (
    <div className="d-thumb">
      {src ? (
        <img
          src={src}
          alt={name || 'Toko keramik'}
          onError={() => setStage((v) => v + 1)}
        />
      ) : (
        <Store size={26} aria-hidden="true" />
      )}
    </div>
  )
}

export default function RecentShops({ shops }: { shops: any[] }) {
  return (
    <section className="d-card">
      <div className="d-card-head">
        <div>
          <h3>Toko Terbaru</h3>
          <p>Daftar toko yang terdaftar di Kampung Keramik Dinoyo</p>
        </div>

        <Link href="/toko" className="d-link">
          Lihat semua <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </div>

      <div className="d-shops">
        {shops.length === 0 ? (
          <div className="d-empty">
            <Store size={28} aria-hidden="true" />
            <p>Belum ada data toko.</p>
          </div>
        ) : (
          shops.map((shop) => (
            <Link href={`/toko?shop=${shop.id}`} className="d-shop" key={shop.id}>
              <ShopThumb image={shop.image} name={shop.name} />

              <div className="d-shop-info">
                <h4>{shop.name || 'Nama toko'}</h4>
                <p>{shop.address || shop.description || 'Kampung Keramik Dinoyo'}</p>
                <small>{shop.is_active ? 'Toko aktif' : 'Toko tidak aktif'}</small>
              </div>

              <span className={`d-pill ${shop.is_active ? 'on' : 'off'}`}>
                {shop.is_active ? 'Aktif' : 'Tidak aktif'}
              </span>

              <ChevronRight size={20} className="d-shop-go" aria-hidden="true" />
            </Link>
          ))
        )}
      </div>
    </section>
  )
}