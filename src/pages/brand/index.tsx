import { FC, useEffect, useState } from 'react'
import styles from '@/styles/Brand.module.css'
import Image from 'next/image'
import Head from 'next/head'
import QuillEditor from './QuillEditor'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'

interface indexProps {}

const index: FC<indexProps> = ({}) => {
  const [isEditing, setIsEditing] = useState(false)
  const [content, setContent] = useState('')
  const { user } = useSelector((state: RootState) => state.user)

  const handleValueChange = (value: string) => {
    setContent(value)
  }
  const handleSave = () => {
    setIsEditing(false)
  }
  useEffect(() => {
    if (!user) return
    console.log('user', user)
  }, [user])

  const toggleEditing = () => {
    setIsEditing(!isEditing)
  }
  const pencilIconSvg = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
    >
      <g clip-path="url(#clip0_13842_168963)">
        <path
          d="M2 11.5002V14.0002H4.5L11.8733 6.62687L9.37333 4.12687L2 11.5002ZM13.8067 4.69354C14.0667 4.43354 14.0667 4.01354 13.8067 3.75354L12.2467 2.19354C11.9867 1.93354 11.5667 1.93354 11.3067 2.19354L10.0867 3.41354L12.5867 5.91354L13.8067 4.69354Z"
          fill="#8064A2"
        />
      </g>
      <defs>
        <clipPath id="clip0_13842_168963">
          <rect width="16" height="16" fill="white" />
        </clipPath>
      </defs>
    </svg>
  )
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
                <div className={styles['heading-container']}>
                  <span className={styles['heading']}>BRAND </span>
                  {/* {user.is_admin && <div className={styles['pencil']} onClick={toggleEditing}>{pencilIconSvg}</div>} */}
                  {
                    <div className={styles['pencil']} onClick={toggleEditing}>
                      {pencilIconSvg}
                    </div>
                  }
                </div>
                <div className={styles['list-container']}>
                  <div>
                    <div
                      className={`ql-editor`}
                      dangerouslySetInnerHTML={{ __html: content }}
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* <CustomEditor value={content} onChange={handleValueChange} /> */}
                <div className="ql-snow">
                  <h2 className={styles['heading']}>Editor Output:</h2>
                  <div
                    className={`ql-editor`}
                    dangerouslySetInnerHTML={{ __html: content }}
                  />
                  {/* {content} */}
                </div>
                <QuillEditor value={content} onChange={handleValueChange} />
                <div>
                  <button onClick={handleSave}>Save</button>
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
