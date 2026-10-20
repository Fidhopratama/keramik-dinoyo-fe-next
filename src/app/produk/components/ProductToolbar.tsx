import { Search } from 'lucide-react'

type Props = {
  value: string
  onChange: (value: string) => void
  onSearch: () => void
}

export default function ProductToolbar({ value, onChange, onSearch }: Props) {
  return (
    <div className="pr-toolbar">
      <label className="pr-search">
        <Search size={16} aria-hidden="true" />
        <input
          type="text"
          value={value}
          placeholder="Cari nama produk..."
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') onSearch()
          }}
        />
      </label>

      <button type="button" className="pr-btn ghost" onClick={onSearch}>
        Cari
      </button>
    </div>
  )
}