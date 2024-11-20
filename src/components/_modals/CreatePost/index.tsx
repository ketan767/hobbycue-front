import React, { useEffect, useRef, useState } from 'react'
import styles from './CreatePost.module.css'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import store, { RootState } from '@/redux/store'
import { useDispatch, useSelector } from 'react-redux'
import { checkIfUrlExists, isEmptyField, isVideoLink } from '@/utils'
import { getAllHobbies } from '@/services/hobby.service'
import {
  createListingPost,
  createUserPost,
  getMetadata,
  uploadImage,
  updateListingPost,
  updateUserPost,
} from '@/services/post.service'
import { closeModal } from '@/redux/slices/modal'

import DOMPurify from 'dompurify'
import CreatePostProfileSwitcher from './ProfileSwitcher'
import {
  CircularProgress,
  Input,
  MenuItem,
  Select,
  useMediaQuery,
} from '@mui/material'
// import CancelBtn from '@/assets/svg/trash-icon.svg'
import CancelBtn from '@/assets/icons/x-icon.svg'
import FilledButton from '@/components/_buttons/FilledButton'
import { DropdownOption } from './Dropdown/DropdownOption'
import InputSelect from '@/components/_formElements/Select/Select'
import SaveModal from '../SaveModal/saveModal'
import CloseIcon from '@/assets/icons/CloseIcon'
import { useRouter } from 'next/router'
import { increaseRefreshNum, setFilters } from '@/redux/slices/post'
import MobileLocationDropdown from './MobileLocationDropdown'
import { updateActiveProfile } from '@/redux/slices/user'
import defaultImg from '@/assets/svg/default-images/default-user-icon.svg'
import CustomSnackbar from '@/components/CustomSnackbar/CustomSnackbar'
import ReactPlayer from 'react-player'

const CustomEditor = dynamic(() => import('@/components/CustomEditor'), {
  ssr: false,
  loading: () => <h1>Loading...</h1>,
})

