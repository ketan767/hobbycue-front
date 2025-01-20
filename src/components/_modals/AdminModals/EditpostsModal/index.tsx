import React, { useState, useRef, useEffect, FormEvent } from 'react'
import { Button, CircularProgress } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { closeModal } from '@/redux/slices/modal'
import StatusDropdown from '@/components/_formElements/StatusDropdown'
import CustomSnackbar from '@/components/CustomSnackbar/CustomSnackbar'
import CloseIcon from '@/assets/icons/CloseIcon'
import styles from './styles.module.css'
import Image from 'next/image'
import { getAllPosts } from '@/services/post.service'
import { getAllHobbies } from '@/services/hobby.service'
import { updatePostByAdmin } from '@/services/admin.service'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import Link from 'next/link'

type Props = {
  _id: string
  handleClose: () => void
}

export type DropdownListItem = {
  _id: string
  display: string
  sub_category?: string
  genre?: any
}

const CustomEditor = dynamic(() => import('@/components/CustomEditor'), {
  ssr: false,
  loading: () => <h1>Loading...</h1>,
})

const EditPostModal: React.FC<Props> = ({ _id, handleClose }) => {
  const dispatch = useDispatch()
  const [submitBtnLoading, setSubmitBtnLoading] = useState<boolean>(false)
  const [inputErrs, setInputErrs] = useState<{ error: string | null }>({
    error: null,
  })
  const nextButtonRef = useRef<HTMLButtonElement | null>(null)
  const [snackbar, setSnackbar] = useState({
    type: 'success',
    display: false,
    message: '',
  })

  const [post, setPost] = useState<any>(null)
  const [hobbies, setHobbies] = useState<DropdownListItem[]>([])
  const [genres, setGenres] = useState<DropdownListItem[]>([])
  const modalRef = useRef<HTMLDivElement | null>(null)

  console.log({ genres })
  console.log({ post })
  // Close modal on clicking outside
  const handleClickOutside = (event: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      handleClose()
    }
  }

  // Close modal on pressing 'Esc'
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      handleClose()
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])
  useEffect(() => {
    const fetchPostData = async () => {
      const { err, res } = await getAllPosts(
        `_id=${_id}&populate=_author,_genre,_hobby`,
      )
      setPost(res?.data.data?.posts[0])
    }

    if (_id) {
      fetchPostData()
      getAllHobbies(
        `fields=display,genre&level=3&level=2&level=1&level=0&show=true`,
      )
        .then((res) => {
          setHobbies(res.res.data.hobbies)
        })
        .catch((err) => console.log({ err }))
    }
  }, [_id])

  const updatePostFunc = async () => {
    const { err, res } = await updatePostByAdmin(post._id, post)
    if (err) {
      setSnackbar({
        type: 'warning',
        display: true,
        message: 'Some error occured',
      })
    } else if (res) {
      setSnackbar({
        type: 'success',
        display: true,
        message: 'Post updated successfully',
      })
    } else {
      setSnackbar({
        type: 'warning',
        display: true,
        message: 'Some error occured',
      })
    }
  }

  useEffect(() => {
    const fetchGenres = async () => {
      const chosenHobby = hobbies.find((obj) => obj._id === post?._hobby?._id)
      if (chosenHobby && chosenHobby.genre && chosenHobby.genre.length > 0) {
        const query = `fields=display&show=true&genre=${chosenHobby.genre[0]}&level=5`
        const { err, res } = await getAllHobbies(query)
        console.log({ res })
        if (!err) {
          setGenres(res.data.hobbies)
        }
      }
    }
    fetchGenres()
  }, [hobbies, post])

  if (!_id || !post) {
    return <div>Loading...</div>
  }

  const handleFormSubmit = async () => {
    setSubmitBtnLoading(true)
    await updatePostFunc()
  }

   
  

  return (
    <>
      <div className={`${styles['modal-wrapper']}`} ref={modalRef}>
        <header className={styles['header']}>
          <h4 className={styles['heading']}>Edit Post</h4>
          <CloseIcon
            className={styles['modal-close-icon']}
            onClick={handleClose}
          />
        </header>

        <hr className={styles['modal-hr']} />

                <section className={styles['body']}>
                    {/* Row 1 */}
                    <div className={styles['input-row']} >
                        <div className={styles['input-box-wrapper']}>
                            <label className={styles['label']} style={{
                                marginTop: '8px',
                                marginBottom:'4px'
                            }}>Content <span className={styles['required-star']}>*</span></label>
                            <CustomEditor
                                value={post?.content}
                                onChange={(value: any) => {
                                    setPost((prev: any) => {
                                        return { ...prev, content: value }
                                    })
                                }}
                                setData={setPost}
                                data={post}
                                image={true}
                            />
                        </div>
                    </div>

          {/* Row 2 */}
          <div className={styles['input-row']}>
            <div className={styles['input-box-wrapper']}>
              <label htmlFor="hobby-url" className={styles['label']}>
                Visibility
              </label>
              <input
                id="hobby-url"
                type="text"
                placeholder="The name that will come up in the searchbox"
                className={styles['input-box-element']}
                required
              />
            </div>

            <div>
              <label htmlFor="level" className={styles['label']}>
                Published <span className={styles['required-star']}>*</span>
              </label>
              <div>
                <select
                  id="level"
                  className={`${styles['input-box-element']} ${styles['input-box-element-small']}`}
                  required
                >
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
            </div>
          </div>

          {/* Row 3 */}
          <div className={styles['input-row']}>
            <div className={styles['input-box-wrapper']}>
              <label htmlFor="category" className={styles['label']}>
                Hobby
              </label>
              {/* <input
                                id="category"
                                type="text"
                                className={styles['input-box-element']}
                                required
                            /> */}
              <select
                id="sub-category"
                className={`${styles['input-box-element']}`}
                required
              >
                <option value={post?._hobby?.display}>
                  {post?._hobby?.display}
                </option>
                {hobbies
                  .filter(
                    (item) =>
                      item.display &&
                      item.display !== '' &&
                      item.display !== post?._hobby?.display,
                  )
                  .map((item) => (
                    <option key={item._id} value={item.display}>
                      {item.display}
                    </option>
                  ))}
              </select>
            </div>
            <div className={styles['input-box-wrapper']}>
              <label htmlFor="sub-category" className={styles['label']}>
                Genre
              </label>
              <select
                id="sub-category"
                className={`${styles['input-box-element']} ${styles['sub-category']}`}
                required
              >
                {genres.map((item) => (
                  <option key={item._id} value={item.display}>
                    {item.display}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        <div className={styles.auditFields}>
            <Link
                    href={`/profile/${post?._author?.profile_url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    >
              <div className={styles.auditField}>
              
                <span className={styles.label}>Created By:</span>
                   
                    <span className={styles.value}>{post?._author.full_name || "N/A"}</span>
                  
              </div>
              </Link>
              <div className={styles.auditField}>
                <span className={styles.label}>Created At:</span>
                <span className={styles.value}>
                {post?.createdAt ? 
                  (() => {
                      const date = new Date(post?.createdAt);
                      const options = { year: 'numeric' as const, month: 'short' as const, day: 'numeric' as const, hour: 'numeric' as const, minute: 'numeric' as const, hour12: true };
                      const formattedDate = new Intl.DateTimeFormat('en-US', options).format(date);
                      const [monthDay, year, time] = formattedDate.split(', ');
                      return `${year} ${monthDay}, ${time}`;
                  })() 
                  : "N/A"
                }
                </span>
                
              </div>
              <Link
                    href={`/profile/admin`}
                    target="_blank"
                    rel="noopener noreferrer"
                    >
              <div className={styles.auditField}>
             
                <span className={styles.label}>Updated By:</span>
                
                    <span className={styles.value}>{post?.updatedBy || ""}</span>
                    
                {/* <span className={styles.value}></span> */}
              </div>
              </Link>
              <div className={styles.auditField}>
                <span className={styles.label}>Updated At:</span>
                <span className={styles.value}>
                {post?.updatedAt ? 
                  (() => {
                      const date = new Date(post?.updatedAt);
                      const options = { year: 'numeric' as const, month: 'short' as const, day: 'numeric' as const, hour: 'numeric' as const, minute: 'numeric' as const, hour12: true };
                      const formattedDate = new Intl.DateTimeFormat('en-US', options).format(date);
                      const [monthDay, year, time] = formattedDate.split(', ');
                      return `${year} ${monthDay}, ${time}`;
                  })() 
                  : "N/A"
                }
                </span>
              </div>
            </div>

        <footer className={styles['footer']}>
          <button
            className="modal-footer-btn submit"
            style={{ backgroundColor: '#0096C8' }}
            onClick={handleFormSubmit}
            disabled={submitBtnLoading}
          >
            {submitBtnLoading ? (
              <CircularProgress color="inherit" size="24px" />
            ) : (
              'Save'
            )}
          </button>
        </footer>
      </div>

      <CustomSnackbar
        message={snackbar?.message}
        triggerOpen={snackbar?.display}
        type={snackbar.type === 'success' ? 'success' : 'error'}
        closeSnackbar={() => {
          setSnackbar((prevValue) => ({ ...prevValue, display: false }))
        }}
      />
    </>
  )
}

export default EditPostModal
