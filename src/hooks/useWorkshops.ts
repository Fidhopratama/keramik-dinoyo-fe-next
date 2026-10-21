'use client'

import { useCallback, useEffect, useState } from 'react'

import {
  createWorkshop,
  deleteWorkshop,
  getWorkshops,
  updateWorkshop,
} from '../services/api'
import { getMessage } from '../lib/common'
import { buildWorkshopFormData, getWorkshopFormMessage } from '../lib/workshop'
import type { Workshop, WorkshopFormData } from '../types/workshop'

type Result = { ok: boolean; message: string }

export default function useWorkshops() {
  const [workshops, setWorkshops] = useState<Workshop[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState<number | string | null>(null)

  const fetchWorkshops = useCallback(async () => {
    try {
      setLoading(true)
      setError('')

      const response = await getWorkshops()
      const data = response.data?.data || []

      setWorkshops(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('GET WORKSHOP ERROR:', err)
      setError(getMessage(err, 'Data kegiatan gagal dimuat.'))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void fetchWorkshops()
  }, [fetchWorkshops])

  const save = async (
    form: WorkshopFormData,
    imageFile: File | null,
    editing: Workshop | null,
  ): Promise<Result> => {
    try {
      setSaving(true)

      const data = buildWorkshopFormData(form, imageFile)

      if (editing) {
        await updateWorkshop(editing.id, data)
        return { ok: true, message: 'Kegiatan berhasil diperbarui.' }
      }

      await createWorkshop(data)
      return { ok: true, message: 'Kegiatan berhasil ditambahkan.' }
    } catch (err) {
      console.error('SAVE WORKSHOP ERROR:', err)
      return { ok: false, message: getWorkshopFormMessage(err) }
    } finally {
      setSaving(false)
    }
  }

  const remove = async (workshop: Workshop): Promise<Result> => {
    try {
      setDeletingId(workshop.id)
      await deleteWorkshop(workshop.id)

      setWorkshops((prev) => prev.filter((item) => item.id !== workshop.id))

      return { ok: true, message: 'Kegiatan berhasil dihapus.' }
    } catch (err) {
      console.error('DELETE WORKSHOP ERROR:', err)
      return { ok: false, message: getMessage(err, 'Gagal menghapus kegiatan.') }
    } finally {
      setDeletingId(null)
    }
  }

  return {
    workshops,
    loading,
    error,
    saving,
    deletingId,
    fetchWorkshops,
    save,
    remove,
  }
}
