'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Check } from 'lucide-react'

import AdminLayout from '../../components/AdminLayout'
import useChangePassword from '../../hooks/useChangePassword'
import ChangePasswordForm from './components/ChangePasswordForm'
import PasswordStyles from './components/PasswordStyles'

export default function GantiPasswordPage() {
  const router = useRouter()

  const { saving, message, submit } = useChangePassword(() => {
    window.setTimeout(() => router.push('/profil'), 1500)
  })

  return (
    <AdminLayout>
      <PasswordStyles />

      <div className="p">
        <Link href="/profil" className="p-back">
          <ArrowLeft size={16} aria-hidden="true" />
          Kembali ke Profil
        </Link>

        <div className="p-head">
          <h2>Ganti Password</h2>
          <p>Gunakan password yang kuat dan jangan dibagikan ke orang lain.</p>
        </div>

        {message && (
          <div className={`p-toast ${message.type}`} role="status">
            {message.type === 'success' && <Check size={15} />}
            {message.text}
          </div>
        )}

        <ChangePasswordForm saving={saving} onSubmit={submit} />
      </div>
    </AdminLayout>
  )
}
