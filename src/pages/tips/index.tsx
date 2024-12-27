import { FC, useEffect, useState } from 'react'
import styles from '@/styles/Brand.module.css'
import Image from 'next/image'
import Head from 'next/head'

import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { getTips, updateTips } from '@/services/admin.service'
import CustomSnackbar from '@/components/CustomSnackbar/CustomSnackbar'
import dynamic from 'next/dynamic'

const QuillEditor = dynamic(
  () => import('@/components/QuillEditor/QuillEditor'),
  {
    ssr: false,
    loading: () => <h1>Loading...</h1>,
  },
)
interface indexProps {}

const index: FC<indexProps> = ({}) => {
  const [isEditing, setIsEditing] = useState(false)
  const [content, setContent] = useState('')
  const { user } = useSelector((state: RootState) => state.user)
  const [id, setId] = useState('')
  const [isUpdating, setIsUpdating] = useState(false)
  const [snackbar, setSnackbar] = useState({
    type: 'success',
    display: false,
    message: '',
  })

  const handleValueChange = (value: string) => {
    setContent(value)
  }
  const handleSave = async (e: any) => {
    setIsUpdating(true)
    try {
      const formData = {
        content: content,
      }
      const data = await updateTips(id, formData)

      if (data.res.status === 200) {
        setSnackbar({
          display: true,
          type: 'success',
          message: 'Page updated successfully',
        })
        setIsEditing(false)
      }
    } catch (error) {
      setSnackbar({
        display: true,
        type: 'warning',
        message: 'Unable to update data',
      })
      console.log('error', error)
    } finally {
      setIsUpdating(false)
    }
  }

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

  useEffect(() => {
    const fetchTips = async () => {
      const result = await getTips()
      // console.log('result------>', result.res.data[0])
      // console.log('id------>', result.res.data[0]._id)

      const currContent = result.res?.data[0]
        ? result?.res?.data[0].content
        : ''
      const currId = result?.res?.data[0] ? result?.res?.data[0]?._id : ''
      setContent(currContent)
      setId(currId)
    }
    fetchTips()
  }, [])
  return (
    <>
      <Head>
        <title>HobbyCue - Tips</title>
      </Head>
      <main className={styles['main']}>
        <section className={styles['white-container']}>
          <div className={styles['heading-container']}>
            {user.is_admin && (
              <div className={styles['pencil']} onClick={toggleEditing}>
                {pencilIconSvg}
              </div>
            )}
          </div>
          <div className={styles['list-container']}>
            <div className={styles['max-w-1296px']}>
              <style>
                {`
                        .ql-toolbar.ql-snow {
                          width: 100%;
                          border-left:none;
                          border-right:none;
                          border-bottom:none;
                        }
                        .ql-container.ql-snow {
                          width: 100%;
                          border:none;
                        }
                        .ql-editor{
                          border: none !important;
                          width: 100%;
                          border-top:1px solid #ccc;
                          padding-right:16px;
                          margin-inline: auto;
                        }
                        .ql-editor.ql-indent-1{
                          padding-left:4px;
                        }
                        .ql-editor ul, 
                        .ql-editor ol {
                          padding-left: 4px;  
                                        text-align:justify; 

                        }

                        .ql-editor a {
                          color: rgb(128, 100, 162);  
                          text-decoration: none !important;
                                        text-align:justify;

                        }
                        .ql-editor p {
                          color: var(--Grey-Darkest, #08090a);
                          font-family: Cambria;
                          font-size: 16px !important;
                          font-style: normal;
                          font-weight: 400;
                          line-height: 24px;
                          margin-bottom: 11px;
}
                        }
                         @media screen and (max-width:1100px) {
                          .ql-editor{
                          
                            width: 114vw;
                          
                          }
                        }
                        
                      `}
              </style>
              <div className={`ql-snow ${styles['max-w-1296px']}`}>
                <div
                  className={`ql-editor ${styles['max-w-full']}`}
                  dangerouslySetInnerHTML={{ __html: content }}
                />
              </div>
              {isEditing && (
                <>
                  <QuillEditor value={content} onChange={handleValueChange} />
                  <div className={styles.buttonContainer}>
                    <button className={styles.button} onClick={handleSave}>
                      {!isUpdating ? 'Save' : 'Saving...'}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </section>
      </main>
      {
        <CustomSnackbar
          message={snackbar.message}
          triggerOpen={snackbar.display}
          type={snackbar.type === 'success' ? 'success' : 'error'}
          closeSnackbar={() => {
            setSnackbar((prevValue) => ({ ...prevValue, display: false }))
          }}
        />
      }
    </>
  )
}

export default index
