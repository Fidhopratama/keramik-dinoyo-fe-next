'use client'

import AdminLayout from '../components/AdminLayout'
import useDashboardData from '../hooks/useDashboardData'
import { pickLatestAi } from '../lib/dashboard'
import ActivityChart from './dashboard/components/ActivityChart'
import AiSummary from './dashboard/components/AiSummary'
import DashboardHeader from './dashboard/components/DashboardHeader'
import DashboardStyles from './dashboard/components/DashboardStyles'
import RecentShops from './dashboard/components/RecentShops'
import StatCards from './dashboard/components/StatCards'

function Dashboard() {
  const { dashboard, shops, aiList, loading, error } = useDashboardData()

  if (loading) {
    return (
      <AdminLayout>
        <div style={{ padding: 24, color: '#8b827b' }}>Memuat data dashboard...</div>
      </AdminLayout>
    )
  }

  if (error) {
    return (
      <AdminLayout>
        <div style={{ padding: 24 }}>
          <p role="alert" style={{ color: '#b91c1c', marginBottom: 12 }}>{error}</p>
          <button type="button" onClick={() => window.location.reload()}>
            Coba lagi
          </button>
        </div>
      </AdminLayout>
    )
  }

  const stats = dashboard?.statistics || {}
  const aiCount = stats.total_ai_verifications ?? stats.ai_verifications ?? aiList.length
  const latestAi = pickLatestAi(aiList, dashboard?.recent_ai_analyses)

  return (
    <AdminLayout>
      <DashboardStyles />

      <div className="d">
        <DashboardHeader />

        <StatCards statistics={stats} shopCount={shops.length} aiCount={aiCount} />

        <div className="d-grid">
          <ActivityChart activity={dashboard?.monthly_activity} />
          <AiSummary latest={latestAi} />
        </div>

        <RecentShops shops={shops} />
      </div>
    </AdminLayout>
  )
}

export default Dashboard
