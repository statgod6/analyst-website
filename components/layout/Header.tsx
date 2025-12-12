'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Blogs', href: '/blogs' },
    { name: 'Products', href: '/products' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ]

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <nav className="container-custom">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo and Brand Name */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center">
              <Image 
                src="/logo.png" 
                alt="AI for Everyone Logo" 
                width={150} 
                height={50} 
                className="h-10 md:h-12 w-auto"
                priority
              />
            </Link>
            {/* Brand Name - Next to logo on desktop, centered on mobile */}
            <span className="hidden md:inline text-lg md:text-2xl font-extrabold whitespace-nowrap bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 bg-clip-text text-transparent drop-shadow-sm tracking-tight hover:from-purple-600 hover:via-pink-500 hover:to-orange-400 transition-all duration-500 cursor-default">
              AI for Everyone
            </span>
          </div>

          {/* Brand Name - Center on mobile only */}
          <div className="absolute left-1/2 transform -translate-x-1/2 md:hidden">
            <span className="text-base font-extrabold whitespace-nowrap bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 bg-clip-text text-transparent drop-shadow-sm tracking-tight">
              AI for Everyone
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="font-semibold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 bg-clip-text text-transparent hover:from-purple-600 hover:via-pink-500 hover:to-orange-400 transition-all duration-500"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6 text-primary" />
            ) : (
              <Menu className="h-6 w-6 text-primary" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="font-semibold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 bg-clip-text text-transparent hover:from-purple-600 hover:via-pink-500 hover:to-orange-400 transition-all duration-500"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}

export default Header
