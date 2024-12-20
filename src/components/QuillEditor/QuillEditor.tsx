import dynamic from 'next/dynamic'
import { useEffect, useRef, useState } from 'react'
import 'react-quill/dist/quill.snow.css'
import styles from './QillEditor.module.css'
import ReactQuill, { Quill } from 'react-quill'
import { uploadEditorImage } from '@/services/blog.services'
interface QuillEditorProps {
  value: string
  onChange: (content: string) => void
}

const QuillEditor: React.FC<QuillEditorProps> = ({ value, onChange }) => {
  const [editorValue, setEditorValue] = useState<string>(value)

  // Use ReactQuill's specific ref type
  const quillRef = useRef<ReactQuill>(null)

  const handleEditorChange = (content: string) => {
    setEditorValue(content)
    onChange(content)
  }

  useEffect(() => {
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

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }, { font: [] }],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ indent: '-1' }],
      [{ indent: '+1' }],
      ['header', 'bold', 'italic', 'underline', 'strike'],
      [{ color: [] }, { background: [] }],
      [{ align: [] }],
      ['image', 'link'],
    ],
  }

  const formats = [
    'header',
    'font',
    'list',
    'bullet',
    'indent',
    'bold',
    'italic',
    'underline',
    'strike',
    'color',
    'background',
    'align',
    'image',
    'link',
  ]

  return (
    <div className={styles.container}>
      <ReactQuill
        ref={quillRef}
        value={editorValue}
        onChange={handleEditorChange}
        modules={modules}
        formats={formats}
        theme="snow"
        className={`${styles.quill} ${styles.qlContainer} blog-quill`}
      />
      <style>
        {`
          .ql-toolbar.ql-snow {
            width: 100%;
            border-left:none;
            border-right:none;
            border-bottom:none;
            position: sticky;
            top: 80px;
            z-index: 2;
            background: #fff
          }
          .ql-container.ql-snow {
            width: 100%;
            max-width: 100%;
            border:none;
          }
          .ql-editor{
            border: none !important;
            width: 100%;
            max-width: 100%;
            border-top:1px solid #ccc;
            padding-right:16px;
            margin-inline: auto;
          }
          .ql-editor.ql-indent-1{
            padding-left:4px;
          }
          .ql-editor ul, 
          .ql-editor ol {
            padding-left: 4px;  
            text-align:justify; 
          }

          .ql-editor a {
            color: rgb(128, 100, 162);  
            text-decoration: none !important;
            text-align:justify;
          }
          .ql-editor p {
              color: var(--Grey-Darkest, #08090a);
              font-family: Cambria;
              font-size: 16px !important;
              font-style: normal;
              font-weight: 400;
              line-height: 24px;
              margin-bottom: 11px;
          }
          @media screen and (max-width:1100px) {
            .ql-editor{
              width:99vw;
              max-width: 115%;
            }
            .ql-toolbar.ql-snow {
              width: 100%;
              border-left:none;
              border-right:none;
              border-bottom:none;
              padding:8px;
              flex-wrap: wrap;
              height:100px;   
            }
          }
        `}
      </style>
    </div>
  )
}

export default QuillEditor
