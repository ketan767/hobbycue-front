import React, { useEffect, useRef, useState } from 'react'
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
// import CancelBtn from '@/assets/svg/trash-icon.svg'
import CancelBtn from '@/assets/icons/x-icon.svg'
import FilledButton from '@/components/_buttons/FilledButton'
import { DropdownOption } from './Dropdown/DropdownOption'
import InputSelect from '@/components/_formElements/Select/Select'

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
    visibility: 'Everyone',
    media: [],
    video_url: '',
  })
  const [submitBtnLoading, setSubmitBtnLoading] = useState<boolean>(false)

  const [errors, setErrors] = useState({
    content: '',
    genre: '',
    hobby: '',
  })

  const [showHobbyDropdown, setShowHobbyDropdown] = useState<boolean>(false)
  const [showGenreDropdown, setShowGenreDropdown] = useState<boolean>(false)

  const [hobbyInputValue, setHobbyInputValue] = useState('')
  const [genreInputValue, setGenreInputValue] = useState('')
  const [hasLink, setHasLink] = useState(false)

  const hobbyRef = useRef<HTMLInputElement>(null)
  const genreRef = useRef<HTMLInputElement>(null)

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
  }, [data.content])

  useEffect(() => {
    if (user._addresses) {
      if (user._addresses?.length > 0) {
        const address = user._addresses[0]
        // let visibilityArr: any = ['public']
        let visibilityArr: any = [
          {
            value: 'Everyone',
            display: 'Everyone',
            type: 'text',
          },
        ]
        let obj: any = {
          type: 'dropdown',
          value: 'Home',
          display: 'Home',
          options: [],
          _id: address._id,
          active: false,
        }
        visibilityArr.push(obj)
        if (address.state) {
          obj.display = `${address.city} - Home`
        }
        if (address.pin_code) {
          obj.options.push({
            value: address.pin_code,
            display: `Pin Code ${address.pin_code}`,
          })
        }
        if (address.locality) {
          obj.options.push({
            value: address.locality,
            display: `${address.locality}`,
          })
        }
        if (address.society) {
          obj.options.push({
            value: address.society,
            display: `${address.society}`,
          })
        }
        // console.log('address', address)
        // console.log('visibilityArr', visibilityArr)
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
    if (data.content === '' || data.content === '<p><br></p>') {
      console.log(data.content)
      return setErrors({
        ...errors,
        content: 'This field is required',
      })
    }
    if (!data.hobby) {
      hobbyRef.current?.focus()
      return setErrors({
        ...errors,
        hobby: 'This field is required',
      })
    }
    const jsonData: any = {
      hobbyId: data.hobby,
      genreId: data.genre ? data.genre : '',
      content: DOMPurify.sanitize(data.content),
      visibility: data.visibility,
      media: data.media,
      has_link: hasLink,
      video_url: data.video_url ? data.video_url : null,
    }
    console.log('jsonData', jsonData.hobbyId)
    console.log('jsonData genreId', jsonData.genreId)
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
    setErrors({
      content: '',
      genre: '',
      hobby: '',
    })
  }, [data])

  useEffect(() => {
    setData((prev: any) => {
      return { ...prev, type: activeProfile.type, data: activeProfile.data }
    })
  }, [])

  const removeMedia = (idxToRemove: any, key: String) => {
    if (key === 'media') {
      let tempData: any = data.media.filter(
        (item: any, idx: any) => idx !== idxToRemove,
      )
      setData((prev: any) => {
        return { ...prev, media: tempData }
      })
    } else {
      setData((prev: any) => {
        return { ...prev, video_url: '' }
      })
    }
  }

  const handleAddressChange = (value: string) => {
    setData((prev: any) => ({ ...prev, visibility: value }))
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
            error={errors.content}
          />
          {data.video_url && (
            <div className={styles.videoWrapper}>
              <div className={styles.imgContainer}>
                <video width="320" height="180" controls>
                  <source src={data.video_url} type="video/mp4" />
                </video>
                <Image
                  onClick={() => removeMedia(0, 'video_url')}
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
                  <div className={styles.imgContainer} key={idx}>
                    <img src={item} alt="" />
                    <Image
                      onClick={() => removeMedia(idx, 'media')}
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
          {/* <section className={styles['dropdown-wrapper']}>
            <div
              className={`${styles['input-box']} ${
                errors.hobby ? styles['error-input-box'] : ''
              } `}
            >
              <label>Hobby</label>
              <input
                type="text"
                placeholder="Search hobby..."
                autoComplete="name"
                required
                value={hobbyInputValue}
                ref={hobbyRef}
                onFocus={() => setShowHobbyDropdown(true)}
                onBlur={() =>
                  setTimeout(() => {
                    setShowHobbyDropdown(false)
                  }, 300)
                }
                onChange={handleHobbyInputChange}
              />
              {errors.hobby && (
                <p className={styles['error-text']}>{errors.hobby}</p>
              )}
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
          </section> */}
          {/* 
          <section className={styles['dropdown-wrapper']}>
            <div
              className={`${styles['input-box']}  ${
                errors.genre ? styles['error-input-box'] : ''
              } `}
            >
              <label>Genre/Style</label>

              <input
                type="text"
                placeholder="Search genre/style..."
                autoComplete="name"
                ref={genreRef}
                value={genreInputValue}
                onFocus={() => setShowGenreDropdown(true)}
                onBlur={() =>
                  setTimeout(() => {
                    setShowGenreDropdown(false)
                  }, 300)
                }
                onChange={handleGenreInputChange}
              />
              {errors.genre && (
                <p className={styles['error-text']}>{errors.genre}</p>
              )}
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
          </section> */}

          <div
            className={`${styles['input-box']}  ${
              errors.hobby ? styles['error-input-box'] : ''
            } `}
          >
            <label>Hobby</label>
            <Select
              value={data.hobby}
              onChange={(e) => {
                let val = e.target.value
                setData((prev: any) => ({ ...prev, hobby: val }))
              }}
              displayEmpty
              inputProps={{ 'aria-label': 'Without label' }}
              className={` ${styles['visibility-dropdown']}`}
            >
              {user._hobbies?.map((item: any, idx: any) => {
                return (
                  <MenuItem
                    key={idx}
                    value={item.hobby?._id}
                    selected={item.hobby?._id === data.hobby}
                  >
                    <p>
                      {item.hobby?.display
                        ? item.hobby?.display
                        : item.hobby?.slug}
                    </p>
                  </MenuItem>
                )
              })}
            </Select>
            {errors.hobby && (
              <p className={styles['error-text']}>{errors.hobby}</p>
            )}
          </div>

          <div
            className={`${styles['input-box']}  ${
              errors.genre ? styles['error-input-box'] : ''
            } `}
          >
            <label>Genre/Style</label>
            <Select
              value={data.genre}
              onChange={(e) => {
                let val = e.target.value
                setData((prev: any) => ({ ...prev, genre: val }))
              }}
              displayEmpty
              inputProps={{ 'aria-label': 'Without label' }}
              className={` ${styles['visibility-dropdown']}`}
            >
              {user._hobbies?.map((item: any, idx: any) => {
                return (
                  <MenuItem
                    key={idx}
                    value={item.genre?._id}
                    selected={item.genre?._id === data.genre}
                  >
                    <p>
                      {item.genre?.display
                        ? item.genre?.display
                        : item.genre?.slug}
                    </p>
                  </MenuItem>
                )
              })}
            </Select>
            {errors.genre && (
              <p className={styles['error-text']}>{errors.genre}</p>
            )}
          </div>

          <div>
            <label>Who Can View</label>

            <InputSelect
              onChange={(e: any) => {
                let val = e.target.value
                setData((prev: any) => ({ ...prev, visibility: val }))
              }}
              value={data.visibility}
              // inputProps={{ 'aria-label': 'Without label' }}
              // className={` ${styles['visibility-dropdown']}`}
            >
              {visibilityData?.map((item: any, idx) => {
                return (
                  <>
                    <DropdownOption
                      {...item}
                      key={idx}
                      currentValue={data.visibility}
                      onChange={handleAddressChange}
                    />
                  </>
                )
              })}
            </InputSelect>
          </div>

          <FilledButton
            disabled={submitBtnLoading}
            onClick={handleSubmit}
            className={styles['create-post-btn']}
            loading={submitBtnLoading}
          >
            Post
          </FilledButton>
        </aside>
      </div>
    </div>
  )
}
