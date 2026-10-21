'use client'

import { useCallback, useEffect, useState } from 'react'

import { createShop, deleteShop, getShops, updateShop } from '../services/api'
import { getMessage } from '../lib/common'
import { buildShopFormData, getResponseData } from '../lib/shop'
import type { Shop, ShopFormData } from '../types/shop'

export default function useShops() {
  const [shops, setShops] = useState<Shop[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState<number | string | null>(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const fetchShops = useCallback(async () => {
    try {
      setLoading(true)
      setError('')

      const response = await getShops()
      setShops(getResponseData(response))
    } catch (err: unknown) {
      console.error('Fetch shops error:', err)
      setError(getMessage(err, 'Gagal mengambil data toko.'))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void fetchShops()
  }, [fetchShops])

  // Mengembalikan true kalau berhasil disimpan.
  const save = async (form: ShopFormData, editing: Shop | null) => {
    try {
      setSaving(true)
      setError('')
      setSuccess('')

      const data = buildShopFormData(form)

      if (editing) {
        await updateShop(editing.id, data)
        setSuccess('Toko berhasil diperbarui.')
      } else {
        await createShop(data)
        setSuccess('Toko berhasil ditambahkan.')
      }

      await fetchShops()
      return true
    } catch (err: unknown) {
      console.error('Save shop error:', err)
      setError(getMessage(err, 'Gagal menyimpan data toko.'))
      return false
    } finally {
      setSaving(false)
    }
  }

  const remove = async (shop: Shop) => {
    try {
      setDeletingId(shop.id)
      setError('')
      setSuccess('')

      await deleteShop(shop.id)

      setShops((current) => current.filter((item) => item.id !== shop.id))
      setSuccess('Toko berhasil dihapus.')
    } catch (err: unknown) {
      console.error('Delete shop error:', err)
      setError(getMessage(err, 'Gagal menghapus toko.'))
    } finally {
      setDeletingId(null)
    }
  }

  return {
    shops,
    loading,
    saving,
    deletingId,
    error,
    success,
    setError,
    setSuccess,
    fetchShops,
    save,
    remove,
  }
}
