import React, { useEffect, useState } from 'react'

import styles from './UserOnboardingWelcomeModal.module.css'
import Image from 'next/image'
import FilledButton from '@/components/_buttons/FilledButton'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'
import { closeModal } from '@/redux/slices/modal'
import { IconButton, InputAdornment, TextField } from '@mui/material'
import SearchIcon from '@/assets/svg/search-small.svg'
import { setShowPageLoader } from '@/redux/slices/site'
import {
  getMyProfileDetail,
  searchUsers,
  updateMyProfileDetail,
} from '@/services/user.service'
import {
  Page,
  setHobbiesSearchResult,
  setSearchString,
  setTypeResultOne,
  setTypeResultThree,
  setTypeResultTwo,
  setUserSearchResults,
} from '@/redux/slices/search'
import { searchPages } from '@/services/listing.service'
import { getAllHobbies } from '@/services/hobby.service'
import { RootState } from '@/redux/store'
import defaultUserImage from '@/assets/svg/default-images/default-user-icon.svg'
import CustomSnackbar from '@/components/CustomSnackbar/CustomSnackbar'
import checkedboxChecked from '@/assets/svg/checkbox-checked.svg'
import checkedboxUnChecked from '@/assets/svg/Checkbox-unchecked.svg'
import { updateProfileData } from '@/redux/slices/user'

type SearchInput = {
  search: InputData<string>
}

