import {
  addUserHobby,
  deleteUserHobby,
  getMyProfileDetail,
  updateMyProfileDetail,
  updateUserHobbyLevel,
} from '@/services/user.service'
import { CircularProgress, useMediaQuery } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import styles from './styles.module.css'

import CloseIcon from '@/assets/icons/CloseIcon'
import NextIcon from '@/assets/svg/Next.svg'
import CheckIcon from '@/assets/svg/Check.svg'
import BackIcon from '@/assets/svg/Previous.svg'
import hobbyLvlOne from '@/assets/svg/hobby_level_One.svg'
import hobbyLvlThree from '@/assets/svg/hobby_level_Three.svg'
import hobbyLvlTwo from '@/assets/svg/hobby_level_Two.svg'
import addhobby from '@/assets/svg/addhobby.svg'
import { closeModal, openModal } from '@/redux/slices/modal'
import { updateUser } from '@/redux/slices/user'
import { RootState } from '@/redux/store'
import { getAllHobbies } from '@/services/hobby.service'
import { isEmptyField } from '@/utils'
import { FormControl, MenuItem, Select } from '@mui/material'
import Image from 'next/image'
import { useDispatch, useSelector } from 'react-redux'
import SaveModal from '../../SaveModal/saveModal'
import DropdownMenu from '@/components/DropdownMenu'
import { useRouter } from 'next/router'
import AddHobby from '../../AddHobby/AddHobbyModal'
import CustomSnackbar from '@/components/CustomSnackbar/CustomSnackbar'
import AddGenre from '../../AddGenre/AddGenreModal'

type Props = {
  onComplete?: () => void
  onBackBtnClick?: () => void
  confirmationModal?: boolean
  setConfirmationModal?: any
  handleClosee?: any
  handleClose?: any
  isError?: boolean
  onStatusChange?: (isChanged: boolean) => void
  showAddGenreModal?: boolean
  showAddHobbyModal?: boolean
  setShowAddGenreModal?: any
  setShowAddHobbyModal?: any
}
const levels = ['Beginner', 'Intermediate', 'Advanced']
// const levels = {
//   BEGINNER: 1,
//   INTERMEDIATE: 2,
//   ADVANCED: 3,
// }

type ProfileHobbyData = {
  hobby: DropdownListItem | null
  genre: DropdownListItem | null
  level: 1 | 2 | 3
}
type DropdownListItem = {
  _id: string
  display: string
  sub_category?: string
  genre?: any
}

type Snackbar = {
  triggerOpen: boolean
  message: string
  type: 'error' | 'success'
  closeSnackbar?: () => void
}

