import React, { useEffect, useState, useRef } from 'react'
import styles from './styles.module.css'
import { Button, CircularProgress } from '@mui/material'
import {
  addUserHobby,
  deleteUserHobby,
  getMyProfileDetail,
} from '@/services/user.service'

import { FormControl, MenuItem, Select, TextField } from '@mui/material'
import { getAllHobbies } from '@/services/hobby.service'
import { isEmptyField } from '@/utils'
import { useDispatch, useSelector } from 'react-redux'
import { updateUser } from '@/redux/slices/user'
import { RootState } from '@/redux/store'
import { closeModal, openModal } from '@/redux/slices/modal'
import { addListingHobby, deleteListingHobby } from '@/services/listing.service'
import { getListingHobbies } from '@/services/listing.service'
import SaveModal from '../../SaveModal/saveModal'
import CloseIcon from '@/assets/icons/CloseIcon'
import addhobby from '@/assets/svg/addhobby.svg'
import BackIcon from '@/assets/svg/Previous.svg'
import NextIcon from '@/assets/svg/Next.svg'
import Image from 'next/image'

type Props = {
  onComplete?: () => void
  onBackBtnClick?: () => void
  confirmationModal?: boolean
  setConfirmationModal?: any
  handleClose?: any
  isError?: boolean
  onBoarding?: boolean
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

const ListingHobbyEditModal: React.FC<Props> = ({
  onComplete,
  onBackBtnClick,
  confirmationModal,
  setConfirmationModal,
  handleClose,
  onBoarding,
}) => {
  const dispatch = useDispatch()

  const { user } = useSelector((state: RootState) => state.user)
  const { listingModalData } = useSelector((state: RootState) => state.site)

  const [hobbiesList, setHobbiesList] = useState([])
  const [data, setData] = useState<ListingHobbyData>({
    hobby: null,
    genre: null,
  })
  const [error, setError] = useState<string | null>(null)
  const hobbyRef = useRef<any>(null)
  const [showHobbyDropdown, setShowHobbyDropdown] = useState<boolean>(false)
  const [showGenreDropdown, setShowGenreDropdown] = useState<boolean>(false)
  const [genreid, setGenreId] = useState('')
  const [hobbyInputValue, setHobbyInputValue] = useState('')
  const [genreInputValue, setGenreInputValue] = useState('')
  const [isError, setIsError] = useState(false)
  const [HobbyError, setHobbyError] = useState(false)

  const [hobbyDropdownList, setHobbyDropdownList] = useState<
    DropdownListItem[]
  >([])
  const [genreDropdownList, setGenreDropdownList] = useState<
    DropdownListItem[]
  >([])
  const [nextDisabled, setNextDisabled] = useState(false)

  const [addHobbyBtnLoading, setAddHobbyBtnLoading] = useState<boolean>(false)

  const handleHobbyInputChange = async (e: any) => {
    setHobbyInputValue(e.target.value)
    setGenreInputValue('')
    setGenreDropdownList([])
    setGenreId('')
    setError(null)
    setHobbyError(false)

    setData((prev) => {
      return { ...prev, hobby: null }
    })
    if (isEmptyField(e.target.value)) return setHobbyDropdownList([])
    const query = `fields=display,genre&level=3&level=2&level=1&level=0&show=true&search=${e.target.value}`
    const { err, res } = await getAllHobbies(query)
    if (err) return console.log(err)
    console.log('resp', res)
    setHobbyDropdownList(res.data.hobbies)
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
    setGenreDropdownList(res.data.hobbies)
  }
  const printgenreid = () => {
    console.log('genreid', genreid)
  }
  const handleHobbySelection = async (selectedHobby: DropdownListItem) => {
    setShowGenreDropdown(false)
    setGenreId('')
    setData((prev) => ({ ...prev, hobby: selectedHobby }))
    setHobbyInputValue(selectedHobby.display)

    if (selectedHobby.genre && selectedHobby.genre.length > 0) {
      setGenreId(selectedHobby.genre[0])

      const query = `fields=display&show=true&genre=${selectedHobby.genre[0]}&level=5`
      const { err, res } = await getAllHobbies(query)

      if (!err) {
        setGenreDropdownList(res.data.hobbies)
        setShowGenreDropdown(true)
      } else {
        console.error('Error fetching genres:', err)
      }
    }
  }

  const handleAddHobby = async () => {
    setHobbyError(false)
    setError(null)
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
        setError('Please enter a hobby')
        hobbyRef.current?.focus()
        setHobbyError(true)
        return
      }

      if (matchedHobby) {
        selectedHobby = matchedHobby
      } else {
        // setHobbyError(true)
        // setError('Typed hobby not found!')
        dispatch(openModal({ type: 'add-hobby', closable: true }))
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
        setError('Typed Genre not found!')
        return
      }
      if (selectedGenre !== null && !matchedGenre) {
        setError("This hobby doesn't contain this genre")
        return
      }
    } else {
      selectedGenre = data.genre
    }

    if (!data.hobby || !listingModalData._id) return

    setAddHobbyBtnLoading(true)
    let jsonData = { hobbyId: data.hobby?._id, genreId: data.genre?._id }
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

  const handleDeleteHobby = async (id: string) => {
    if (!listingModalData._id) return console.error('Listing ID Not Found!')

    // @TODO: Error Handling
    const { err, res } = await deleteListingHobby(listingModalData._id, id)
    if (err) return console.log(err)

    await updateHobbyList()
  }

  const handleSubmit = async () => {
    setHobbyError(false)
    setError(null)
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
          dispatch(openModal({ type: 'add-hobby', closable: true }))
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
          setError('Typed Genre not found!')
          return
        }
        if (selectedGenre !== null && !matchedGenre) {
          setError("This hobby doesn't contain this genre")
          return
        }
      } else {
        selectedGenre = data.genre
      }

      if (!data.hobby || !listingModalData._id) return

      setAddHobbyBtnLoading(true)
      let jsonData = { hobbyId: data.hobby?._id, genreId: data.genre?._id }
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
      setError('Add atleast one hobby!')
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

  const updateHobbyList = async () => {
    if (!listingModalData._id) return console.error('No Listing ID Found!')

    const { err, res } = await getListingHobbies(listingModalData._id)
    if (err) return console.log(err)

    setHobbiesList(res?.data.data.hobbies)
  }

  useEffect(() => {
    hobbyRef.current?.focus()
    updateHobbyList()
  }, [])

  const nextButtonRef = useRef<HTMLButtonElement | null>(null)
  useEffect(() => {
    const handleKeyPress = (event: any) => {
      if (event.key === 'Enter') {
        nextButtonRef.current?.focus()
      }
    }

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

  if (confirmationModal) {
    return (
      <SaveModal
        handleClose={handleClose}
        handleSubmit={handleSubmit}
        setConfirmationModal={setConfirmationModal}
        isError={isError}
        OnBoarding={onBoarding}
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
          <h4 className={styles['heading']}>{'Hobbies'}</h4>
        </header>

        <hr className={styles['modal-hr']} />

        <section className={styles['body']}>
          <>
            <section className={styles['add-hobbies-wrapper']}>
              <p className={styles['helper-text']}>{error}</p>

              {/* Hobbies List, that are already Added */}
              {/* <h3 className={styles['heading']}>Added Hobbies</h3> */}
              <section className={styles['added-hobby-list']}>
                <table>
                  <thead>
                    <tr>
                      <td>Hobby-Genre/Style</td>
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
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              className={styles['delete-hobby-btn']}
                              onClick={() => handleDeleteHobby(hobby._id)}
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
                          </div>
                          {showHobbyDropdown &&
                            hobbyDropdownList.length !== 0 && (
                              <div className={styles['dropdown']}>
                                {hobbyDropdownList.map((hobby) => {
                                  return (
                                    <p
                                      key={hobby._id}
                                      onClick={() => {
                                        handleHobbySelection(hobby)
                                        setShowHobbyDropdown(false)
                                      }}
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
                              placeholder="Genre/Style"
                              autoComplete="name"
                              required
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
                          {showGenreDropdown &&
                            genreDropdownList.length !== 0 && (
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
                                        setShowGenreDropdown(false)
                                      }}
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
                src={NextIcon}
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
