'use client'

import axios from 'axios'

import { validateImageFile } from './common'
import { createCloudinaryUploadSignature } from '../services/api'

export type ImageUploadProgress = (percentage: number) => void
export type ImageUploadPhase =
  | 'idle'
  | 'authorizing'
  | 'uploading'
  | 'complete'
  | 'error'

export type CloudinaryUploadSignature = {
  cloudName: string
  apiKey: string
  timestamp: number
  signature: string
  folder: string
  publicId: string
}

export type CloudinaryUploadDependencies = {
  requestSignature: () => Promise<unknown>
  uploadFile: (
    url: string,
    formData: FormData,
    onProgress: ImageUploadProgress,
  ) => Promise<unknown>
}

const UPLOAD_PRESET = 'keramik-dinoyo-uploads'
const ALLOWED_FORMATS = 'jpg,jpeg,png,webp'

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function parseSignature(value: unknown): CloudinaryUploadSignature {
  if (!isRecord(value) || value.success !== true || !isRecord(value.data)) {
    throw new Error('Backend tidak mengembalikan signature Cloudinary yang valid.')
  }

  const { cloudName, apiKey, timestamp, signature, folder, publicId } =
    value.data
  const numericTimestamp =
    typeof timestamp === 'number'
      ? timestamp
      : typeof timestamp === 'string' && /^\d+$/.test(timestamp)
        ? Number(timestamp)
        : Number.NaN

  if (
    typeof cloudName !== 'string' ||
    !/^[a-zA-Z0-9_-]+$/.test(cloudName) ||
    typeof apiKey !== 'string' ||
    !apiKey ||
    !Number.isSafeInteger(numericTimestamp) ||
    typeof signature !== 'string' ||
    !signature ||
    typeof folder !== 'string' ||
    !folder ||
    typeof publicId !== 'string' ||
    !publicId
  ) {
    throw new Error('Backend tidak mengembalikan signature Cloudinary yang valid.')
  }

  return {
    cloudName,
    apiKey,
    timestamp: numericTimestamp,
    signature,
    folder,
    publicId,
  }
}

function getCloudinaryErrorMessage(error: unknown): string {
  if (
    isRecord(error) &&
    isRecord(error.response) &&
    isRecord(error.response.data) &&
    isRecord(error.response.data.error) &&
    typeof error.response.data.error.message === 'string'
  ) {
    return error.response.data.error.message
  }

  return error instanceof Error ? error.message : 'Upload gambar ke Cloudinary gagal.'
}

async function postToCloudinary(
  url: string,
  formData: FormData,
  onProgress: ImageUploadProgress,
): Promise<unknown> {
  try {
    const response = await axios.post<unknown>(url, formData, {
      onUploadProgress(event) {
        if (event.total && Number.isFinite(event.loaded)) {
          onProgress(
            Math.max(0, Math.min(100, (event.loaded / event.total) * 100)),
          )
        }
      },
    })
    return response.data
  } catch (error) {
    throw new Error(getCloudinaryErrorMessage(error))
  }
}

const defaultDependencies: CloudinaryUploadDependencies = {
  requestSignature: async () =>
    (await createCloudinaryUploadSignature()).data,
  uploadFile: postToCloudinary,
}

export function createCloudinaryUploadAdapter(
  dependencies: CloudinaryUploadDependencies = defaultDependencies,
) {
  return {
    async requestPermission(): Promise<CloudinaryUploadSignature> {
      return parseSignature(await dependencies.requestSignature())
    },

    async uploadToStorage(
      file: File,
      signature: CloudinaryUploadSignature,
      onProgress: ImageUploadProgress,
    ): Promise<string> {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('upload_preset', UPLOAD_PRESET)
      formData.append('allowed_formats', ALLOWED_FORMATS)
      formData.append('folder', signature.folder)
      formData.append('public_id', signature.publicId)
      formData.append('timestamp', String(signature.timestamp))
      formData.append('api_key', signature.apiKey)
      formData.append('signature', signature.signature)

      const uploadUrl = `https://api.cloudinary.com/v1_1/${encodeURIComponent(signature.cloudName)}/image/upload`
      const response = await dependencies.uploadFile(
        uploadUrl,
        formData,
        onProgress,
      )

      if (!isRecord(response) || typeof response.secure_url !== 'string') {
        throw new Error('Cloudinary tidak mengembalikan secure_url yang valid.')
      }

      let secureUrl: URL
      try {
        secureUrl = new URL(response.secure_url)
      } catch {
        throw new Error('Cloudinary mengembalikan secure_url yang tidak valid.')
      }

      if (secureUrl.protocol !== 'https:') {
        throw new Error('Cloudinary harus mengembalikan secure_url HTTPS.')
      }

      return secureUrl.toString()
    },
  }
}

export async function uploadImageWithAuthorization(
  file: File,
  adapter: ReturnType<typeof createCloudinaryUploadAdapter>,
  onProgress: ImageUploadProgress,
  onPhase: (phase: ImageUploadPhase) => void = () => {},
): Promise<string> {
  try {
    const validationError = validateImageFile(file)
    if (validationError) throw new Error(validationError)

    onPhase('authorizing')
    const signature = await adapter.requestPermission()

    onPhase('uploading')
    const secureUrl = await adapter.uploadToStorage(
      file,
      signature,
      (percentage) => {
        if (Number.isFinite(percentage)) {
          onProgress(Math.max(0, Math.min(100, percentage)))
        }
      },
    )

    onProgress(100)
    onPhase('complete')
    return secureUrl
  } catch (error) {
    onPhase('error')
    throw error
  }
}

const cloudinaryUploadAdapter = createCloudinaryUploadAdapter()

export function uploadImageToCloudinary(
  file: File,
  onProgress: ImageUploadProgress,
  onPhase?: (phase: ImageUploadPhase) => void,
): Promise<string> {
  return uploadImageWithAuthorization(
    file,
    cloudinaryUploadAdapter,
    onProgress,
    onPhase,
  )
}