const ProfileHobbyEditModal: React.FC<Props> = ({
  onComplete,
  onBackBtnClick,
  confirmationModal,
  setConfirmationModal,
  handleClosee,
  handleClose,
  onStatusChange,
  showAddGenreModal,
  showAddHobbyModal,
  setShowAddGenreModal,
  setShowAddHobbyModal,
}) => {
  const dispatch = useDispatch()
  const [showModal, setShowModal] = useState(false)
  const hobbyDropdownRef = useRef<HTMLDivElement>(null)
  const genreDropdownRef = useRef<HTMLDivElement>(null)
  const { user } = useSelector((state: RootState) => state.user)
  const searchref = useRef<HTMLInputElement>(null)
  const [addHobbyBtnLoading, setAddHobbyBtnLoading] = useState<boolean>(false)
  const [submitBtnLoading, setSubmitBtnLoading] = useState<boolean>(false)
  const [nextDisabled, setNextDisabled] = useState(false)
  const [errorOrmsg, setErrorOrmsg] = useState<string | null>(null)

  const [data, setData] = useState<ProfileHobbyData>({
    hobby: null,
    genre: null,
    level: 1,
  })
  const [showHobbyDowpdown, setShowHobbyDowpdown] = useState<boolean>(false)
  const [showGenreDowpdown, setShowGenreDowpdown] = useState<boolean>(false)
  const [isError, setIsError] = useState(false)
  const [HobbyError, setHobbyError] = useState(false)
  const [focusedHobbyIndex, setFocusedHobbyIndex] = useState<number>(-1)
  const [focusedGenreIndex, setFocusedGenreIndex] = useState<number>(-1)
  const [hobbyInputValue, setHobbyInputValue] = useState('')
  const [genreid, setGenreId] = useState('')
  const [genreInputValue, setGenreInputValue] = useState('')
  const [userHobbies, setUserHobbies]: any = useState([])
  const [hobbyDropdownList, setHobbyDropdownList] = useState<
    DropdownListItem[]
  >([])
  const [genreDropdownList, setGenreDropdownList] = useState<
    DropdownListItem[]
  >([])
  const genreInputRef = useRef<HTMLInputElement>(null)
  const levels = [
    { name: 'Beginner', src: hobbyLvlOne },
    { name: 'Intermediate', src: hobbyLvlTwo },
    { name: 'Advanced', src: hobbyLvlThree },
  ]

  const [initialData, setInitialData] = useState<never[]>([])
  const [isChanged, setIsChanged] = useState(false)
  const [isChangeadded, setIsChangeadded] = useState(false)
  const router = useRouter()
  const [showSnackbar, setShowSnackbar] = useState<Snackbar>({
    triggerOpen: false,
    message: '',
    type: 'success' || 'error',
  })

  const handleHobbyInputChange = async (e: any) => {
    setHobbyInputValue(e.target.value)
    setGenreInputValue('')
    setGenreDropdownList([])
    setGenreId('')
    setHobbyError(false)
    setErrorOrmsg(null)

    setData((prev) => {
      return { ...prev, hobby: null }
    })

    if (isEmptyField(e.target.value)) {
      setHobbyDropdownList([])
      setFocusedHobbyIndex(-1)
      return
    }

    const query = `fields=display,genre&level=3&level=2&level=1&level=0&show=true&search=${e.target.value}`
    const { err, res } = await getAllHobbies(query)

    if (err) return console.log(err)

    // Modify the sorting logic to prioritize items where the search keyword appears at the beginning
    const sortedHobbies = res.data.hobbies.sort((a: any, b: any) => {
      const indexA = a.display
        .toLowerCase()
        .indexOf(e.target.value.toLowerCase())
      const indexB = b.display
        .toLowerCase()
        .indexOf(e.target.value.toLowerCase())

      if (indexA === 0 && indexB !== 0) {
        return -1
      } else if (indexB === 0 && indexA !== 0) {
        return 1
      }

      // Otherwise, use default sorting behavior
      return 0
    })

    setHobbyDropdownList(sortedHobbies)

    setFocusedHobbyIndex(-1)
  }

  const handleHobbyKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (hobbyDropdownList.length === 0) return

    switch (e.key) {
      case 'ArrowDown':
        setFocusedHobbyIndex((prevIndex) =>
          prevIndex < hobbyDropdownList.length - 1 ? prevIndex + 1 : prevIndex,
        )
        break
      case 'ArrowUp':
        setFocusedHobbyIndex((prevIndex) =>
          prevIndex > 0 ? prevIndex - 1 : prevIndex,
        )
        break
      case 'Enter':
        if (focusedHobbyIndex !== -1) {
          handleHobbySelection(hobbyDropdownList[focusedHobbyIndex])
          setShowHobbyDowpdown(false)
        }
        break
      default:
        break
    }
  }

  const handleGenreInputChange = async (e: any) => {
    setGenreInputValue(e.target.value)

    setData((prev) => {
      return { ...prev, genre: null }
    })
    if (isEmptyField(e.target.value)) return setGenreDropdownList([])
    const query = `fields=display&show=true&genre=${genreid}&level=5`

    const { err, res } = await getAllHobbies(query)
    if (err) return console.log(err)

    const sortedGenres = res.data.hobbies.sort((a: any, b: any) => {
      const indexA = a.display
        .toLowerCase()
        .indexOf(e.target.value.toLowerCase())
      const indexB = b.display
        .toLowerCase()
        .indexOf(e.target.value.toLowerCase())

      if (indexA === 0 && indexB !== 0) {
        return -1
      } else if (indexB === 0 && indexA !== 0) {
        return 1
      }

      return 0
    })

    setGenreDropdownList(sortedGenres)
  }

  const handleGenreKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (genreDropdownList.length === 0) return

    switch (e.key) {
      case 'ArrowDown':
        setFocusedGenreIndex((prevIndex) =>
          prevIndex < genreDropdownList.length - 1 ? prevIndex + 1 : prevIndex,
        )
        break
      case 'ArrowUp':
        setFocusedGenreIndex((prevIndex) =>
          prevIndex > 0 ? prevIndex - 1 : prevIndex,
        )
        break
      case 'Enter':
        if (focusedGenreIndex !== -1) {
          setData((prevValue) => ({
            ...prevValue,
            genre: genreDropdownList[focusedGenreIndex],
          }))
          setShowGenreDowpdown(false)
          setGenreInputValue(genreDropdownList[focusedGenreIndex]?.display)
        }
        break
      default:
        break
    }
  }

  const handleHobbySelection = async (selectedHobby: DropdownListItem) => {
    setShowGenreDowpdown(false)
    setGenreId('')
    console.log(selectedHobby)

    setData((prev) => ({ ...prev, hobby: selectedHobby }))
    setHobbyInputValue(selectedHobby.display)

    if (selectedHobby.genre && selectedHobby.genre.length > 0) {
      setGenreId(selectedHobby.genre[0])

      const query = `fields=display&show=true&genre=${selectedHobby.genre[0]}&level=5`
      const { err, res } = await getAllHobbies(query)

      if (!err) {
        setGenreDropdownList(res.data.hobbies)
        setShowGenreDowpdown(true)
        genreInputRef.current?.focus()
      } else {
      }
    }
  }

  const handleAddHobby = () => {
    setHobbyError(false)
    setErrorOrmsg(null)
    setShowGenreDowpdown(false)

    let selectedHobby = null
    let selectedGenre = null

    // Handle hobby input
    if (!data.hobby) {
      const matchedHobby = hobbyDropdownList.find(
        (hobby) =>
          hobby.display.toLowerCase() === hobbyInputValue.toLowerCase(),
      )

      if (!hobbyInputValue.trim()) {
        setErrorOrmsg('Please enter a hobby')
        setHobbyError(true)
        searchref.current?.focus()
        return
      }

      if (matchedHobby) {
        selectedHobby = matchedHobby
        setErrorOrmsg('hobby added Successfully!')
      } else {
        setShowAddHobbyModal(true)
        return
      }
    } else {
      selectedHobby = data.hobby
    }

    // Handle genre input
    if (!data.genre) {
      const matchedGenre = genreDropdownList.find(
        (genre) =>
          genre.display.toLowerCase() === genreInputValue.toLowerCase(),
      )

      if (selectedGenre !== null && selectedGenre !== matchedGenre) {
        setErrorOrmsg('Typed Genre not found!')
        setHobbyError(true)
        return
      }
      if (selectedGenre !== null && !matchedGenre) {
        setErrorOrmsg("This hobby doesn't contain this genre")

        return
      }
    }
    if (genreInputValue.length > 0) {
      const matchedGenre = genreDropdownList.find(
        (genre) =>
          genre.display.toLowerCase() === genreInputValue.toLowerCase(),
      )
      if (!matchedGenre) {
        setShowAddGenreModal(true)
        return
      } else {
        selectedGenre = data.genre
      }
    } else {
      selectedGenre = data.genre
    }

    setAddHobbyBtnLoading(true)

    let jsonData = {
      hobby: selectedHobby?._id,
      genre: selectedGenre?._id,
      level: data.level,
    }
    console.log({ userHobbies })
    const sameAsPrevious = userHobbies?.find(
      (obj: any) =>
        obj.hobby?._id === jsonData.hobby && jsonData.genre === obj.genre?._id,
    )
    if (sameAsPrevious) {
      setHobbyError(true)
      setErrorOrmsg('Same hobby detected in the hobbies list')
      setAddHobbyBtnLoading(false)
      return
    }
    addUserHobby(jsonData, async (err, res) => {
      console.log('json', jsonData)
      console.log('Button clicked!')
      if (err) {
        setAddHobbyBtnLoading(false)
        return console.log(err)
      }
      else{
        setErrorOrmsg('Hobby added successfully!')
      }
      const { err: updtProfileErr, res: updtProfileRes } =
        await updateMyProfileDetail({ is_onboarded: true })
      const { err: error, res: response } = await getMyProfileDetail()
      setAddHobbyBtnLoading(false)
      if (error) return console.log(error)

      if (response?.data.success) {
        const { is_onboarded } = user
        dispatch(updateUser({ ...response?.data.data.user, is_onboarded }))
        setHobbyInputValue('')
        setGenreInputValue('')
        setData({ level: 1, hobby: null, genre: null })
      }
    })
  }

  const handleSubmit = async () => {
    setSubmitBtnLoading(true)
    setHobbyError(false)
    setErrorOrmsg(null)
    setShowGenreDowpdown(false)
    let isOnboarded = false
    if (hobbyInputValue) {
      let selectedHobby = null
      let selectedGenre = null

      // Handle hobby input
      if (!data.hobby) {
        const matchedHobby = hobbyDropdownList.find(
          (hobby) =>
            hobby.display.toLowerCase() === hobbyInputValue.toLowerCase(),
        )

        if (!hobbyInputValue.trim()) {
          if (userHobbies.length > 0) {
            window.location.reload()
            handleClose()
            return
          } else {
            setErrorOrmsg('Add atleast one hobby!')
            setHobbyError(true)
            searchref.current?.focus()
            setHobbyInputValue('')
            return
          }
        }

        if (matchedHobby) {
          selectedHobby = matchedHobby
        } else {
          // setErrorOrmsg('Typed hobby not found!')
          // searchref.current?.focus()
          // setHobbyError(true)
          setShowAddHobbyModal(true)
          return
        }
      } else {
        selectedHobby = data.hobby
      }

      // Handle genre input
      if (!data.genre) {
        const matchedGenre = genreDropdownList.find(
          (genre) =>
            genre.display.toLowerCase() === genreInputValue.toLowerCase(),
        )

        if (selectedGenre !== null && selectedGenre !== matchedGenre) {
          // setErrorOrmsg('Typed Genre not found!')
          // setHobbyError(true)
          setShowAddGenreModal(true)
          return
        }
        if (selectedGenre !== null && !matchedGenre) {
          // setErrorOrmsg("This hobby doesn't contain this genre")
          // setHobbyError(true)
          setShowAddGenreModal(true)
          return
        }
      } else {
        selectedGenre = data.genre
      }

      setAddHobbyBtnLoading(true)

      let jsonData = {
        hobby: selectedHobby?._id,
        genre: selectedGenre?._id,
        level: data.level,
      }
      const sameAsPrevious = userHobbies?.find(
        (obj: any) =>
          obj?.hobby?._id === jsonData.hobby &&
          obj?.genre?._id === jsonData.genre,
      )
      if (sameAsPrevious) {
        setHobbyError(true)
        setErrorOrmsg('Same hobby detected in the hobbies list')

        setAddHobbyBtnLoading(false)
        setSubmitBtnLoading(false)
        return
      }
      const { err: updtProfileErr, res: updtProfileRes } =
        await updateMyProfileDetail({ is_onboarded: true })

      await addUserHobby(jsonData, async (err, res) => {
        console.log('json', jsonData)
        if (err) {
          setAddHobbyBtnLoading(false)
          setSubmitBtnLoading(false)
          return console.log(err)
        }

        const { err: error, res: response } = await getMyProfileDetail()
        if (error) return console.log(error)
        setAddHobbyBtnLoading(false)
        setSubmitBtnLoading(false)

        if (response?.data.success) {
          if (onComplete !== undefined) {
            isOnboarded = true
            onComplete()
            setAddHobbyBtnLoading(false)
            setSubmitBtnLoading(false)
            return
          }
          dispatch(updateUser(response?.data.data.user))
          handleClose()
          window.location.reload()
          setAddHobbyBtnLoading(false)
          setSubmitBtnLoading(false)
          return
        }
      })
    }

    if (userHobbies.length === 0 && !isOnboarded) {
      setErrorOrmsg('Add atleast one hobby!')
      setHobbyError(true)
      searchref.current?.focus()
      return
    }
    if (onComplete !== undefined) {
      onComplete()
    } else {
      window.location.reload()
      dispatch(closeModal())
    }
  }

  const handleDeleteHobby = async (id: string) => {
    const { err, res } = await deleteUserHobby(id)

    if (err) {
      return console.log(err)
    }

    const { err: error, res: response } = await getMyProfileDetail()

    if (error) return console.log(error)
    if (response?.data.success) {
      dispatch(updateUser(response?.data.data.user))
      setErrorOrmsg('hobby deleted Successfully!')
    }
  }

  useEffect(() => {
    if (!user._hobbies) {
      // setNextDisabled(true)
    } else if (user._hobbies.length === 0) {
      // setNextDisabled(true)
    } else {
      setNextDisabled(false)
    }
  }, [user])

  useEffect(() => {
    setUserHobbies(user._hobbies)
  }, [user._hobbies])

  useEffect(() => {
    // To show exit save modal
    let hasChanges = false
    if (hobbyInputValue !== '') {
      hasChanges = true
      setIsChanged(hasChanges)
    } else {
      hasChanges = false
      setIsChanged(hasChanges)
    }

    // To reload the page
    const hasChangesadded =
      JSON.stringify(userHobbies) !== JSON.stringify(initialData)
    setIsChangeadded(hasChangesadded)

    if (onStatusChange) {
      if (isChanged || hasChangesadded) onStatusChange(true)
    }
  }, [userHobbies, onStatusChange, hobbyInputValue])

  useEffect(() => {
    setInitialData(user._hobbies)
  }, [user.display])

  const handleLevelChange = async (_id: any, level: string) => {
    let temp = userHobbies.map((item: any) => {
      if (item?._id === _id) {
        return { ...item, level }
      } else {
        return item
      }
    })

    setUserHobbies(temp)

    const { err, res } = await updateUserHobbyLevel(_id, { level })
    if (err) return console.log(err)
    console.log('hobby updated-', res?.data)

    setShowModal(true)
  }

  const HandleSaveError = async () => {
    if (userHobbies.length === 0) {
      setIsError(true)
    }
  }
  useEffect(() => {
    console.warn(data)
  }, [data])
  useEffect(() => {
    if (confirmationModal) {
      HandleSaveError()
    }
  }, [confirmationModal])

  useEffect(() => {
    if (isError) {
      const timer = setTimeout(() => {
        setIsError(false)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [isError])

  const nextButtonRef = useRef<HTMLButtonElement | null>(null)
  useEffect(() => {
    const handleKeyPress = (event: any) => {
      if (event.key === 'Enter') {
        nextButtonRef.current?.focus()
      }
    }
    searchref.current?.focus()
    window.addEventListener('keydown', handleKeyPress)

    return () => {
      window.removeEventListener('keydown', handleKeyPress)
    }
  }, [])

  useEffect(() => {
    // Update the scroll position of the dropdown when the selected option changes
    const dropdown = hobbyDropdownRef.current
    const selectedOption = document.getElementById(
      `option-h-${focusedHobbyIndex}`,
    )

    if (dropdown && selectedOption) {
      const dropdownRect = dropdown.getBoundingClientRect()
      const selectedOptionRect = selectedOption.getBoundingClientRect()

      // Check if the selected option is below the visible area
      if (selectedOptionRect.bottom > dropdownRect.bottom) {
        dropdown.scrollTop += selectedOptionRect.bottom - dropdownRect.bottom
      }

      // Check if the selected option is above the visible area
      if (selectedOptionRect.top < dropdownRect.top) {
        dropdown.scrollTop -= dropdownRect.top - selectedOptionRect.top
      }
    }
  }, [focusedHobbyIndex])

  useEffect(() => {
    // Update the scroll position of the dropdown when the selected option changes
    const dropdown = genreDropdownRef.current
    const selectedOption = document.getElementById(
      `option-g-${focusedGenreIndex}`,
    )

    if (dropdown && selectedOption) {
      const dropdownRect = dropdown.getBoundingClientRect()
      const selectedOptionRect = selectedOption.getBoundingClientRect()

      // Check if the selected option is below the visible area
      if (selectedOptionRect.bottom > dropdownRect.bottom) {
        dropdown.scrollTop += selectedOptionRect.bottom - dropdownRect.bottom
      }

      // Check if the selected option is above the visible area
      if (selectedOptionRect.top < dropdownRect.top) {
        dropdown.scrollTop -= dropdownRect.top - selectedOptionRect.top
      }
    }
  }, [focusedGenreIndex])

  const isMobile = useMediaQuery('(max-width:1100px)')

  const hobbyDropDownWrapperRef = useRef<HTMLDivElement>(null)
  const handleOutsideClick = (event: MouseEvent) => {
    if (
      hobbyDropDownWrapperRef.current &&
      !hobbyDropDownWrapperRef.current.contains(event.target as Node)
    ) {
      setShowHobbyDowpdown(false)
    }
  }
  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick)

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
    }
  }, [])

  console.log({ data })

  if (showAddHobbyModal) {
    return (
      <>
        {/* {genreInputValue.length === 0 ? ( */}
        <AddHobby
          handleClose={() => {
            setShowAddHobbyModal(false)
          }}
          handleSubmit={() => {
            setShowSnackbar({
              message: 'This feature is under development',
              triggerOpen: true,
              type: 'success',
            })
          }}
          propData={{ defaultValue: hobbyInputValue }}
        />
        {/* ) : ( */}
        {/* )} */}
        <CustomSnackbar
          message={showSnackbar.message}
          type={showSnackbar.type}
          triggerOpen={showSnackbar.triggerOpen}
          closeSnackbar={() => {
            setShowSnackbar({
              message: '',
              triggerOpen: false,
              type: 'success',
            })
          }}
        />
      </>
    )
  }

  if (showAddGenreModal) {
    return (
      <>
        <AddGenre
          handleClose={() => {
            setShowAddGenreModal(false)
          }}
          handleSubmit={() => {
            setShowSnackbar({
              message: 'This feature is under development',
              triggerOpen: true,
              type: 'success',
            })
          }}
          propData={{ defaultValue: genreInputValue }}
        />
        <CustomSnackbar
          message={showSnackbar.message}
          type={showSnackbar.type}
          triggerOpen={showSnackbar.triggerOpen}
          closeSnackbar={() => {
            setShowSnackbar({
              message: '',
              triggerOpen: false,
              type: 'success',
            })
          }}
        />
      </>
    )
  }

  if (confirmationModal) {
    return (
      <SaveModal
        handleClose={handleClosee}
        handleSubmit={handleSubmit}
        setConfirmationModal={setConfirmationModal}
        isError={isError}
        hasChange={isChanged}
        reloadrouter={isChangeadded}
      />
    )
  }

  return (
    <>
      <div className={styles['modal-wrapper']}>
        <CloseIcon
          className={styles['modal-close-icon']}
          onClick={handleClosee}
        />
        {/* Modal Header */}
        <header className={styles['header']}>
          <h4 className={styles['heading']}>{'Hobbies'}</h4>
        </header>

        <hr className={styles['modal-hr']} />

        <section className={`${styles['body']} custom-scrollbar`}>
          <>
            <section className={styles['add-hobbies-wrapper']}>
              <section className={styles['added-hobby-list']}>
                <table>
                  <thead>
                    <tr>
                      <td>Hobby - Genre/Style</td>
                      <td>Level</td>
                      <td className={styles.hideActionMobile}>Action</td>
                    </tr>
                  </thead>
                  <tbody style={{ display: 'inline-table' }}>
                    {userHobbies?.map((hobby: any) => {
                      return (
                        <tr key={hobby._id}>
                          <td>
                            <div>
                              {`${hobby?.hobby?.display}${
                                hobby?.genre?.display
                                  ? ' - ' + hobby?.genre?.display
                                  : ''
                              }`}
                            </div>
                          </td>

                          <td>
                            {/* {hobby.level === 1
                              ? 'Beginner'
                              : hobby.level === 2
                              ? 'Intermediate'
                              : hobby.level === 3
                              ? 'Advanced'
                              : ''} */}
                            <Select
                              value={hobby?.level}
                              className={styles['hobby-dropdown']}
                              onChange={(e) => {
                                let val: any = e?.target?.value
                                handleLevelChange(hobby?._id, val)
                              }}
                              sx={{
                                boxShadow: 'none',
                                '.MuiOutlinedInput-notchedOutline': {
                                  border: 0,
                                  outline: 'none',
                                },
                              }}
                              displayEmpty
                              renderValue={(selected) => (
                                <div className={styles?.levelwithtext}>
                                  <Image
                                    alt={`hobby${selected}`}
                                    src={levels[selected - 1]?.src}
                                  />
                                  <p className={styles['render-p']}>
                                    {levels[selected - 1]?.name}
                                  </p>
                                </div>
                              )}
                            >
                              {levels?.map((item, idx) => (
                                <MenuItem
                                  key={idx}
                                  value={idx + 1}
                                  style={{ padding: '8px 0px' }}
                                >
                                  <div className={styles.levelwithtext}>
                                    <Image
                                      alt={`hobby${idx + 1}`}
                                      src={item?.src}
                                    />
                                    <p>{item?.name}</p>
                                  </div>
                                </MenuItem>
                              ))}
                            </Select>
                          </td>
                          <td>
                            <svg
                              tabIndex={0}
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              className={styles['delete-hobby-btn']}
                              onClick={() => handleDeleteHobby(hobby._id)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  handleDeleteHobby(hobby._id)
                                }
                              }}
                            >
                              <g clip-path="url(#clip0_173_49175)">
                                <path
                                  d="M6.137 19C6.137 20.1 7.00002 21 8.05481 21H15.726C16.7808 21 17.6439 20.1 17.6439 19V7H6.137V19ZM18.6028 4H15.2466L14.2877 3H9.49317L8.53427 4H5.1781V6H18.6028V4Z"
                                  fill="#8064A2"
                                />
                              </g>
                              <defs>
                                <clipPath id="clip0_173_49175">
                                  <rect
                                    width="23.0137"
                                    height="24"
                                    fill="white"
                                    transform="translate(0.383545)"
                                  />
                                </clipPath>
                              </defs>
                            </svg>
                          </td>
                        </tr>
                      )
                    })}

                    <tr>
                      <td className={styles.AddHobbyFields}>
                        {/* Hobby Input and Dropdown */}
                        <div>
                          <div
                            ref={hobbyDropDownWrapperRef}
                            className={styles['dropdown-wrapper']}
                          >
                            <div
                              className={`${styles['input-box']} ${
                                HobbyError ? styles['input-box-error'] : ''
                              }`}
                            >
                              <input
                                type="text"
                                placeholder="Search hobby..."
                                autoComplete="name"
                                required
                                value={hobbyInputValue}
                                onFocus={() => setShowHobbyDowpdown(true)}
                                onBlur={() =>
                                  setTimeout(() => {
                                    if (!isMobile) setShowHobbyDowpdown(false)
                                  }, 300)
                                }
                                ref={searchref}
                                onChange={handleHobbyInputChange}
                                onKeyDown={handleHobbyKeyDown}
                              />
                            </div>
                            {showHobbyDowpdown &&
                              hobbyDropdownList.length !== 0 && (
                                <div
                                  className={`custom-scrollbar ${
                                    styles['dropdown']
                                  } ${
                                    userHobbies.length > 4
                                      ? styles['dropdown-upwards']
                                      : styles['dropdown-downwords']
                                  }`}
                                  ref={hobbyDropdownRef}
                                >
                                  {hobbyDropdownList.map((hobby, index) => (
                                    <p
                                      id={`option-h-${index}`}
                                      key={hobby._id}
                                      onClick={() => {
                                        handleHobbySelection(hobby)
                                        setShowHobbyDowpdown(false)
                                      }}
                                      className={
                                        index === focusedHobbyIndex
                                          ? styles['dropdown-option-focus']
                                          : ''
                                      }
                                    >
                                      {hobby.display}
                                    </p>
                                  ))}
                                </div>
                              )}
                          </div>

                          <div className={styles['dropdown-wrapper']}>
                            <div className={styles['input-box']}>
                              <input
                                ref={genreInputRef}
                                type="text"
                                placeholder="Genre/Style"
                                autoComplete="name"
                                required
                                value={genreInputValue}
                                onFocus={() => setShowGenreDowpdown(true)}
                                onBlur={() =>
                                  setTimeout(() => {
                                    setShowGenreDowpdown(false)
                                  }, 300)
                                }
                                onChange={handleGenreInputChange}
                                onKeyDown={handleGenreKeyDown}
                              />
                              {/* <p className={styles['helper-text']}>{inputErrs.full_name}</p> */}
                            </div>
                            {showGenreDowpdown &&
                              genreDropdownList.length !== 0 && (
                                <div
                                  className={`custom-scrollbar ${
                                    styles['dropdown']
                                  } ${
                                    userHobbies.length > 4
                                      ? styles['dropdown-upwards']
                                      : styles['dropdown-downwords']
                                  }`}
                                  ref={genreDropdownRef}
                                >
                                  {genreDropdownList.map((genre, index) => {
                                    return (
                                      <p
                                        id={`option-g-${index}`}
                                        key={genre?._id}
                                        onClick={() => {
                                          setData((prev) => {
                                            return { ...prev, genre: genre }
                                          })
                                          setGenreInputValue(genre?.display)
                                          setShowGenreDowpdown(false)
                                        }}
                                        className={
                                          index === focusedGenreIndex
                                            ? styles['dropdown-option-focus']
                                            : ''
                                        }
                                      >
                                        {genre?.display}
                                      </p>
                                    )
                                  })}
                                </div>
                              )}
                          </div>
                        </div>
                      </td>
                      <td>
                        {/* <FormControl
                          variant="outlined"
                          size="small"
                          sx={{ width: '150px' }}
                        >
                          <Select
                            className={styles['select-level-main']}
                            value={data.level}
                            onChange={(e) => {
                              setData((prev: any) => {
                                return { ...prev, level: e?.target?.value }
                              })
                            }}
                            displayEmpty
                            inputProps={{ 'aria-label': ' label' }}
                          >
                            <MenuItem
                              className={styles['levelwithtext-add']}
                              value={1}
                            >
                              <Image alt="hobbyOne" src={hobbyLvlOne}></Image>
                              <span className={styles.lvltext}>Beginner</span>
                            </MenuItem>
                            <MenuItem
                              value={2}
                              className={styles['levelwithtext-add']}
                            >
                              <Image alt="hobbyTwo" src={hobbyLvlTwo}></Image>
                              <span className={styles.lvltext}>
                                Intermediate
                              </span>
                            </MenuItem>
                            <MenuItem
                              value={3}
                              className={styles['levelwithtext-add']}
                            >
                              <Image
                                alt="hobbyThree"
                                src={hobbyLvlThree}
                              ></Image>
                              <span className={styles.lvltext}>Advanced</span>
                            </MenuItem>
                          </Select>
                        </FormControl> */}
                        <DropdownMenu
                          value={
                            <div
                              style={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                gap: '8px',
                              }}
                            >
                              <Image
                                src={levels[data.level - 1]?.src.src}
                                width={17}
                                height={17}
                                alt=""
                              />
                              <p
                                style={{
                                  fontWeight: '600',
                                  color: '#6d747a',
                                  fontSize: '14px',
                                }}
                                className={`${styles['display-desktop']} ${styles['new-hobby-level-dropdown']}`}
                              >
                                {levels[data.level - 1]?.name}
                              </p>
                            </div>
                          }
                          options={levels.map((item) => item.name)}
                          iconOptions={levels.map((item) => item.src?.src)}
                          onOptionClick={(e: any) => {
                            setData((prev: any) => {
                              return { ...prev, level: parseInt(e?.id) + 1 }
                            })
                          }}
                          dropdownHeaderClass={
                            styles['new-hobby-level-dropdown-header']
                          }
                          valueIndex={data?.level - 1}
                          dropdownIcon
                        />
                      </td>

                      <td>
                        <button
                          disabled={addHobbyBtnLoading}
                          className={styles['add-btn']}
                          onClick={handleAddHobby}
                        >
                          {addHobbyBtnLoading ? (
                            <CircularProgress color="inherit" size={'22px'} />
                          ) : (
                            <Image src={addhobby} alt="add hobby"></Image>
                          )}
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <p
                  className={
                    HobbyError
                      ? styles['helper-text']
                      : styles['helper-text-green']
                  }
                >
                  {errorOrmsg}
                </p>
              </section>
            </section>
          </>
        </section>

        <footer className={styles['footer']}>
          {Boolean(onBackBtnClick) && (
            <>
              <button
                className="modal-footer-btn cancel"
                onClick={onBackBtnClick ? onBackBtnClick : handleClose}
              >
                Back
              </button>
              {/* SVG Button for Mobile */}
              <div onClick={onBackBtnClick ? onBackBtnClick : handleClose}>
                <Image
                  src={BackIcon}
                  alt="Back"
                  className="modal-mob-btn cancel"
                />
              </div>
            </>
          )}

          <button
            ref={nextButtonRef}
            className="modal-footer-btn submit"
            tabIndex={0}
            onClick={handleSubmit}
            disabled={submitBtnLoading ? submitBtnLoading : nextDisabled}
          >
            {submitBtnLoading ? (
              <CircularProgress color="inherit" size={'24px'} />
            ) : onComplete ? (
              'Finish'
            ) : (
              'Save'
            )}
          </button>
          {/* SVG Button for Mobile */}
          {onComplete ? (
            <div onClick={handleSubmit}>
              <Image
                src={CheckIcon}
                alt="back"
                className="modal-mob-btn cancel"
              />
            </div>
          ) : (
            <button
              ref={nextButtonRef}
              className="modal-mob-btn-save"
              onClick={handleSubmit}
              disabled={submitBtnLoading ? submitBtnLoading : nextDisabled}
            >
              Save
            </button>
          )}
        </footer>
      </div>
    </>
  )
}

export default ProfileHobbyEditModal
