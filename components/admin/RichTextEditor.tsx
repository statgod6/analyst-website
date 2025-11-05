'use client'

import { useEffect, useRef, useState } from 'react'
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  Link as LinkIcon, 
  Heading1, 
  Heading2, 
  Heading3,
  Quote,
  Code,
  Image as ImageIcon
} from 'lucide-react'

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  minHeight?: string
}

export default function RichTextEditor({ 
  value, 
  onChange, 
  placeholder = 'Start writing...',
  minHeight = '400px'
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const [isFocused, setIsFocused] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value
    }
  }, [value])

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML)
    }
  }

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value)
    editorRef.current?.focus()
  }

  const insertHeading = (level: number) => {
    const selection = window.getSelection()
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0)
      const heading = document.createElement(`h${level}`)
      heading.className = level === 1 ? 'text-3xl font-bold my-4' : 
                         level === 2 ? 'text-2xl font-bold my-3' : 
                         'text-xl font-semibold my-2'
      
      try {
        range.deleteContents()
        range.insertNode(heading)
        heading.innerHTML = '<br>'
        
        const newRange = document.createRange()
        newRange.setStart(heading, 0)
        newRange.collapse(true)
        selection.removeAllRanges()
        selection.addRange(newRange)
      } catch (e) {
        console.error('Error inserting heading:', e)
      }
    }
    editorRef.current?.focus()
  }

  const insertLink = () => {
    let url = prompt('Enter URL:')
    if (url) {
      // Ensure URL has proper protocol
      if (!url.startsWith('http://') && !url.startsWith('https://') && !url.startsWith('mailto:')) {
        url = 'https://' + url
      }
      execCommand('createLink', url)
      
      // Set target="_blank" for external links
      const selection = window.getSelection()
      if (selection && selection.anchorNode) {
        const link = selection.anchorNode.parentElement
        if (link && link.tagName === 'A') {
          link.setAttribute('target', '_blank')
          link.setAttribute('rel', 'noopener noreferrer')
        }
      }
    }
  }

  const handleImageUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB')
      return
    }

    setUploadingImage(true)

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
      insertImageIntoEditor(data.url)
    } catch (error) {
      console.error('Upload error:', error)
      alert('Failed to upload image. Please try again.')
    } finally {
      setUploadingImage(false)
    }
  }

  const insertImageIntoEditor = (imageUrl: string) => {
    const selection = window.getSelection()
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0)
      
      // Create image element
      const img = document.createElement('img')
      img.src = imageUrl
      img.className = 'max-w-full h-auto my-4 rounded-lg'
      img.alt = 'Inserted image'
      img.style.maxWidth = '100%'
      img.style.height = 'auto'
      
      // Create a wrapper div for the image
      const wrapper = document.createElement('div')
      wrapper.className = 'my-4'
      wrapper.appendChild(img)
      
      // Insert the wrapper
      range.deleteContents()
      range.insertNode(wrapper)
      
      // Add a paragraph after the image for continued typing
      const para = document.createElement('p')
      para.innerHTML = '<br>'
      wrapper.parentNode?.insertBefore(para, wrapper.nextSibling)
      
      // Move cursor to the new paragraph
      const newRange = document.createRange()
      newRange.setStart(para, 0)
      newRange.collapse(true)
      selection.removeAllRanges()
      selection.addRange(newRange)
    }
    
    editorRef.current?.focus()
    handleInput() // Trigger onChange
  }

  const triggerImageUpload = () => {
    fileInputRef.current?.click()
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleImageUpload(file)
    }
    // Reset input value to allow uploading the same file again
    e.target.value = ''
  }

  const toolbarButtons = [
    { icon: Heading1, label: 'Heading 1', action: () => insertHeading(1) },
    { icon: Heading2, label: 'Heading 2', action: () => insertHeading(2) },
    { icon: Heading3, label: 'Heading 3', action: () => insertHeading(3) },
    { divider: true },
    { icon: Bold, label: 'Bold', action: () => execCommand('bold') },
    { icon: Italic, label: 'Italic', action: () => execCommand('italic') },
    { divider: true },
    { icon: List, label: 'Bullet List', action: () => execCommand('insertUnorderedList') },
    { icon: ListOrdered, label: 'Numbered List', action: () => execCommand('insertOrderedList') },
    { divider: true },
    { icon: LinkIcon, label: 'Insert Link', action: insertLink },
    { icon: Quote, label: 'Quote', action: () => execCommand('formatBlock', 'blockquote') },
    { icon: ImageIcon, label: 'Insert Image', action: triggerImageUpload, disabled: uploadingImage },
  ]

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
      
      {/* Toolbar */}
      <div className="border-b border-gray-200 bg-gray-50 p-2 flex flex-wrap gap-1">
        {toolbarButtons.map((button, index) => {
          if (button.divider) {
            return <div key={`divider-${index}`} className="w-px bg-gray-300 mx-1" />
          }
          
          const Icon = button.icon!
          return (
            <button
              key={button.label}
              type="button"
              onClick={button.action}
              disabled={button.disabled}
              className="p-2 hover:bg-gray-200 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title={button.label}
            >
              <Icon className="h-4 w-4 text-gray-700" />
            </button>
          )
        })}
        
        {uploadingImage && (
          <div className="flex items-center gap-2 ml-auto px-3 py-1 bg-blue-50 text-blue-600 text-sm rounded">
            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></div>
            <span>Uploading image...</span>
          </div>
        )}
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={`p-4 outline-none prose prose-lg max-w-none ${
          isFocused ? 'ring-2 ring-primary ring-inset' : ''
        }`}
        style={{ minHeight }}
        data-placeholder={placeholder}
      />

      <style jsx>{`
        [contentEditable]:empty:before {
          content: attr(data-placeholder);
          color: #9CA3AF;
          pointer-events: none;
        }
      `}</style>
    </div>
  )
}
