'use client'

import { useEffect, useState } from 'react'

import { DEFAULT_PREFS, loadPrefs, savePrefs } from '../lib/preferences'
import type { Prefs } from '../types/preferences'

export default function usePreferences() {
  const [prefs, setPrefs] = useState<Prefs>(DEFAULT_PREFS)

  useEffect(() => {
    setPrefs(loadPrefs())
  }, [])

  const update = (patch: Partial<Prefs>) =>
    setPrefs((current) => ({ ...current, ...patch }))

  const save = () => savePrefs(prefs)

  return { prefs, update, save }
}
