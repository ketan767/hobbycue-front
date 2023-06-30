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
import { MenuItem, Select } from '@mui/material'
import CancelBtn from '@/assets/svg/trash-icon.svg'

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
  const [visibilityData, setVisibilityData] = useState(['public'])

  useEffect(() => {
    const isUrl = checkIfUrlExists(data.content.replace(/<img .*?>/g, ''))
    setHasLink(isUrl)
    // console.log(data.content)
    // console.log({ isUrl })
  }, [data.content])

  useEffect(() => {
    if (user._addresses) {
      if (user._addresses?.length > 0) {
        const address = user._addresses[0]
        let visibilityArr: any = ['public']
        visibilityArr.push(address.city)
        visibilityArr.push(address.country)
        visibilityArr.push(address.pin_code)
        visibilityArr.push(address.society)
        visibilityArr.push(address.state)
        setVisibilityData(visibilityArr)
      }
    }
  }, [user])
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
    const userHobbies = user._hobbies.map((item: any) => item.hobby._id)
    const userGenres = user._hobbies.map((item: any) => item.genre._id)

    let hobbies = res.data.hobbies
    let genres = res.data.hobbies
    hobbies = hobbies.filter((item: any) => userHobbies.includes(item._id))
    genres = genres.filter((item: any) => userGenres.includes(item._id))
    setHobbyDropdownList(hobbies)
    // setGenreDropdownList(genres)
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

    const userGenres = user._hobbies.map((item: any) => item.genre._id)
    let genres = res.data.hobbies
    genres = genres.filter((item: any) => userGenres.includes(item._id))
    setGenreDropdownList(genres)
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
        store.dispatch(closeModal())
        window.location.reload()
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
      store.dispatch(closeModal())
      window.location.reload()
    }
  }

  useEffect(() => {
    setData((prev: any) => {
      return { ...prev, type: activeProfile.type, data: activeProfile.data }
    })
  }, [])

  const removeMedia = (idxToRemove: any) => {
    setData((prev: any) => {
      return { ...prev, video_url: '' }
    })
  }

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
            <div className={styles.videoWrapper}>
              <div className={styles.imgContainer}>
                <video width="320" height="180" controls>
                  <source src={data.video_url} type="video/mp4" />
                </video>
                  <Image
                    onClick={() => removeMedia(0)}
                    src={CancelBtn}
                    className={styles['img-cancel-icon']}
                    alt="cancel"
                  />
              </div>
            </div>
          )}
          {data.media?.length > 0 ? (
            <div className={styles.imgWrapper}>
              {data?.media?.map((item: any, idx) => {
                return (
                  <div className={styles.imgContainer}>
                    <img key={idx} src={item} alt="" />
                    <Image
                      onClick={() => removeMedia(idx)}
                      src={CancelBtn}
                      className={styles['img-cancel-icon']}
                      alt="cancel"
                    />
                  </div>
                )
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

            <Select
              value={data.visibility}
              onChange={(e) => {
                let val = e.target.value
                setData((prev: any) => ({ ...prev, visibility: val }))
              }}
              displayEmpty
              inputProps={{ 'aria-label': 'Without label' }}
              className={` ${styles['visibility-dropdown']}`}
            >
              {visibilityData?.map((item: any, idx) => {
                return (
                  <MenuItem key={idx} value={item}>
                    <p>{item}</p>
                  </MenuItem>
                )
              })}
            </Select>
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
