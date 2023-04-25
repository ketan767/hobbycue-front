import React, { useEffect, useState } from 'react'
import styles from './styles.module.css'
import { Button, CircularProgress } from '@mui/material'
import { addUserHobby, getMyProfileDetail } from '@/services/userService'
import FilledButton from '@/components/_buttons/FilledButton'

// import debounce from 'lodash/debounce'
// import throttle from 'lodash/throttle'

import { FormControl, MenuItem, Select, TextField } from '@mui/material'
import { getAllHobbies } from '@/services/hobbyService'
import { isEmptyField } from '@/utils'
import { useDispatch, useSelector } from 'react-redux'
import { updateUserDetail } from '@/redux/slices/user'
import { RootState } from '@/redux/store'

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

  const { userDetail } = useSelector((state: RootState) => state.user)
  console.log('🚀 ~ file: index.tsx:43 ~ userDetail :', userDetail)

  const [addHobbyBtnLoading, setAddHobbyBtnLoading] = useState<boolean>(false)
  const [submitBtnLoading, setSubmitBtnLoading] = useState<boolean>(false)

  const [data, setData] = useState<ProfileHobbyData>({ hobby: null, genre: null, level: 1 })

  const [showHobbyDowpdown, setShowHobbyDowpdown] = useState<boolean>(false)
  const [showGenreDowpdown, setShowGenreDowpdown] = useState<boolean>(false)

  const [hobbyInputValue, setHobbyInputValue] = useState('')
  const [genreInputValue, setGenreInputValue] = useState('')

  const [hobbyDropdownList, setHobbyDropdownList] = useState<DropdownListItem[]>([])
  const [genreDropdownList, setGenreDropdownList] = useState<DropdownListItem[]>([])

  const handleHobbyInputChange = (e: any) => {
    setHobbyInputValue(e.target.value)

    setData((prev) => {
      return { ...prev, hobby: null }
    })
    if (isEmptyField(e.target.value)) return setHobbyDropdownList([])
    const query = `fields=display,sub_category&show=true&search=${e.target.value}`
    getAllHobbies(query, (err, res) => {
      if (err) return console.log(err)
      setHobbyDropdownList(res.data.hobbies)
    })
  }
  const handleGenreInputChange = (e: any) => {
    setGenreInputValue(e.target.value)

    setData((prev) => {
      return { ...prev, genre: null }
    })
    if (isEmptyField(e.target.value)) return setGenreDropdownList([])
    const query = `fields=display&show=true&search=${e.target.value}`
    getAllHobbies(query, (err, res) => {
      if (err) return console.log(err)
      setGenreDropdownList(res.data.hobbies)
    })
  }

  const handleAddHobby = () => {
    if (!data.hobby || !data.genre) return

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
          dispatch(updateUserDetail(res.data.data.user))
        }
      })
    })
  }

  const handleSubmit = () => {
    onComplete && onComplete()
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
                        }, 150)
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
                        }, 150)
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
                            key={genre._id}
                            onClick={() => {
                              setData((prev) => {
                                return { ...prev, genre: genre }
                              })
                              setGenreInputValue(genre.display)
                            }}
                          >
                            {genre.display}
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
            </section>
          </>
        </section>

        <footer className={styles['footer']}>
          {Boolean(onBackBtnClick) && (
            <Button variant="outlined" size="medium" color="primary" onClick={onBackBtnClick}>
              Back
            </Button>
          )}
          <Button
            className={styles['submit']}
            variant="contained"
            size="medium"
            color="primary"
            onClick={handleSubmit}
            disabled={submitBtnLoading}
          >
            {submitBtnLoading ? <CircularProgress color="inherit" size={'22px'} /> : 'Next'}
          </Button>
        </footer>
      </div>
    </>
  )
}

export default ProfileHobbyEditModal
