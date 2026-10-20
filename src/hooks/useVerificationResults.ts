'use client'

import { useEffect, useMemo, useState } from 'react'

import { getAiAnalysisResults } from '../services/api'
import { getMessage, toList } from '../lib/common'
import { toRow } from '../lib/verification'

export default function useVerificationResults() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      try {
        setLoading(true)
        setError('')

        const response = await getAiAnalysisResults()
        if (cancelled) return

        setItems(toList(response))
      } catch (err: any) {
        if (cancelled) return
        console.error('AI results error:', err)
        setError(getMessage(err, 'Hasil verifikasi AI gagal dimuat.'))
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()

    return () => {
      cancelled = true
    }
  }, [])

  const rows = useMemo(() => items.map(toRow), [items])

  return { rows, loading, error }
}
