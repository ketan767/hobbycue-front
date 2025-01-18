import { FC, useEffect, useRef, useState } from 'react'
import styles from '@/styles/Brand.module.css'
import Image from 'next/image'
import Head from 'next/head'
import styles2 from '@/styles/ExplorePage.module.css'

import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'

import CustomSnackbar from '@/components/CustomSnackbar/CustomSnackbar'
import dynamic from 'next/dynamic'
import { GetOtherPage, updateOtherPage } from '@/services/admin.service'
import PageGridLayout from '@/layouts/PageGridLayout'
import ProfileSwitcher from '@/components/ProfileSwitcher/ProfileSwitcher'

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
  const [title, setTitle] = useState('')
  const { user } = useSelector((state: RootState) => state.user)
  const [id, setId] = useState('')
  const titleRef = useRef<HTMLTextAreaElement | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)
  const [snackbar, setSnackbar] = useState({
    type: 'success',
    display: false,
    message: '',
  })

  const handleChange = (e: any, type: string) => {
    const { value } = e.target
    console.warn('valiee', value)
    setTitle(value)
  }

  const handleValueChange = (value: string) => {
    setContent(value)
  }
  const handleSave = async (e: any) => {
    setIsUpdating(true)
    try {
      const formData = {
        content: content,
        title: title,
      }
      const data = await updateOtherPage('faq', formData)
      // console.log('data=================>', data)
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

  const updateTitle = async () => {
    try {
      const formData = {
        title: title,
      }
      const data = await updateOtherPage('faq', formData)
    } catch (error) {
      console.log('error', error)
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
    const fetchBrands = async () => {
      const result = await GetOtherPage('faq')

      const currContent = result.res.data[0] ? result.res.data[0].content : ''
      const currTitle = result.res.data[0] ? result.res.data[0].title : ''
      const currId = result.res.data[0] ? result.res.data[0]._id : ''
      setContent(currContent)
      setTitle(currTitle)
      setId(currId)
    }
    fetchBrands()

    if (user?.is_admin) {
      setIsEditing(true)
    }
  }, [user])

  useEffect(() => {
    if (titleRef.current) {
      titleRef.current.style.height = 'auto'
      titleRef.current.style.height = `${titleRef.current.scrollHeight}px`
    }
  }, [title])
  return (
    <>
      <Head>
        <title>HobbyCue - FAQ</title>
        <meta
          name="description"
          content="hobbycue – explore your hobby or passion Sign-in to interact with a community of fellow hobbyists and an eco-system of experts, teachers, suppliers, classes, workshops, and places to practice, participate or perform. Your hobby may be about visual or performing arts, sports, games, gardening, model making, cooking, indoor or outdoor activities… If you are an expert […]"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:image" content="/hobbycuecom.png" />
        <meta property="og:image:width" content="478" />
        <meta property="og:image:height" content="477" />
        <meta property="og:image:type" content="image/png" />
      </Head>

      <PageGridLayout column={2}>
        <aside className={`${styles2['left-aside']} custom-scrollbar`}>
          <section
            className={`content-box-wrapper ${styles2['hobbies-side-wrapper']}`}
          >
            <header className={styles2['header']}>
              <div className={styles2['heading']}>
                {isEditing ? (
                  <textarea
                    className={styles['title'] + ' ' + styles.editInput}
                    placeholder="Title"
                    value={title || ''}
                    name="title"
                    onChange={(e) => handleChange(e, 'title')}
                    onBlur={() => updateTitle()}
                    ref={titleRef}
                    onKeyDown={(e) =>
                      e.key === 'Enter' && titleRef.current?.blur()
                    }
                    rows={1}
                    onInput={function (e) {
                      const target = e.target as HTMLTextAreaElement
                      target.style.height = 'auto'
                      target.style.height = target.scrollHeight + 'px'
                    }}
                  />
                ) : (
                  <h1 className={styles['static-title']}>{title || ''}</h1>
                )}
              </div>
            </header>
          </section>
        </aside>
        <main className={styles['main']}>
          <section className={styles['white-container']}>
            <div className={styles['heading-container']}>
              {/* <span className={styles['heading']}>BRAND </span> */}
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
                  {!isEditing && (
                    <div
                      className={`ql-editor ${styles['max-w-full']}`}
                      dangerouslySetInnerHTML={{ __html: content }}
                    />
                  )}
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
      </PageGridLayout>
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
