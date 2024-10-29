import React, { useEffect, useRef, useState } from 'react'
import PageContentBox from '@/layouts/PageContentBox'
import PageGridLayout from '@/layouts/PageGridLayout'
import { withAuth } from '@/navigation/withAuth'
import styles from './CommunityLayout.module.css'
import { useRouter } from 'next/router'
import Image from 'next/image'
import { useDispatch, useSelector } from 'react-redux'
import store, { RootState } from '@/redux/store'
import EditIcon from '@/assets/svg/edit-icon.svg'
import { openModal } from '@/redux/slices/modal'
import { getAllPosts } from '@/services/post.service'
import { GetServerSideProps } from 'next'
import defaultUserIcon from '@/assets/svg/default-images/default-user-icon.svg'
import post, {
  appendPosts,
  setFilters,
  updateCurrentPage,
  updateHasMore,
  updateLoading,
  updatePages,
  updatePagesLoading,
  updatePosts,
} from '@/redux/slices/post'
import PostCard from '@/components/PostCard/PostCard'
import ProfileSwitcher from '@/components/ProfileSwitcher/ProfileSwitcher'
import PostCardSkeletonLoading from '@/components/PostCardSkeletonLoading'
import { checkIfUrlExists, pageType, validateEmail } from '@/utils'
import Link from 'next/link'
import {
  getAllHobbies,
  getHobbyMembersCommunity,
  getTrendingHobbies,
} from '@/services/hobby.service'
import DefaultHobbyImg from '@/assets/svg/default-images/default-hobbies.svg'
import DefaultHobbyImgcover from '@/assets/svg/default-images/default-hobby-cover.svg'
import {
  CircularProgress,
  MenuItem,
  Select,
  Snackbar,
  useMediaQuery,
} from '@mui/material'
import FilledButton from '@/components/_buttons/FilledButton'
import InputSelect from '@/components/_formElements/Select/Select'
import { DropdownOption } from '@/components/_modals/CreatePost/Dropdown/DropdownOption'
import { getListingPages } from '@/services/listing.service'
import { setShowPageLoader, updateListingModalData } from '@/redux/slices/site'
import { InviteToCommunity } from '@/services/auth.service'
import CustomSnackbar from '@/components/CustomSnackbar/CustomSnackbar'
import CommunityTopDropdown from '@/components/_formElements/CommunityTopDropdown/CommunityTopDropdown'
import { CommunityDropdownOption } from '@/components/_formElements/CommunityDropdownOption/CommunityDropdownOption'
import PanelDropdownList from './PanelDropdownList'
import { showProfileError } from '@/redux/slices/user'
import { TrendingHobbiesByUser } from '@/services/user.service'

type Props = {
  activeTab: CommunityPageTabs
  children: React.ReactNode
  singlePostPage?: boolean
  hide?: boolean
}
type singlePostProps = {
  hobbyMembers: any[]
  whatsNew: any[]
  trendingHobbies: any[]
}

interface Hobby {
  _id: string
  display: string
  slug: string
}

interface Genre {
  _id: string
  display: string
  slug: string
}

interface HobbyEntry {
  createdAt: string
  genre: Genre | null
  hobby: Hobby
  listing_id: string
  updatedAt: string
  __v: number
  _id: string
}

