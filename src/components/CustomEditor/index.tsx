import React, { useCallback, useRef, useState, useEffect } from 'react'
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
import Tooltip from '@/components/Tooltip/ToolTip'

const { EmojiBlot, ShortNameEmoji, ToolbarEmoji, TextAreaEmoji } = quillEmoji

Quill.register(
  {
    'formats/emoji': EmojiBlot,
    'modules/emoji-shortname': ShortNameEmoji,
    'modules/emoji-toolbar': ToolbarEmoji,
    'modules/emoji-textarea': TextAreaEmoji,
  },
  true,
)

interface Props {
  value: string
  onChange: (value: string) => void
  image?: boolean
  setData?: any
  data?: any
  error?: any
  hasLink?: boolean
}

const CustomEditor: React.FC<Props> = ({
  value,
  onChange,
  image,
  data,
  setData,
  error,
  hasLink,
}) => {
  const editorRef = useRef(null)
  const inputRef = useRef<HTMLInputElement>(null)
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
  const onReady = () => {
    if (image && !imageIconAdded) {
      const toolbar = document.querySelector('.ql-toolbar.ql-snow')
      const img = document.createElement('img')
      img.src = '/image.svg'
      img.addEventListener('click', openInput)
      toolbar?.append(img)
    }
  }

  useEffect(() => {
    if (editorRef.current === undefined) return
    onReady()
  }, [])

  const handleImageChange = (e: any) => {
    let images = [...e.target.files]
    // setData((prev: any) => ({ ...prev, media: [...prev.media, ...images] }))
    if (data.video_url !== '')
      return alert('Only video or image can be uploaded')
    if (data.media && data.media.length >= 3)
      return alert('Maximum 3 images can be uploaded')
    if (images.length > 3) return alert('Maximum 3 images can be uploaded')
    images.forEach((item: any) => {
      handleImageUpload(item, false)
    })
  }

  const handleImageUpload = async (image: any, isVideo: boolean) => {
    const formData = new FormData()
    formData.append('post', image)
    console.log('formData', formData)
    const { err, res } = await uploadImage(formData)
    if (err) return console.log(err)
    if (res?.data.success) {
      console.log(res.data)
      const img = res.data.data.url
      if (isVideo) {
        setData((prev: any) => ({ ...prev, video_url: img }))
      } else {
        if (data.media) {
          setData((prev: any) => ({ ...prev, media: [...prev.media, img] }))
        } else {
          setData((prev: any) => ({ ...prev, media: [img] }))
        }
      }
      // window.location.reload()
      // dispatch(closeModal())
    }
  }

  const openInput = () => {
    inputRef.current?.click()
  }

  const openInputVideo = () => {
    inputVideoRef.current?.click()
  }

  return (
    <>
      <ReactQuill
        theme="snow"
        ref={editorRef}
        value={data.content}
        onChange={(updatedValue) => {
          setData((prev: any) => ({ ...prev, content: updatedValue }))
        }}
        className={`${styles.quill} ${error ? styles['quill-error'] : ''} ${
          hasLink ? styles['quill-has-link'] : ''
        }`}
        placeholder="Start something interesting..."
        modules={{
          toolbar: {
            container: [
              [
                {
                  bold: {
                    className: 'quill-toolbar-button',
                    title: 'Bold',
                    text: 'Bold Text',
                    'data-tooltip': 'Bold Tooltip',
                  },
                },
                {
                  italic: {
                    className: 'quill-toolbar-button',
                    title: 'Italic',
                    text: 'Italic Text',
                    'data-tooltip': 'Italic Tooltip',
                  },
                },
                'underline',
                // 'emoji',
              ],
              [{ list: 'ordered' }, { list: 'bullet' }],
            ],
            // handlers: { emoji: function () {} },
          },
          // 'emoji-toolbar': true,
          // 'emoji-textarea': true,
          // 'emoji-shortname': true,
        }}
      />

      <input
        type="file"
        multiple
        accept="image/png, image/gif, image/jpeg"
        className={styles.hidden}
        onChange={(e) => handleImageChange(e)}
        ref={inputRef}
      />

      {error && <p className={styles['error-text']}>{error}</p>}
      <style>{`
          .ql-editor ul, 
          .ql-editor ol {
            padding-left: 4px;  
          }
      `}</style>
    </>
  )
}

export default CustomEditor
