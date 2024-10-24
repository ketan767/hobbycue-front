// components/QuillEditor.tsx
import dynamic from 'next/dynamic';
import { useState } from 'react';
import 'react-quill/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

interface QuillEditorProps {
  value: string;
  onChange: (content: string) => void;
}

const QuillEditor: React.FC<QuillEditorProps> = ({ value, onChange }) => {
  const [editorValue, setEditorValue] = useState<string>(value);

  const handleEditorChange = (content: string) => {
    setEditorValue(content);
    onChange(content);
  };

  // Define a custom toolbar with a code block option
  const modules = {
    toolbar: [
      [{ 'header': '1'}, { 'header': '2'}, { 'font': [] }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'align': [] }],
      ['link', 'image', 'code-block'], // Added 'code-block'
      ['clean']
    ],
  };

  return (
    <ReactQuill
      value={editorValue}
      onChange={handleEditorChange}
      modules={modules}
      theme="snow"
    />
  );
};

export default QuillEditor;
