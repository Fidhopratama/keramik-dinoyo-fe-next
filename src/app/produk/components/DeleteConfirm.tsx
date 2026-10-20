type Props = {
  name: string
  deleting: boolean
  onConfirm: () => void
  onCancel: () => void
}

export default function DeleteConfirm({ name, deleting, onConfirm, onCancel }: Props) {
  return (
    <div className="pr-overlay">
      <div className="pr-modal small" role="alertdialog" aria-modal="true">
        <div className="pr-modal-head">
          <div>
            <h3>Hapus produk?</h3>
          </div>
        </div>

        <p className="pr-confirm-text">
          Produk <strong>{name}</strong> akan dihapus dan tidak bisa dikembalikan.
        </p>

        <div className="pr-modal-actions">
          <button type="button" className="pr-btn ghost" onClick={onCancel} disabled={deleting}>
            Batal
          </button>
          <button type="button" className="pr-btn danger" onClick={onConfirm} disabled={deleting}>
            {deleting ? 'Menghapus...' : 'Hapus'}
          </button>
        </div>
      </div>
    </div>
  )
}