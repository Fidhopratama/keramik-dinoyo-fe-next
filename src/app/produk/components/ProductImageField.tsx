import ImageUploadField from '../../../components/ImageUploadField'
import type { ImageUploadPhase } from '../../../lib/imageUpload'

type Props = {
  file: File | null
  imageUrl: string
  status: ImageUploadPhase
  progress: number
  statusMessage: string
  onChange: (file: File | null) => void
}

export default function ProductImageField({
  file,
  imageUrl,
  status,
  progress,
  statusMessage,
  onChange,
}: Props) {
  return (
    <div className="pr-field">
      <ImageUploadField
        id="image"
        label="Foto Produk"
        file={file}
        imageUrl={imageUrl}
        status={status}
        progress={progress}
        statusMessage={statusMessage}
        onChange={onChange}
      />
    </div>
  )
}
