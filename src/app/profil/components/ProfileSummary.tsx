import type { ProfileData } from '../../../types/profile'

export default function ProfileSummary({ profile }: { profile: ProfileData }) {
  const initial = profile.name.trim().charAt(0).toUpperCase() || 'A'

  return (
    <section className="pf-summary">
      <div className="pf-avatar" aria-hidden="true">
        {initial}
      </div>

      <div>
        <h3>{profile.name || 'Admin'}</h3>
        <p>{profile.email || 'Email belum diisi'}</p>
        <span className="pf-tag">Administrator</span>
      </div>
    </section>
  )
}