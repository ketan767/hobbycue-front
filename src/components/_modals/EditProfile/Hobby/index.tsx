import React, { useEffect, useState, useRef } from 'react'
import styles from './styles.module.css'
import { Button, CircularProgress } from '@mui/material'
import {
  addUserHobby,
  deleteUserHobby,
  getMyProfileDetail,
  updateMyProfileDetail,
  updateUserHobbyLevel,
} from '@/services/user.service'

import { FormControl, MenuItem, Select, TextField } from '@mui/material'
import { getAllHobbies } from '@/services/hobby.service'
import { isEmptyField } from '@/utils'
import { useDispatch, useSelector } from 'react-redux'
import { updateUser } from '@/redux/slices/user'
import { RootState } from '@/redux/store'
import { closeModal } from '@/redux/slices/modal'
import SaveModal from '../../SaveModal/saveModal'
import CloseIcon from '@/assets/icons/CloseIcon'

type Props = {
  onComplete?: () => void
  onBackBtnClick?: () => void
  confirmationModal?: boolean
  setConfirmationModal?: any
  handleClosee?: any
  handleClose?: any
  isError?: boolean
  onStatusChange?: (isChanged: boolean) => void
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

const ProfileHobbyEditModal: React.FC<Props> = ({
  onComplete,
  onBackBtnClick,
  confirmationModal,
  setConfirmationModal,
  handleClosee,
  handleClose,
  onStatusChange,
}) => {
  const dispatch = useDispatch()

  const { user } = useSelector((state: RootState) => state.user)
  const searchref = useRef<HTMLInputElement>(null)
  const [addHobbyBtnLoading, setAddHobbyBtnLoading] = useState<boolean>(false)
  const [submitBtnLoading, setSubmitBtnLoading] = useState<boolean>(false)
  const [nextDisabled, setNextDisabled] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [data, setData] = useState<ProfileHobbyData>({
    hobby: null,
    genre: null,
    level: 1,
  })

  const [showHobbyDowpdown, setShowHobbyDowpdown] = useState<boolean>(false)
  const [showGenreDowpdown, setShowGenreDowpdown] = useState<boolean>(false)
  const [isError, setIsError] = useState(false)

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

  const [initialData, setInitialData] = useState({})
  const [isChanged, setIsChanged] = useState(false)

  const handleHobbyInputChange = async (e: any) => {
    setHobbyInputValue(e.target.value)
    setGenreInputValue('')
    setGenreDropdownList([])
    setGenreId('')

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
    setShowGenreDowpdown(false)
    setGenreId('')
    setData((prev) => ({ ...prev, hobby: selectedHobby }))
    setHobbyInputValue(selectedHobby.display)

    if (selectedHobby.genre && selectedHobby.genre.length > 0) {
      setGenreId(selectedHobby.genre[0])

      const query = `fields=display&show=true&genre=${selectedHobby.genre[0]}&level=5`
      const { err, res } = await getAllHobbies(query)

      if (!err) {
        setGenreDropdownList(res.data.hobbies)
        setShowGenreDowpdown(true)
      } else {
        console.error('Error fetching genres:', err)
      }
    }
  }

  const handleAddHobby = () => {
    setError(null)

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
        return
      }

      if (matchedHobby) {
        selectedHobby = matchedHobby
      } else {
        setError('Typed hobby not found!')
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

    setAddHobbyBtnLoading(true)

    let jsonData = {
      hobby: selectedHobby?._id,
      genre: selectedGenre?._id,
      level: data.level,
    }

    addUserHobby(jsonData, async (err, res) => {
      console.log('json', jsonData)
      console.log('Button clicked!')
      if (err) {
        setAddHobbyBtnLoading(false)
        return console.log(err)
      }

      const { err: error, res: response } = await getMyProfileDetail()
      setAddHobbyBtnLoading(false)
      if (error) return console.log(error)

      if (response?.data.success) {
        dispatch(updateUser(response?.data.data.user))
        setHobbyInputValue('')
        setGenreInputValue('')
        setData({ level: 1, hobby: null, genre: null })
      }
    })
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

  const handleSubmit = () => {
    if (userHobbies.length === 0) {
      setError('Add atleast one hobby!')
      searchref.current?.focus()
      return
    }
    if (onComplete) onComplete()
    else {
      window.location.reload()
      dispatch(closeModal())
    }
  }

  useEffect(() => {
    setUserHobbies(user._hobbies)
  }, [user._hobbies])

  useEffect(() => {
    setInitialData(user._hobbies)
    const hasChanges =
      JSON.stringify(userHobbies) !== JSON.stringify(initialData)
    setIsChanged(hasChanges)

    if (onStatusChange) {
      onStatusChange(hasChanges)
    }
  }, [userHobbies, initialData, onStatusChange])
  const handleLevelChange = async (_id: any, level: string) => {
    let temp = userHobbies.map((item: any) => {
      if (item._id === _id) {
        return { ...item, level }
      } else {
        return item
      }
    })
    setUserHobbies(temp)
    const { err, res } = await updateUserHobbyLevel(_id, { level })
    if (err) return console.log(err)
    console.log('hobby updated-', res?.data)
  }
  const HandleSaveError = async () => {
    if (userHobbies.length === 0) {
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
      <div className={styles['modal-wrapper']}>
        <CloseIcon
          className={styles['modal-close-icon']}
          onClick={handleClose}
        />
        {/* Modal Header */}
        <header className={styles['header']}>
          <h4 className={styles['heading']}>{'Hobbies'}</h4>
        </header>

        <hr />

        <section className={styles['body']}>
          <>
            <section className={styles['add-hobbies-wrapper']}>
              <p className={styles['info']}>
                Added hobbies appear in the table below.
              </p>

              <h3 className={styles['heading']}>Add Hobby</h3>
              <section className={styles['add-new-hobby']}>
                {/* Hobby Input and Dropdown */}
                <section className={styles['dropdown-warpper']}>
                  <div className={styles['input-box']}>
                    <input
                      type="text"
                      placeholder="Search hobby..."
                      autoComplete="name"
                      required
                      value={hobbyInputValue}
                      onFocus={() => setShowHobbyDowpdown(true)}
                      onBlur={() =>
                        setTimeout(() => {
                          setShowHobbyDowpdown(false)
                        }, 300)
                      }
                      ref={searchref}
                      onChange={handleHobbyInputChange}
                    />
                  </div>
                  {showHobbyDowpdown && hobbyDropdownList.length !== 0 && (
                    <div className={styles['dropdown']}>
                      {hobbyDropdownList.map((hobby) => {
                        return (
                          <p
                            key={hobby._id}
                            onClick={() => handleHobbySelection(hobby)}
                          >
                            {hobby.display}
                          </p>
                        )
                      })}
                    </div>
                  )}
                </section>

                {/* Genre Input and Dropdown */}
                <section className={styles['dropdown-warpper']}>
                  <div className={styles['input-box']}>
                    <input
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
                    />
                    {/* <p className={styles['helper-text']}>{inputErrs.full_name}</p> */}
                  </div>
                  {showGenreDowpdown && genreDropdownList.length !== 0 && (
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

                <FormControl
                  variant="outlined"
                  size="small"
                  sx={{ width: '150px' }}
                >
                  <Select
                    className={styles['select-level-main']}
                    value={data.level}
                    onChange={(e) => {
                      setData((prev: any) => {
                        return { ...prev, level: e.target.value }
                      })
                    }}
                    displayEmpty
                    inputProps={{ 'aria-label': 'Without label' }}
                  >
                    <MenuItem value={1}>{'Beginner'}</MenuItem>
                    <MenuItem value={2}>{'Intermediate'}</MenuItem>
                    <MenuItem value={3}>{'Advanced'}</MenuItem>
                  </Select>
                </FormControl>
                {/* <div className={styles['input-box']}>
                  <input
                    type="text"
                    placeholder="Full Name"
                    autoComplete="name"
                    required
                    value={'data'}
                    onChange={(e) =>
                      setData((prev) => {
                        return { ...prev, full_name: e.target.value }
                      })
                    }
                  />
                  <p className={styles['helper-text']}>{inputErrs.full_name}</p>
                </div> */}

                <button
                  disabled={addHobbyBtnLoading}
                  className={styles['add-btn']}
                  onClick={handleAddHobby}
                >
                  {addHobbyBtnLoading ? (
                    <CircularProgress color="inherit" size={'22px'} />
                  ) : (
                    'Add'
                  )}
                </button>
              </section>

              <h3 className={styles['heading']}>Added Hobbies</h3>

              <section className={styles['added-hobby-list']}>
                <table>
                  <thead>
                    <tr>
                      <td>Hobby</td>
                      <td>Genre/Style</td>
                      <td>Level</td>
                      <td>Action</td>
                    </tr>
                  </thead>
                  <tbody>
                    {userHobbies?.map((hobby: any) => {
                      return (
                        <tr key={hobby._id}>
                          <td>{hobby?.hobby?.display}</td>
                          <td>{hobby?.genre?.display || '-'}</td>
                          <td>
                            {/* {hobby.level === 1
                              ? 'Beginner'
                              : hobby.level === 2
                              ? 'Intermediate'
                              : hobby.level === 3
                              ? 'Advanced'
                              : ''} */}
                            <Select
                              value={hobby.level}
                              className={styles['hobby-dropdown']}
                              onChange={(e) => {
                                let val = e.target.value
                                handleLevelChange(hobby._id, val)
                              }}
                              sx={{
                                boxShadow: 'none',
                                '.MuiOutlinedInput-notchedOutline': {
                                  border: 0,
                                  outline: 'none',
                                },
                              }}
                              displayEmpty
                            >
                              {levels?.map((item: any, idx) => {
                                return (
                                  <MenuItem key={idx} value={idx + 1}>
                                    <p>{item}</p>
                                  </MenuItem>
                                )
                              })}
                            </Select>
                          </td>
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
                  </tbody>
                </table>
              </section>
            </section>
            <p className={styles['helper-text']}>{error}</p>
          </>
        </section>

        <footer className={styles['footer']}>
          {/* {Boolean(onBackBtnClick) && (
            <button
              className="modal-footer-btn cancel"
              onClick={onBackBtnClick}
            >
              Back
            </button>
          )} */}
          <button
            className="modal-footer-btn cancel"
            onClick={onBackBtnClick ? onBackBtnClick : handleClose}
          >
            {onBackBtnClick ? 'Back' : 'Cancel'}
          </button>

          <button
            ref={nextButtonRef}
            className="modal-footer-btn submit"
            onClick={handleSubmit}
            disabled={submitBtnLoading ? submitBtnLoading : nextDisabled}
          >
            {submitBtnLoading ? (
              <CircularProgress color="inherit" size={'24px'} />
            ) : onComplete ? (
              'Save'
            ) : (
              'Save'
            )}
          </button>
        </footer>
      </div>
    </>
  )
}

export default ProfileHobbyEditModal
