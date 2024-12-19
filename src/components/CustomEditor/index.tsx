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
  onStatusChange?: (isChanged: boolean) => void
  forWhichComponent?: string
}

const CustomEditor: React.FC<Props> = ({
  value,
  onChange,
  image,
  data,
  setData,
  error,
  hasLink,
  onStatusChange,
  forWhichComponent,
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
      const toolbar = document.querySelector('.ql-toolbar.ql-snow');
      // Check if an <img> already exists inside the toolbar
      const existingImg = toolbar?.querySelector('img');
      
      if (!existingImg) {  // Only append the new image if no img exists
        const img = document.createElement('img');
        img.src = '/image.svg';
        img.addEventListener('click', openInput);
        toolbar?.append(img);
        setImageIconAdded(true);
      }
    }
  };
  

  useEffect(() => {
    if (editorRef.current === undefined) return
    onReady()
  }, [])

  const handleImageChange = (e: any) => {
    if (onStatusChange) {
      onStatusChange(true)
    }
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
    if (onStatusChange) {
      onStatusChange(true)
    }
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
    {/* <style>{`
          .ql-editor.ql-indent-1{
            padding-left:4px;
          }
          .ql-editor ul, 
          .ql-editor ol {
            font-family:'Poppins';
            padding-left: 4px; 
            font-size:14px;
            text-align:left; 
          }

          .ql-editor a {
            font-family:'Poppins';
            color: rgb(128, 100, 162);  
            text-decoration: none !important;
            font-size:14px;
            text-align:left;
          }
          .ql-editor p {
            font-family:'Poppins';
            font-size:14px;
            text-align:left;
          }
          .ql-editor {
            scrollbar-width: thin;
            scrollbar-color: #777 #f1f1f1;
          }
      `}</style> */}
      <ReactQuill
        theme="snow"
        ref={editorRef}
        value={data.content}
        onChange={(updatedValue) => {
          if (onStatusChange) {
            if (updatedValue == '') {
              onStatusChange(false)
            } else {
              onStatusChange(true)
            }
          }
          console.log(`status is changed`)

          setData((prev: any) => ({ ...prev, content: updatedValue }))
        }}
        className={`${styles['border']} ${error ? styles['quill-error'] : ''} ${
          hasLink ? styles['quill-has-link'] : ''
        }`}
        style={{
          ...(forWhichComponent === "createPost" ? { maxHeight: "100%" } : {}),
          ...(hasLink ? {maxHeight: "420px"} : { height: "490px" })
        }}        
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
              [{ list: 'ordered' }, { list: 'bullet' }], ['link'],
            ],
          },
          // 'emoji-toolbar': true,
          // 'emoji-textarea': true,
          // 'emoji-shortname': true,
        }}
      />

      <style>{`
          ${
            !hasLink &&
            `
            .ql-editor.ql-blank {
                min-height: calc(100vh - 18rem) !important;
            }
            .ql-container {
                height: calc(100vh - 18rem) !important;
            }
            `
          }
          .ql-toolbar.ql-snow {
            border-radius: 8px 8px 0 0 !important;
          }
          .ql-container.ql-snow {
            border:none !important;
          }
          .ql-editor.ql-indent-1{
            padding-left:4px;
          }
          .ql-editor ul, 
          .ql-editor ol {
            font-family:'Poppins';
            padding-left: 4px; 
            font-size:14px;
            text-align:left; 
          }

          .ql-editor a {
            font-family:'Poppins';
            color: rgb(128, 100, 162);  
            text-decoration: none !important;
            font-size:14px;
            text-align:left;
          }
          .ql-editor p {
            font-family:'Poppins';
            font-size:14px;
            text-align:left;
          }
          .ql-editor {
            min-height: 100px;
          }
          .ql-container{
            border: 2px solid #000 !important;
            border-radius: 5px;
          }
          ${
            forWhichComponent === "createPost" && 
            `
              .ql-editor {
                scrollbar-width: thin;
                scrollbar-color: #777 #f1f1f1;
              }
            `
          }
          
      `}</style>

      <input
        type="file"
        multiple
        accept="image/png, image/gif, image/jpeg"
        className={styles.hidden}
        onChange={(e) => handleImageChange(e)}
        ref={inputRef}
      />

      {error && <p className={styles['error-text']}>{error}</p>}
      
    </>
  )
}

export default CustomEditor
