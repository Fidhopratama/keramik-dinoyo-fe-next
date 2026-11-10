import { useState } from 'react'
import type { ProfileData } from '../../../types/profile'

export default function ProfileSummary({ profile }: { profile: ProfileData }) {
  const [imageFailed, setImageFailed] = useState(false)
  const initial = profile.name.trim().charAt(0).toUpperCase() || 'A'

  return (
    <section className="pf-summary">
      <div className="pf-avatar" aria-hidden="true">
        {profile.imageUrl && !imageFailed ? (
          <img
            src={profile.imageUrl}
            alt=""
            onError={() => setImageFailed(true)}
          />
        ) : (
          initial
        )}
      </div>

      <div>
        <h3>{profile.name || 'Admin'}</h3>
        <p>{profile.email || 'Email belum diisi'}</p>
        <span className="pf-tag">Administrator</span>
      </div>
    </section>
  )
}