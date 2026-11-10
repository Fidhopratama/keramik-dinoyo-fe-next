import assert from 'node:assert/strict'
import { test } from 'node:test'

import {
  createCloudinaryUploadAdapter,
  uploadImageWithAuthorization,
} from '../src/lib/imageUpload'
import type {
  CloudinaryUploadDependencies,
  CloudinaryUploadSignature,
  ImageUploadPhase,
} from '../src/lib/imageUpload'
import { buildProductPayload } from '../src/lib/product'
import { buildShopPayload } from '../src/lib/shop'
import { buildWorkshopPayload } from '../src/lib/workshop'

const signature: CloudinaryUploadSignature = {
  cloudName: 'cloud-example',
  apiKey: '123456789',
  timestamp: 1_799_999_999,
  signature: 'signed-value',
  folder: 'keramik/products',
  publicId: 'product-image',
}
const testFile = new File(['image'], 'product.png', { type: 'image/png' })
const secureUrl = 'https://res.cloudinary.com/cloud-example/image/upload/product-image.png'

test('requests backend signature, uploads with its signed parameters, and returns secure_url', async () => {
  const calls: string[] = []
  const progress: number[] = []
  const phases: ImageUploadPhase[] = []
  let uploadedUrl = ''
  let uploadedFormData: FormData | undefined

  const dependencies: CloudinaryUploadDependencies = {
    async requestSignature() {
      calls.push('signature')
      return { success: true, data: signature }
    },
    async uploadFile(url, formData, onProgress) {
      calls.push('cloudinary')
      uploadedUrl = url
      uploadedFormData = formData
      onProgress(45)
      return { secure_url: secureUrl }
    },
  }

  const result = await uploadImageWithAuthorization(
    testFile,
    createCloudinaryUploadAdapter(dependencies),
    (value) => progress.push(value),
    (phase) => phases.push(phase),
  )

  assert.equal(result, secureUrl)
  assert.deepEqual(calls, ['signature', 'cloudinary'])
  assert.equal(
    uploadedUrl,
    'https://api.cloudinary.com/v1_1/cloud-example/image/upload',
  )
  assert.ok(uploadedFormData)
  assert.equal(uploadedFormData.get('file'), testFile)
  assert.equal(uploadedFormData.get('upload_preset'), 'keramik-dinoyo-uploads')
  assert.equal(uploadedFormData.get('allowed_formats'), 'jpg,jpeg,png,webp')
  assert.equal(uploadedFormData.get('folder'), signature.folder)
  assert.equal(uploadedFormData.get('public_id'), signature.publicId)
  assert.equal(uploadedFormData.get('timestamp'), String(signature.timestamp))
  assert.equal(uploadedFormData.get('api_key'), signature.apiKey)
  assert.equal(uploadedFormData.get('signature'), signature.signature)
  assert.deepEqual(progress, [45, 100])
  assert.deepEqual(phases, ['authorizing', 'uploading', 'complete'])
})

test('does not request a signature when local image validation fails', async () => {
  let requested = false
  const adapter = createCloudinaryUploadAdapter({
    async requestSignature() {
      requested = true
      throw new Error('must not be called')
    },
    async uploadFile() {
      throw new Error('must not be called')
    },
  })

  await assert.rejects(
    uploadImageWithAuthorization(
      new File(['gif'], 'unsupported.gif', { type: 'image/gif' }),
      adapter,
      () => {},
    ),
    /JPG\/JPEG, PNG, atau WEBP/,
  )
  assert.equal(requested, false)
})

test('rejects invalid backend signatures and reports upload errors', async () => {
  const invalidSignatureAdapter = createCloudinaryUploadAdapter({
    async requestSignature() {
      return { success: true, data: { ...signature, publicId: '' } }
    },
    async uploadFile() {
      throw new Error('must not be called')
    },
  })

  await assert.rejects(
    uploadImageWithAuthorization(
      testFile,
      invalidSignatureAdapter,
      () => {},
    ),
    /signature Cloudinary yang valid/,
  )

  const uploadFailure = new Error('Cloudinary upload failed')
  const failedAdapter = createCloudinaryUploadAdapter({
    async requestSignature() {
      return { success: true, data: signature }
    },
    async uploadFile() {
      throw uploadFailure
    },
  })
  const phases: ImageUploadPhase[] = []

  await assert.rejects(
    uploadImageWithAuthorization(
      testFile,
      failedAdapter,
      () => {},
      (phase) => phases.push(phase),
    ),
    /Cloudinary upload failed/,
  )
  assert.deepEqual(phases, ['authorizing', 'uploading', 'error'])
})

test('rejects Cloudinary responses without a valid HTTPS secure_url', async () => {
  const adapter = createCloudinaryUploadAdapter({
    async requestSignature() {
      return { success: true, data: signature }
    },
    async uploadFile() {
      return { secure_url: 'http://insecure.example.test/image.png' }
    },
  })

  await assert.rejects(
    uploadImageWithAuthorization(testFile, adapter, () => {}),
    /secure_url HTTPS/,
  )
})

test('CRUD payload builders forward the Cloudinary URL as image', () => {
  const productPayload = buildProductPayload(
    {
      shop_id: '1',
      category_id: '',
      name: 'Cup',
      description: '',
      price: '15000',
      stock: '2',
      status: 'active',
      imageFile: testFile,
      imagePreview: '',
    },
    null,
    secureUrl,
  )
  const shopPayload = buildShopPayload(
    {
      name: 'Shop',
      description: '',
      instagram: '',
      tiktok: '',
      whatsapp: '',
      address: '',
      is_active: true,
      imageFile: testFile,
      imagePreview: '',
    },
    secureUrl,
  )
  const workshopPayload = buildWorkshopPayload(
    {
      title: 'Workshop',
      description: '',
      instructor: '',
      date: '2026-12-01',
      start_time: '09:00',
      end_time: '12:00',
      capacity: 10,
      location: 'Lokasi workshop yang cukup detail',
      status: 'upcoming',
    },
    secureUrl,
  )

  for (const payload of [productPayload, shopPayload, workshopPayload]) {
    assert.equal(payload.image, secureUrl)
    assert.equal('imageSessionId' in payload, false)
    assert.equal('imageFile' in payload, false)
  }
})
