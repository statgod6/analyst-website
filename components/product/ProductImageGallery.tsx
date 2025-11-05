'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, FileText } from 'lucide-react'

interface ProductImageGalleryProps {
  coverImage: string
  previewImages?: string[]
  productName: string
  productType: string
  isBestseller?: boolean
}

export default function ProductImageGallery({
  coverImage,
  previewImages = [],
  productName,
  productType,
  isBestseller = false
}: ProductImageGalleryProps) {
  // Combine cover image with preview images
  const allImages = [coverImage, ...previewImages].filter(Boolean)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [imageError, setImageError] = useState(false)

  const handlePrevious = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1))
    setImageError(false)
  }

  const handleNext = () => {
    setCurrentImageIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1))
    setImageError(false)
  }

  const handleThumbnailClick = (index: number) => {
    setCurrentImageIndex(index)
    setImageError(false)
  }

  // Fallback when no valid image
  if (!coverImage || imageError || allImages.length === 0) {
    return (
      <div className="space-y-4">
        <div className="aspect-[4/3] md:aspect-[3/4] bg-gradient-to-br from-primary via-secondary to-accent opacity-20 rounded-xl relative overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-primary">
              <FileText className="h-16 w-16 md:h-24 md:w-24 mx-auto mb-3 md:mb-4 opacity-60" />
              <p className="text-base md:text-xl font-semibold opacity-80">{productType.toUpperCase()}</p>
            </div>
          </div>

          {/* Bestseller Badge */}
          {isBestseller && (
            <div className="absolute top-3 right-3 md:top-4 md:right-4 bg-accent text-primary px-3 py-1 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-bold shadow-lg">
              BESTSELLER
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative group">
        <div className="aspect-[4/3] md:aspect-[3/4] bg-gray-100 rounded-xl overflow-hidden relative">
          <Image
            src={allImages[currentImageIndex]}
            alt={`${productName} - Image ${currentImageIndex + 1}`}
            fill
            className="object-cover"
            priority={currentImageIndex === 0}
            sizes="(max-width: 768px) 100vw, 50vw"
            onError={() => setImageError(true)}
          />

          {/* Bestseller Badge */}
          {isBestseller && (
            <div className="absolute top-3 right-3 md:top-4 md:right-4 bg-accent text-primary px-3 py-1 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-bold shadow-lg z-10">
              BESTSELLER
            </div>
          )}

          {/* Navigation Arrows - Only show if multiple images */}
          {allImages.length > 1 && (
            <>
              <button
                onClick={handlePrevious}
                className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 md:p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-4 w-4 md:h-6 md:w-6 text-gray-800" />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 md:p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
                aria-label="Next image"
              >
                <ChevronRight className="h-4 w-4 md:h-6 md:w-6 text-gray-800" />
              </button>

              {/* Image Counter */}
              <div className="absolute bottom-3 md:bottom-4 right-3 md:right-4 bg-black/70 text-white px-2 md:px-3 py-1 md:py-1.5 rounded-full text-xs md:text-sm font-medium z-10">
                {currentImageIndex + 1} / {allImages.length}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Thumbnail Gallery - Only show if multiple images */}
      {allImages.length > 1 && (
        <div className="grid grid-cols-4 md:grid-cols-3 gap-2 md:gap-3">
          {allImages.slice(0, 6).map((image, index) => (
            <button
              key={index}
              onClick={() => handleThumbnailClick(index)}
              className={`aspect-square rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                currentImageIndex === index
                  ? 'border-primary shadow-md scale-105'
                  : 'border-gray-200 hover:border-gray-300 hover:scale-105'
              }`}
              aria-label={`View image ${index + 1}`}
            >
              <div className="relative w-full h-full">
                <Image
                  src={image}
                  alt={`${productName} thumbnail ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 25vw, 15vw"
                />
              </div>
            </button>
          ))}

          {/* Show "+X more" if there are more than 6 images */}
          {allImages.length > 6 && (
            <div className="aspect-square rounded-lg bg-gray-100 border-2 border-gray-200 flex items-center justify-center">
              <span className="text-xs md:text-sm font-semibold text-gray-600">
                +{allImages.length - 6}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Mobile: Swipe Indicator */}
      {allImages.length > 1 && (
        <div className="md:hidden text-center">
          <p className="text-xs text-gray-500">Swipe or use arrows to view more images</p>
        </div>
      )}
    </div>
  )
}
