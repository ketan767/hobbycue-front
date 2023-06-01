import React, { useCallback, useRef, useState, useEffect} from 'react'
import { CKEditor } from '@ckeditor/ckeditor5-react'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
// import Underline from '@ckeditor/ckeditor5-basic-styles/src/underline'
import styles from './style.module.css'
import dynamic from 'next/dynamic'
import { SimpleUploadAdapter } from '@ckeditor/ckeditor5-upload'
import { uploadImage } from '@/services/post.service'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

// const SimpleUploadAdapter = dynamic(() => import('@ckeditor/ckeditor5-upload'), {
//   ssr: false,
//   loading: () => <h1>Loading...</h1>,
// })

interface Props {
  value: string
  onChange: (value: string) => void
  image?: boolean
  setData?: any
  data?: any
}

const CustomEditor: React.FC<Props> = ({
  value,
  onChange,
  image,
  data,
  setData,
}) => {
  const editorRef = useRef(null)
  const inputRef = useRef<HTMLInputElement>(null)
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
      setImageIconAdded(true)
    }
  }

  useEffect(() => {
    if(editorRef.current === undefined) return
    onReady()
  }, [editorRef.current])

  function readFile(event: any) {
    if(data.media.length === 3) return alert('only 3 images allowed')
    handleImageUpload(event.target.result)
  }

  const handleImageChange = (e: any) => {
    const images = [...e.target.files]
    // console.log(images)
    // setData((prev: any) => ({ ...prev, media: [...prev.media, ...images] }))
    images.forEach((item: any) => {
      var reader = new FileReader()
      reader.readAsText(item)
      handleImageUpload(item)
      reader.addEventListener('load', readFile)
    })
  }
  // console.log(editorRef?.current?.editor)
  // console.log('content', data.content)

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
      {/* <CKEditor
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
        }}
      /> */}
      <ReactQuill
        theme="snow"
        ref={editorRef}
    
        value={data.content}
        onChange={(updatedValue) => {
          setData((prev: any) => ({ ...prev, content: updatedValue }))
        }}
        modules={{  
          toolbar: {  
            container: [  
              [{ 'header': [1, 2, 3, 4, 5, 6, false] }],  
              ['bold', 'italic', 'underline'],  
              [{ 'list': 'ordered' }, { 'list': 'bullet' }],  
              [{ 'align': [] }],  
              // ['link', 'image'],  
              ['clean'],  
              [{ 'color': [] }]  
            ],   
          },  
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

export default CustomEditor
