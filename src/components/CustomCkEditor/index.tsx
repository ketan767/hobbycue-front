import React, { useCallback } from 'react'
import { CKEditor } from '@ckeditor/ckeditor5-react'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
// import Underline from '@ckeditor/ckeditor5-basic-styles/src/underline'

interface Props {
  value: string
  onChange: (value: string) => void
}

const CustomCKEditor: React.FC<Props> = ({ value, onChange }) => {
  const handleEditorChange = useCallback(
    (event: any, editor: any) => {
      const data = editor.getData()
      onChange(data)
    },
    [onChange],
  )

  return (
    <CKEditor
      editor={ClassicEditor}
      data={value}
      onReady={(editor) => {console.log(editor)}}
      onChange={handleEditorChange}
      config={{
        toolbar: ['bold', 'italic', 'underline', '|', 'numberedList', 'bulletedList'],
        // plugins: [Underline],
      }}
    />
  )
}

export default CustomCKEditor
