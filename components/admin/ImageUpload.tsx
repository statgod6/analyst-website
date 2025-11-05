'use client'

import { useState } from 'react'
import { Upload, X, Image as ImageIcon } from 'lucide-react'

interface ImageUploadProps {
  value: string
  onChange: (url: string, alt?: string) => void
  label: string
  required?: boolean
  showAltText?: boolean
}

export default function ImageUpload({ 
  value, 
  onChange, 
  label, 
  required = false,
  showAltText = true 
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [altText, setAltText] = useState('')
  const [dragActive, setDragActive] = useState(false)

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB')
      return
    }

    setUploading(true)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      const data = await response.json()
      onChange(data.url, altText)
    } catch (error) {
      console.error('Upload error:', error)
      alert('Failed to upload image. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleRemove = () => {
    onChange('', '')
    setAltText('')
  }

  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {value ? (
        <div className="relative group">
          <img
            src={value}
            alt={altText || 'Preview'}
            className="w-full h-64 object-cover rounded-lg"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div
          onDragOver={(e) => {
            e.preventDefault()
            setDragActive(true)
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive 
              ? 'border-primary bg-blue-50' 
              : 'border-gray-300 hover:border-gray-400'
          }`}
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleChange}
            className="hidden"
            id={`image-upload-${label}`}
            disabled={uploading}
          />
          <label
            htmlFor={`image-upload-${label}`}
            className="cursor-pointer"
          >
            <div className="flex flex-col items-center">
              {uploading ? (
                <>
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
                  <p className="text-gray-600">Uploading...</p>
                </>
              ) : (
                <>
                  <ImageIcon className="h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-gray-600 mb-2">
                    Drag and drop an image, or <span className="text-primary font-semibold">browse</span>
                  </p>
                  <p className="text-sm text-gray-500">
                    PNG, JPG, WEBP up to 5MB
                  </p>
                </>
              )}
            </div>
          </label>
        </div>
      )}

      {showAltText && value && (
        <input
          type="text"
          value={altText}
          onChange={(e) => {
            setAltText(e.target.value)
            onChange(value, e.target.value)
          }}
          placeholder="Image alt text (for SEO and accessibility)"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
      )}
    </div>
  )
}
