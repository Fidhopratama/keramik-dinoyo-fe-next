import { TriangleAlert } from 'lucide-react'

export default function VerificationNotice() {
  return (
    <div className="v-note">
      <TriangleAlert size={18} aria-hidden="true" />
      <span>
        Hasil analisis AI hanya berupa saran untuk membantu admin. Keputusan
        akhir tetap ditentukan oleh admin setelah memeriksa produknya.
      </span>
    </div>
  )
}