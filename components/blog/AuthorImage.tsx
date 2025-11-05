'use client'

interface AuthorImageProps {
  src: string
  alt: string
  size?: 'small' | 'large'
}

export default function AuthorImage({ src, alt, size = 'small' }: AuthorImageProps) {
  const sizeClasses = size === 'small' 
    ? 'h-12 w-12 border-2' 
    : 'h-20 w-20 border-2 shadow-lg'

  return (
    <img
      src={src}
      alt={alt}
      className={`${sizeClasses} rounded-full object-cover border-primary flex-shrink-0`}
      onError={(e) => {
        e.currentTarget.src = '/images/default-avatar.jpg'
      }}
    />
  )
}
