'use client'

type WorkshopToolbarProps = {
  search: string
  setSearch: (value: string) => void
  statusFilter: string
  setStatusFilter: (value: string) => void
}

export default function WorkshopToolbar({
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
}: WorkshopToolbarProps) {
  return (
    <div className="workshop-toolbar">
      <div className="workshop-search">
        <span className="workshop-search-icon">⌕</span>

        <input
          type="text"
          placeholder="Cari kegiatan, instruktur, atau lokasi..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>

      <select
        className="workshop-filter"
        value={statusFilter}
        onChange={(event) => setStatusFilter(event.target.value)}
      >
        <option value="all">Semua Status</option>
        <option value="upcoming">Akan Datang</option>
        <option value="ongoing">Berlangsung</option>
        <option value="completed">Selesai</option>
        <option value="cancelled">Dibatalkan</option>
      </select>
    </div>
  )
}