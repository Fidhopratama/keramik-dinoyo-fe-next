'use client'

import { useCallback, useEffect, useState } from 'react'

import {
  getAiAnalysisResults,
  getProducts,
  getShops,
  getWorkshops,
} from '../services/api'
import {
  collectNotifications,
  filterByPrefs,
  listOf,
  readReadIds,
  saveReadIds,
} from '../lib/notification'
import { DEFAULT_PREFS, loadPrefs } from '../lib/preferences'
import type { AppNotification } from '../types/notification'
import type { Prefs } from '../types/preferences'

export default function useNotifications() {
  const [items, setItems] = useState<AppNotification[]>([])
  const [readIds, setReadIds] = useState<string[]>([])
  const [prefs, setPrefs] = useState<Prefs>(DEFAULT_PREFS)

  const load = useCallback(async () => {
    const results = await Promise.allSettled([
      getShops(),
      getProducts(),
      getWorkshops(),
      getAiAnalysisResults(),
    ])

    const pick = (index: number) => {
      const result = results[index]
      return result.status === 'fulfilled' ? listOf(result.value) : []
    }

    setItems(collectNotifications(pick(0), pick(1), pick(2), pick(3)))
    setPrefs(loadPrefs())
    setReadIds(readReadIds())
  }, [])

  useEffect(() => {
    void load()

    const timer = window.setInterval(() => void load(), 60000)
    return () => window.clearInterval(timer)
  }, [load])

  const visible = filterByPrefs(items, prefs)
  const unread = visible.filter((item) => !readIds.includes(item.id))

  const markRead = (ids: string[]) => {
    const merged = Array.from(new Set([...readIds, ...ids]))
    setReadIds(merged)
    saveReadIds(merged)
  }

  // Dipanggil saat lonceng dibuka, supaya perubahan di Pengaturan langsung terbaca.
  const refreshPrefs = () => setPrefs(loadPrefs())

  return { visible, unread, readIds, prefsOn: prefs.notifications, markRead, refreshPrefs }
}
