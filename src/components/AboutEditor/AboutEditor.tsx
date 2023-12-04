import React, { useCallback, useRef, useState, useEffect, Ref } from 'react'
import { CKEditor } from '@ckeditor/ckeditor5-react'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
// import Underline from '@ckeditor/ckeditor5-basic-styles/src/underline'
import styles from './style.module.css'
import dynamic from 'next/dynamic'
import { SimpleUploadAdapter } from '@ckeditor/ckeditor5-upload'
import { uploadImage } from '@/services/post.service'
import ReactQuill, { Quill } from 'react-quill'
// @ts-ignore
import quillEmoji from 'quill-emoji'
import 'react-quill/dist/quill.snow.css'
import 'quill-emoji/dist/quill-emoji.css'

interface Props {
  value: string
  onChange: (value: string) => void
  placeholder: any
  error?: any
  elementRef?: any
}

const AboutEditor: React.FC<Props> = ({
  value,
  onChange,
  placeholder,
  error,
  elementRef,
}) => {
  const inputRef = useRef<any>(null)
  const inputVideoRef = useRef<HTMLInputElement>(null)
  const [imageIconAdded, setImageIconAdded] = useState(false)
  const [content, setContent] = useState('')

  const handleEditorChange = useCallback(
    (event: any, editor: any) => {
      const data = editor.getData()
      onChange(data)
    },
    [onChange],
  )

  useEffect(() => {
    const handleQuillFocus = () => {
      const quillEditor = inputRef.current.getEditor()
      if (quillEditor) {
        const contentLength = value.length
        quillEditor.setSelection(contentLength, 0)
      }
    }

    const quillEditor = inputRef.current.getEditor()
    if (quillEditor) {
      quillEditor.focus()
      handleQuillFocus()
    }
    return () => {}
  }, [])

  return (
    <div className={`about-quill-container  ${error ? 'quill-error' : ''}  `}>
      <ReactQuill
        ref={inputRef}
        theme="snow"
        value={value}
        onChange={(updatedValue) => {
          onChange(updatedValue)
        }}
        className={`${styles.quill}`}
        placeholder={placeholder}
        modules={{
          toolbar: {
            container: [
              [
                'bold',
                'italic',
                'underline',
                { list: 'ordered' },
                { list: 'bullet' },
              ],
              //   [{ list: 'ordered' }, { list: 'bullet' }],
            ],
          },
        }}
      />
    </div>
  )
}

export default AboutEditor
