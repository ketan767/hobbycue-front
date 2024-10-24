import { FC, useState } from 'react'
import styles from '@/styles/faq.module.css'
import Image from 'next/image'
import Head from 'next/head'
import CustomEditor from './QuillEditor'
import QuillEditor from './QuillEditor'

interface indexProps {}

const index: FC<indexProps> = ({}) => {
  const [isEditing, setIsEditing] = useState(true)
  const [content, setContent] = useState('')

  const handleValueChange = (value: string) => {
    setContent(value)
  }
  return (
    <>
      <Head>
        <title>HobbyCue - Brand</title>
      </Head>
      <main className={styles['main']}>
        <div className={styles['container']}>
          <section className={styles['white-container']}>
            {!isEditing ? (
              <>
                <h1>BRAND</h1>
                <div className={styles['list-container']}></div>
              </>
            ) : (
              <>
                <QuillEditor value={content} onChange={handleValueChange} />
                {/* <CustomEditor value={content} onChange={handleValueChange} /> */}
                <div>
                  <h2>Editor Output:</h2>
                  <div dangerouslySetInnerHTML={{ __html: content }} />
                </div>
                <div>
                  <h2>Editor Output (Preformatted for Code):</h2>
                  <pre>
                    {/* Render the content as plain HTML but inside <pre> to preserve indentation */}
                    <code dangerouslySetInnerHTML={{ __html: content }} />
                  </pre>
                </div>
              </>
            )}
          </section>
        </div>
      </main>
    </>
  )
}

export default index
