import {
  addUserHobby,
  deleteUserHobby,
  getMyProfileDetail,
  updateMyProfileDetail,
  updateUserHobbyLevel,
  updateUserpreferences,
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
import { showProfileError, updateUser } from '@/redux/slices/user'
import { RootState } from '@/redux/store'
import {
  SendHobbyRequest,
  getAllHobbies,
  getAllHobbiesWithoutPagi,
} from '@/services/hobby.service'
import { isEmptyField } from '@/utils'
import { FormControl, MenuItem, Select } from '@mui/material'
import Image from 'next/image'
import { useDispatch, useSelector } from 'react-redux'
import SaveModal from '../../SaveModal/saveModal'
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
  CheckIsOnboarded?: any
  propData?: {
    hobbyAndGenre?: boolean
    selectedGenreToAdd?: {
      _id: string
      display: string
      level: number
      show: boolean
      sub_category: any
      genre: any
    }
    selectedHobbyToAdd?: {
      _id: string
      display: string
      level: number
      show: boolean
      sub_category: any
      genre: any
    }
  }
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
  CheckIsOnboarded,
  propData,
}) => {
  const dispatch = useDispatch()
  const selectedHobbyToAdd = propData && propData?.selectedHobbyToAdd
  const [showModal, setShowModal] = useState(false)
  const hobbyDropdownRef = useRef<HTMLDivElement>(null)
  const genreDropdownRef = useRef<HTMLDivElement>(null)
  const selectLevelRef = useRef<HTMLSelectElement>(null)
  const bodyRef = useRef<HTMLElement>(null)
  const { user } = useSelector((state: RootState) => state.user)
  const searchref = useRef<HTMLInputElement>(null)
  const [addHobbyBtnLoading, setAddHobbyBtnLoading] = useState<boolean>(false)
  const [submitBtnLoading, setSubmitBtnLoading] = useState<boolean>(false)
  const [nextDisabled, setNextDisabled] = useState(false)
  const [errorOrmsg, setErrorOrmsg] = useState<string | null>(null)
  console.warn('selectwwdhobb', propData)
  const [data, setData] = useState<ProfileHobbyData>({
    hobby: null,
    genre: null,
    level: 1,
  })
  const [showHobbyDowpdown, setShowHobbyDowpdown] = useState<boolean>(false)
  const [showGenreDowpdown, setShowGenreDowpdown] = useState<boolean>(false)
  console.warn({ showGenreDowpdown })

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
  const [allHobbiesList, setAllHobbiesList] = useState<DropdownListItem[]>([])
  const [allGenreList, setAllGenreList] = useState<DropdownListItem[]>([])
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
    type: 'success',
  })

  const handleGenreInputFocus = () => {
    setShowGenreDowpdown(true)
    const query = `fields=display,genre&level=3&level=2&level=1&level=0&show=true&search=${hobbyInputValue}`
    getAllHobbies(query).then((result) => {
      const sortedHobbies = result.res.data.hobbies.sort((a: any, b: any) => {
        const indexA = a.display
          ?.toLowerCase()
          .indexOf(hobbyInputValue.toLowerCase())
        const indexB = b.display
          ?.toLowerCase()
          .indexOf(hobbyInputValue.toLowerCase())

        if (indexA === 0 && indexB !== 0) {
          return -1
        } else if (indexB === 0 && indexA !== 0) {
          return 1
        }

        return a.display.toLowerCase().localeCompare(b.display.toLowerCase())
      })
      const selectedHobby = sortedHobbies[0]
      handleHobbySelection(selectedHobby)
    })
  }
  const handleHobbyInputChange = async (e: any) => {
    setShowHobbyDowpdown(true)
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
    const query2 = `fields=display,genre&level=5&level=4&level=3&level=2&level=1&level=0&search=${e.target.value}`
    const { err, res } = await getAllHobbies(query)
    const { err: err2, res: res2 } = await getAllHobbiesWithoutPagi(query2)
    if (err) return console.log(err)
    if (err2) return console.log(err2)

    let sortedHobbies = res.data.hobbies
    let allHobbies = res2.data.hobbies

    if (e.target.value.toLowerCase() === 'sing') {
      // Prioritize "vocal music" at the top
      sortedHobbies = sortedHobbies.sort((a: any, b: any) => {
        if (a.display.toLowerCase() === 'vocal music') return -1
        if (b.display.toLowerCase() === 'vocal music') return 1
        return a.display.toLowerCase().localeCompare(b.display.toLowerCase())
      })
    } else {
      // Sort alphabetically
      sortedHobbies = sortedHobbies.sort((a: any, b: any) => {
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

        return a.display.toLowerCase().localeCompare(b.display.toLowerCase())
      })
    }
    setAllHobbiesList(allHobbies)
    console.log('res------------>', allHobbies)
    setHobbyDropdownList(sortedHobbies)
    setFocusedHobbyIndex(-1)
  }

  const handleHobbyKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
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
        if (hobbyInputValue.length !== 0 && !showHobbyDowpdown) {
          AddButtonRef.current?.click()
        } else if (focusedHobbyIndex !== -1 && showHobbyDowpdown) {
          handleHobbySelection(hobbyDropdownList[focusedHobbyIndex]).finally(
            () => {
              setShowHobbyDowpdown(false)
            },
          )
        } else if (focusedHobbyIndex === -1 && hobbyInputValue.length !== 0) {
          setShowHobbyDowpdown(false)
          // handleGenreInputFocus();
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
    const query2 = `fields=display,show&genre=${genreid}&level=5`

    const { err, res } = await getAllHobbies(query)
    if (err) return console.log(err)
    const { err: err2, res: res2 } = await getAllHobbiesWithoutPagi(query2)
    if (err2) return console.log(err2)

    // Step 1: Filter the data based on the search query
    const filteredGenres = res.data.hobbies.filter((item: any) => {
      return item.display.toLowerCase().includes(e.target.value.toLowerCase())
    })
    const allFilteredGenres = res2.data.hobbies.filter((item: any) => {
      return item.display.toLowerCase().includes(e.target.value.toLowerCase())
    })
    // Step 2: Sort the filtered data
    const sortedGenres = filteredGenres.sort((a: any, b: any) => {
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
    setAllGenreList(allFilteredGenres)
    console.log('all----------------->', allFilteredGenres)
    setFocusedGenreIndex(-1)
  }

  const handleGenreKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showGenreDowpdown) {
      if (e.key === 'Enter') {
        AddButtonRef.current?.click()
      }
      return
    }

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
        if (genreInputValue.length !== 0 && !showGenreDowpdown) {
          setGenreInputValue(genreDropdownList[focusedGenreIndex]?.display)
        } else if (focusedGenreIndex !== -1) {
          setData((prevValue) => ({
            ...prevValue,
            genre: genreDropdownList[focusedGenreIndex],
          }))
          setShowGenreDowpdown(false)
          setGenreInputValue(genreDropdownList[focusedGenreIndex]?.display)
        } else if (genreDropdownList.length > 0) {
          setData((prevValue) => ({
            ...prevValue,
            genre: genreDropdownList[0],
          }))
          setShowGenreDowpdown(false)
          setGenreInputValue(genreDropdownList[0]?.display)
        }
        break
      default:
        break
    }
  }

  const handleHobbySelection = async (selectedHobby: DropdownListItem) => {
    setGenreId('')
    console.log(selectedHobby)

    setData((prev) => ({ ...prev, hobby: selectedHobby }))
    setHobbyInputValue(selectedHobby?.display ?? hobbyInputValue)

    if (
      selectedHobby &&
      selectedHobby.genre &&
      selectedHobby.genre.length > 0
    ) {
      setGenreId(selectedHobby.genre[0])

      const query = `fields=display&show=true&genre=${selectedHobby.genre[0]}&level=5`
      const { err, res } = await getAllHobbies(query)

      if (!err) {
        setGenreDropdownList(res.data.hobbies)
      } else {
      }
    }
  }
  const handleGenreSelection = async () => {
    if (genreDropdownList.length !== 0 && !data.genre?._id && genreInputValue) {
      setGenreInputValue(genreDropdownList[0]?.display)
      setData((prevValue) => ({
        ...prevValue,
        genre: genreDropdownList[0],
      }))
    }
  }

  const handleAddHobby = async () => {
    await handleGenreSelection()
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
        setIsChanged(true)
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
        setIsChanged(false)
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
      setErrorOrmsg('Hobby already exists in your list')
      setAddHobbyBtnLoading(false)
      return
    }
    addUserHobby(jsonData, async (err, res) => {
      if (err) {
        setAddHobbyBtnLoading(false)
        return console.log(err)
      } else {
        setErrorOrmsg('Hobby added to your list')
      }
      let updatedCompletedSteps = [...user.completed_onboarding_steps]

      if (!updatedCompletedSteps.includes('Hobby')) {
        updatedCompletedSteps.push('Hobby')
      }
      let onboarded = false
      if (user.completed_onboarding_steps.length === 3) {
        onboarded = true
      }
      const { err: updtProfileErr, res: updtProfileRes } =
        await updateMyProfileDetail({
          is_onboarded: onboarded,
          completed_onboarding_steps: updatedCompletedSteps,
        })
      const { err: error, res: response } = await getMyProfileDetail()
      setAddHobbyBtnLoading(false)
      if (error) return console.log(error)

      if (response?.data.success) {
        const { is_onboarded } = user
        dispatch(updateUser({ ...response?.data.data.user, is_onboarded }))
        setHobbyInputValue('')
        setGenreInputValue('')
        setData({ level: 1, hobby: null, genre: null })

        setAddHobbyBtnLoading(false)
      }
      setAddHobbyBtnLoading(false)
    })
    setData({ hobby: null, genre: null, level: 1 })
    setHobbyDropdownList([])
    setGenreDropdownList([])
    searchref.current?.focus()
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
            router.reload()
            handleClose()
            return
          } else {
            setErrorOrmsg('Add atleast one hobby!')
            setHobbyError(true)
            searchref.current?.focus()
            setHobbyInputValue('')
            setSubmitBtnLoading(false)
            return
          }
        }

        if (matchedHobby) {
          selectedHobby = matchedHobby
        } else {
          // setErrorOrmsg('Typed hobby not found!')
          // searchref.current?.focus()
          // setHobbyError(true)
          setSubmitBtnLoading(false)
          setShowAddHobbyModal(true)
          setIsChanged(false)
          return
        }
      } else {
        selectedHobby = data.hobby
      }

      // Handle genre input
      if (!data.genre) {
        const matchedGenre = genreDropdownList.some(
          (genre) =>
            genre.display.toLowerCase() === genreInputValue.toLowerCase(),
        )

        if (!matchedGenre && genreInputValue.trim().length !== 0) {
          // setErrorOrmsg('Typed Genre not found!')
          // setHobbyError(true)
          setShowAddGenreModal(true)
          setIsChanged(false)
          setSubmitBtnLoading(false)
          return
        }
        if (selectedGenre !== null && !matchedGenre) {
          // setErrorOrmsg("This hobby doesn't contain this genre")
          // setHobbyError(true)
          setShowAddGenreModal(true)
          setIsChanged(false)
          setSubmitBtnLoading(false)
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
      let updatedCompletedSteps = [...user.completed_onboarding_steps]

      if (!updatedCompletedSteps.includes('Hobby')) {
        updatedCompletedSteps.push('Hobby')
      }
      let onboarded = false
      if (user.completed_onboarding_steps.length === 3) {
        onboarded = true
      }
      const { err: updtProfileErr, res: updtProfileRes } =
        await updateMyProfileDetail({
          is_onboarded: onboarded,
          completed_onboarding_steps: updatedCompletedSteps,
        })

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
        dispatch(updateUser(response?.data.data.user))
        if (response?.data.success) {
          if (onComplete !== undefined) {
            isOnboarded = true
            onComplete()
            setAddHobbyBtnLoading(false)
            setSubmitBtnLoading(false)
            return
          }
          if (!user.is_onboarded) {
            const { err: error, res: response } = await getMyProfileDetail()
            if (
              response?.data?.data?.user?.completed_onboarding_steps.length == 3
            ) {
              const data = { is_onboarded: true }
              const { err, res } = await updateMyProfileDetail(data)
              router.push(`/community`)
            } else {
              dispatch(closeModal())
              router.push(`/profile/${response?.data?.data?.user?.profile_url}`)
              dispatch(showProfileError(true))
            }
            return
          } else {
            if (user.is_onboarded) {
              router.push(`/community`)
            }
            router.reload()

            dispatch(closeModal())
            return
          }
        }
      })
    }

    if (userHobbies.length === 0 && !isOnboarded) {
      setErrorOrmsg('Add atleast one hobby!')
      setHobbyError(true)
      setSubmitBtnLoading(false)
      searchref.current?.focus()
      return
    }
    if (!user.is_onboarded) {
      const { err: error, res: response } = await getMyProfileDetail()
      if (response?.data?.data?.user?.completed_onboarding_steps.length == 3) {
        const data = { is_onboarded: true }
        const { err, res } = await updateMyProfileDetail(data)
        router.push(`/community`)
      } else {
        dispatch(closeModal())
        router.push(`/profile/${response?.data?.data?.user?.profile_url}`)
        dispatch(showProfileError(true))
      }
      return
    } else {
      if (!user.is_onboarded) {
        router.push(`/profile/${user?.profile_url}`)
        dispatch(showProfileError(true))
      } else {
        router.reload()
        dispatch(closeModal())
      }
      return
    }
  }

  const updatePreference = async (preferences: any) => {
    try {
      const { res, err } = await updateUserpreferences({ preferences })
      if (err) {
        console.error('Error updating preferences:', err)
      } else {
        console.log('Preferences updated successfully:', res.data)
        const user = await getMyProfileDetail()
        dispatch(updateUser(user.res?.data?.data.user))
        //window.location.reload();
      }
    } catch (error) {
      console.error('Unexpected error:', error)
    }
  }

  const handleDeleteHobby = async (id: string, hobby: any, index: number) => {
    if (
      hobby.hobby._id ===
        user?.preferences?.create_post_pref?.preferred_hobby?.hobby?._id &&
      (hobby.genre?.id
        ? hobby.genre?.id ===
          user?.preferences?.create_post_pref?.preferred_hobby?.genre?._id
        : true)
    ) {
      const indexToUse = index === 0 ? 1 : 0
      const updatedPreferences = {
        community_view: {
          preferred_hobby: {
            hobby:
              user.preferences.community_view.preferred_hobby?.hobby?._id ||
              null,
            genre:
              user.preferences.community_view.preferred_hobby?.genre?._id ||
              null,
          },
          preferred_location:
            user?.preferences.community_view.preferred_location?._id ||
            'All locations',
        },
        create_post_pref: {
          preferred_hobby: {
            hobby: user._hobbies[indexToUse]?.hobby?._id,
            genre: user._hobbies[indexToUse]?.genre?._id || null,
          },
          preferred_location:
            user.preferences.create_post_pref.preferred_location?._id ||
            'All locations',
        },
        location_visibility: user.preferences.location_visibility || 'My City',
        email_visibility: user.preferences.email_visibility || 'No one',
        phone_visibility: user.preferences.phone_visibility || 'No one',
      }
      updatePreference(updatedPreferences)
    }

    const { err, res } = await deleteUserHobby(id)

    if (err) {
      return console.log(err)
    }

    const { err: error, res: response } = await getMyProfileDetail()

    if (error) return console.log(error)
    if (response?.data.success) {
      dispatch(updateUser(response?.data.data.user))
      setErrorOrmsg('Hobby removed from your list')
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
  const AddButtonRef = useRef<HTMLButtonElement | null>(null)
  useEffect(() => {
    const handleKeyPress = (event: any) => {
      // if (event.key === 'Enter') {
      //   console.log({showHobbyDowpdown,showGenreDowpdown})
      //   if(showHobbyDowpdown===false&&showGenreDowpdown===false){
      //     nextButtonRef.current?.click()
      //   }else{
      //     nextButtonRef.current?.focus()
      //   }
      // }
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
  }, [])

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
  const genreDropDownWrapperRef = useRef<HTMLDivElement>(null)
  const handleOutsideClick = (event: MouseEvent) => {
    if (
      hobbyDropDownWrapperRef.current &&
      !hobbyDropDownWrapperRef.current.contains(event.target as Node)
    ) {
      setShowHobbyDowpdown(false)
    }
    if (
      genreDropDownWrapperRef.current &&
      !genreDropDownWrapperRef.current.contains(event.target as Node)
    ) {
      setShowGenreDowpdown(false)
    }
  }
  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick)

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
    }
  }, [])
  useEffect(() => {
    // setData((prev)=>{
    //   if(selectedHobbyToAdd && selectedHobbyToAdd?.level>=5){
    //     return {...prev,genre:selectedHobbyToAdd}
    //   }else if (selectedHobbyToAdd && selectedHobbyToAdd?.level<5){
    //     return {...prev,hobby:selectedHobbyToAdd}
    //   }
    //   return {...prev}
    // })
    const AddToMine = async () => {
      if (
        selectedHobbyToAdd &&
        selectedHobbyToAdd?.level >= 5 &&
        !propData?.hobbyAndGenre
      ) {
        if (selectedHobbyToAdd.show === true) {
          setData((prev) => ({ ...prev, genre: selectedHobbyToAdd }))
          setData((prev) => ({
            ...prev,
            hobby: selectedHobbyToAdd?.sub_category,
          }))
        }
        if (
          selectedHobbyToAdd &&
          selectedHobbyToAdd.genre &&
          selectedHobbyToAdd.genre.length > 0
        ) {
          setGenreId(selectedHobbyToAdd.genre[0])

          const query = `fields=display&show=true&genre=${selectedHobbyToAdd.genre[0]}&level=5`
          const { err, res } = await getAllHobbies(query)

          if (!err) {
            setGenreDropdownList(res.data.hobbies)
          }
        }

        setHobbyInputValue(selectedHobbyToAdd?.sub_category?.display)
        setGenreInputValue(selectedHobbyToAdd.display)
        handleGenreInputChange
      } else if (
        selectedHobbyToAdd &&
        selectedHobbyToAdd?.level < 5 &&
        !propData?.hobbyAndGenre
      ) {
        if (selectedHobbyToAdd.show === true) {
          setData((prev) => ({ ...prev, hobby: selectedHobbyToAdd }))
        }
        setHobbyInputValue(selectedHobbyToAdd.display)
      } else if (propData?.hobbyAndGenre) {
        setData((prev) => ({ ...prev, hobby: selectedHobbyToAdd || null }))
        setData((prev) => ({
          ...prev,
          genre: propData.selectedGenreToAdd || null,
        }))
        setGenreId(selectedHobbyToAdd?.genre[0])
        setHobbyInputValue(selectedHobbyToAdd?.display || '')
        setGenreInputValue(propData?.selectedGenreToAdd?.display || '')
      }
    }
    AddToMine()
  }, [selectedHobbyToAdd])

  useEffect(() => {
    const timer = setTimeout(() => {
      if (bodyRef.current) {
        bodyRef.current.scrollTop = bodyRef.current.scrollHeight
      }
    }, 10)
    return () => clearTimeout(timer)
  }, [hobbyInputValue])

  console.log({ data, isChanged })

  if (showAddHobbyModal) {
    return (
      <>
        <AddHobby
          handleClose={() => {
            setShowAddHobbyModal(false)
          }}
          handleSubmit={() => async () => {
            let jsonData = {
              user_id: user._id,
              user_type: 'user',
              hobby: hobbyInputValue,
              level: 'Hobby',
            }
            const { err, res } = await SendHobbyRequest(jsonData)
            if (res?.data.success) {
              setShowAddHobbyModal(false)
              setErrorOrmsg(
                `<strong>${hobbyInputValue}</strong> has been requested.  You can add it later once approved.`,
              )
              setHobbyInputValue('')
              setGenreInputValue('')
            } else if (err) {
              setShowSnackbar({
                triggerOpen: true,
                type: 'error',
                message: 'Something went wrong',
              })
              console.log(err)
            }
          }}
          propData={{ defaultValue: hobbyInputValue }}
          selectedHobbyText={
            selectedHobbyToAdd &&
            selectedHobbyToAdd?.show === false &&
            selectedHobbyToAdd.display === hobbyInputValue
              ? selectedHobbyToAdd.display
              : undefined
          }
          existsButNotEnabled={allHobbiesList.length > 0}
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
          handleSubmit={() => async () => {
            let jsonData = {
              user_id: user._id,
              user_type: 'user',
              hobby: genreInputValue,
              level: 'Genre',
            }
            const { err, res } = await SendHobbyRequest(jsonData)
            if (res?.data.success) {
              setShowAddGenreModal(false)
              setErrorOrmsg(
                `<strong>${hobbyInputValue} - ${genreInputValue}</strong> has been requested. You can add it later if approved.`,
              )
              setHobbyInputValue('')
              setGenreInputValue('')
            } else if (err) {
              setShowSnackbar({
                triggerOpen: true,
                type: 'error',
                message: 'Something went wrong',
              })
              console.log(err)
            }
          }}
          propData={{ defaultValue: genreInputValue }}
          HobbyValue={{ defaultValue: hobbyInputValue }}
          existsButNotEnabled={allGenreList.length > 0}
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
          onClick={handleClose}
        />
        {/* Modal Header */}
        <header className={styles['header']}>
          <h4 className={styles['heading']}>{'Hobbies and Interests'}</h4>
        </header>

        <hr className={styles['modal-hr']} />

        <section ref={bodyRef} className={`${styles['body']}`}>
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
                    {userHobbies?.map((hobby: any, index: number) => {
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
                              MenuProps={{
                                anchorOrigin: {
                                  vertical: 'top',
                                  horizontal: 'center',
                                },
                                transformOrigin: {
                                  vertical: isMobile
                                    ? userHobbies?.length > 5
                                      ? 'bottom'
                                      : 'top'
                                    : userHobbies?.length > 8
                                    ? 'bottom'
                                    : 'top',
                                  horizontal: 'center',
                                },
                              }}
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
                              onClick={() =>
                                handleDeleteHobby(hobby._id, hobby, index)
                              }
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  handleDeleteHobby(hobby._id, hobby, index)
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
                                autoComplete="new"
                                placeholder="Search hobby..."
                                required
                                value={hobbyInputValue}
                                onFocus={() => setShowHobbyDowpdown(true)}
                                // onBlur={() =>
                                //   setTimeout(() => {
                                //     if (!isMobile) setShowHobbyDowpdown(false)
                                //   }, 300)
                                // }
                                ref={searchref}
                                onChange={handleHobbyInputChange}
                                onKeyDown={handleHobbyKeyDown}
                              />
                            </div>
                            {showHobbyDowpdown &&
                              hobbyDropdownList.length !== 0 && (
                                <div
                                  className={`${styles['dropdown']} ${
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

                          <div
                            className={styles['dropdown-wrapper']}
                            ref={genreDropDownWrapperRef}
                          >
                            <div className={styles['input-box']}>
                              <input
                                ref={genreInputRef}
                                type="text"
                                autoComplete="new"
                                placeholder="Genre/Style"
                                required
                                value={genreInputValue}
                                onFocus={() => {
                                  setShowGenreDowpdown(true)
                                  if (
                                    genreDropdownList.length === 0 &&
                                    hobbyInputValue.length !== 0 &&
                                    data.hobby === null
                                  ) {
                                    handleGenreInputFocus()
                                  }
                                }}
                                // onBlur={() =>
                                //   setTimeout(() => {
                                //     handleGenreSelection()
                                //     setShowGenreDowpdown(false)
                                //   }, 300)
                                // }
                                onChange={handleGenreInputChange}
                                onKeyDown={handleGenreKeyDown}
                              />
                              {/* <p className={styles['helper-text']}>{inputErrs.full_name}</p> */}
                            </div>
                            {showGenreDowpdown &&
                              genreDropdownList.length !== 0 && (
                                <div
                                  className={` ${styles['dropdown']} ${
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
                        <Select
                          ref={selectLevelRef}
                          value={levels[data.level - 1]?.name}
                          className={styles['hobby-dropdown']}
                          MenuProps={{
                            anchorOrigin: {
                              vertical: 'top',
                              horizontal: 'center',
                            },
                            transformOrigin: {
                              vertical: isMobile
                                ? userHobbies?.length > 5
                                  ? 'bottom'
                                  : 'top'
                                : userHobbies?.length > 8
                                ? 'bottom'
                                : 'top',
                              horizontal: 'center',
                            },
                          }}
                          onChange={(e) => {
                            console.log({ e })
                            let val: any = e?.target?.value
                            setData((prev: any) => {
                              return { ...prev, level: parseInt(val) }
                            })
                          }}
                          sx={{
                            boxShadow: 'none',
                            '.MuiOutlinedInput-notchedOutline': {
                              border: 0,
                              outline: 'none',
                            },
                          }}
                          displayEmpty
                          renderValue={(selected: any) => (
                            <div className={styles?.levelwithtext}>
                              <Image
                                alt={`hobby${selected}`}
                                src={levels[data.level - 1]?.src}
                              />
                              <p className={styles['render-p']}>
                                {levels[data.level - 1]?.name}
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
                        <button
                          ref={AddButtonRef}
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
                  dangerouslySetInnerHTML={{
                    __html: errorOrmsg ? errorOrmsg : '',
                  }}
                >
                  {/* {errorOrmsg} */}
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
