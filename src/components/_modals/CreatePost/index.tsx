import React, { useEffect, useState } from 'react'
import styles from './CreatePost.module.css'
import dynamic from 'next/dynamic'

import Image from 'next/image'
import store, { RootState } from '@/redux/store'
import { useSelector } from 'react-redux'
import { checkIfUrlExists, isEmptyField } from '@/utils'
import { getAllHobbies } from '@/services/hobby.service'
import {
  createListingPost,
  createUserPost,
  uploadImage,
} from '@/services/post.service'
import { closeModal } from '@/redux/slices/modal'

import DOMPurify from 'dompurify'
import CreatePostProfileSwitcher from './ProfileSwitcher'

const CustomEditor = dynamic(() => import('@/components/CustomEditor'), {
  ssr: false,
  loading: () => <h1>Loading...</h1>,
})

type Props = {}

type DropdownListItem = {
  _id: string
  display: string
  sub_category?: string
}

type NewPostData = {
  type: 'user' | 'listing'
  data: any
  hobby: DropdownListItem | null
  genre: DropdownListItem | null
  content: string
  contentToDisplay: string
  visibility: string
  media: []
  video_url: any
}
export const CreatePost: React.FC<Props> = (props) => {
  const { user, activeProfile } = useSelector((state: RootState) => state.user)

  const [data, setData] = useState<NewPostData>({
    type: 'user',
    data: null,
    hobby: null,
    genre: null,
    content: '',
    contentToDisplay: '',
    visibility: 'public',
    media: [],
    video_url: '',
  })
  const [submitBtnLoading, setSubmitBtnLoading] = useState<boolean>(false)

  const [showHobbyDropdown, setShowHobbyDropdown] = useState<boolean>(false)
  const [showGenreDropdown, setShowGenreDropdown] = useState<boolean>(false)

  const [hobbyInputValue, setHobbyInputValue] = useState('')
  const [genreInputValue, setGenreInputValue] = useState('')
  const [hasLink, setHasLink] = useState(false)

  const [hobbyDropdownList, setHobbyDropdownList] = useState<
    DropdownListItem[]
  >([])
  const [genreDropdownList, setGenreDropdownList] = useState<
    DropdownListItem[]
  >([])

  useEffect(() => {
    const isUrl = checkIfUrlExists(data.content.replace(/<img .*?>/g, ''))
    setHasLink(isUrl)
    // console.log(data.content)
    // console.log({ isUrl })
  }, [data.content])
  
  // useEffect(() => {
  //   let imgStrs = ``
  //   data.media.map((item: any) => {
  //     imgStrs += `<img src="${item}" />`
  //   })
  //   let content = `${data.content} <div style="display:flex" > ${imgStrs} </div>`
  //   setData((prev: any) => ({ ...prev, content: content }))
  // }, [data.media])

  // useEffect(() => {
  //   let videoStr = `<video width="320" height="240" controls>
  //   <source src=${data.video_url} type="video/mp4" />
  // </video>`
  //   let content = `${data.content} ${videoStr}`
  //   setData((prev: any) => ({ ...prev, content: content }))
  // }, [data.video_url])

  const handleHobbyInputChange = async (e: any) => {
    setHobbyInputValue(e.target.value)

    setData((prev) => {
      return { ...prev, hobb: null }
    })
    if (isEmptyField(e.target.value)) return setHobbyDropdownList([])
    const query = `fields=display,sub_category&show=true&search=${e.target.value}`
    const { err, res } = await getAllHobbies(query)
    if (err) return console.log(err)
    setHobbyDropdownList(res.data.hobbies)
    setGenreDropdownList(res.data.hobbies)
  }

  const handleGenreInputChange = async (e: any) => {
    setGenreInputValue(e.target.value)

    setData((prev) => {
      return { ...prev, genre: null }
    })
    if (isEmptyField(e.target.value)) return setGenreDropdownList([])
    const query = `fields=display&show=true&search=${e.target.value}`

    const { err, res } = await getAllHobbies(query)
    if (err) return console.log(err)
    setGenreDropdownList(res.data.hobbies)
  }

  const handleSubmit = async () => {
    if (!data.hobby) return
    const jsonData: any = {
      hobbyId: data.hobby?._id,
      genreId: data.genre?._id,
      content: DOMPurify.sanitize(data.content),
      visibility: data.visibility,
      media: data.media,
      has_link: hasLink,
      video_url: data.video_url ? data.video_url : null,
    }
    setSubmitBtnLoading(true)

    if (data.type === 'listing') {
      jsonData.listingId = data.data._id
      const { err, res } = await createListingPost(jsonData)
      setSubmitBtnLoading(false)
      if (err) {
        return console.log(err)
      }
      if (res.data.success) {
        // store.dispatch(closeModal())
        // window.location.reload()
      }
      return
    }

    const { err, res } = await createUserPost(jsonData)
    setSubmitBtnLoading(false)
    if (err) {
      return console.log(err)
    }
    if (res.data.success) {
      console.log('res', res)
    }
  }

  useEffect(() => {
    setData((prev: any) => {
      return { ...prev, type: activeProfile.type, data: activeProfile.data }
    })
  }, [])

  return (
    <div className={styles['modal-wrapper']}>
      <h3 className={styles['modal-heading']}>Create Post</h3>
      <div className={styles['create-post-modal']}>
        <section className={styles['editor-container']}>
          <CustomEditor
            value=""
            onChange={(value) => {
              setData((prev) => {
                return { ...prev, content: value }
              })
            }}
            setData={setData}
            data={data}
            image={true}
          />
          {data.video_url && (
            <video width="320" height="180" controls>
              <source src={data.video_url} type="video/mp4" />
            </video>
          )}
          {data.media?.length > 0 ? (
            <div className={styles.imgContainer}>
              {data?.media?.map((item: any, idx) => {
                return <img key={idx} src={item} alt="" />
              })}
            </div>
          ) : (
            <></>
          )}
        </section>
        <aside>
          <div>
            <label>Posting As</label>
            <CreatePostProfileSwitcher data={data} setData={setData} />
          </div>

          {/* Hobby Input and Dropdown */}
          <section className={styles['dropdown-wrapper']}>
            <div className={styles['input-box']}>
              <label>Hobby</label>
              <input
                type="text"
                placeholder="Search hobby..."
                autoComplete="name"
                required
                value={hobbyInputValue}
                onFocus={() => setShowHobbyDropdown(true)}
                onBlur={() =>
                  setTimeout(() => {
                    setShowHobbyDropdown(false)
                  }, 300)
                }
                onChange={handleHobbyInputChange}
              />
              {/* <p className={styles['helper-text']}>{inputErrs.full_name}</p> */}
            </div>
            {showHobbyDropdown && hobbyDropdownList.length !== 0 && (
              <div className={styles['dropdown']}>
                {hobbyDropdownList.map((hobby) => {
                  return (
                    <p
                      key={hobby._id}
                      onClick={() => {
                        setData((prev) => {
                          return { ...prev, hobby: hobby }
                        })
                        setHobbyInputValue(hobby.display)
                      }}
                    >
                      {hobby.display}
                    </p>
                  )
                })}
              </div>
            )}
          </section>

          {/* Genre Input and Dropdown */}
          <section className={styles['dropdown-wrapper']}>
            <div className={styles['input-box']}>
              <label>Genre/Style</label>

              <input
                type="text"
                placeholder="Search genre/style..."
                autoComplete="name"
                value={genreInputValue}
                onFocus={() => setShowGenreDropdown(true)}
                onBlur={() =>
                  setTimeout(() => {
                    setShowGenreDropdown(false)
                  }, 300)
                }
                onChange={handleGenreInputChange}
              />
              {/* <p className={styles['helper-text']}>{inputErrs.full_name}</p> */}
            </div>
            {showGenreDropdown && genreDropdownList.length !== 0 && (
              <div className={styles['dropdown']}>
                {genreDropdownList.map((genre) => {
                  return (
                    <p
                      key={genre?._id}
                      onClick={() => {
                        setData((prev) => {
                          return { ...prev, genre: genre }
                        })
                        setGenreInputValue(genre?.display)
                      }}
                    >
                      {genre?.display}
                    </p>
                  )
                })}
              </div>
            )}
          </section>

          <div>
            <label>Who Can View</label>
            <section className={` ${styles['who-can-view']}`}>
              <p className={styles['name']}>Everyone</p>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clip-path="url(#clip0_25_51286)">
                  <path
                    d="M15.88 9.29055L12 13.1705L8.11998 9.29055C7.72998 8.90055 7.09998 8.90055 6.70998 9.29055C6.31998 9.68055 6.31998 10.3105 6.70998 10.7005L11.3 15.2905C11.69 15.6805 12.32 15.6805 12.71 15.2905L17.3 10.7005C17.69 10.3105 17.69 9.68055 17.3 9.29055C16.91 8.91055 16.27 8.90055 15.88 9.29055Z"
                    fill="#08090A"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_25_51286">
                    <rect width="24" height="24" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </section>
          </div>

          <button
            disabled={submitBtnLoading}
            onClick={handleSubmit}
            className={styles['create-post-btn']}
          >
            Post
          </button>
        </aside>
      </div>
    </div>
  )
}
