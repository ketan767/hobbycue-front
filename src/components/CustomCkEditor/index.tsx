import React, { useCallback, useRef } from 'react'
import { CKEditor } from '@ckeditor/ckeditor5-react'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'

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
  placeholder? : string
}

const CustomCKEditor: React.FC<Props> = ({
  value,
  onChange,
  image,
  setData,
  placeholder
}) => {
  const editorRef = useRef(null)
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
    const images = [...e.target.files]
    console.log(images)
    setData((prev: any) => ({ ...prev, media: [...prev.media, images] }))

    // images.forEach((item: any) => {
    //   var reader = new FileReader()
    //   reader.readAsText(item)
    //   handleImageUpload(item)
    //   // reader.addEventListener('load', readFile)
    // })
  }

  const handleImageUpload = async (image: any) => {
    const formData = new FormData()
    formData.append('post', image)
    console.log('formData', formData)
    const { err, res } = await uploadImage(formData)
    if (err) return console.log(err)
    if (res?.data.success) {
      console.log(res.data)
      const img = res.data.data.url
      setData((prev: any) => ({ ...prev, media: [...prev.media, img] }))
      alert('image uploaded')
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
        ref={editorRef}
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
          placeholder: placeholder ? placeholder : '',
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
