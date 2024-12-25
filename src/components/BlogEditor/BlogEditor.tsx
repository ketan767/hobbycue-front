import React, { useCallback, useRef, useState, useEffect, Ref } from 'react'
import { CKEditor } from '@ckeditor/ckeditor5-react'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
// import Underline from '@ckeditor/ckeditor5-basic-styles/src/underline'
import styles from '@/pages/blog/styles.module.css'
import dynamic from 'next/dynamic'
import { SimpleUploadAdapter } from '@ckeditor/ckeditor5-upload'
import { uploadImage } from '@/services/post.service'
import ReactQuill, { Quill } from 'react-quill'
// @ts-ignore
import quillEmoji from 'quill-emoji'
import 'react-quill/dist/quill.snow.css'
import 'quill-emoji/dist/quill-emoji.css'
import { useDispatch } from 'react-redux'
import { uploadEditorImage } from '@/services/blog.services'

interface Props {
  value: string
  onChange: (value: string) => void
  placeholder: any
  error?: any
  elementRef?: any
  onFocus?: any
}

const BlogEditor: React.FC<Props> = ({
  value,
  onChange,
  placeholder,
  error,
  onFocus,
  elementRef,
}) => {
  const quillRef = useRef<ReactQuill>(null)
  const editorRef = useRef<HTMLDivElement | null>(null)
  const inputVideoRef = useRef<HTMLInputElement>(null)
  const [imageIconAdded, setImageIconAdded] = useState(false)
  const [content, setContent] = useState('')
  const [isBlurred, setIsBlurred] = useState(false)
  console.log('asifs isBlurred', isBlurred)

  useEffect(() => {
    // Ensure the Quill instance is correctly accessed
    const quillInstance = quillRef.current?.getEditor()
    if (!quillInstance) return

    const handlePaste = async (e: ClipboardEvent) => {
      const clipboardItems = Array.from(e.clipboardData?.items || [])
      for (const item of clipboardItems) {
        if (item.type.startsWith('image/')) {
          e.preventDefault()

          const file = item.getAsFile()
          if (file) {
            const reader = new FileReader()
            reader.onload = (event) => {
              const base64Image = event.target?.result
              if (base64Image && typeof base64Image === 'string') {
                const range = quillInstance.getSelection()
                quillInstance.insertEmbed(
                  range?.index || 0,
                  'image',
                  base64Image,
                )
                quillInstance.setSelection({
                  index: (range?.index || 0) + 1,
                  length: 0,
                })
              }
            }
            reader.readAsDataURL(file)
          }
          break
        }
      }
    }

    quillInstance.root.addEventListener('paste', handlePaste)
    return () => {
      quillInstance.root.removeEventListener('paste', handlePaste)
    }
  }, [])

  useEffect(() => {
    if (quillRef.current) {
      const quill = quillRef.current.getEditor()
      const processedImages = new Set()
      let timeoutId: NodeJS.Timeout | null = null

      const handleTextChange = async () => {
        if (timeoutId) clearTimeout(timeoutId)

        timeoutId = setTimeout(async () => {
          const editorContent = quill.root.innerHTML

          const base64ImageRegex =
            /<img src="data:image\/[^;]+;base64,[^"]+"[^>]*>/g
          const matches = editorContent.match(base64ImageRegex)

          if (matches) {
            for (const base64ImageTag of matches) {
              const base64SrcRegex = /src="([^"]+)"/
              const base64Src = base64ImageTag.match(base64SrcRegex)?.[1]

              // Skip if the image has already been processed
              if (base64Src && !processedImages.has(base64Src)) {
                try {
                  const { res } = await uploadEditorImage(base64Src)

                  if (res?.data.success) {
                    const imageUrl = res.data.data.url

                    const newContent = editorContent.replace(
                      base64ImageTag,
                      `<img src="${imageUrl}" alt="Uploaded Image"/>`,
                    )

                    quill.root.innerHTML = newContent
                    processedImages.add(base64Src)
                  }
                } catch (error) {
                  console.error('Image upload failed:', error)
                }
              }
            }
          }
        }, 300)
      }

      quill.on('text-change', handleTextChange)

      return () => {
        quill.off('text-change', handleTextChange)
        if (timeoutId) clearTimeout(timeoutId)
      }
    }
  }, [])

  useEffect(() => {
    if (editorRef.current) {
      const editorBounds = editorRef.current.getBoundingClientRect()
      const popup: HTMLDivElement | null = document.querySelector('.ql-tooltip')
      if (popup) {
        console.log('asifs obj', popup)
        const popupBounds = popup.getBoundingClientRect()

        // Check if the popup goes beyond the right edge
        if (popupBounds.right > editorBounds.right) {
          popup.style.left = `${editorBounds.width - popupBounds.width}px`
        }

        // Check if the popup goes beyond the left edge
        if (popupBounds.left < editorBounds.left) {
          popup.style.left = `0px`
        }
      }
    }
  }, [isBlurred])

  return (
    // <div className={`${error ? 'quill-error' : ''}`}>
    <div ref={editorRef}>
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={value}
        onChange={onChange}
        onFocus={() => setIsBlurred(false)}
        onBlur={() => setIsBlurred(true)}
        // onBlur={() => handleEditBlog('content')}
        className={`${styles.quill} ${styles['ql-editor']} blog-quill`}
        placeholder={'Text'}
        modules={{
          toolbar: {
            container: [
              [
                'bold',
                'italic',
                'underline',
                { list: 'ordered' },
                { list: 'bullet' },
                { header: '1' },
                { header: '2' },
                { align: [] },
              ],

              ['link', 'image'],
            ],
          },
        }}
      />
    </div>
  )
}

export default BlogEditor
