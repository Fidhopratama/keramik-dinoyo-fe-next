'use client'

import { useEffect, useState } from 'react'
import type { ChangeEvent } from 'react'
import { ImagePlus } from 'lucide-react'

import {
  validateDetailedAddress,
  validateIndonesianMobileNumber,
} from '../../../lib/common'
import type { ShopFormData } from '../../../types/shop'

type AddressFeature = {
  properties?: {
    name?: string
    housenumber?: string
    street?: string
    district?: string
    locality?: string
    city?: string
    county?: string
    state?: string
    postcode?: string
    country?: string
    countrycode?: string
  }
  geometry?: {
    coordinates?: number[]
  }
}

type Props = {
  form: ShopFormData
  saving: boolean
  selectedAddress: string
  onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  onAddressSelect: (address: string) => void
  onImageChange: (event: ChangeEvent<HTMLInputElement>) => void
}

function addressLabel(feature: AddressFeature): string {
  const place = feature.properties || {}
  const street = [place.housenumber, place.street].filter(Boolean).join(' ')
  const parts = [
    place.name,
    street,
    place.district,
    place.locality,
    place.city,
    place.county,
    place.state,
    place.postcode,
    place.country,
  ].filter((part): part is string => Boolean(part?.trim()))

  return [...new Set(parts)].join(', ')
}

function isNearDinoyo(feature: AddressFeature): boolean {
  const [longitude, latitude] = feature.geometry?.coordinates || []

  if (
    feature.properties?.countrycode?.toUpperCase() !== 'ID' ||
    typeof longitude !== 'number' ||
    typeof latitude !== 'number'
  ) {
    return false
  }

  const toRadians = (degrees: number) => (degrees * Math.PI) / 180
  const latitudeDifference = toRadians(latitude + 7.9425)
  const longitudeDifference = toRadians(longitude - 112.6136)
  const distance =
    2 *
    6371 *
    Math.asin(
      Math.sqrt(
        Math.sin(latitudeDifference / 2) ** 2 +
          Math.cos(toRadians(-7.9425)) *
            Math.cos(toRadians(latitude)) *
            Math.sin(longitudeDifference / 2) ** 2,
      ),
    )

  return distance <= 20
}

