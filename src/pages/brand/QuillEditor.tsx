// components/QuillEditor.tsx
import dynamic from 'next/dynamic'
import { useState } from 'react'
import 'react-quill/dist/quill.snow.css'
import styles from './QillEditor.module.css'

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false })

interface QuillEditorProps {
  value: string
  onChange: (content: string) => void
}

const QuillEditor: React.FC<QuillEditorProps> = ({ value, onChange }) => {
  const [editorValue, setEditorValue] = useState<string>(value)

  const handleEditorChange = (content: string) => {
    setEditorValue(content)
    onChange(content)
  }

  // Define a custom toolbar with a code block option
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }, { font: [] }],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ indent: '-1' }, { indent: '+1' }],
      ['header', 'bold', 'italic', 'underline', 'strike'],
      [{ color: [] }, { background: [] }],
      [{ align: [] }],
      ['image'],
    ],
  }

  return (
    <div className={styles.container}>
      <ReactQuill
        value={editorValue}
        onChange={handleEditorChange}
        modules={modules}
        theme="snow"
        className={`${styles.quill} ${styles.qlContainer}  react-quill`}
      />
      <style>
        {`
          .ql-toolbar.ql-snow {
            width: 100%;
            border-left:none;
            border-right:none;
            border-bottom:none;
          }
          .ql-container.ql-snow {
            width: 87vw;
            border:none;
          }
          .ql-editor{
            border: none !important;
            width: 87vw;
            border-top:1px solid #ccc;

          }
          .ql-editor.ql-indent-1{
            padding-left:4px;
          }
          .ql-editor ul, 
          .ql-editor ol {
            padding-left: 4px;  
          }
          
        `}
      </style>
    </div>
  )
}

export default QuillEditor
