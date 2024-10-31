import React, { useEffect, useState, useRef } from 'react'
import styles from './styles.module.css'
import { Button, CircularProgress, useMediaQuery } from '@mui/material'
import {
  addUserHobby,
  deleteUserHobby,
  getMyProfileDetail,
} from '@/services/user.service'

import { FormControl, MenuItem, Select, TextField } from '@mui/material'
import { SendHobbyRequest, getAllHobbies } from '@/services/hobby.service'
import { isEmptyField } from '@/utils'
import { useDispatch, useSelector } from 'react-redux'
import { updateUser } from '@/redux/slices/user'
import { RootState } from '@/redux/store'
import { closeModal, openModal } from '@/redux/slices/modal'
import { addListingHobby, deleteListingHobby } from '@/services/listing.service'
import { getListingHobbies } from '@/services/listing.service'
import SaveModal from '../../SaveModal/saveModal'
import CheckIcon from '@/assets/svg/Check.svg'
import CloseIcon from '@/assets/icons/CloseIcon'
import addhobby from '@/assets/svg/addhobby.svg'
import BackIcon from '@/assets/svg/Previous.svg'
import NextIcon from '@/assets/svg/Next.svg'
import Image from 'next/image'
import AddHobby from '../../AddHobby/AddHobbyModal'
import CustomSnackbar from '@/components/CustomSnackbar/CustomSnackbar'
import AddGenre from '../../AddGenre/AddGenreModal'
import { usePathname } from 'next/navigation'
import { listingData } from '../ListingRelated/data'

type Props = {
  onComplete?: () => void
  onBackBtnClick?: () => void
  confirmationModal?: boolean
  setConfirmationModal?: any
  handleClose?: any
  isError?: boolean
  onBoarding?: boolean
  onStatusChange?: (isChanged: boolean) => void
  showAddGenreModal?: boolean
  showAddHobbyModal?: boolean
  setShowAddGenreModal?: any
  setShowAddHobbyModal?: any
}

type DropdownListItem = {
  _id: string
  display: string
  sub_category?: string
  genre?: any
}

type ListingHobbyData = {
  hobby: DropdownListItem | null
  genre: DropdownListItem | null
}
type Snackbar = {
  triggerOpen: boolean
  message: string
  type: 'error' | 'success'
  closeSnackbar?: () => void
}

