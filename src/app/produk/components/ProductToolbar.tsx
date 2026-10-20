'use client'

type ProductToolbarProps = {
  search: string
  onSearchChange: (value: string) => void
  onSearch: () => void
}

export default function ProductToolbar({
  search,
  onSearchChange,
  onSearch,
}: ProductToolbarProps) {
  return (
    <div className="product-toolbar">
      <input
        type="text"
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter') onSearch()
        }}
        placeholder="Cari nama produk..."
        aria-label="Cari nama produk"
      />

      <button
        type="button"
        className="secondary-button"
        onClick={onSearch}
      >
        Cari
      </button>
    </div>
  )
}