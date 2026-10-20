'use client'

import { useCallback, useEffect, useState } from 'react'

import {
  createProduct,
  deleteProduct,
  getProducts,
  getShops,
  updateProduct,
} from '../services/api'
import { getMessage } from '../lib/common'
import { buildFormData, getFormMessage } from '../lib/product'
import type { Product, ProductForm, Shop } from '../types/product'

export default function useProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [shops, setShops] = useState<Shop[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState<number | string | null>(null)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      setError('')

      const [productsResponse, shopsResponse] = await Promise.all([
        getProducts({ search: search || undefined }),
        getShops(),
      ])

      setProducts(
        productsResponse.data?.data?.data || productsResponse.data?.data || [],
      )
      setShops(shopsResponse.data?.data || [])
    } catch (err) {
      console.error(err)
      setError(getMessage(err, 'Gagal mengambil data produk.'))
    } finally {
      setLoading(false)
    }
  }, [search])

  useEffect(() => {
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Mengembalikan pesan error, atau teks kosong kalau berhasil.
  const save = async (form: ProductForm, editing: Product | null) => {
    try {
      setSaving(true)

      const data = buildFormData(form, editing)

      if (editing) {
        await updateProduct(editing.id, data)
      } else {
        await createProduct(data)
      }

      await fetchData()
      return ''
    } catch (err) {
      console.error(err)
      return getFormMessage(err, 'Gagal menyimpan produk.')
    } finally {
      setSaving(false)
    }
  }

  const remove = async (product: Product) => {
    try {
      setDeletingId(product.id)
      setError('')

      await deleteProduct(product.id)
      await fetchData()
      return true
    } catch (err) {
      console.error(err)
      setError(getMessage(err, 'Produk tidak bisa dihapus.'))
      return false
    } finally {
      setDeletingId(null)
    }
  }

  return {
    products,
    shops,
    loading,
    saving,
    deletingId,
    error,
    search,
    setSearch,
    fetchData,
    save,
    remove,
  }
}