const CommunityLayout: React.FC<Props> = ({
  children,
  activeTab,
  singlePostPage,
  hide = false,
}) => {
  const dispatch = useDispatch()
  const membersContainerRef = useRef<HTMLElement>(null)
  const whatsNewContainerRef = useRef<HTMLElement>(null)
  const inviteBtnRef = useRef<HTMLButtonElement>(null)
  const { activeProfile, user, isLoggedIn } = useSelector(
    (state: RootState) => state.user,
  )
  const { allPosts, filters, post_pagination } = useSelector(
    (state: RootState) => state.post,
  )
  const [showPanel, setShowPanel] = useState(false)
  const [hobbyGroup, setHobbyGroup] = useState({
    profile_image: null,
    cover_image: null,
    display: '',
  })
  const [locations, setLocations] = useState([])
  const [email, setEmail] = useState('')
  const [selectedHobby, setSelectedHobby] = useState(
    filters.hobby || 'All Hobbies',
  )
  const [selectedGenre, setSelectedGenre] = useState<string | undefined>(
    filters.genre,
  )
  const [selectedLocation, setSelectedLocation] = useState(
    filters.location || 'All Locations',
  )

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
  const [seeMoreMembers, setSeeMoreMembers] = useState(true)
  const [seeMoreTrendHobbies, setSeeMoreTrendHobbies] = useState(true)
  const [hobbyMembers, setHobbymembers] = useState([])
  const [whatsNew, setWhatsNew] = useState([])
  const [SeeMorewhatsNew, setSeeMoreWhatsNew] = useState(true)
  const [childData, setChildData] = useState<singlePostProps | null>({
    hobbyMembers: [],
    whatsNew: [],
    trendingHobbies: [],
  })

  const hideThirdColumnTabs = ['pages', 'links', 'store', 'blogs']
  const { showPageLoader } = useSelector((state: RootState) => state.site)
  const { refreshNum } = useSelector((state: RootState) => state.post)
  const router = useRouter()

  const toggleSeeMore = () => {
    setSeeMoreHobby(!seeMoreHobby)
    dispatch(setFilters({ seeMoreHobbies: !seeMoreHobby }))
  }

  const handleHobbyClick = async (hobbyId: any, genreId: any) => {
    if (!isLoggedIn) {
      dispatch(openModal({ type: 'auth', closable: true }))
      return
    }

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
      if (hobbyId !== 'All Hobbies' || hobbyId !== 'My Hobbies') {
        params.append('_hobby', hobbyId)
      }
      if (genreId !== 'undefined' && genreId !== '') {
        params.append('_genre', genreId)
      }
      !router.pathname?.includes('/community') && router.push('/community')
      dispatch(updateLoading(true))

      dispatch(updateLoading(false))
    } else {
      dispatch(setFilters({ genre: '', hobby: '' }))
      setSelectedHobby('All Hobbies')
      setSelectedGenre('')
      // fetchPosts()
    }
  }

  const EditProfileLocation = () => {
    if (!isLoggedIn) {
      dispatch(openModal({ type: 'auth', closable: true }))
      return
    }

    if (activeProfile?.type === 'user') {
      window.location.href = '/settings/localization-payments'
    } else {
      dispatch(openModal({ type: 'listing-address-edit', closable: true }))
    }
  }

  const editHobbiesClick = () => {
    if (!isLoggedIn) {
      dispatch(openModal({ type: 'auth', closable: true }))
      return
    }
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

  function getClassName(type: any) {
    if (type === 'user') {
      return 'default-user-icon'
    } else if (type === 1) {
      return 'default-people-listing-icon'
    } else if (type === 2) {
      return 'default-place-listing-icon'
    } else if (type === 3) {
      return 'default-program-listing-icon'
    } else if (type === 4) {
      return 'default-product-listing-icon'
    } else if (type === 'listing') {
      return 'default-people-listing-icon'
    }
  }

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }
  useEffect(() => {
    scrollToTop()
  }, [selectedHobby])

  const fetchPosts = async (page = 1) => {
    if (showPageLoader) {
      dispatch(setShowPageLoader(false))
    }
    let params = new URLSearchParams(
      `page=${page}&limit=10&populate=_author,_genre,_hobby`,
    )

    if (activeProfile?.data?._hobbies.length === 0) {
      dispatch(setShowPageLoader(true))

      dispatch(setShowPageLoader(false))
      return
    }

    if (selectedLocation === '' && selectedHobby === '') return
    if (activeTab === 'links') {
      params.append('has_link', 'true')
    }
    if (
      selectedGenre &&
      selectedGenre !== 'undefined' &&
      selectedGenre !== ''
    ) {
      params.append('_genre', selectedGenre)
    }
    if (selectedHobby === 'My Hobbies') {
      activeProfile?.data?._hobbies.forEach((item: any) => {
        params.append('_hobby', item?.hobby?._id)
      })
    } else if (selectedHobby === 'All Hobbies') {
      params = new URLSearchParams(
        `page=${page}&limit=10&populate=_author,_genre,_hobby`,
      )
    } else if (
      selectedHobby !== '' &&
      selectedHobby !== 'All Hobbies' &&
      selectedHobby !== 'My Hobbies'
    ) {
      params.append('_hobby', selectedHobby)
    } else {
      activeProfile?.data?._hobbies.forEach((item: any) => {
        params.append('_hobby', item?.hobby?._id)
      })
    }

    const localSelectedLocation = filters.location
    const addresses = activeProfile.data?._addresses || []
    const matchingAddress = [
      ...addresses,
      activeProfile.data?.primary_address ?? {},
    ].find(
      (address) =>
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
    if (page === 1) dispatch(updateLoading(true))

    const { err, res } = await getAllPosts(params.toString())
    if (err) return console.log(err)
    if (res?.data?.success) {
      let posts = res.data.data.posts.map((post: any) => {
        let content = post.content.replace(/<img .*?>/g, '')
        return { ...post, content }
      })

      if (page === 1) {
        dispatch(updatePosts(posts))
      } else {
        dispatch(appendPosts(posts))
      }

      dispatch(updateHasMore(posts.length === 10))
      dispatch(updateCurrentPage(page))

      if (posts.length === 0) {
        setShowPanel(true)
      } else {
        setShowPanel(false)
      }
    }
    dispatch(updateLoading(false))
  }

  useEffect(() => {
    fetchPosts(post_pagination)
  }, [post_pagination])

  const fetchHobbyMembers = async (hobbies?: HobbyEntry[]) => {
    try {
      if (!hobbies || hobbies.length === 0) {
        console.error('No hobbies provided')
        return
      }

      const hobbyIdsSet = new Set<string>()
      let genreId: string | null = null

      if (filters.genre !== '' || filters.hobby !== '') {
        hobbyIdsSet.add(filters.hobby)
        genreId = filters.genre
      } else {
        hobbies.forEach((entry) => {
          if (entry.hobby?._id) {
            hobbyIdsSet.add(entry.hobby._id)
          }
          if (entry.genre?._id) {
            genreId = entry.genre._id // Assume there's only one genre ID
          }
        })
      }

      const hobbyIds = Array.from(hobbyIdsSet)

      let url = `${hobbyIds.join(',')}`

      // Append genreId as query parameter if it exists
      if (genreId) {
        url += `?genreId=${genreId}`
      }

      const { res, err } = await getHobbyMembersCommunity(url)
      if (res.data) {
        setHobbymembers(res.data.users)
        setChildData((prev) => ({
          hobbyMembers: res.data.users,
          whatsNew: prev ? prev.whatsNew : [],
          trendingHobbies: prev ? prev.trendingHobbies : [],
        }))
      }
    } catch (error) {
      console.error('Fetch error:', error)
      return
    }
  }

  const fetchWhatsNew = async () => {
    const { res, err } = await getListingPages(
      `sort=-createdAt&limit=15&is_published=true`,
    )
    if (res?.data) {
      setWhatsNew(res.data.data.listings)
      setChildData((prev) => ({
        hobbyMembers: prev ? prev.hobbyMembers : [],
        whatsNew: res.data.data.listings,
        trendingHobbies: prev ? prev.trendingHobbies : [],
      }))
    }
  }

  useEffect(() => {
    if (activeProfile?.data?._hobbies) {
      fetchHobbyMembers(activeProfile?.data?._hobbies)
    }
  }, [filters.genre, filters.hobby, activeProfile])
  const fetchTrendingHobbies = async () => {
    const { err, res } = await TrendingHobbiesByUser()

    if (err) {
      return console.log('err', err)
    }
    setTrendingHobbies(res.data?.data)
    setChildData((prev) => ({
      hobbyMembers: prev ? prev.hobbyMembers : [],
      whatsNew: prev ? prev.whatsNew : [],
      trendingHobbies: res.data.data ? res.data.data : [],
    }))
  }

  useEffect(() => {
    fetchTrendingHobbies()
    fetchWhatsNew()
  }, [])

  useEffect(() => {
    dispatch(updateListingModalData(activeProfile.data))
  }, [activeProfile.type])

  // useEffect(()=>{
  //   let activeProf_IDs:string[] = [];
  //   const {length:arrLength} = activeProf_IDs;
  //   if(arrLength>1){
  //     if(activeProf_IDs[arrLength-1]!==activeProf_IDs[arrLength-2]){
  //       setSelectedGenre("");
  //       setSelectedHobby("");
  //       setSelectedLocation("All Locations");
  //       dispatch(setFilters({hobby:"",genre:"",location:'All Locations'}))
  //     }
  //   }
  //   if(typeof activeProfile.data?._id==="string"){
  //   activeProf_IDs.push(activeProfile.data?._id);
  //   }
  // },[activeProfile.data, dispatch])

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
  //   if (selectedLocation !== '' && selectedLocation !== 'All Locations') {
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
  console.warn('selectedhobbyyy', selectedHobby)
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
  console.warn('filterrr hobby', filters.hobby)

  useEffect(() => {
    setSelectedGenre(filters.genre !== '' ? filters.genre : undefined)
    setSelectedHobby(!filters.hobby ? 'All Hobbies' : filters.hobby)
    setSelectedLocation(filters.location ?? '')
  }, [filters.genre, filters.hobby, filters.location])

  useEffect(() => {
    setSeeMoreHobby(filters.seeMoreHobbies)
  }, [filters.seeMoreHobbies])

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
          // if (visibilityArr[1]) {
          //   console.log({ visibilityArr })
          //   if (visibilityArr[1].display) {
          //     // if (filters.location === null) {
          //     dispatch(
          //       setFilters({
          //         location:
          //           visibilityArr[1]?.display?.split(' ')[0] || 'All Locations',
          //       }),
          //     )
          //     setSelectedLocation(
          //       visibilityArr[1]?.display?.split(' ')[0] || 'All Locations',
          //     )
          //     // }
          //   }
          // }

          // added as for go live
          if (filters.location === null) {
            dispatch(
              setFilters({
                location: 'All Locations',
              }),
            )
            setSelectedLocation('All Locations')
          }
          setVisibilityData(visibilityArr)
        }
      }
    } else if (activeProfile.type === 'listing') {
      let address = activeProfile.data?._address
      let visibilityArr: any = [
        {
          value: 'All Locations',
          display: 'All Locations',
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
      // if (visibilityArr[1]) {
      //   console.log({ visibilityArr })
      //   if (visibilityArr[1].display) {
      //     // if (filters.location === null) {
      //     dispatch(
      //       setFilters({
      //         location:
      //           visibilityArr[1]?.display?.split(' ')[0] || 'All Locations',
      //       }),
      //     )
      //     setSelectedLocation(
      //       visibilityArr[1]?.display?.split(' ')[0] || 'All Locations',
      //     )
      //     // }
      //   }
      // }
      //added as for go live
      if (filters.location === null) {
        dispatch(
          setFilters({
            location: 'All Locations',
          }),
        )
        setSelectedLocation('All Locations')
      }
    }
  }, [activeProfile])
  console.warn('activveprofileeeee', activeProfile.type)

  // useEffect(() => {
  // setSelectedHobby('All Hobbies')
  // setSelectedGenre('')
  // }, [activeProfile])

  const updateFilterLocation = (val: any) => {
    if (!isLoggedIn) {
      dispatch(openModal({ type: 'auth', closable: true }))
      return
    }
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
    !router.pathname?.includes('/community') && router.push('/community')
  }

  useEffect(() => {
    if (!isLoggedIn)
      dispatch(
        setFilters({
          location: 'All Locations',
        }),
      )
  }, [])

  const handleStartPost = () => {
    if (!isLoggedIn) {
      dispatch(openModal({ type: 'auth', closable: true }))
      return
    }
    if (!user.is_onboarded) {
      // router.push(`/profile/${user.profile_url}`)
      // dispatch(showProfileError(true))
      dispatch(openModal({ type: 'SimpleOnboarding', closable: true }))
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
    if (!isLoggedIn) {
      dispatch(openModal({ type: 'auth', closable: true }))
      return
    }

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
    const _id = activeProfile?.data?._id
    const hobby_id = filters?.hobby
    const location = filters?.location || ''
    setInviteBtnLoader(true)

    const { err, res } = await InviteToCommunity({
      to,
      name,
      _id,
      hobby_id,
      location,
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

  useEffect(() => {
    if (membersContainerRef.current) {
      const requiredHeight = hobbyMembers.length * 38 + 84
      if (hobbyMembers.length <= 2) {
        membersContainerRef.current.style.height = 'auto'
      } else if (seeMoreMembers) {
        membersContainerRef.current.style.height = '198px'
      } else {
        membersContainerRef.current.style.height = requiredHeight + 'px'
      }
    }
  }, [seeMoreMembers, hobbyMembers])

  useEffect(() => {
    if (whatsNewContainerRef.current) {
      const requiredHeight = whatsNew.length * 46 + 84
      if (whatsNew.length <= 2) {
        whatsNewContainerRef.current.style.height = 'auto'
      } else if (SeeMorewhatsNew) {
        whatsNewContainerRef.current.style.height = '225px'
      } else {
        whatsNewContainerRef.current.style.height = requiredHeight + 'px'
      }
    }
  }, [SeeMorewhatsNew, whatsNew])

  const DoubleArrowSvg = ({ rotate }: { rotate?: boolean }) => {
    return (
      <svg
        style={{ rotate: rotate === true ? '180deg' : '0deg' }}
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
      >
        <path
          d="M13.75 10.9375L10 14.6875L6.25 10.9375M13.75 5.3125L10 9.0625L6.25 5.3125"
          stroke="#8064A2"
          stroke-width="1.2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    )
  }

  const questionSvg = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
    >
      <path
        d="M7.965 12.2C8.21 12.2 8.4172 12.1153 8.5866 11.9459C8.756 11.7765 8.84047 11.5695 8.84 11.325C8.84 11.08 8.75553 10.8728 8.5866 10.7034C8.41767 10.534 8.21047 10.4495 7.965 10.45C7.72 10.45 7.51303 10.5347 7.3441 10.7041C7.17517 10.8735 7.09047 11.0805 7.09 11.325C7.09 11.57 7.1747 11.7772 7.3441 11.9466C7.5135 12.116 7.72047 12.2005 7.965 12.2ZM7.335 9.505H8.63C8.63 9.12 8.67387 8.81667 8.7616 8.595C8.84933 8.37333 9.09713 8.07 9.505 7.685C9.80833 7.38167 10.0475 7.0928 10.2225 6.8184C10.3975 6.544 10.485 6.21453 10.485 5.83C10.485 5.17667 10.2458 4.675 9.7675 4.325C9.28917 3.975 8.72333 3.8 8.07 3.8C7.405 3.8 6.86553 3.975 6.4516 4.325C6.03767 4.675 5.7488 5.095 5.585 5.585L6.74 6.04C6.79833 5.83 6.9297 5.6025 7.1341 5.3575C7.3385 5.1125 7.65047 4.99 8.07 4.99C8.44333 4.99 8.72333 5.0922 8.91 5.2966C9.09667 5.501 9.19 5.72547 9.19 5.97C9.19 6.20333 9.12 6.4222 8.98 6.6266C8.84 6.831 8.665 7.02047 8.455 7.195C7.94167 7.65 7.62667 7.99417 7.51 8.2275C7.39333 8.46083 7.335 8.88667 7.335 9.505ZM8 15C7.03167 15 6.12167 14.8164 5.27 14.4491C4.41833 14.0818 3.6775 13.583 3.0475 12.9525C2.4175 12.3225 1.91887 11.5817 1.5516 10.73C1.18433 9.87833 1.00047 8.96833 1 8C1 7.03167 1.18387 6.12167 1.5516 5.27C1.91933 4.41833 2.41797 3.6775 3.0475 3.0475C3.6775 2.4175 4.41833 1.91887 5.27 1.5516C6.12167 1.18433 7.03167 1.00047 8 1C8.96833 1 9.87833 1.18387 10.73 1.5516C11.5817 1.91933 12.3225 2.41797 12.9525 3.0475C13.5825 3.6775 14.0814 4.41833 14.4491 5.27C14.8168 6.12167 15.0005 7.03167 15 8C15 8.96833 14.8161 9.87833 14.4484 10.73C14.0807 11.5817 13.582 12.3225 12.9525 12.9525C12.3225 13.5825 11.5817 14.0814 10.73 14.4491C9.87833 14.8168 8.96833 15.0005 8 15ZM8 13.6C9.56333 13.6 10.8875 13.0575 11.9725 11.9725C13.0575 10.8875 13.6 9.56333 13.6 8C13.6 6.43667 13.0575 5.1125 11.9725 4.0275C10.8875 2.9425 9.56333 2.4 8 2.4C6.43667 2.4 5.1125 2.9425 4.0275 4.0275C2.9425 5.1125 2.4 6.43667 2.4 8C2.4 9.56333 2.9425 10.8875 4.0275 11.9725C5.1125 13.0575 6.43667 13.6 8 13.6Z"
        fill="#8064A2"
      />
    </svg>
  )

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
        {!isMobile && (
          <aside
            className={`${styles['community-left-aside']} custom-scrollbar`}
          >
            <ProfileSwitcher
              dropdownClass={styles['desktop-profile-switcher-class']}
            />
            <section
              className={`content-box-wrapper ${styles['hobbies-side-wrapper']}`}
            >
              <header>
                <h3>Hobbies</h3>
                <Image
                  src={EditIcon}
                  onClick={() => {
                    if (!isLoggedIn) {
                      dispatch(openModal({ type: 'auth', closable: true }))
                      return
                    }

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
                  }}
                  alt="edit"
                />
                {/* <Image src={EditIcon} alt="Edit" /> */}
              </header>
              {/* <span className={styles['divider']}></span> */}
              <section>
                <ul>
                  <li
                    onClick={() => handleHobbyClick('All Hobbies', null)}
                    className={
                      selectedHobby === 'All Hobbies' ? styles.selectedItem : ''
                    }
                  >
                    All Hobbies
                  </li>
                  <li
                    onClick={() => handleHobbyClick('My Hobbies', null)}
                    className={
                      selectedHobby === 'My Hobbies' && selectedGenre === null
                        ? styles.selectedItem
                        : ''
                    }
                  >
                    My Hobbies
                  </li>
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
                          {hobby?.hobby?.display}{' '}
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
                <Image
                  src={EditIcon}
                  onClick={EditProfileLocation}
                  alt="edit"
                />
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
                          className={styles['location-dropdown-container']}
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
          </aside>
        )}

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
                  // style={{
                  //   borderBottomRightRadius: hide ? 8 : 0,
                  //   borderBottomLeftRadius: hide ? 8 : 0,
                  //   paddingTop: hide ? 12 : 20,
                  // }}
                >
                  {activeProfile.type === 'user' ? (
                    <>
                      {activeProfile.data?.profile_image ? (
                        <img
                          className={styles['profile-img']}
                          src={activeProfile?.data?.profile_image}
                          alt=""
                          width={48}
                          height={48}
                        />
                      ) : (
                        <div
                          className={`${styles['profile-img']} ${styles['profile-img-user']} default-user-icon`}
                        ></div>
                      )}
                    </>
                  ) : (
                    <>
                      {activeProfile?.data?.profile_image ? (
                        <img
                          className={`${styles['img-listing']}`}
                          src={activeProfile?.data?.profile_image}
                        ></img>
                      ) : (
                        <div
                          className={
                            activeProfile.data?.type == 1
                              ? `default-people-listing-icon ${styles['img-listing']}`
                              : activeProfile.data?.type == 2
                              ? `${styles['img-listing']} default-place-listing-icon`
                              : activeProfile.data?.type == 3
                              ? `${styles['img-listing']} default-program-listing-icon`
                              : activeProfile.data?.type == 4
                              ? `${styles['img-listing']} default-product-listing-icon`
                              : `${styles['contentImage']} default-people-listing-icon`
                          }
                        ></div>
                      )}
                    </>
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
                      // maxWidth="139px"
                      className={styles['hobby-select']}
                      value={
                        hobbiesDropDownArr.find(
                          (obj: any) => obj?.value === selectedHobby,
                        )?.display ?? selectedHobby
                      }
                      variant={selectedHobby === '' ? 'secondary' : 'primary'}
                    >
                      {[
                        { display: 'All Hobbies', value: 'All Hobbies' },
                        { display: 'My Hobbies', value: 'My Hobbies' },
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
                          // maxWidth="139px"
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

                    <div className={styles.hobbyDropDownOption}>in</div>

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
                  </div>
                  <button
                    onClick={() => setShowPanel((prev) => !prev)}
                    className={styles['panel-dropdown-btn']}
                  >
                    <DoubleArrowSvg rotate={showPanel} />
                  </button>
                </section>
                {showPanel && (
                  <section className={styles['dropdowns-panel']}>
                    {[
                      {
                        name: 'Hobby Members',
                        options: hobbyMembers,
                        type: 'user members',
                        invite: true,
                      },
                      {
                        name: "What's New",
                        options: whatsNew,
                        type: 'members',
                        initialOpen: allPosts.length === 0,
                      },
                      {
                        name: 'Trending Hobbies',
                        options: trendingHobbies,
                      },
                    ].map(
                      (
                        obj: {
                          name: string
                          options: any[]
                          type?: string
                          invite?: boolean
                          initialOpen?: boolean
                        },
                        idx: number,
                      ) => (
                        <PanelDropdownList
                          name={obj.name}
                          options={obj.options}
                          key={idx}
                          type={obj?.type}
                          inviteFunction={Invitecommunity}
                          inviteError={errorMessage}
                          inviteTextChangeFunc={(e: any) => {
                            setEmail(e.target.value)
                            setErrorMessage('')
                          }}
                          inviteText={email}
                          invite={obj?.invite}
                          initialOpen={obj?.initialOpen}
                        />
                      ),
                    )}
                  </section>
                )}
                {/* {!hide && ( */}
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
                {/* )} */}
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
                      <input type="text" autoComplete="new" name="" id="" />
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
            {/* {children} */}
            {React.Children.map(children, (child) =>
              React.cloneElement(child as React.ReactElement<singlePostProps>, {
                hobbyMembers: childData?.hobbyMembers,
                whatsNew: childData?.whatsNew,
                trendingHobbies: childData?.trendingHobbies,
              }),
            )}
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
                      (obj: any) => obj?.hobby?._id === selectedHobby,
                    )?.hobby?.display ?? 'All Hobbies'}

                    {activeProfile.data?._hobbies?.find(
                      (obj: any) =>
                        obj?.hobby?._id === selectedHobby &&
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
                  autoComplete="new"
                  value={email}
                  placeholder="Email"
                  name="society"
                  onChange={(e: any) => {
                    setEmail(e.target.value)
                    setErrorMessage('')
                  }}
                  type="email"
                  id=""
                  className={errorMessage !== '' ? styles['error-input'] : ''}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      inviteBtnRef?.current?.click()
                    }
                  }}
                />
                <span className={styles['input-prefix']}></span>
                <FilledButton
                  onClick={Invitecommunity}
                  inviteBtnRef={inviteBtnRef}
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
              ref={membersContainerRef}
              className={styles['desktop-members-conatiner']}
            >
              <header>Hobby Members</header>
              {hobbyMembers
                ?.slice(0, seeMoreMembers ? 3 : hobbyMembers.length)
                .map((obj: any, idx) => (
                  <div key={idx} className={styles['member']}>
                    <Link
                      href={`/profile/${obj.profile_url}`}
                      className={styles['img-name']}
                    >
                      {obj?.profile_image ? (
                        <img src={obj.profile_image} />
                      ) : (
                        <Image src={defaultUserIcon} alt="" />
                      )}

                      <p>{obj?.full_name}</p>
                    </Link>
                  </div>
                ))}
              {hobbyMembers.length > 3 && (
                <div
                  onClick={() => {
                    setSeeMoreMembers((prev) => !prev)
                  }}
                  className={styles['see-all']}
                >
                  <p>{seeMoreMembers ? 'See more' : 'See less'}</p>
                </div>
              )}
            </section>
            <section
              ref={whatsNewContainerRef}
              className={styles['desktop-members-conatiner']}
            >
              <header>What's New</header>
              {whatsNew
                ?.slice(0, SeeMorewhatsNew ? 3 : whatsNew.length)
                .map((obj: any, idx) => (
                  <div key={idx} className={styles['member']}>
                    <Link
                      href={`/${pageType(obj?.type)}/${obj.page_url}`}
                      className={styles['img-name-listing']}
                    >
                      {obj?.profile_image ? (
                        <img src={obj.profile_image} />
                      ) : (
                        <div
                          className={
                            getClassName(obj?.type) + ` ${styles['defaultImg']}`
                          }
                        ></div>
                      )}

                      <p>{obj?.title}</p>
                    </Link>
                  </div>
                ))}
              {whatsNew.length > 3 && (
                <div
                  onClick={() => {
                    setSeeMoreWhatsNew((prev) => !prev)
                  }}
                  className={styles['see-all']}
                >
                  <p>{SeeMorewhatsNew ? 'See more' : 'See less'}</p>
                </div>
              )}
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
                  {trendingHobbies
                    ?.slice(0, seeMoreTrendHobbies ? 3 : trendingHobbies.length)
                    .map((hobby: any) => {
                      if (hobby.profile_image) {
                      }
                      return (
                        <li key={hobby._id}>
                          <Link href={`/hobby/${hobby.slug}`}>
                            {hobby?.profile_image ? (
                              <div className={styles['border-div']}>
                                <img
                                  className={styles.profileImage}
                                  src={hobby.profile_image}
                                  alt={`${hobby.display}'s `}
                                  width={40}
                                  height={40}
                                />{' '}
                              </div>
                            ) : (
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
                                  fillOpacity="0.5"
                                />
                                <path
                                  d="M79.6206 46.1372C79.7422 45.7727 80.2578 45.7727 80.3794 46.1372L87.9122 68.7141C87.9663 68.8763 88.1176 68.9861 88.2885 68.9875L112.088 69.175C112.472 69.178 112.632 69.6684 112.323 69.8967L93.1785 84.0374C93.041 84.139 92.9833 84.3168 93.0348 84.4798L100.211 107.173C100.327 107.539 99.9097 107.842 99.5971 107.619L80.2326 93.7812C80.0935 93.6818 79.9065 93.6818 79.7674 93.7812L60.4029 107.619C60.0903 107.842 59.6731 107.539 59.789 107.173L66.9652 84.4798C67.0167 84.3168 66.959 84.139 66.8215 84.0374L47.6773 69.8967C47.3682 69.6684 47.5276 69.178 47.9118 69.175L71.7115 68.9875C71.8824 68.9861 72.0337 68.8763 72.0878 68.7141L79.6206 46.1372Z"
                                  fill="white"
                                />
                              </svg>
                            )}
                            <span>{`${hobby.display}`}</span>
                          </Link>
                        </li>
                      )
                    })}
                </ul>
                {trendingHobbies.length > 3 && (
                  <div
                    onClick={() => {
                      setSeeMoreTrendHobbies((prev) => !prev)
                    }}
                    className={styles['see-all']}
                  >
                    <p>{seeMoreTrendHobbies ? 'See more' : 'See less'}</p>
                  </div>
                )}
              </section>
            </section>
            {isMobile ? null : (
              <button
                onClick={() => {
                  router.push('/help')
                }}
                className={styles['help-centre-btn']}
              >
                {questionSvg}
                <p>Help Centre</p>
              </button>
            )}
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
