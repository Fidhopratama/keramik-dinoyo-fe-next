import type { ChangeEvent } from 'react'

type Props = {
  preview: string
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
}

export default function ProductImageField({ preview, onChange }: Props) {
  return (
    <div className="pr-field">
      <label htmlFor="image">Foto Produk</label>

      <input
        id="image"
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={onChange}
      />

      <small className="pr-help">JPG, PNG, atau WEBP. Maksimal 2 MB.</small>

      {preview && (
        <div className="pr-preview">
          <img src={preview} alt="Preview produk" />
        </div>
      )}
    </div>
  )
}
