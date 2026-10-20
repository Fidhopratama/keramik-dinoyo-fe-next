'use client'

import { Check } from 'lucide-react'

import AdminLayout from '../../components/AdminLayout'
import useProfile from '../../hooks/useProfile'
import ProfileForm from './components/ProfileForm'
import ProfileStyles from './components/ProfileStyles'
import ProfileSummary from './components/ProfileSummary'
import SecurityCard from './components/SecurityCard'

export default function ProfilPage() {
  const { profile, loading, saving, notice, save } = useProfile()

  return (
    <AdminLayout>
      <ProfileStyles />

      <div className="pf">
        <div className="pf-head">
          <h2>Profil Admin</h2>
          <p>Kelola informasi akun administrator.</p>
        </div>

        {notice && (
          <div className={`pf-toast ${notice.type}`} role="status">
            {notice.type === 'success' && <Check size={15} />}
            {notice.text}
          </div>
        )}

        <ProfileSummary profile={profile} />
        <ProfileForm
          profile={profile}
          loading={loading}
          saving={saving}
          onSave={save}
        />
        <SecurityCard />
      </div>
    </AdminLayout>
  )
}
