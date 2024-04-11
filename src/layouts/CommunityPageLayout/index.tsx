import React, { useEffect, useRef, useState } from 'react'
import PageContentBox from '@/layouts/PageContentBox'
import PageGridLayout from '@/layouts/PageGridLayout'
import { withAuth } from '@/navigation/withAuth'
import styles from './CommunityLayout.module.css'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useDispatch, useSelector } from 'react-redux'
import store, { RootState } from '@/redux/store'
import EditIcon from '@/assets/svg/edit-icon.svg'
import { openModal } from '@/redux/slices/modal'
import { getAllPosts } from '@/services/post.service'
import { GetServerSideProps } from 'next'
import defaultUserIcon from '@/assets/svg/default-images/default-user-icon.svg'
import {
  setFilters,
  updateLoading,
  updatePages,
  updatePagesLoading,
  updatePosts,
} from '@/redux/slices/post'
import PostCard from '@/components/PostCard/PostCard'
import ProfileSwitcher from '@/components/ProfileSwitcher/ProfileSwitcher'
import PostCardSkeletonLoading from '@/components/PostCardSkeletonLoading'
import { checkIfUrlExists, validateEmail } from '@/utils'
import Link from 'next/link'
import { getAllHobbies, getTrendingHobbies } from '@/services/hobby.service'
import DefaultHobbyImg from '@/assets/svg/default-images/default-hobbies.svg'
import DefaultHobbyImgcover from '@/assets/svg/default-images/default-hobby-cover.svg'
import { CircularProgress, MenuItem, Select, Snackbar, useMediaQuery } from '@mui/material'
import FilledButton from '@/components/_buttons/FilledButton'
import InputSelect from '@/components/_formElements/Select/Select'
import { DropdownOption } from '@/components/_modals/CreatePost/Dropdown/DropdownOption'
import { getListingPages } from '@/services/listing.service'
import { setShowPageLoader } from '@/redux/slices/site'
import { InviteToCommunity } from '@/services/auth.service'
import CustomSnackbar from '@/components/CustomSnackbar/CustomSnackbar'
import CommunityTopDropdown from '@/components/_formElements/CommunityTopDropdown/CommunityTopDropdown'
import { CommunityDropdownOption } from '@/components/_formElements/CommunityDropdownOption/CommunityDropdownOption'
import PanelDropdownList from './PanelDropdownList'
import { showProfileError } from '@/redux/slices/user'

type Props = {
  activeTab: CommunityPageTabs
  children: React.ReactNode
  singlePostPage?: boolean
}