const ListingHobbyEditModal: React.FC<Props> = ({
  onComplete,
  onBackBtnClick,
  confirmationModal,
  setConfirmationModal,
  handleClose,
  onStatusChange,
  onBoarding,
  showAddGenreModal,
  showAddHobbyModal,
  setShowAddGenreModal,
  setShowAddHobbyModal,
}) => {
  const dispatch = useDispatch()
  const pathname = usePathname()

  const { user, activeProfile } = useSelector((state: RootState) => state.user)
  const { listingModalData } = useSelector((state: RootState) => state.site)

  const [hobbiesList, setHobbiesList] = useState([])
  const [data, setData] = useState<ListingHobbyData>({
    hobby: null,
    genre: null,
  })
  const [errorOrmsg, setErrorOrmsg] = useState<string | null>(null)
  const hobbyRef = useRef<HTMLInputElement>(null)
  const genreInputRef = useRef<HTMLInputElement>(null)
  const hobbyDropdownRef = useRef<HTMLDivElement>(null)
  const genreDropdownRef = useRef<HTMLDivElement>(null)
  const [showHobbyDropdown, setShowHobbyDropdown] = useState<boolean>(false)
  const [showGenreDropdown, setShowGenreDropdown] = useState<boolean>(false)
  const [genreid, setGenreId] = useState('')
  const [hobbyInputValue, setHobbyInputValue] = useState('')
  const [genreInputValue, setGenreInputValue] = useState('')
  const [isError, setIsError] = useState(false)
  const [HobbyError, setHobbyError] = useState(false)
  const [focusedHobbyIndex, setFocusedHobbyIndex] = useState<number>(-1)
  const [focusedGenreIndex, setFocusedGenreIndex] = useState<number>(-1)
  const [initialData, setInitialData] = useState<never[]>([])
  const [isChanged, setIsChanged] = useState(false)
  const [isChangeadded, setIsChangeadded] = useState(false)
  const [showSnackbar, setShowSnackbar] = useState<Snackbar>({
    triggerOpen: false,
    message: '',
    type: 'success',
  })
  const bodyRef = useRef<HTMLElement>(null)
  const [hobbyDropdownList, setHobbyDropdownList] = useState<
    DropdownListItem[]
  >([])
  const [genreDropdownList, setGenreDropdownList] = useState<
    DropdownListItem[]
  >([])
  const [nextDisabled, setNextDisabled] = useState(false)

  const [addHobbyBtnLoading, setAddHobbyBtnLoading] = useState<boolean>(false)

  const handleGenreInputFocus = () => {
    setShowGenreDropdown(true)
    const query = `fields=display,genre&level=3&level=2&level=1&level=0&show=true&search=${hobbyInputValue}`
    getAllHobbies(query).then((result) => {
      const sortedHobbies = result.res.data.hobbies.sort((a: any, b: any) => {
        const indexA = a.display
          .toLowerCase()
          .indexOf(hobbyInputValue.toLowerCase())
        const indexB = b.display
          .toLowerCase()
          .indexOf(hobbyInputValue.toLowerCase())

        if (indexA === 0 && indexB !== 0) {
          return -1
        } else if (indexB === 0 && indexA !== 0) {
          return 1
        }

        // Otherwise, use default sorting behavior
        return 0
      })
      const selectedHobby = sortedHobbies[0]
      handleHobbySelection(selectedHobby)
    })
  }

  const handleHobbyInputChange = async (e: any) => {
    setShowHobbyDropdown(true)
    setHobbyInputValue(e.target.value)
    setGenreInputValue('')
    setGenreDropdownList([])
    setGenreId('')
    setErrorOrmsg(null)
    setHobbyError(false)

    setData((prev) => {
      return { ...prev, hobby: null }
    })
    if (isEmptyField(e.target.value)) {
      setFocusedHobbyIndex(-1)
      setHobbyDropdownList([])
      return
    }
    const query = `fields=display,genre&level=3&level=2&level=1&level=0&show=true&search=${e.target.value}`
    const { err, res } = await getAllHobbies(query)

    if (err) return console.log(err)

    let sortedHobbies = res.data.hobbies

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
    setHobbyDropdownList(sortedHobbies)
    setFocusedHobbyIndex(-1)
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

    const filteredGenres = res.data.hobbies.filter((item: any) => {
      return item.display.toLowerCase().includes(e.target.value.toLowerCase())
    })

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
    setFocusedGenreIndex(-1)
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
        if (hobbyInputValue.length !== 0 && !showHobbyDropdown) {
          AddButtonRef.current?.click()
        } else if (focusedHobbyIndex !== -1 && showHobbyDropdown) {
          handleHobbySelection(hobbyDropdownList[focusedHobbyIndex]).finally(
            () => {
              setShowHobbyDropdown(false)
            },
          )
        } else if (focusedHobbyIndex === -1 && hobbyInputValue.length !== 0) {
          setShowHobbyDropdown(false)
          // handleGenreInputFocus();
        }
        break
      default:
        break
    }
  }

  const handleGenreKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showGenreDropdown) {
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
        if (genreInputValue.length !== 0 && !showGenreDropdown) {
          setGenreInputValue(genreDropdownList[focusedGenreIndex]?.display)
        } else if (focusedGenreIndex !== -1) {
          setData((prevValue) => ({
            ...prevValue,
            genre: genreDropdownList[focusedGenreIndex],
          }))
          setShowGenreDropdown(false)
          setGenreInputValue(genreDropdownList[focusedGenreIndex]?.display)
        } else if (genreDropdownList.length > 0) {
          setData((prevValue) => ({
            ...prevValue,
            genre: genreDropdownList[0],
          }))
          setShowGenreDropdown(false)
          setGenreInputValue(genreDropdownList[0]?.display)
        }
        break
      default:
        break
    }
  }
  const handleHobbySelection = async (selectedHobby: DropdownListItem) => {
    setGenreId('')
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
    setShowGenreDropdown(false)
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
        hobbyRef.current?.focus()
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

    if (!data.hobby || !listingModalData._id) return

    setAddHobbyBtnLoading(true)
    let jsonData = {
      hobbyId: data.hobby?._id,
      genreId: data.genre?._id,
    }
    const sameAsPrevious = hobbiesList?.find(
      (obj: any) =>
        obj?.hobby?._id === jsonData.hobbyId &&
        obj?.genre?._id === jsonData.genreId,
    )

    if (sameAsPrevious) {
      setHobbyError(true)
      setErrorOrmsg('Same hobby detected in the hobbies list')
      setAddHobbyBtnLoading(false)
      return
    }
    const { err, res } = await addListingHobby(listingModalData._id, jsonData)
    if (err) {
      setAddHobbyBtnLoading(false)
      return console.log(err)
    } else {
      setErrorOrmsg('Hobby added successfully!')
    }

    await updateHobbyList()
    setHobbyInputValue('')
    setGenreInputValue('')
    setData({ hobby: null, genre: null })
    setAddHobbyBtnLoading(false)
    setHobbyDropdownList([])
    setGenreDropdownList([])
    hobbyRef.current?.focus()
  }

  const handleDeleteHobby = async (id: string) => {
    if (!listingModalData._id) return

    // @TODO: Error Handling
    const { err, res } = await deleteListingHobby(listingModalData._id, id)
    if (err) return console.log(err)

    await updateHobbyList()
    setErrorOrmsg('hobby deleted Successfully!')
  }

  const handleSubmit = async () => {
    setHobbyError(false)
    setErrorOrmsg(null)
    setShowGenreDropdown(false)
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
          window.location.reload()
          handleClose()
          return
        }

        if (matchedHobby) {
          selectedHobby = matchedHobby
        } else {
          // setHobbyError(true)
          // setError('Typed hobby not found!')
          // dispatch(openModal({ type: 'add-hobby', closable: true }))
          setShowAddHobbyModal(true)
          setIsChanged(false)
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

        if (!matchedGenre && genreInputValue.trim().length !== 0) {
          setIsChanged(false)
          setShowAddGenreModal(true)
          return
        }
      } else {
        selectedGenre = data.genre
      }

      if (!data.hobby || !listingModalData._id) return

      setAddHobbyBtnLoading(true)
      let jsonData = { hobbyId: data.hobby?._id, genreId: data.genre?._id }
      const sameAsPrevious = hobbiesList?.find(
        (obj: any) =>
          obj?.hobby?._id === jsonData.hobbyId &&
          obj?.genre?._id === jsonData.genreId,
      )
      if (sameAsPrevious) {
        setHobbyError(true)
        setErrorOrmsg('Same hobby detected in the hobbies list')
        setAddHobbyBtnLoading(false)
        return
      }
      const { err, res } = await addListingHobby(listingModalData._id, jsonData)
      if (err) {
        setAddHobbyBtnLoading(false)
        return console.log(err)
      }
      await updateHobbyList()
      setHobbyInputValue('')
      setGenreInputValue('')
      setData({ hobby: null, genre: null })
      setAddHobbyBtnLoading(false)
    }

    if (hobbiesList.length === 0) {
      setErrorOrmsg('Add atleast one hobby!')
      setHobbyError(true)
      hobbyRef.current?.focus()
      return
    }
    if (onComplete) onComplete()
    else {
      window.location.reload()
      dispatch(closeModal())
    }
  }

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
      JSON.stringify(hobbiesList) !== JSON.stringify(initialData)
    setIsChangeadded(hasChangesadded)

    if (onStatusChange) {
      if (isChanged || hasChangesadded) onStatusChange(true)
    }
  }, [hobbiesList, hobbyInputValue, onStatusChange])

  const updateHobbyList = async () => {
    if (!listingModalData._id) return

    const { err, res } = await getListingHobbies(listingModalData._id)
    if (err) return console.log(err)

    setHobbiesList(res?.data.data.hobbies)
  }

  useEffect(() => {
    setInitialData(listingModalData?._hobbies)
  }, [listingModalData?._id])

  useEffect(() => {
    hobbyRef.current?.focus()
    updateHobbyList()
  }, [])

  const nextButtonRef = useRef<HTMLButtonElement | null>(null)
  const AddButtonRef = useRef<HTMLButtonElement | null>(null)
  useEffect(() => {
    const handleKeyPress = (event: any) => {
      // if (event.key === 'Enter') {
      //   nextButtonRef.current?.focus()
      // }
    }
    hobbyRef.current?.focus()
    window.addEventListener('keydown', handleKeyPress)

    return () => {
      window.removeEventListener('keydown', handleKeyPress)
    }
  }, [])
  const HandleSaveError = async () => {
    if (hobbiesList.length === 0) {
      setIsError(true)
    }
  }

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
      setShowHobbyDropdown(false)
    }
  }
  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick)

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
    }
  }, [])
  useEffect(() => {
    if (activeProfile.type === 'listing' && pathname.startsWith('/community')) {
      setHobbiesList(activeProfile.data?._hobbies)
    }
  }, [activeProfile])

  useEffect(() => {
    const timer = setTimeout(() => {
      if (bodyRef.current) {
        bodyRef.current.scrollTop = bodyRef.current.scrollHeight
      }
    }, 10)
    return () => clearTimeout(timer)
  }, [hobbyInputValue])

  if (showAddHobbyModal) {
    return (
      <>
        <AddHobby
          handleClose={() => {
            setShowAddHobbyModal(false)
          }}
          handleSubmit={() => async () => {
            let jsonData = {
              listing_id: listingModalData._id,
              user_type: 'listing',
              hobby: hobbyInputValue,
              level: 'Hobby',
            }
            const { err, res } = await SendHobbyRequest(jsonData)
            if (res?.data.success) {
              setShowAddHobbyModal(false)
              setErrorOrmsg(
                `${hobbyInputValue} has been requested.  You can add it later if approved.`,
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
  if (showAddGenreModal) {
    return (
      <>
        <AddGenre
          handleClose={() => {
            setShowAddGenreModal(false)
          }}
          handleSubmit={() => async () => {
            let jsonData = {
              listing_id: listingModalData._id,
              user_type: 'listing',
              hobby: genreInputValue,
              level: 'Genre',
            }
            const { err, res } = await SendHobbyRequest(jsonData)
            if (res?.data.success) {
              setShowAddGenreModal(false)
              setErrorOrmsg(
                `${genreInputValue} has been requested. You can add it later if approved.`,
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
        handleClose={handleClose}
        handleSubmit={handleSubmit}
        setConfirmationModal={setConfirmationModal}
        isError={isError}
        OnBoarding={onBoarding}
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

        <section ref={bodyRef} className={`${styles['body']} `}>
          <>
            <section className={styles['add-hobbies-wrapper']}>
              {/* Hobbies List, that are already Added */}
              {/* <h3 className={styles['heading']}>Added Hobbies</h3> */}
              <section className={styles['added-hobby-list']}>
                <table>
                  <thead>
                    <tr>
                      <td>Hobby - Genre/Style</td>
                      <td className={styles.hideActionMobile}>Action</td>
                    </tr>
                  </thead>
                  <tbody>
                    {hobbiesList?.map((hobby: any) => {
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
                          {/* <td>{hobby?.genre?.display || '-'}</td> */}
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
                      <td>
                        {/* Hobby Input and Dropdown */}
                        <section className={styles['dropdown-wrapper']}>
                          <div
                            className={`${styles['input-box']} ${
                              HobbyError ? styles['input-box-error'] : ''
                            }`}
                          >
                            <input
                              ref={hobbyRef}
                              type="text"
                              autoComplete="new"
                              placeholder="Search hobby..."
                              required
                              value={hobbyInputValue}
                              onFocus={() => setShowHobbyDropdown(true)}
                              onBlur={() =>
                                setTimeout(() => {
                                  if (!isMobile) setShowHobbyDropdown(false)
                                }, 300)
                              }
                              onChange={handleHobbyInputChange}
                              onKeyDown={handleHobbyKeyDown}
                            />
                          </div>
                          {showHobbyDropdown &&
                            hobbyDropdownList.length !== 0 && (
                              <div
                                className={` ${styles['dropdown']} ${
                                  hobbiesList.length > 4
                                    ? styles['dropdown-upwards']
                                    : styles['dropdown-downwords']
                                }`}
                                ref={hobbyDropdownRef}
                              >
                                {hobbyDropdownList.map((hobby, index) => {
                                  return (
                                    <p
                                      id={`option-h-${index}`}
                                      key={hobby._id}
                                      onClick={() => {
                                        handleHobbySelection(hobby)
                                        setShowHobbyDropdown(false)
                                      }}
                                      className={
                                        index === focusedHobbyIndex
                                          ? styles['dropdown-option-focus']
                                          : ''
                                      }
                                    >
                                      {hobby.display}
                                    </p>
                                  )
                                })}
                              </div>
                            )}
                        </section>

                        <section className={styles['dropdown-wrapper']}>
                          <div className={styles['input-box']}>
                            <input
                              type="text"
                              autoComplete="new"
                              placeholder="Genre/Style"
                              required
                              ref={genreInputRef}
                              value={genreInputValue}
                              onFocus={() => {
                                setShowGenreDropdown(true)
                                if (
                                  genreDropdownList.length === 0 &&
                                  hobbyInputValue.length !== 0 &&
                                  data.hobby === null
                                ) {
                                  handleGenreInputFocus()
                                }
                              }}
                              onBlur={() =>
                                setTimeout(() => {
                                  handleGenreSelection()
                                  setShowGenreDropdown(false)
                                }, 300)
                              }
                              onChange={handleGenreInputChange}
                              onKeyDown={handleGenreKeyDown}
                            />
                            {/* <p className={styles['helper-text']}>{inputErrs.full_name}</p> */}
                          </div>
                          {showGenreDropdown &&
                            genreDropdownList.length !== 0 && (
                              <div
                                className={`${styles['dropdown']} ${
                                  hobbiesList.length > 4
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
                                        setShowGenreDropdown(false)
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
                        </section>
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
                onClick={onBackBtnClick}
              >
                Back
              </button>
              {/* SVG Button for Mobile */}
              <div onClick={onBackBtnClick}>
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
            onClick={handleSubmit}
          >
            {onComplete ? 'Finish' : 'Save'}
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
            >
              Save
            </button>
          )}
        </footer>
      </div>
    </>
  )
}

export default ListingHobbyEditModal

/**
 * @TODO:
 * 1. Debounce API req while typing in the hobby/genre search list.
 * 2. Dropdown and Functionality to change the Level of an Hobby in the `Added Hobbies` list.
 * 3. Chnage in query in the Genre search dropdown.
 * 4. Delete button loading while deleting any hobby.
 */