type Props = {
  onComplete?: () => void
  onBackBtnClick?: () => void
  confirmationModal?: boolean
  setConfirmationModal?: any
  handleClose?: any
  isError?: boolean
  onStatusChange?: (isChanged: boolean) => void
  propData?: any
}

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
export const CreatePost: React.FC<Props> = ({
  onComplete,
  onBackBtnClick,
  confirmationModal,
  setConfirmationModal,
  handleClose,
  onStatusChange,
  propData,
}) => {
  console.warn('propsdata', propData)
  const router = useRouter()
  const { user, listing, activeProfile, isLoggedIn } = useSelector(
    (state: RootState) => state.user,
  )
  const dispatch = useDispatch()
  const filteredListing = listing.filter((item: any) => item.is_published)
  const { filters } = useSelector((state: RootState) => state.post)
  const [hobbies, setHobbies] = useState([])
  const [editing, setEditing] = useState(false)
  const [data, setData] = useState<NewPostData>({
    type: 'user',
    data: null,
    hobby: null,
    genre: null,
    content: propData?.defaultValue ?? '',
    contentToDisplay: '',
    visibility: 'All Locations',
    media: [],
    video_url: '',
  })
  const [showMetaData, setShowMetaData] = useState(true)
  const editBoxRef = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    if (propData && propData._hobby) {
      setData((prev) => ({
        ...prev,
        hobby: propData._hobby as DropdownListItem,
      }))
    }
    if (propData && propData._genre) {
      setData((prev) => ({
        ...prev,
        genre: propData._genre as DropdownListItem,
      }))
    }
    if (propData && propData.content) {
      setData((prev) => ({ ...prev, content: propData.content }))
    }
    if (propData && propData.visibility) {
      setData((prev) => ({ ...prev, visibility: propData.visibility }))
    }
    if (propData && propData?.media?.length !== 0) {
      setData((prev) => ({ ...prev, media: propData.media }))
    }
    if (propData && propData._id) {
      setEditing(true)
    }
  }, [propData])

  useEffect(() => {
    const hobbiesDropDownArr =
      activeProfile.data?._hobbies?.map((item: any) => ({
        hobbyId: item.hobby?._id,
        genreId: item.genre?._id ?? '', // Add genre id to the object
        hobbyDisplay: `${item.hobby?.display}`,
        genreDisplay: `${item?.genre?.display ?? ''}`,
      })) ?? []
    const selectedHobby = hobbiesDropDownArr.find((obj: any) => {
      if (filters.genre && filters.genre !== '') {
        return obj.hobbyId === filters.hobby && obj.genreId === filters.genre
      } else {
        return obj.hobbyId === filters.hobby
      }
    })
    const updateFilters = () => {
      if (propData && propData._hobby) {
        setData((prev) => ({
          ...prev,
          hobby: propData._hobby as DropdownListItem,
        }))
      }
      if (propData && propData._genre) {
        console.log(propData, 'genre')
        setData((prev) => ({
          ...prev,
          genre: propData._genre as DropdownListItem,
        }))
      }
      if (propData && propData.createdAt) {
        return
      }
      console.warn(propData, 'still running')
      setData((prev) => {
        if (selectedHobby) {
          return {
            ...prev,
            hobby: {
              _id: selectedHobby.hobbyId,
              display: selectedHobby.hobbyDisplay,
            },
            genre: {
              _id: selectedHobby.genreId,
              display: selectedHobby.genreDisplay,
            },
            visibility: filters.location ?? '',
          }
        } else {
          if (hobbiesDropDownArr && hobbiesDropDownArr?.length > 0) {
            return {
              ...prev,
              visibility: filters.location ?? 'All Locations',
              hobby: {
                _id: hobbiesDropDownArr[0]?.hobbyId,
                display: hobbiesDropDownArr[0]?.hobbyDisplay,
              },
              genre: hobbiesDropDownArr[0]?.genreId
                ? {
                    _id: hobbiesDropDownArr[0]?.genreId,
                    display: hobbiesDropDownArr[0]?.genreDisplay,
                  }
                : null,
            }
          } else {
            return { ...prev, visibility: filters.location ?? 'All Locations' }
          }
        }
      })
    }
    updateFilters()
  }, [filters, propData])

  // automatically hobby will take user's hobby[0] when profile switches

  useEffect(() => {
    const hobbiesDropDownArr =
      data.data?._hobbies?.map((item: any) => ({
        hobbyId: item.hobby?._id,
        genreId: item.genre?._id ?? '', // Add genre id to the object
        hobbyDisplay: `${item.hobby?.display}`,
        genreDisplay: `${item?.genre?.display ?? ''}`,
      })) ?? []
    const selectedHobby = hobbiesDropDownArr.find((obj: any) => {
      if (filters.genre && filters.genre !== '') {
        return obj.hobbyId === filters.hobby && obj.genreId === filters.genre
      } else {
        return obj.hobbyId === filters.hobby
      }
    })
    const updateData = () => {
      if (propData && propData._hobby) {
        console.log(propData, 'hobby')
        setData((prev) => ({
          ...prev,
          hobby: propData._hobby as DropdownListItem,
        }))
      }
      if (propData && propData._genre) {
        console.log(propData, 'genre')
        setData((prev) => ({
          ...prev,
          genre: propData._genre as DropdownListItem,
        }))
      }
      if (propData && propData.createdAt) {
        return
      }
      setData((prev) => {
        if (selectedHobby) {
          return {
            ...prev,
            hobby: {
              _id: selectedHobby.hobbyId,
              display: selectedHobby.hobbyDisplay,
            },
            genre: {
              _id: selectedHobby.genreId,
              display: selectedHobby.genreDisplay,
            },
            visibility: filters.location ?? '',
          }
        } else {
          if (hobbiesDropDownArr && hobbiesDropDownArr?.length > 0) {
            return {
              ...prev,
              visibility: filters.location ?? 'All Locations',
              hobby: {
                _id: hobbiesDropDownArr[0]?.hobbyId,
                display: hobbiesDropDownArr[0]?.hobbyDisplay,
              },
              genre: hobbiesDropDownArr[0]?.genreId
                ? {
                    _id: hobbiesDropDownArr[0]?.genreId,
                    display: hobbiesDropDownArr[0]?.genreDisplay,
                  }
                : null,
            }
          } else {
            return { ...prev, visibility: filters.location ?? 'All Locations' }
          }
        }
      })
    }
    updateData()
  }, [data.data, propData])

  useEffect(() => {
    setHobbies(activeProfile.data?._hobbies)
  }, [activeProfile])
  const [submitBtnLoading, setSubmitBtnLoading] = useState<boolean>(false)

  const [errors, setErrors] = useState({
    content: '',
    genre: '',
    hobby: '',
  })
  const [hobbyInputValue, setHobbyInputValue] = useState('')
  const [genreInputValue, setGenreInputValue] = useState('')
  const [hasLink, setHasLink] = useState(false)
  const [url, setUrl] = useState('')
  const [isError, setIsError] = useState(false)
  const [isChanged, setIsChanged] = useState(false)
  const [snackbar, setSnackbar] = useState({
    type: 'success',
    display: false,
    message: '',
  })
  const showFeatureUnderDevelopment = () => {
    setSnackbar({
      display: true,
      type: 'warning',
      message: 'This feature is under development',
    })
    setTimeout(() => {
      dispatch(closeModal())
    }, 2500)
  }
  const [metaData, setMetaData] = useState({
    title: '',
    description: '',
    image: '',
    icon: '',
    url: '',
  })
  const hobbyRef = useRef<HTMLInputElement>(null)
  const genreRef = useRef<HTMLInputElement>(null)
  const [metadataImg, setMetaDataImg] = useState('')

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
    setShowMetaData(true)
    console.warn(hasLink)
  }, [hasLink])

  useEffect(() => {
    if (hasLink) {
      const regex =
        /(http|ftp|https):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:\/~+#-]*[\w@?^=%&\/~+#-])/
      const url = data.content.match(regex)
      if (url) {
        setUrl(url[0])
      }
      if (url) {
        getMetadata(url[0])
          .then((res: any) => {
            setMetaData(res?.res?.data.data.data)
            setMetaDataImg(res?.res?.data.data.data?.image ?? '')
          })
          .catch((err) => {
            console.log(err)
          })
      }
    } else {
      setData((prevValue: any) => {
        return {
          ...prevValue,
          media: prevValue?.media?.filter((item: any) => item !== metadataImg),
        }
      })
    }
  }, [data.content, hasLink])

  useEffect(() => {
    console.log({ metaData })
  }, [metaData])

  useEffect(() => {
    if (
      data &&
      data.type === 'user' &&
      data.data &&
      data.data._addresses &&
      data.data._addresses.length > 0
    ) {
      let visibilityArr: any = [
        {
          value: 'All Locations',
          display: 'All Locations',
          type: 'text',
        },
      ]
      data.data?._addresses.map((address: any) => {
        let obj: any = {
          type: 'dropdown',
          value: 'Home',
          display: 'Home',
          options: [],
          _id: address._id,
          active: false,
        }
        visibilityArr.push(obj)
        if (address.city || address.label) {
          obj.display = `${address.city} -  ${
            address.label ? address.label : 'Default'
          } `
        }

        if (address.pin_code) {
          obj.options.push({
            value: address.pin_code,
            display: `PIN Code ${address.pin_code}`,
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
      })
      setVisibilityData(visibilityArr)
    } else if (data.type === 'listing') {
      let address = data.data?._address
      let visibilityArr: any = [
        {
          value: 'All Locations',
          display: 'All Locations',
          type: 'text',
        },
      ]
      let obj: any = {
        type: 'dropdown',
        value: 'Default',
        display: 'Default',
        options: [],
        _id: address._id,
        active: false,
      }
      visibilityArr.push(obj)
      if (address.city || address.label) {
        obj.display = `${address.city} -  ${
          address.label ? address.label : 'Default'
        } `
      }
      if (address.pin_code) {
        obj.options.push({
          value: address.pin_code,
          display: `PIN Code ${address.pin_code}`,
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
      setVisibilityData(visibilityArr)
    }
  }, [data])

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
  console.warn('alldata', data)
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
      if (editBoxRef.current) {
        editBoxRef.current.scrollTo(0, 0)
      }
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
      hobbyId: data.hobby?._id,

      content: DOMPurify.sanitize(data.content),
      visibility: data.visibility,
      media:
        // hasLink && showMetaData ? [...data.media, metadataImg] :
        data.media,
      has_link: hasLink,
      video_url: data.video_url ? data.video_url : null,
    }
    if (typeof data.genre === 'object' && typeof data.genre?._id === 'string') {
      jsonData.genreId = data.genre._id
    }

    console.log('jsonData', jsonData.hobbyId)
    console.log('jsonData genreId', jsonData.genreId)
    setSubmitBtnLoading(true)

    if (data.type === 'listing') {
      jsonData.listingId = data.data._id
      const { err, res } = editing
        ? await updateListingPost(jsonData, propData._id)
        : await createListingPost(jsonData)
      setSubmitBtnLoading(false)
      if (err) {
        return console.log(err)
      }
      if (res.data.success) {
        store.dispatch(
          setFilters({
            location: data.visibility !== '' ? data.visibility : null,
            hobby: data.hobby?._id ?? '',
            genre: data.genre?._id ?? '',
          }),
        )
        store.dispatch(
          updateActiveProfile({ type: data.type, data: data.data }),
        )
        store.dispatch(closeModal())
        // window.location.reload()
        store.dispatch(increaseRefreshNum())
        router.push('/community')
      }
      return
    }

    const { err, res } = editing
      ? await updateUserPost(jsonData, propData?._id)
      : await createUserPost(jsonData)

    setSubmitBtnLoading(false)

    if (err) {
      return console.log(err)
    }
    if (res.data.success) {
      store.dispatch(
        setFilters({
          location: data.visibility !== '' ? data.visibility : null,
          hobby: data.hobby?._id ?? '',
          genre: data.genre?._id ?? '',
        }),
      )
      store.dispatch(updateActiveProfile({ type: data.type, data: data.data }))
      store.dispatch(closeModal())
      // window.location.reload()
      store.dispatch(increaseRefreshNum())
      router.push('/community')
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

  const isMobile = useMediaQuery('(max-width:1100px)')
  if (confirmationModal) {
    return (
      <SaveModal
        handleClose={handleClose}
        handleSubmit={handleSubmit}
        setConfirmationModal={setConfirmationModal}
        isError={isError}
      />
    )
  }

  return (
    <>
      <div
        style={{width: '671px'}}
        className={`${styles['modal-wrapper']} ${
          confirmationModal ? styles['ins-active'] : ''
        } ${data.media.length && !isMobile ? styles['changedWidth'] : ''}`}
      >
        {/* Modal Header */}
        <div style={{ width:"671px" }}
          className={`${styles['modal-wrapper']} ${
            data.media.length && !isMobile ? styles['changedWidth'] : ''
          }`}
        >
          <h3 className={styles['modal-heading']}>
            {editing ? 'Update Post' : 'Create Post'}
          </h3>
          <div className={styles['create-post-modal']}>
            <div className={styles['image-posting-as']}>
              {data.type === 'user' ? (
                <img
                  className={styles['user-profile-img']}
                  src={data.data?.profile_image ?? defaultImg.src}
                  alt=""
                />
              ) : data?.data?.profile_image ? (
                <img
                  className={styles['listing-profile-img']}
                  src={data.data?.profile_image}
                  alt=""
                />
              ) : (
                <div
                  className={` ${styles['listing-profile-img']}
                    ${
                      data.data.type === 1
                        ? 'default-people-listing-icon'
                        : data.data.type === 2
                        ? 'default-place-listing-icon'
                        : data.data.type === 3
                        ? 'default-program-listing-icon'
                        : 'default-people-listing-icon'
                    }
                  `}
                ></div>
              )}

              <aside>
                <div>
                  <CreatePostProfileSwitcher
                    data={data}
                    setData={setData}
                    setHobbies={setHobbies}
                    classForShowDropdown={styles['full-width-all']}
                    className={styles['profile-switcher-parent']}
                  />
                </div>

                <div
                  className={`${styles['input-box']}  ${
                    errors.hobby ? styles['error-input-box'] : ''
                  } `}
                >
                  <InputSelect
                    value={`${data.hobby?.display ?? ''}${
                      data.genre?.display ? ' - ' : ''
                    }${data.genre?.display ?? ''}`}
                    onChange={(e: any) => {}}
                    selectText=""
                    optionsContainerClass={styles['options-container-class']}
                    optionsContainerUnactiveClass={
                      styles['optionsContainerUnactiveClass']
                    }
                    className={styles['input-select']}
                  >
                    {hobbies?.map((item: any, idx) => {
                      return (
                        <>
                          <DropdownOption
                            _id={undefined}
                            type={'hobby'}
                            display={
                              (item.hobby?.display
                                ? item.hobby?.display
                                : item.hobby?.slug) +
                              (item?.genre ? ` - ${item?.genre?.display} ` : '')
                            }
                            value={
                              item.hobby?._id + '-' + item?.genre?._id
                            }
                            options={null}
                            key={idx}
                            selected={
                              item.hobby?._id === data.hobby?._id &&
                              (data.genre
                                ? item.genre?._id === data.genre?._id
                                : item.genre
                                ? false
                                : true)
                            }
                            item={item}
                            onChange={(e: any) => {
                              // const selected = user._hobbies.find(
                              //   (item: any) => item.hobby?._id === val,
                              // )
                              setData((prev: any) => ({
                                ...prev,
                                hobby: e?.hobby ?? null,
                                genre: e?.genre ?? null,
                              }))
                            }}
                          />
                        </>
                      )
                    })}
                  </InputSelect>
                  {errors.hobby && (
                    <p className={styles['error-text']}>{errors.hobby}</p>
                  )}
                </div>

                <div>
                  {!isMobile && (
                    <InputSelect
                      onChange={(e: any) => {
                        let val = e.target.value
                        setData((prev: any) => ({ ...prev, visibility: val }))
                      }}
                      value={data.visibility}
                      className={styles['input-select']}
                      optionsContainerClass={styles['options-container-class']}
                      optionsContainerUnactiveClass={
                        styles['optionsContainerUnactiveClass']
                      }
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
                  )}

                  {isMobile && (
                    <InputSelect
                      onChange={(e: any) => {
                        let val = e.target.value
                        setData((prev: any) => ({ ...prev, visibility: val }))
                      }}
                      value={data.visibility}
                      className={styles['input-select']}
                      optionsContainerClass={styles['options-container-class']}
                      optionsContainerUnactiveClass={
                        styles['optionsContainerUnactiveClass']
                      }
                      // inputProps={{ 'aria-label': 'Without label' }}
                      // className={` ${styles['visibility-dropdown']}`}
                    >
                      {visibilityData?.map((item: any, idx: number) => {
                        return (
                          <>
                            <MobileLocationDropdown
                              key={idx}
                              {...item}
                              currentValue={data.visibility}
                              onChange={handleAddressChange}
                            />
                          </>
                        )
                      })}
                    </InputSelect>
                  )}
                </div>
              </aside>
            </div>
            <section
              className={styles['editor-container'] + ' btnOutlinePurple'}
              ref={editBoxRef}
            >
              <CustomEditor
                value={data?.content}
                onChange={(value) => {
                  setData((prev) => {
                    return { ...prev, content: value }
                  })
                }}
                setData={setData}
                data={data}
                image={true}
                error={errors.content}
                hasLink={hasLink && showMetaData}
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
                        <div>
                          <Image
                            onClick={() => removeMedia(idx, 'media')}
                            src={CancelBtn}
                            className={styles['img-cancel-icon']}
                            alt="cancel"
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <></>
              )}

              {hasLink && showMetaData && (
                <>
                  {isVideoLink(url) ? (
                    <div className={styles.videoPlayer}>
                      <ReactPlayer
                        width="100%"
                        height="410px"
                        url={url}
                        controls={true}
                      />
                    </div>
                  ) : (
                    <div className={styles['show-metadata']}>
                      <svg
                        className={styles['metadata-close-icon']}
                        onClick={() => {
                          setShowMetaData(false)
                        }}
                        width="30"
                        height="30"
                        viewBox="0 0 25 25"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle cx="12.3242" cy="12.8281" r="12" fill="white" />
                        <g clip-path="url(#clip0_11249_41681)">
                          <path
                            d="M16.5247 8.63526C16.2647 8.37526 15.8447 8.37526 15.5847 8.63526L12.3247 11.8886L9.06469 8.62859C8.80469 8.36859 8.38469 8.36859 8.12469 8.62859C7.86469 8.88859 7.86469 9.30859 8.12469 9.56859L11.3847 12.8286L8.12469 16.0886C7.86469 16.3486 7.86469 16.7686 8.12469 17.0286C8.38469 17.2886 8.80469 17.2886 9.06469 17.0286L12.3247 13.7686L15.5847 17.0286C15.8447 17.2886 16.2647 17.2886 16.5247 17.0286C16.7847 16.7686 16.7847 16.3486 16.5247 16.0886L13.2647 12.8286L16.5247 9.56859C16.778 9.31526 16.778 8.88859 16.5247 8.63526Z"
                            fill="#08090A"
                          />
                        </g>
                        <defs>
                          <clipPath id="clip0_11249_41681">
                            <rect
                              width="16"
                              height="16"
                              fill="white"
                              transform="translate(4.32422 4.82812)"
                            />
                          </clipPath>
                        </defs>
                      </svg>

                      {/* {metaData?.image && (
                    <img
                      className={styles['metadata-image']}
                      src={metaData?.image}
                      alt=""
                    />
                  )} */}
                      <div className={styles['metadata-content']}>
                        <img
                          className={styles['metadata']}
                          src={
                            (typeof metaData?.image === 'string' &&
                              metaData.image) ||
                            (typeof metaData?.icon === 'string' &&
                              metaData.icon) ||
                            defaultImg
                          }
                          alt=""
                        />

                        <div className={styles['metadata-info-container']}>
                          {metaData?.title && (
                            <p className={styles['metadata-title']}>
                              {metaData?.title}
                            </p>
                          )}
                          {!isMobile && metaData?.url && (
                            <p className={styles['metadata-url']}>
                              {metaData?.description}
                            </p>
                          )}
                        </div>
                      </div>
                      {isMobile && (
                        <p className={styles['metadata-url']}>
                          {' '}
                          {metaData?.description}{' '}
                        </p>
                      )}
                    </div>
                  )}
                </>
              )}
            </section>

            <FilledButton
              disabled={submitBtnLoading}
              onClick={handleSubmit}
              className={styles['create-post-btn']}
              loading={submitBtnLoading}
            >
              {submitBtnLoading ? (
                <CircularProgress color="inherit" size={'16px'} />
              ) : (
                'Post'
              )}
            </FilledButton>
          </div>
        </div>
      </div>
      {
        <CustomSnackbar
          message={snackbar?.message}
          triggerOpen={snackbar?.display}
          type={snackbar.type === 'success' ? 'success' : 'error'}
          closeSnackbar={() => {
            setSnackbar((prevValue) => ({ ...prevValue, display: false }))
          }}
        />
      }
    </>
  )
}
