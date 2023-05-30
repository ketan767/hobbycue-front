import React, { useCallback, useRef } from 'react'
import { CKEditor } from '@ckeditor/ckeditor5-react'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
// import Underline from '@ckeditor/ckeditor5-basic-styles/src/underline'
import styles from './style.module.css'
import dynamic from 'next/dynamic'
import { SimpleUploadAdapter } from '@ckeditor/ckeditor5-upload';

// const SimpleUploadAdapter = dynamic(() => import('@ckeditor/ckeditor5-upload'), {
//   ssr: false,
//   loading: () => <h1>Loading...</h1>,
// })

interface Props {
  value: string
  onChange: (value: string) => void
  image?: boolean
  setData?: any
}

const CustomCKEditor: React.FC<Props> = ({
  value,
  onChange,
  image,
  setData,
}) => {
  const editorRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleEditorChange = useCallback(
    (event: any, editor: any) => {
      const data = editor.getData()
      onChange(data)
    },
    [onChange],
  )

  const onReady = (editor: any) => {
    if (image) {
      const toolbar = document.querySelector('.ck-toolbar__items')
      const img = document.createElement('img')
      img.src = '/image.svg'
      img.addEventListener('click', openInput)
      // toolbar?.append(img)
    }
  }

  const handleImageChange = (e: any) => {
    setData((prev: any) => ({ ...prev, media: e.target.files }))
  }

  const openInput = () => {
    inputRef.current?.click()
  }
  return (
    <>
      <CKEditor
        editor={ClassicEditor}
        data={value}
        onReady={(editor) => onReady(editor)}
        onChange={handleEditorChange}
        config={{
          toolbar: [
            'bold',
            'italic',
            'underline',
            '|',
            'numberedList',
            'bulletedList',
            'insertImage',
            'uploadImage',
          ],
          simpleUpload: {
            uploadUrl: '/'
          }
          // plugins: [SimpleUploadAdapter],
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
    </>
  )
}

export default CustomCKEditor
