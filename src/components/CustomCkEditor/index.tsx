import React, { useCallback, useRef } from 'react'
import { CKEditor } from '@ckeditor/ckeditor5-react'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
// import Underline from '@ckeditor/ckeditor5-basic-styles/src/underline'
import styles from './style.module.css'
import dynamic from 'next/dynamic'
import { SimpleUploadAdapter } from '@ckeditor/ckeditor5-upload'
import { uploadImage } from '@/services/post.service'

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
      toolbar?.append(img)
    }
  }

  function readFile(event: any) {
    handleImageUpload(event.target.result)
  }

  const handleImageChange = (e: any) => {
    setData((prev: any) => ({ ...prev, media: [...e.target.files] }))
    const images = [...e.target.files]
    console.log(images)

    images.forEach((item: any) => {
      var reader = new FileReader()
      reader.readAsText(item)
      reader.addEventListener('load', readFile)
    })
  }

  const handleImageUpload = async (image: any) => {
    console.log('uploading', image)
    const formData = new FormData()
    formData.append('post-image', image)
    const { err, res } = await uploadImage(formData)
    if (err) return console.log(err)
    if (res?.data.success) {
      // window.location.reload()
      // dispatch(closeModal())
    }
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
          ],
          simpleUpload: {
            uploadUrl: '/',
          },
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
