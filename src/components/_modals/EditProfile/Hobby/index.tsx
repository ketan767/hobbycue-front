import React, { useEffect, useState } from 'react'
import styles from './styles.module.css'
import { Button, CircularProgress } from '@mui/material'
import { addUserHobby, deleteUserHobby, getMyProfileDetail } from '@/services/userService'

import { FormControl, MenuItem, Select, TextField } from '@mui/material'
import { getAllHobbies } from '@/services/hobbyService'
import { isEmptyField } from '@/utils'
import { useDispatch, useSelector } from 'react-redux'
import { updateUser } from '@/redux/slices/user'
import { RootState } from '@/redux/store'
import { closeModal } from '@/redux/slices/modal'

type Props = {
  onComplete?: () => void
  onBackBtnClick?: () => void
}

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
}

const ProfileHobbyEditModal: React.FC<Props> = ({ onComplete, onBackBtnClick }) => {
  const dispatch = useDispatch()

  const { user } = useSelector((state: RootState) => state.user)

  const [addHobbyBtnLoading, setAddHobbyBtnLoading] = useState<boolean>(false)
  const [submitBtnLoading, setSubmitBtnLoading] = useState<boolean>(false)

  const [data, setData] = useState<ProfileHobbyData>({ hobby: null, genre: null, level: 1 })

  const [showHobbyDowpdown, setShowHobbyDowpdown] = useState<boolean>(false)
  const [showGenreDowpdown, setShowGenreDowpdown] = useState<boolean>(false)

  const [hobbyInputValue, setHobbyInputValue] = useState('')
  const [genreInputValue, setGenreInputValue] = useState('')

  const [hobbyDropdownList, setHobbyDropdownList] = useState<DropdownListItem[]>([])
  const [genreDropdownList, setGenreDropdownList] = useState<DropdownListItem[]>([])

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

  const handleAddHobby = () => {
    if (!data.hobby) return

    setAddHobbyBtnLoading(true)

    let jsonData = { hobby: data.hobby?._id, genre: data.genre?._id, level: data.level }
    addUserHobby(jsonData, (err, res) => {
      if (err) {
        setAddHobbyBtnLoading(false)
        return console.log(err)
      }

      getMyProfileDetail('populate=_hobbies,_addresses,primary_address', (err, res) => {
        setAddHobbyBtnLoading(false)
        if (err) return console.log(err)
        if (res.data.success) {
          dispatch(updateUser(res.data.data.user))
          setHobbyInputValue('')
          setGenreInputValue('')
        }
      })
    })
  }
  const handleDeleteHobby = async (id: string) => {
    const { err, res } = await deleteUserHobby(id)

    if (err) {
      return console.log(err)
    }

    getMyProfileDetail('populate=_hobbies,_addresses,primary_address', (err, res) => {
      if (err) return console.log(err)
      if (res.data.success) {
        dispatch(updateUser(res.data.data.user))
      }
    })
  }

  const handleSubmit = () => {
    if (onComplete) onComplete()
    else dispatch(closeModal())
  }

  return (
    <>
      <div className={styles['modal-wrapper']}>
        {/* Modal Header */}
        <header className={styles['header']}>
          <h4 className={styles['heading']}>{'Address'}</h4>
        </header>

        <hr />

        <section className={styles['body']}>
          <>
            <section className={styles['add-hobbies-wrapper']}>
              <p className={styles['info']}>Added hobbies appear in the table below.</p>

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
                      onChange={handleHobbyInputChange}
                    />
                    {/* <p className={styles['helper-text']}>{inputErrs.full_name}</p> */}
                  </div>
                  {showHobbyDowpdown && hobbyDropdownList.length !== 0 && (
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

                <FormControl variant="outlined" size="small" sx={{ width: '150px' }}>
                  <Select
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

                <Button disabled={addHobbyBtnLoading} variant="contained" onClick={handleAddHobby}>
                  {addHobbyBtnLoading ? <CircularProgress color="inherit" size={'22px'} /> : 'Add'}
                </Button>
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
                    {user._hobbies?.map((hobby: any) => {
                      return (
                        <tr key={hobby._id}>
                          <td>{hobby?.hobby?.display}</td>
                          <td>{hobby?.genre?.display || '-'}</td>
                          <td>
                            {hobby.level === 1
                              ? 'Beginner'
                              : hobby.level === 2
                              ? 'Intermediate'
                              : hobby.level === 3
                              ? 'Advanced'
                              : ''}
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
          </>
        </section>

        <footer className={styles['footer']}>
          {Boolean(onBackBtnClick) && (
            <button className="modal-footer-btn cancel" onClick={onBackBtnClick}>
              Back
            </button>
          )}

          <button
            className="modal-footer-btn submit"
            onClick={handleSubmit}
            disabled={submitBtnLoading}
          >
            {submitBtnLoading ? (
              <CircularProgress color="inherit" size={'24px'} />
            ) : onComplete ? (
              'Next'
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

/**
 * @TODO:
 * 1. Debounce API req while typing in the hobby/genre search list.
 * 2. Dropdown and Functionality to change the Level of an Hobby in the `Added Hobbies` list.
 * 3. Chnage in query in the Genre search dropdown.
 * 4. Delete button loading while deleting any hobby.
 */