export default function ShopForm({
  form,
  saving,
  selectedAddress,
  onChange,
  onAddressSelect,
  onImageChange,
}: Props) {
  const [suggestions, setSuggestions] = useState<AddressFeature[]>([])
  const [searchingAddress, setSearchingAddress] = useState(false)
  const [addressSearchError, setAddressSearchError] = useState('')
  const addressError = form.address.trim()
    ? validateDetailedAddress(form.address, 'Alamat toko')
    : ''
  const whatsappError = form.whatsapp.trim()
    ? validateIndonesianMobileNumber(form.whatsapp)
    : ''

  useEffect(() => {
    const query = form.address.trim()

    if (query.length < 3 || query === selectedAddress) {
      setSuggestions([])
      setSearchingAddress(false)
      setAddressSearchError('')
      return
    }

    setSuggestions([])
    setAddressSearchError('')
    const controller = new AbortController()
    const timeout = window.setTimeout(async () => {
      setSearchingAddress(true)
      setAddressSearchError('')

      try {
        const params = new URLSearchParams({
          q: query,
          lat: '-7.9425',
          lon: '112.6136',
          limit: '5',
          lang: 'default',
        })
        const response = await fetch(
          `https://photon.komoot.io/api/?${params.toString()}`,
          { signal: controller.signal },
        )

        if (!response.ok) {
          throw new Error(`Pencarian alamat gagal (${response.status}).`)
        }

        const result = (await response.json()) as {
          features?: AddressFeature[]
        }
        setSuggestions(
          (result.features || []).filter(
            (feature) => addressLabel(feature) && isNearDinoyo(feature),
          ),
        )
      } catch (error) {
        if (controller.signal.aborted) return

        console.error('Address search error:', error)
        setSuggestions([])
        setAddressSearchError(
          'Saran alamat gagal dimuat. Periksa koneksi lalu coba lagi.',
        )
      } finally {
        if (!controller.signal.aborted) setSearchingAddress(false)
      }
    }, 350)

    return () => {
      window.clearTimeout(timeout)
      controller.abort()
    }
  }, [form.address, selectedAddress])

  return (
    <>
      <div className="sh-field">
        <label htmlFor="name">Nama Toko</label>
        <input
          id="name"
          name="name"
          type="text"
          placeholder="Nama toko"
          value={form.name}
          onChange={onChange}
          disabled={saving}
          required
        />
      </div>

      <div className="sh-field">
        <label htmlFor="description">Deskripsi</label>
        <textarea
          id="description"
          name="description"
          placeholder="Deskripsi toko"
          value={form.description}
          onChange={onChange}
          disabled={saving}
        />
      </div>

      <div className="sh-field">
        <label htmlFor="address">Alamat</label>
        <textarea
          id="address"
          name="address"
          placeholder="Alamat toko"
          value={form.address}
          onChange={onChange}
          disabled={saving}
          required
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={suggestions.length > 0}
          aria-controls="address-suggestions"
          aria-invalid={Boolean(addressError)}
          aria-describedby={addressError ? 'address-help address-error' : 'address-help'}
        />
        {addressError && (
          <span id="address-error" className="sh-help sh-address-error" role="alert">
            {addressError}
          </span>
        )}
        {searchingAddress && (
          <span className="sh-help" role="status">Mencari saran alamat...</span>
        )}
        {suggestions.length > 0 && (
          <div
            id="address-suggestions"
            className="sh-address-suggestions"
            role="listbox"
            aria-label="Saran alamat"
          >
            {suggestions.map((feature, index) => {
              const label = addressLabel(feature)

              return (
                <button
                  key={`${label}-${index}`}
                  type="button"
                  role="option"
                  aria-selected={false}
                  className="sh-address-suggestion"
                  onClick={() => {
                    onAddressSelect(label)
                    setSuggestions([])
                  }}
                  disabled={saving}
                >
                  {label}
                </button>
              )
            })}
          </div>
        )}
        {addressSearchError && (
          <span className="sh-help sh-address-error" role="alert">
            {addressSearchError}
          </span>
        )}
        {form.address.trim() && form.address.trim() !== selectedAddress && !searchingAddress && !addressSearchError && suggestions.length === 0 && form.address.trim().length >= 3 && (
          <span className="sh-help sh-address-error" role="status">
            Pilih alamat dari saran yang muncul sebelum menyimpan.
          </span>
        )}
        <span id="address-help" className="sh-help">
          Saran alamat dari data peta:{' '}
          <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">
            OpenStreetMap
          </a>
          .
        </span>
      </div>

      <div className="sh-two">
        <div className="sh-field">
          <label htmlFor="instagram">Instagram</label>
          <input
            id="instagram"
            name="instagram"
            type="text"
            placeholder="@username"
            value={form.instagram}
            onChange={onChange}
            disabled={saving}
          />
        </div>

        <div className="sh-field">
          <label htmlFor="tiktok">TikTok</label>
          <input
            id="tiktok"
            name="tiktok"
            type="text"
            placeholder="@username"
            value={form.tiktok}
            onChange={onChange}
            disabled={saving}
          />
        </div>
      </div>

      <div className="sh-field">
        <label htmlFor="whatsapp">WhatsApp</label>
        <input
          id="whatsapp"
          name="whatsapp"
          type="tel"
          placeholder="Nomor WhatsApp"
          value={form.whatsapp}
          onChange={(event) => {
            let digitCount = 0
            const value = event.currentTarget.value
            const limitedValue = [...value]
              .filter((character) => {
                if (!/\d/.test(character)) return true
                digitCount += 1
                return digitCount <= 14
              })
              .join('')

            if (limitedValue !== value) event.currentTarget.value = limitedValue
            onChange(event)
          }}
          disabled={saving}
          aria-invalid={Boolean(whatsappError)}
          aria-describedby={whatsappError ? 'whatsapp-error' : undefined}
        />
        {whatsappError && (
          <span id="whatsapp-error" className="sh-help sh-address-error" role="alert">
            {whatsappError}
          </span>
        )}
      </div>

      <div className="sh-field">
        <label>Foto Toko</label>
        <label className="sh-upload">
          {form.imagePreview ? (
            <img src={form.imagePreview} alt="Pratinjau toko" />
          ) : (
            <>
              <ImagePlus size={28} aria-hidden="true" />
              <span>Klik untuk memilih foto</span>
            </>
          )}
          <input
            type="file"
            accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
            onChange={onImageChange}
            disabled={saving}
          />
        </label>
        <span className="sh-help">JPG/JPEG, PNG, atau WEBP. Maksimal 5 MB.</span>
      </div>

      <label className="sh-check">
        <input
          type="checkbox"
          name="is_active"
          checked={form.is_active}
          onChange={onChange}
          disabled={saving}
        />
        Toko aktif
      </label>
    </>
  )
}
