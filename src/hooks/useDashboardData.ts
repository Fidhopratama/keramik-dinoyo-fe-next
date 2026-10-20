'use client'

import { useEffect, useState } from 'react'

import api, { getAiAnalysisResults, getShops } from '../services/api'
import { getMessage, toList } from '../lib/common'

export default function useDashboardData() {
  const [dashboard, setDashboard] = useState<any>(null)
  const [shops, setShops] = useState<any[]>([])
  const [aiList, setAiList] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      try {
        setLoading(true)
        setError('')

        const [dash, shopRes, aiRes] = await Promise.all([
          api.get('/dashboard'),
          getShops(),
          getAiAnalysisResults().catch(() => null),
        ])
        if (cancelled) return

        const data = dash.data?.data || {}
        const recent = data.recent_shops
        const all = shopRes.data?.data || []

        setDashboard(data)
        setAiList(toList(aiRes))

        if (Array.isArray(recent) && recent.length > 0) {
          setShops(recent.slice(0, 3))
        } else if (Array.isArray(all)) {
          setShops(all.slice(0, 3))
        }
      } catch (err: any) {
        if (cancelled) return
        console.error('Dashboard error:', err)
        setError(getMessage(err, 'Data dashboard gagal dimuat.'))
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()

    return () => {
      cancelled = true
    }
  }, [])

  return { dashboard, shops, aiList, loading, error }
}
