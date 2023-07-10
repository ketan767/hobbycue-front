import React, { useEffect, useState } from 'react'
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
import { closeModal } from '@/redux/slices/modal'
import { addListingHobby, deleteListingHobby } from '@/services/listing.service'
import { getListingHobbies } from '@/services/listing.service'

type Props = {
  onComplete?: () => void
  onBackBtnClick?: () => void
}

type DropdownListItem = {
  _id: string
  display: string
  sub_category?: string
}

type ListingHobbyData = {
  hobby: DropdownListItem | null
  genre: DropdownListItem | null
}

const ListingHobbyEditModal: React.FC<Props> = ({
  onComplete,
  onBackBtnClick,
}) => {
  const dispatch = useDispatch()

  const { user } = useSelector((state: RootState) => state.user)
  const { listingModalData } = useSelector((state: RootState) => state.site)

  const [hobbiesList, setHobbiesList] = useState([])
  const [data, setData] = useState<ListingHobbyData>({
    hobby: null,
    genre: null,
  })
  const [error, setError] = useState(false)

  const [showHobbyDropdown, setShowHobbyDropdown] = useState<boolean>(false)
  const [showGenreDropdown, setShowGenreDropdown] = useState<boolean>(false)

  const [hobbyInputValue, setHobbyInputValue] = useState('')
  const [genreInputValue, setGenreInputValue] = useState('')

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

    setData((prev) => {
      return { ...prev, hobby: null }
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

  const handleAddHobby = async () => {
    // @TODO: Error Handling
    setError(false)
    setNextDisabled(false)
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

  const handleSubmit = () => {
    if (hobbiesList.length === 0) {
      setError(true)
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
    updateHobbyList()
  }, [])

  useEffect(() => {
    if (!hobbiesList) {
      // setNextDisabled(true)
    } else if (hobbiesList.length === 0) {
      // setNextDisabled(true)
    } else {
      setNextDisabled(false)
    }
  }, [hobbiesList])

  return (
    <>
      <div className={styles['modal-wrapper']}>
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

              {/* Add New Hobbies Dropdown and Add Button */}
              <h3 className={styles['heading']}>Add Hobby</h3>
              <section className={styles['add-new-hobby']}>
                {/* Hobby Input and Dropdown */}
                <section className={styles['dropdown-wrapper']}>
                  <div className={styles['input-box']}>
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

                <Button
                  className={styles['add-btn']}
                  disabled={addHobbyBtnLoading}
                  variant="contained"
                  onClick={handleAddHobby}
                >
                  {addHobbyBtnLoading ? (
                    <CircularProgress color="inherit" size={'22px'} />
                  ) : (
                    'Add'
                  )}
                </Button>
              </section>

              {/* Hobbies List, that are already Added */}
              <h3 className={styles['heading']}>Added Hobbies</h3>
              <section className={styles['added-hobby-list']}>
                <table>
                  <thead>
                    <tr>
                      <td>Hobby</td>
                      <td>Genre/Style</td>
                      <td>Action</td>
                    </tr>
                  </thead>
                  <tbody>
                    {hobbiesList?.map((hobby: any) => {
                      return (
                        <tr key={hobby._id}>
                          <td>{hobby?.hobby?.display}</td>
                          <td>{hobby?.genre?.display || '-'}</td>
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
              <p className={styles['helper-text']}>
                {error ? 'Add atleast one hobby!' : ''}
              </p>
            </section>
          </>
        </section>

        <footer className={styles['footer']}>
          {Boolean(onBackBtnClick) && (
            <button
              className="modal-footer-btn cancel"
              onClick={onBackBtnClick}
            >
              Back
            </button>
          )}

          <button
            className="modal-footer-btn submit"
            onClick={handleSubmit}
            disabled={nextDisabled}
          >
            {onComplete ? 'Next' : 'Save'}
          </button>
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
