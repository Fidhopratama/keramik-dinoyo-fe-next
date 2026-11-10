'use client'

import { useCallback, useEffect, useState } from 'react'

import {
  createWorkshop,
  deleteWorkshop,
  getWorkshops,
  updateWorkshop,
} from '../services/api'
import { getMessage } from '../lib/common'
import { uploadImageToCloudinary } from '../lib/imageUpload'
import type { ImageUploadPhase } from '../lib/imageUpload'
import { buildWorkshopPayload, getWorkshopFormMessage } from '../lib/workshop'
import type { Workshop, WorkshopFormData } from '../types/workshop'

type Result = { ok: boolean; message: string }

export default function useWorkshops() {
  const [workshops, setWorkshops] = useState<Workshop[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState<number | string | null>(null)
  const [imageUploadStatus, setImageUploadStatus] =
    useState<ImageUploadPhase>('idle')
  const [imageUploadProgress, setImageUploadProgress] = useState(0)
  const [imageUploadMessage, setImageUploadMessage] = useState('')

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
    let imageUploadInProgress = false
    try {
      setSaving(true)

      setImageUploadStatus('idle')
      setImageUploadProgress(0)
      setImageUploadMessage('')
      let imageUrl: string | undefined
      if (imageFile) {
        imageUploadInProgress = true
        imageUrl = await uploadImageToCloudinary(
          imageFile,
          setImageUploadProgress,
          setImageUploadStatus,
        )
        imageUploadInProgress = false
      }
      const data = buildWorkshopPayload(form, imageUrl)

      if (editing) {
        await updateWorkshop(editing.id, data)
        return { ok: true, message: 'Kegiatan berhasil diperbarui.' }
      }

      await createWorkshop(data)
      return { ok: true, message: 'Kegiatan berhasil ditambahkan.' }
    } catch (err) {
      if (imageUploadInProgress) {
        setImageUploadStatus('error')
        const uploadError =
          err instanceof Error ? err.message : 'Upload gambar gagal.'
        setImageUploadMessage(uploadError)
        return { ok: false, message: uploadError }
      } else {
        console.error('SAVE WORKSHOP ERROR:', err)
      }
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
    imageUploadStatus,
    imageUploadProgress,
    imageUploadMessage,
    fetchWorkshops,
    save,
    remove,
  }
}