const UserOnboardingWelcomeModal = () => {
  const { user } = useSelector((state: RootState) => state.user)
  const [data, setData] = useState<SearchInput>({
    search: { value: '', error: null },
  })
  const [showWelcome, setShowWelcome] = useState<boolean>(true)
  const dispatch = useDispatch()
  const router = useRouter()
  const initialInnerWidth = () => {
    let width = window.innerWidth
    if (width - 1300 >= 0) {
      return (width - 1300) / 2
    } else return 0
  }

  const [screenWidth, setScreenWidth] = useState(initialInnerWidth)
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    setData((prev) => ({ ...prev, search: { value, error: null } }))
  }
  const [snackbar, setSnackbar] = useState({
    type: 'success',
    display: false,
    message: '',
  })
  const searchResult = async () => {
    if (localStorage) {
      localStorage.setItem('modal-shown-after-login', 'true')
    }
    dispatch(closeModal())
    router.push('/search')
    const searchValue = data.search.value.trim()
    const taglineValue = ''
    const cityValue = ''
    const hobbyValue = ''
    const titleValue = ''

    if (!searchValue && !taglineValue && !cityValue && !hobbyValue) {
      console.log('Search fields are empty.')
      return
    }

    let searchCriteria = {
      full_name: searchValue,
      tagline: taglineValue,
      city: cityValue,
      hobby: hobbyValue,
      title: titleValue,
    }

    try {
      dispatch(setShowPageLoader(true))
      const { res: userRes, err: userErr } = await searchUsers(searchCriteria)
      if (userErr) {
        console.error('An error occurred during the user search:', userErr)
      } else {
        console.log('User search results:', userRes)
        dispatch(setUserSearchResults(userRes))
      }
      // Search by title
      dispatch(setShowPageLoader(true))
      const { res: titleRes, err: titleErr } = await searchPages({
        title: searchValue,
      })
      if (titleErr) {
        console.error('An error occurred during the title search:', titleErr)
        return
      }
      console.warn({ titleRes })
      let combinedResults = new Set(titleRes.data.slice(0, 50))
      let remainingSlots = 50 - combinedResults.size

      if (combinedResults.size < 10) {
        dispatch(setShowPageLoader(true))
        const { res: taglineRes, err: taglineErr } = await searchPages({
          tagline: searchValue,
        })
        if (!taglineErr) {
          combinedResults = combinedResults.add(
            taglineRes.data.slice(0, remainingSlots),
          )
        }
      }
      // If title search results are exactly 50, prioritize the first 40 and get 10 by tagline
      else if (combinedResults.size === 50) {
        dispatch(setShowPageLoader(true))
        combinedResults = new Set(Array.from(combinedResults).slice(0, 40))
        const { res: taglineRes, err: taglineErr } = await searchPages({
          tagline: searchValue,
        })
        if (!taglineErr) {
          combinedResults = combinedResults.add(taglineRes.data.slice(0, 10))
        }
      }

      const typeResultOne = Array.from(combinedResults).filter(
        (page: any) => page.type === 1 && page.is_published === true,
      )

      dispatch(
        setTypeResultOne({
          data: typeResultOne as Page[],
          message: 'Search completed successfully.',
          success: true,
        }),
      )
      const typeResultTwo = Array.from(combinedResults).filter(
        (page: any) => page.type === 2 && page.is_published === true,
      )

      dispatch(
        setTypeResultTwo({
          data: typeResultTwo as Page[],
          message: 'Search completed successfully.',
          success: true,
        }),
      )
      const typeResultThree = Array.from(combinedResults).filter(
        (page: any) => page.type === 3 && page.is_published === true,
      )

      dispatch(
        setTypeResultThree({
          data: typeResultThree as Page[],
          message: 'Search completed successfully.',
          success: true,
        }),
      )
      const query = `fields=display,genre,slug,profile_image&level=3&level=2&level=1&level=0&show=true&search=${searchValue}`
      dispatch(setShowPageLoader(true))
      const { res: hobbyRes, err: hobbyErr } = await getAllHobbies(query)
      if (hobbyErr) {
        console.error('An error occurred during the page search:', hobbyErr)
      } else {
        console.log('hobbies search results:', hobbyRes.data.hobbies)
        dispatch(setHobbiesSearchResult(hobbyRes.data.hobbies))
      }
      dispatch(setShowPageLoader(false))
      dispatch(setSearchString(searchValue))
    } catch (error) {
      dispatch(setShowPageLoader(false))
      console.error('An error occurred during the combined search:', error)
    }
  }
  const updateWelcomeStatus = async () => {
    const { err: error, res: response } = await getMyProfileDetail()
    console.log('userdataaa', response)
    setShowWelcome(response?.data.data?.user?.show_welcome)
  }
  useEffect(() => {
    updateWelcomeStatus()
    const updateScreenWidth = () => {
      let width = window.innerWidth
      if (width - 1300 >= 0) {
        setScreenWidth((width - 1300) / 2)
      } else setScreenWidth(0)
    }
    window.addEventListener('resize', updateScreenWidth)
    return () => {
      window.removeEventListener('resize', updateScreenWidth)
    }
  }, [])

  const ShowWelcome = async () => {
    if (showWelcome) {
      const { err, res } = await updateMyProfileDetail({
        show_welcome: false,
      })
      console.log('welcome false')
      setShowWelcome(false)
    } else {
      const { err, res } = await updateMyProfileDetail({
        show_welcome: true,
      })
      setShowWelcome(true)
    }
  }

  return (
    <>
      <div className={styles.wrapper}>
        <div className={styles['display-desktop']}>
          <div
            style={{ left: `calc(0rem + ${screenWidth}px - 5px)` }}
            className={styles['my-community-wrapper']}
          >
            <Image
              className={styles['hobbycue-logo']}
              src="/logo-welcome-small.svg"
              onClick={() => {
                localStorage.setItem('modal-shown-after-login', 'true')
                dispatch(closeModal())
                router.push('/community')
              }}
              alt=""
              width={55}
              height={55}
            />
            <div>
              <div className={styles['my-community']}>
                <svg
                  width="22"
                  height="19"
                  viewBox="0 0 22 19"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M0 0V19H22L0 0Z" fill="white" />
                </svg>
                <div>
                  <p>My community</p>
                  <p>Communities specific to your Hobbies + Location.</p>

                  <FilledButton
                    className={styles['button']}
                    onClick={() => {
                      router.push('/community')
                      localStorage.setItem('modal-shown-after-login', 'true')
                      dispatch(closeModal())
                    }}
                  >
                    My Community
                  </FilledButton>
                </div>
              </div>
            </div>
          </div>
          <div
            style={{ left: `calc(5.4rem + ${screenWidth}px)` }}
            className={styles['search-wrapper']}
          >
            {/* <div className={styles['search']}> */}
            <TextField
              variant="outlined"
              placeholder="Search for anything on your hobbies..."
              size="small"
              className={styles.inputField}
              onChange={handleInputChange}
              value={data.search.value}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  searchResult()
                }
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  padding: 0,
                  overflow: 'hidden',
                  borderColor: 'red',
                  background: '#f8f9fa',
                  '& fieldset': {
                    borderColor: '#EBEDF0',
                    borderRight: 0,
                  },
                },
                '& .MuiInputBase-input': {
                  fontSize: '15px',
                },
                '& .MuiInputBase-input::placeholder': {
                  fontSize: '12px',
                  color: 'black',
                },
              }}
              InputLabelProps={{ shrink: false }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      sx={{
                        bgcolor: 'primary.main',
                        borderRadius: '0px 8px 8px 0px',
                        '&:hover': {
                          bgcolor: 'primary.dark',
                        },
                      }}
                    >
                      <div
                        className={styles['search-icon-container']}
                        onClick={searchResult}
                      >
                        <Image
                          src={SearchIcon}
                          alt="search"
                          width={16}
                          height={16}
                        />
                      </div>
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            {/* <div>
              <p>Search here...</p>
            </div> */}

            {/* </div> */}
            <div>
              <div className={styles['search-content']}>
                <svg
                  width="22"
                  height="19"
                  viewBox="0 0 22 19"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M0 0V19H22L0 0Z" fill="white" />
                </svg>
                <div>
                  <p>Search</p>
                  <p>Search the site and you may find your next cue.</p>
                  <FilledButton
                    className={styles['button']}
                    onClick={() => {
                      router.push('/search')
                      localStorage.setItem('modal-shown-after-login', 'true')
                      dispatch(closeModal())
                    }}
                  >
                    Search
                  </FilledButton>
                </div>
              </div>
            </div>
          </div>
          <div
            style={{ right: `calc(1.5rem + ${screenWidth}px)` }}
            className={styles['my-profile-wrapper']}
          >
            <div className={styles['my-profile']}>
              {user.profile_image ? (
                <Image
                  onClick={() => {
                    localStorage.setItem('modal-shown-after-login', 'true')
                    dispatch(closeModal())
                    router.push(`/profile/${user?.profile_url}`)
                  }}
                  src={
                    user?.profile_image ? user?.profile_image : defaultUserImage
                  }
                  alt=""
                  width={50}
                  height={50}
                  className={styles['my-profile-rounded']}
                />
              ) : (
                <div
                  style={{ width: '50px', height: '50px', cursor: 'pointer' }}
                  className="default-user-icon"
                ></div>
              )}
            </div>
            <div>
              <div className={styles['my-profile-content']}>
                <svg
                  width="22"
                  height="19"
                  viewBox="0 0 22 19"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M22 0V19H0L22 0Z" fill="white" />
                </svg>

                <div>
                  <p>My Profile</p>
                  <p>View your Profile, Add Pics, Social and more.</p>
                  <FilledButton
                    className={styles['button']}
                    onClick={() => {
                      localStorage.setItem('modal-shown-after-login', 'true')
                      dispatch(closeModal())
                      router.reload()
                    }}
                  >
                    My Profile
                  </FilledButton>
                </div>
              </div>
            </div>
          </div>
          <div className={styles['welcome-wrapper']}>
            <div>
              <Image src={'/celebration.png'} alt="" width={60} height={60} />
            </div>
            <div>
              <p>Welcome to HobbyCue</p>
              <div>
                <p>Choose from one of the options to continue.</p>
                <p>You can always find them on the top navigation.</p>
              </div>
            </div>
            <div>
              <Image
                alt={'dont show checkbox'}
                onClick={ShowWelcome}
                src={showWelcome ? checkedboxUnChecked : checkedboxChecked}
              />
              <p>Do not show this next time</p>
            </div>
          </div>
        </div>

        <div className={`${styles['mobile']} ${styles['display-mobile']}`}>
          <div>
            <div className={styles['my-community-wrapper-mobile']}>
              <Image
                src="/logo-welcome-small.svg"
                onClick={() => {
                  localStorage.setItem('modal-shown-after-login', 'true')
                  dispatch(closeModal())
                }}
                alt=""
                width={40}
                height={40}
              />
              <div>
                <div className={styles['my-community-mobile']}>
                  <svg
                    width="44"
                    height="314"
                    viewBox="0 0 44 314"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M1.78125 0.742188V308.418C1.78125 310.627 3.57211 312.418 5.78125 312.418H43.127"
                      stroke="#1CB7EB"
                      stroke-width="2"
                    />
                  </svg>

                  <div className={styles['my-community-mobile-content']}>
                    <div>
                      <p>My community</p>
                      <p>Communities specific to your Hobbies + Location.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles['search-wrapper-mobile']}>
              <Image
                onClick={searchResult}
                src={'/searchIcon.svg'}
                width={30}
                height={30}
                alt=""
              />
              <div>
                <div className={styles['search-mobile']}>
                  <svg
                    width="76"
                    height="112"
                    viewBox="0 0 76 112"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M74.3128 0.0234375V106.738C74.3128 108.947 72.5219 110.738 70.3128 110.738H0.9375"
                      stroke="#1CB7EB"
                      stroke-width="2"
                    />
                  </svg>
                  <div className={styles['search-mobile-content']}>
                    <div>
                      <p>Search</p>
                      <p>Search the site and you may find your next cue.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles['my-profile-wrapper-mobile']}>
              <Image
                src={'/hamburger-menu.svg'}
                width={30}
                height={30}
                alt=""
              />
              <div>
                <div className={styles['my-profile-mobile']}>
                  <svg
                    width="68"
                    height="215"
                    viewBox="0 0 68 215"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M66.3993 0.0859375V209.441C66.3993 211.651 64.6085 213.441 62.3993 213.441H0.429688"
                      stroke="#1CB7EB"
                      stroke-width="2"
                    />
                  </svg>
                  <div className={styles['my-profile-mobile-content']}>
                    <div>
                      <p>My Profile</p>
                      <p>Search the site and you may find your next cue.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles['welcome-wrapper-mobile']}>
              <div>
                <Image src={'/celebration.png'} alt="" width={60} height={60} />
              </div>
              <div>
                <p>Welcome to HobbyCue</p>
                <div>
                  <p>Choose from one of the options to continue.</p>
                  <p>You can always find them on the top navigation.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {
        <CustomSnackbar
          message={snackbar?.message}
          triggerOpen={snackbar?.display}
          type={snackbar.type === 'success' ? 'success' : 'error'}
          closeSnackbar={() => {
            localStorage.setItem('modal-shown-after-login', 'true')
            dispatch(closeModal())
            setSnackbar((prevValue) => ({ ...prevValue, display: false }))
          }}
        />
      }
    </>
  )
}

export default UserOnboardingWelcomeModal