const CommunityLayout: React.FC<Props> = ({
  children,
  activeTab,
  singlePostPage,
}) => {
  const dispatch = useDispatch()
  const { activeProfile, user } = useSelector((state: RootState) => state.user)
  const { allPosts, filters } = useSelector((state: RootState) => state.post)
  const [showPanel, setShowPanel] = useState(false)
  const [hobbyGroup, setHobbyGroup] = useState({
    profile_image: null,
    cover_image: null,
    display: '',
  })
  const [locations, setLocations] = useState([])
  const [email, setEmail] = useState('')
  const [selectedHobby, setSelectedHobby] = useState('')
  const [selectedGenre, setSelectedGenre] = useState<string | undefined>('')
  const [selectedLocation, setSelectedLocation] = useState('')

  const [snackbar, setSnackbar] = useState({
    type: 'success',
    display: false,
    message: '',
  })
  const tabs: CommunityPageTabs[] = [
    'posts',
    'links',
    'pages',
    'store',
    'blogs',
  ]
  const [visibilityData, setVisibilityData] = useState([
    { display: 'All Locations', value: 'All Locations' },
  ])
  const [seeMoreHobby, setSeeMoreHobby] = useState(
    // activeProfile.data?._hobbies?.length > 3 ? true : false,
    false,
  )
  const [errorMessage, setErrorMessage] = useState('')

  const [inviteBtnLoader, setInviteBtnLoader] = useState(false)
  const [trendingHobbies, setTrendingHobbies] = useState([])
  const panelListData = [{
    name:"Trending Hobbies",
    options:trendingHobbies,
  }];
  console.log('Number of hobbies:', activeProfile.data?._hobbies?.length)

  const hideThirdColumnTabs = ['pages', 'links', 'store', 'blogs']
  const { showPageLoader } = useSelector((state: RootState) => state.site)
  const { refreshNum } = useSelector((state: RootState) => state.post)
  const router = useRouter()

  const toggleSeeMore = () => {
    setSeeMoreHobby(!seeMoreHobby)
    dispatch(setFilters({ seeMoreHobbies: !seeMoreHobby }))
  }
  // const getPost = async () => {
  //   const params = new URLSearchParams(`populate=_author,_genre,_hobby`)
  //   activeProfile?.data?._hobbies.forEach((item: any) => {
  //     params.append('_hobby', item.hobby?._id)
  //   })
  //   if (!activeProfile?.data?._hobbies) return

  //   if (activeProfile?.data?._hobbies.length === 0) return
  //   console.log('active', activeProfile.data._hobbies)
  //   dispatch(updateLoading(true))
  //   const { err, res } = await getAllPosts(params.toString())
  //   if (err) return console.log(err)
  //   if (res.data.success) {
  //     store.dispatch(updatePosts(res.data.data.posts))
  //   }
  //   dispatch(updateLoading(false))
  // }

  // useEffect(() => {
  //   fetchPosts()
  // }, [activeProfile])

  const handleHobbyClick = async (hobbyId: any, genreId: any) => {
    console.log('hobbyIDDDD', hobbyId, genreId)
    if (selectedHobby !== hobbyId || selectedGenre !== genreId) {
      dispatch(
        setFilters({
          hobby: hobbyId,
        }),
      )
      setSelectedHobby(hobbyId)
      if (genreId !== '') {
        setSelectedGenre(genreId)
        dispatch(setFilters({ genre: genreId }))
      }

      // Fetch posts for the newly selected hobby
      const params = new URLSearchParams(`populate=_author,_genre,_hobby`)
      params.append('_hobby', hobbyId)
      if (genreId !== 'undefined' && genreId !== '') {
        params.append('_genre', genreId)
      }
      dispatch(updateLoading(true))

      dispatch(updateLoading(false))
    } else {
      dispatch(setFilters({ genre: '', hobby: '' }))
      setSelectedHobby('')
      setSelectedGenre('')
      // fetchPosts()
    }
  }

  const EditProfileLocation = () => {
    console.log('activeprofile', activeProfile.type)
    if (activeProfile?.type === 'user') {
      window.location.href = '/settings/localization-payments'
    } else {
      dispatch(openModal({ type: 'listing-address-edit', closable: true }))
    }
  }

  const editHobbiesClick = () => {
    if (activeProfile?.type === 'user') {
      dispatch(
        openModal({
          type: 'profile-hobby-edit',
          closable: true,
        }),
      )
    } else {
      dispatch(
        openModal({
          type: 'listing-hobby-edit',
          closable: true,
        }),
      )
    }
  }
  console.log('l', activeProfile.data?._hobbies?.length)
  console.log('activeprofile', activeProfile)
  console.log('selected', selectedLocation)

  console.log('selectedhobbyy', selectedHobby)

  const fetchPosts = async () => {
    if (showPageLoader) {
      dispatch(setShowPageLoader(false))
    }
    let params: any = ''
    if (activeProfile?.data?._hobbies.length === 0) {
      dispatch(setShowPageLoader(true))
      store.dispatch(updatePosts(''))
      dispatch(setShowPageLoader(false))
      return
    }

    if (selectedLocation === '' && selectedHobby === '') return
    if (activeTab === 'links') {
      params = new URLSearchParams(
        `has_link=true&populate=_author,_genre,_hobby`,
      )
    } else {
      params = new URLSearchParams(`populate=_author,_genre,_hobby`)
    }
    if (selectedHobby !== '') {
      params.append('_hobby', selectedHobby)
    }
    if (
      selectedGenre &&
      selectedGenre !== 'undefined' &&
      selectedGenre !== ''
    ) {
      params.append('_genre', selectedGenre)
    }
    if (selectedGenre !== '') {
      // don't remove it, somehow it is helping in fetching correct things according to hobby and genre
    } else {
      activeProfile?.data?._hobbies.forEach((item: any) => {
        params.append('_hobby', item.hobby._id)
      })
    }
    let selectedPinCode = ''
    let selectedLocality = ''
    let selectedSociety = ''

    const localSelectedLocation = filters.location

    const addresses = activeProfile.data?._addresses || []
    const matchingAddress = [
      ...addresses,
      activeProfile.data?.primary_address ?? {},
    ].find(
      (address: any) =>
        address.city === (selectedLocation || localSelectedLocation) ||
        address.pin_code === (selectedLocation || localSelectedLocation) ||
        address.locality === (selectedLocation || localSelectedLocation) ||
        address.society === (selectedLocation || localSelectedLocation),
    )

    if (matchingAddress) {
      if (matchingAddress.city === selectedLocation) {
        params.append('visibility', matchingAddress.city)
        params.append('visibility', matchingAddress.pin_code)
        params.append('visibility', matchingAddress.locality)
        params.append('visibility', matchingAddress.society)
      }
      if (matchingAddress.pin_code === selectedLocation) {
        params.append('visibility', matchingAddress.pin_code)
        params.append('visibility', matchingAddress.locality)
        params.append('visibility', matchingAddress.society)
      }
      if (matchingAddress.locality === selectedLocation) {
        params.append('visibility', matchingAddress.locality)
        params.append('visibility', matchingAddress.society)
      }
      if (matchingAddress.society === selectedLocation) {
        params.append('visibility', matchingAddress.society)
      }
    }

    console.log('PARAMS ---', params.toString())
    dispatch(updateLoading(true))

    const { err, res } = await getAllPosts(params.toString())
    if (err) return console.log(err)
    if (res?.data?.success) {
      console.warn({ res })
      let posts = res.data.data.posts.map((post: any) => {
        let content = post.content.replace(/<img .*?>/g, '')
        return { ...post, content }
      })
      store.dispatch(updatePosts(posts))
    }
    dispatch(updateLoading(false))
  }

  const fetchTrendingHobbies = async () => {
    const { err, res } = await getTrendingHobbies(``)
    if (err) {
      return console.log('err', err)
    }
    setTrendingHobbies(res.data?.hobbies)
  }

  useEffect(() => {
    fetchTrendingHobbies()
  }, [])

  // const fetchPages = async () => {
  //   let params: any = ''
  //   if (!activeProfile?.data?._hobbies) return
  //   if (activeProfile?.data?._hobbies.length === 0) return
  //   if (selectedLocation === '' && selectedHobby === '') return
  //   params = new URLSearchParams(`populate=_author,_genre,_hobby`)
  //   if (selectedHobby !== '') {
  //     params.append('_hobby', selectedHobby)
  //   } else {
  //     activeProfile?.data?._hobbies.forEach((item: any) => {
  //       params.append('_hobby', item.hobby._id)
  //     })
  //   }
  //   if (selectedLocation !== '' && selectedLocation !== 'All locations') {
  //     params.append('location', selectedLocation)
  //   }
  //   console.log('PARAMS ---', params.toString())
  //   dispatch(updatePagesLoading(true))

  //   const { err, res } = await getListingPages(params.toString())
  //   if (err) return console.log(err)
  //   if (res?.data.success) {
  //     if (err) return console.log(err)
  //     if (res?.data.success) {
  //       store.dispatch(updatePages(res.data.data.listings))
  //     }
  //   }
  //   dispatch(updatePagesLoading(false))
  // }

  useEffect(() => {
    if (activeTab === 'posts' || activeTab === 'links') {
      if (selectedLocation !== '') {
        fetchPosts()
      }
    }
  }, [
    selectedHobby,
    selectedLocation,
    activeProfile,
    selectedGenre,
    refreshNum,
  ])

  useEffect(() => {
    if (selectedHobby !== '' && selectedLocation !== '') {
      fetchHobby()
    }
  }, [selectedHobby, selectedLocation])

  const fetchHobby = async () => {
    // const query = `fields=display,sub_category&show=true&search=${selectedHobby}`
    const params = new URLSearchParams()
    params.set('_id', selectedHobby)
    const { err, res } = await getAllHobbies(
      `level=3&${params.toString()}&populate=category,sub_category,tags`,
    )
    // const { err, res } = await getAllHobbies(query)
    if (err) return console.log(err)
    console.log('res', res.data)
    if (res?.data && res?.data?.hobbies) {
      const hobby = res.data.hobbies[0]
      if (hobby !== undefined) {
        setHobbyGroup(hobby)
      }
    }
  }

  useEffect(() => {
    setSelectedGenre(filters.genre !== '' ? filters.genre : undefined)
    setSelectedHobby(filters.hobby)
    setSelectedLocation(filters.location ?? '')
  }, [filters.genre, filters.hobby, filters.location])

  useEffect(() => {
    setSeeMoreHobby(filters.seeMoreHobbies)
  }, [filters.seeMoreHobbies])

  console.log({ selectedGenre, selectedHobby })
  // useEffect(() => {
  //   let tempLocations: any = []
  //   activeProfile.data?._addresses?.forEach((address: any) => {
  //     if (address?.city) {
  //       tempLocations.push(address?.city)
  //     }
  //     if (address?.country) {
  //       tempLocations.push(address?.country)
  //     }
  //     if (address?.pin_code) {
  //       tempLocations.push(address?.pin_code)
  //     }
  //     if (address?.society) {
  //       tempLocations.push(address?.society)
  //     }
  //     if (address?.state) {
  //       tempLocations.push(address?.state)
  //     }
  //   }),
  //     setLocations(tempLocations)
  // }, [activeProfile])

  useEffect(() => {
    if (activeProfile.type === 'user') {
      if (activeProfile.data?._addresses) {
        if (activeProfile.data?._addresses?.length > 0) {
          let visibilityArr: any = [
            {
              value: 'All Locations',
              display: 'All Locations',
              type: 'text',
            },
          ]
          activeProfile.data?._addresses.map((address: any) => {
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
              obj.value = `${address.city ?? 'Home'}`
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
          if (visibilityArr[1]) {
            console.log({ visibilityArr })
            if (visibilityArr[1].display) {
              if (filters.location === null) {
                dispatch(
                  setFilters({
                    location:
                      visibilityArr[1]?.display?.split(' ')[0] ||
                      'All locations',
                  }),
                )
                setSelectedLocation(
                  visibilityArr[1]?.display?.split(' ')[0] || 'All locations',
                )
              }
            }
          }
          setVisibilityData(visibilityArr)
        }
      }
    } else if (activeProfile.type === 'listing') {
      let address = activeProfile.data?._address
      let visibilityArr: any = [
        {
          value: 'All locations',
          display: 'All locations',
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
  }, [activeProfile])

  const updateFilterLocation = (val: any) => {
    dispatch(
      setFilters({
        location: selectedLocation === val ? 'All Locations' : val,
      }),
    )
    setSelectedLocation((prev) => {
      if (prev === val) {
        return 'All Locations'
      } else {
        return val
      }
    })
  }

  const handleStartPost = () => {
    if (!user.is_onboarded) {
      router.push(`/profile/${user.profile_url}`)
      dispatch(showProfileError(true))
    } else {
      dispatch(openModal({ type: 'create-post', closable: true }))
    }
  }

  // useEffect(()=>{
  //   console.warn({selectedLocation})
  //   console.warn({visibilityData})
  // }
  // ,[selectedLocation,visibilityData])

  const Invitecommunity = async () => {
    const to = email
    if (!to || to === '') {
      setErrorMessage('This field is required')
      return
    }
    if (!validateEmail(to)) {
      setErrorMessage('Please enter a valid email')
      return
    }
    setErrorMessage('')
    const name = activeProfile?.data.full_name
    setInviteBtnLoader(true)
    const { err, res } = await InviteToCommunity({
      to,
      name,
    })
    if (res.data?.success) {
      setInviteBtnLoader(false)
      setSnackbar({
        display: true,
        type: 'success',
        message: 'Invitation sent',
      })
      setEmail('')
    }
    if (err) {
      setEmail('')
      setInviteBtnLoader(false)
      setSnackbar({
        display: true,
        type: 'error',
        message: 'Invitation failed.',
      })
    }
  }

  const DoubleArrowSvg = ({rotate}:{rotate?:boolean}) => {
    return (<svg style={{rotate:rotate===true?"180deg":"0deg"}} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M13.75 10.9375L10 14.6875L6.25 10.9375M13.75 5.3125L10 9.0625L6.25 5.3125" stroke="#8064A2" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>)
  }

  const isMobile = useMediaQuery('(max-width:1100px)')

  const hobbiesDropDownArr =
    activeProfile.data?._hobbies?.map((item: any) => ({
      value: item.hobby?._id,
      genreId: item.genre?._id, // Add genre id to the object
      display: `${item.hobby?.display}${item?.genre?.display ? ' - ' : ''}${
        item?.genre?.display ?? ''
      }`,
    })) ?? []

  return (
    <>
      <PageGridLayout
        column={hideThirdColumnTabs.includes(activeTab) ? 2 : 3}
        responsive={true}
      >
       {!isMobile&&<aside className={`${styles['community-left-aside']} custom-scrollbar`}>
          <ProfileSwitcher />
          <section
            className={`content-box-wrapper ${styles['hobbies-side-wrapper']}`}
          >
            <header>
              <h3>Hobbies</h3>
              <Image
                src={EditIcon}
                onClick={() => {
                  if (activeProfile?.type === 'user') {
                    dispatch(
                      openModal({ type: 'profile-hobby-edit', closable: true }),
                    )
                  } else {
                    dispatch(
                      openModal({ type: 'listing-hobby-edit', closable: true }),
                    )
                  }
                }}
                alt="edit"
              />
              {/* <Image src={EditIcon} alt="Edit" /> */}
            </header>
            {/* <span className={styles['divider']}></span> */}
            <section>
              <ul>
                {activeProfile.data?._hobbies
                  ?.slice(
                    0,
                    seeMoreHobby ? activeProfile.data?._hobbies.length : 3,
                  )
                  .map((hobby: any) => {
                    return (
                      <li
                        key={hobby._id}
                        onClick={() =>
                          handleHobbyClick(hobby.hobby?._id, hobby.genre?._id)
                        }
                        className={
                          selectedHobby === hobby.hobby?._id &&
                          (selectedGenre !== ''
                            ? selectedGenre === hobby.genre?._id
                            : '')
                            ? styles.selectedItem
                            : ''
                        }
                      >
                        {hobby?.hobby?.display}
                        {hobby?.genre && ` - ${hobby?.genre?.display} `}
                      </li>
                    )
                  })}
                {activeProfile.data?._hobbies?.length >= 4 &&
                  (!seeMoreHobby ? (
                    <p className={styles['see-more']} onClick={toggleSeeMore}>
                      {' '}
                      See more{' '}
                    </p>
                  ) : (
                    <p className={styles['see-more']} onClick={toggleSeeMore}>
                      {' '}
                      See less{' '}
                    </p>
                  ))}
              </ul>
            </section>
          </section>

          <section
            className={`content-box-wrapper ${styles['location-side-wrapper']}`}
          >
            <header>
              <h3>Location</h3>
              <Image src={EditIcon} onClick={EditProfileLocation} alt="edit" />
              {/* <Image src={EditIcon} alt="Edit" /> */}
            </header>
            {/* <span className={styles['divider']}></span> */}
            {visibilityData?.length > 0 && (
              <InputSelect
                onChange={(e: any) => updateFilterLocation(e.target.value)}
                value={selectedLocation}
                // inputProps={{ 'aria-label': 'Without label' }}
                className={` ${styles['location-dropdown']}`}
              >
                {visibilityData?.map((item: any, idx) => {
                  return (
                    <>
                      <DropdownOption
                        {...item}
                        key={idx}
                        currentValue={selectedLocation}
                        onChange={(val: any) => updateFilterLocation(val)}
                      />
                    </>
                  )
                })}
              </InputSelect>
            )}
            {/* <section>
              <ul>
                {activeProfile.data?._addresses?.map((address: any) => {
                  return (
                    <ul key={address._id}>
                      <li
                        onClick={() => handleLocationClick(address?.city)}
                        className={
                          selectedLocation === address?.city
                            ? styles.selectedItem
                            : ''
                        }
                      >
                        {address?.city}
                      </li>
                      <li
                        onClick={() => handleLocationClick(address?.country)}
                        className={
                          selectedLocation === address?.country
                            ? styles.selectedItem
                            : ''
                        }
                      >
                        {address?.country}
                      </li>
                      <li
                        onClick={() => handleLocationClick(address?.pin_code)}
                        className={
                          selectedLocation === address?.pin_code
                            ? styles.selectedItem
                            : ''
                        }
                      >
                        {address?.pin_code}
                      </li>
                      <li
                        onClick={() => handleLocationClick(address?.society)}
                        className={
                          selectedLocation === address?.society
                            ? styles.selectedItem
                            : ''
                        }
                      >
                        {address?.society}
                      </li>
                      <li
                        onClick={() => handleLocationClick(address?.state)}
                        className={
                          selectedLocation === address?.state
                            ? styles.selectedItem
                            : ''
                        }
                      >
                        {address?.state}
                      </li>
                    </ul>
                  )
                })}
              </ul>
            </section> */}
          </section>
        </aside>}

        <main>
          {!singlePostPage && (
            <header
              className={`${styles['community-header']} ${
                hideThirdColumnTabs.includes(activeTab)
                  ? styles['community-header-small']
                  : ''
              }`}
            >
              <div className={styles['community-header-left']}>
                {/* {selectedHobby !== '' &&
                  selectedLocation !== '' &&
                  Object.keys(hobbyGroup).length > 5 && (
                    <div className={styles['community-group-container']}>
                      <div className={styles['community-group-header']}>
                        <div className={styles['profile-img-container']}>
                          <Image
                            src={
                              hobbyGroup?.profile_image
                                ? hobbyGroup?.profile_image
                                : DefaultHobbyImg
                            }
                            alt="hobby-img"
                          />
                        </div>
                        <div className={styles['cover-img-container']}>
                          <Image
                            src={
                              hobbyGroup.cover_image
                                ? hobbyGroup.cover_image
                                : DefaultHobbyImgcover
                            }
                            alt="hobby-img"
                          />
                        </div>
                      </div>
                      <p>
                        {hobbyGroup?.display} in {selectedLocation}
                      </p>
                    </div>
                  )} */}
                <section
                  className={`content-box-wrapper ${styles['start-post-btn-container']}`}
                >
                  {user?.profile_image ? (
                    <img
                      src={user?.profile_image}
                      alt=""
                      className={styles['profile-img']}
                      height={40}
                      width={40}
                    />
                  ) : (
                    <Image
                      src={defaultUserIcon}
                      alt=""
                      className={styles['profile-img']}
                      height={40}
                      width={40}
                    />
                  )}
                  <button
                    onClick={handleStartPost}
                    className={styles['start-post-btn']}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clip-path="url(#clip0_704_44049)">
                        <path
                          d="M13.1429 8.85714H8.85714V13.1429C8.85714 13.6143 8.47143 14 8 14C7.52857 14 7.14286 13.6143 7.14286 13.1429V8.85714H2.85714C2.38571 8.85714 2 8.47143 2 8C2 7.52857 2.38571 7.14286 2.85714 7.14286H7.14286V2.85714C7.14286 2.38571 7.52857 2 8 2C8.47143 2 8.85714 2.38571 8.85714 2.85714V7.14286H13.1429C13.6143 7.14286 14 7.52857 14 8C14 8.47143 13.6143 8.85714 13.1429 8.85714Z"
                          fill="#8064A2"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_704_44049">
                          <rect width="16" height="16" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>

                    <span>Start a post</span>
                  </button>
                </section>
                <section className={styles['filter-section']}>
                  <div>
                    <CommunityTopDropdown
                      maxWidth="139px"
                      className={styles['hobby-select']}
                      value={
                        hobbiesDropDownArr.find(
                          (obj: any) => obj?.value === selectedHobby,
                        )?.display ?? 'All Hobbies'
                      }
                      variant={selectedHobby === '' ? 'secondary' : 'primary'}
                    >
                      {[
                        { display: 'All Hobbies', value: '' },
                        ...hobbiesDropDownArr,
                        {
                          display: 'Edit Hobbies',
                          value: '',
                          pencil: true,
                          onClick: editHobbiesClick,
                          smallPencil: true,
                        },
                      ]?.map((item: any, idx) => (
                        <CommunityDropdownOption
                          maxWidth="139px"
                          {...item}
                          key={idx}
                          currentValue={
                            hobbiesDropDownArr.find(
                              (obj: any) => obj?.value === selectedHobby,
                            )?.value ?? 'All Hobbies'
                          }
                          onChange={(val: any) =>
                            handleHobbyClick(val?.value, item.genreId ?? '')
                          }
                        />
                      ))}
                    </CommunityTopDropdown>

                    <div className={styles.hobbyDropDownOption}>at</div>

                    {visibilityData?.length > 0 && (
                      <CommunityTopDropdown
                        value={selectedLocation || ''}
                        variant={
                          selectedLocation === 'All Locations'
                            ? 'secondary'
                            : 'primary'
                        }
                      >
                        {[
                          ...visibilityData,
                          {
                            display: 'Edit Location',
                            value: '',
                            pencil: true,
                            onClick: EditProfileLocation,
                          },
                        ]?.map((item: any, idx) => (
                          <CommunityDropdownOption
                            {...item}
                            key={idx}
                            currentValue={selectedLocation}
                            onChange={(val: any) =>
                              updateFilterLocation(
                                val?.display?.split('-')[0]?.trim(),
                              )
                            }
                          />
                        ))}
                      </CommunityTopDropdown>
                    )}

                    <button onClick={()=>setShowPanel(prev=>!prev)} className={styles['panel-dropdown-btn']}>
                      <DoubleArrowSvg rotate={showPanel}/>
                    </button>
                  </div>
                </section>
                {showPanel&&
                <section className={styles['dropdowns-panel']}>
                  {panelListData.map((obj:{name:string,options:any[]},idx:number)=>(
                   <PanelDropdownList name={obj.name} options={obj.options} key={idx}/>
                  ))}
                </section>
                }
                <section
                  className={`content-box-wrapper ${styles['navigation-links']}`}
                >
                  <ul>
                    {tabs.map((tab, idx) => {
                      return (
                        <li
                          key={idx}
                          className={activeTab === tab ? styles['active'] : ''}
                        >
                          <Link
                            key={tab}
                            href={`/community/${tab !== 'posts' ? tab : ''}`}
                          >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                          </Link>
                        </li>
                      )
                    })}
                  </ul>
                </section>
              </div>
              {hideThirdColumnTabs.includes(activeTab) && (
                <div className={styles['invite-container-main']}>
                  <section
                    className={`content-box-wrapper ${styles['invite-wrapper']}`}
                  >
                    <header>
                      <h3>
                        <span>
                          {activeProfile.data?._hobbies?.find(
                            (obj: any) => obj.hobby._id === selectedHobby,
                          )?.hobby?.display ?? 'All Hobbies'}

                          {activeProfile.data?._hobbies?.find(
                            (obj: any) =>
                              obj.hobby._id === selectedHobby &&
                              obj?.genre?._id === selectedGenre,
                          )?.genre &&
                            ` - ${
                              activeProfile.data?._hobbies?.find(
                                (obj: any) =>
                                  obj.hobby._id === selectedHobby &&
                                  selectedGenre === obj?.genre?._id,
                              )?.genre?.display
                            } `}
                        </span>{' '}
                        in <span>{selectedLocation}</span>
                      </h3>
                    </header>
                    {/* <span className={styles['divider']}></span> */}
                    <section>
                      <input type="text" name="" id="" />
                      <FilledButton>Invite</FilledButton>
                    </section>
                  </section>
                </div>
              )}
            </header>
          )}

          <section
            className={`${styles['children-wrapper']} ${
              singlePostPage ? styles['single-post-children-wrapper'] : ''
            } `}
          >
            {children}
          </section>
        </main>

        {hideThirdColumnTabs.includes(activeTab) === false && (
          <aside
            className={`custom-scrollbar ${styles['community-right-aside']}`}
          >
            <section
              className={`content-box-wrapper ${styles['invite-wrapper']}`}
            >
              <header>
                <h3>
                  <span>
                    {activeProfile.data?._hobbies?.find(
                      (obj: any) => obj.hobby._id === selectedHobby,
                    )?.hobby?.display ?? 'All Hobbies'}

                    {activeProfile.data?._hobbies?.find(
                      (obj: any) =>
                        obj.hobby._id === selectedHobby &&
                        obj?.genre?._id === selectedGenre,
                    )?.genre &&
                      ` - ${
                        activeProfile.data?._hobbies?.find(
                          (obj: any) =>
                            obj.hobby._id === selectedHobby &&
                            selectedGenre === obj?.genre?._id,
                        )?.genre?.display
                      } `}
                  </span>{' '}
                  in <span>{selectedLocation}</span>
                </h3>
              </header>
              {/* <span className={styles['divider']}></span> */}
              <section>
                <input
                  value={email}
                  placeholder="Email"
                  name="society"
                  onChange={(e: any) => setEmail(e.target.value)}
                  type="email"
                  id=""
                  className={errorMessage !== '' ? styles['error-input'] : ''}
                />
                <span className={styles['input-prefix']}></span>
                <FilledButton
                  onClick={Invitecommunity}
                  className={inviteBtnLoader ? styles['invite-loader-btn'] : ''}
                >
                  {inviteBtnLoader ? (
                    <CircularProgress color="inherit" size={'20px'} />
                  ) : (
                    'Invite'
                  )}
                </FilledButton>
                {/* <CircularProgress color="inherit" size={'22px'} /> */}
                {errorMessage !== '' && (
                  <span className={styles['error-invite']}>{errorMessage}</span>
                )}
              </section>
            </section>

            <section
              className={`content-box-wrapper ${styles['trending-hobbies-side-wrapper']}`}
            >
              <header>
                <h3>Trending hobbies</h3>
              </header>
              {/* <span className={styles['divider']}></span> */}
              <section>
                <ul>
                  {trendingHobbies?.map((hobby: any) => {
                    if (hobby.profile_image) {
                      console.log('hobby', hobby)
                    }
                    return (
                      <li key={hobby._id}>
                        <Link href={`/hobby/${hobby.slug}`}>
                          {/* <div className={styles['default-img']}></div> */}
                          <svg
                            className={styles.polygonOverlay}
                            width={40}
                            viewBox="0 0 160 160"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M80 0L149.282 40V120L80 160L10.718 120V40L80 0Z"
                              fill="#969696"
                              fill-opacity="0.5"
                            />
                            <path
                              d="M79.6206 46.1372C79.7422 45.7727 80.2578 45.7727 80.3794 46.1372L87.9122 68.7141C87.9663 68.8763 88.1176 68.9861 88.2885 68.9875L112.088 69.175C112.472 69.178 112.632 69.6684 112.323 69.8967L93.1785 84.0374C93.041 84.139 92.9833 84.3168 93.0348 84.4798L100.211 107.173C100.327 107.539 99.9097 107.842 99.5971 107.619L80.2326 93.7812C80.0935 93.6818 79.9065 93.6818 79.7674 93.7812L60.4029 107.619C60.0903 107.842 59.6731 107.539 59.789 107.173L66.9652 84.4798C67.0167 84.3168 66.959 84.139 66.8215 84.0374L47.6773 69.8967C47.3682 69.6684 47.5276 69.178 47.9118 69.175L71.7115 68.9875C71.8824 68.9861 72.0337 68.8763 72.0878 68.7141L79.6206 46.1372Z"
                              fill="white"
                            />
                          </svg>
                          <span>{`${hobby.display}`}</span>
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </section>
            </section>
          </aside>
        )}
      </PageGridLayout>
      {
        <CustomSnackbar
          message={snackbar.message}
          triggerOpen={snackbar.display}
          type={snackbar.type === 'success' ? 'success' : 'error'}
          closeSnackbar={() => {
            setSnackbar((prevValue) => ({ ...prevValue, display: false }))
          }}
        />
      }
    </>
  )
}

export default CommunityLayout
