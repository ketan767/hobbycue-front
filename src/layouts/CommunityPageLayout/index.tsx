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
import {
  updateLoading,
  updatePages,
  updatePagesLoading,
  updatePosts,
} from '@/redux/slices/post'
import PostCard from '@/components/PostCard/PostCard'
import ProfileSwitcher from '@/components/ProfileSwitcher/ProfileSwitcher'
import PostCardSkeletonLoading from '@/components/PostCardSkeletonLoading'
import { checkIfUrlExists } from '@/utils'
import Link from 'next/link'
import { getAllHobbies, getTrendingHobbies } from '@/services/hobby.service'
import DefaultHobbyImg from '@/assets/svg/default-images/default-hobbies.svg'
import DefaultHobbyImgcover from '@/assets/svg/default-images/default-hobby-cover.svg'
import { MenuItem, Select } from '@mui/material'
import FilledButton from '@/components/_buttons/FilledButton'
import InputSelect from '@/components/_formElements/Select/Select'
import { DropdownOption } from '@/components/_modals/CreatePost/Dropdown/DropdownOption'
import { getListingPages } from '@/services/listing.service'
import { setShowPageLoader } from '@/redux/slices/site'
import { InviteToCommunity } from '@/services/auth.service'

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
  const { activeProfile, user } = useSelector((state: any) => state.user)
  const { allPosts } = useSelector((state: RootState) => state.post)
  const [isLoadingPosts, setIsLoadingPosts] = useState(false)
  const [hobbyGroup, setHobbyGroup] = useState({
    profile_image: null,
    cover_image: null,
    display: '',
  })
  const [locations, setLocations] = useState([])
  const [email, setEmail] = useState('')
  const [selectedHobby, setSelectedHobby] = useState('')
  const [selectedGenre, setSelectedGenre] = useState('')
  const [selectedLocation, setSelectedLocation] = useState('')

  const tabs: CommunityPageTabs[] = [
    'posts',
    'links',
    'pages',
    'store',
    'blogs',
  ]
  const [visibilityData, setVisibilityData] = useState(['public'])
  const [seeMoreHobby, setSeeMoreHobby] = useState(
    activeProfile.data?._hobbies?.length > 3 ? true : false,
  )

  const [trendingHobbies, setTrendingHobbies] = useState([])
  console.log('Number of hobbies:', activeProfile.data?._hobbies?.length)

  const hideThirdColumnTabs = ['pages', 'links']
  const { showPageLoader } = useSelector((state: RootState) => state.site)

  const toggleSeeMore = () => setSeeMoreHobby(!seeMoreHobby)
  const getPost = async () => {
    const params = new URLSearchParams(`populate=_author,_genre,_hobby`)
    activeProfile?.data?._hobbies.forEach((item: any) => {
      params.append('_hobby', item.hobby._id)
    })
    if (!activeProfile?.data?._hobbies) return

    if (activeProfile?.data?._hobbies.length === 0) return
    console.log('active', activeProfile.data._hobbies)
    dispatch(updateLoading(true))
    const { err, res } = await getAllPosts(params.toString())
    if (err) return console.log(err)
    if (res.data.success) {
      store.dispatch(updatePosts(res.data.data.posts))
    }
    dispatch(updateLoading(false))
  }

  useEffect(() => {
    getPost()
  }, [activeProfile])

  const handleHobbyClick = async (hobbyId: any) => {
    if (selectedHobby !== hobbyId) {
      setSelectedHobby(hobbyId)
      // Fetch posts for the newly selected hobby
      const params = new URLSearchParams(`populate=_author,_genre,_hobby`)
      params.append('_hobby', hobbyId)
      dispatch(updateLoading(true))

      dispatch(updateLoading(false))
    } else {
      setSelectedHobby('')
      getPost()
    }
  }

  const EditProfileLocation = () => {
    window.location.href = '/settings/localization-and-payments'
  }
  console.log('l', activeProfile.data?._hobbies?.length)
  console.log('activeprofile', activeProfile)
  console.log('selected', selectedLocation)

  const fetchPosts = async () => {
    if (showPageLoader) {
      dispatch(setShowPageLoader(false))
    }
    let params: any = ''
    if (!activeProfile?.data?._hobbies) return
    if (activeProfile?.data?._hobbies.length === 0) return
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
    } else {
      activeProfile?.data?._hobbies.forEach((item: any) => {
        params.append('_hobby', item.hobby._id)
      })
    }
    let selectedPinCode = ''
    let selectedLocality = ''
    let selectedSociety = ''


    const matchingAddress = activeProfile.data?._addresses?.find(

      (address: any) =>
        address.city === selectedLocation ||
        address.pin_code === selectedLocation ||
        address.locality === selectedLocation ||
        address.society === selectedLocation,
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
    if (res.data.success) {
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

  const fetchPages = async () => {
    let params: any = ''
    if (!activeProfile?.data?._hobbies) return
    if (activeProfile?.data?._hobbies.length === 0) return
    if (selectedLocation === '' && selectedHobby === '') return
    params = new URLSearchParams(`populate=_author,_genre,_hobby`)
    if (selectedHobby !== '') {
      params.append('_hobby', selectedHobby)
    } else {
      activeProfile?.data?._hobbies.forEach((item: any) => {
        params.append('_hobby', item.hobby._id)
      })
    }
    if (selectedLocation !== '' && selectedLocation !== 'Everyone') {
      params.append('location', selectedLocation)
    }
    console.log('PARAMS ---', params.toString())
    dispatch(updatePagesLoading(true))

    const { err, res } = await getListingPages(params.toString())
    if (err) return console.log(err)
    if (res?.data.success) {
      if (err) return console.log(err)
      if (res?.data.success) {
        store.dispatch(updatePages(res.data.data.listings))
      }
    }
    dispatch(updatePagesLoading(false))
  }

  useEffect(() => {
    if (activeTab === 'posts' || activeTab === 'links') {
      fetchPosts()
    }
  }, [selectedHobby, selectedLocation, activeProfile])

  const handleLocationClick = async (item: any) => {
    if (item === selectedLocation) {
      setSelectedLocation('')
    } else {
      setSelectedLocation(item)
    }
  }

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
              value: 'Everyone',
              display: 'Everyone',
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
          setVisibilityData(visibilityArr)
        }
      }
    } else if (activeProfile.type === 'listing') {
      let address = activeProfile.data?._address
      let visibilityArr: any = [
        {
          value: 'Everyone',
          display: 'Everyone',
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

  const Invitecommunity = async () => {
    const to = email
    const name = activeProfile?.data.full_name
    const { err, res } = await InviteToCommunity({
      to,
      name,
    })

    setEmail('')
  }

  return (
    <>
      <PageGridLayout
        column={hideThirdColumnTabs.includes(activeTab) ? 2 : 3}
        responsive={true}
      >
        <aside className={`${styles['community-left-aside']} custom-scrollbar`}>
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
            <span className={styles['divider']}></span>
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
                        onClick={() => handleHobbyClick(hobby.hobby._id)}
                        className={
                          selectedHobby === hobby.hobby._id
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
            <span className={styles['divider']}></span>
            {visibilityData?.length > 0 && (
              <InputSelect
                onChange={(e: any) => {
                  let val = e.target.value
                  setSelectedLocation(val)
                }}
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
                        onChange={(val: any) => setSelectedLocation(val)}
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
                {selectedHobby !== '' &&
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
                  )}
                <section
                  className={`content-box-wrapper ${styles['start-post-btn-container']}`}
                >
                  <button
                    onClick={() => {
                      if (user.is_onboarded)
                        dispatch(
                          openModal({ type: 'create-post', closable: true }),
                        )
                        else
                        dispatch(openModal({type:"user-onboarding", closable:true}))
                    }}
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
                <section className={styles['filter-section']}>
                  <div>
                    <Select
                      sx={{
                        boxShadow: 'none',
                        '.MuiOutlinedInput-notchedOutline': { border: 0 },
                        fieldset: { border: 0 },
                      }}
                      className={styles['location-select']}
                      value={selectedHobby || ''}
                      onChange={(e) => handleHobbyClick(e.target.value)}
                      displayEmpty
                    >
                      <MenuItem value="">All Hobbies</MenuItem>
                      {activeProfile.data?._hobbies?.map(
                        (item: any, idx: any) => (
                          <MenuItem key={idx} value={item.hobby._id}>
                            {item.hobby.display}
                          </MenuItem>
                        ),
                      )}
                      <MenuItem
                        onClick={() => {
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
                      >
                        Edit Hobbies
                        <Image
                          src={EditIcon}
                          className={styles.hobbyeditresponsive}
                          alt="edit"
                        />{' '}
                      </MenuItem>
                    </Select>
                    <div className={styles.hobbyDropDownOption}>at</div>

                    {visibilityData?.length > 0 && (
                      <Select
                        value={selectedLocation || ''}
                        onChange={(val: any) => setSelectedLocation(val)}
                        className={` ${styles['location-select']}`}
                      >
                        {visibilityData?.map((item: any, idx) => (
                          <DropdownOption
                            {...item}
                            key={idx}
                            currentValue={selectedLocation}
                            onChange={(val: any) => setSelectedLocation(val)}
                          />
                        ))}
                        <MenuItem
                          className={styles.editLocation}
                          onClick={EditProfileLocation}
                        >
                          Edit Location
                          <Image
                            src={EditIcon}
                            className={styles.editLocationResponsive}
                            alt="edit"
                          />
                        </MenuItem>
                      </Select>
                    )}
                  </div>
                </section>
              </div>
              {hideThirdColumnTabs.includes(activeTab) && (
                <div className={styles['invite-container-main']}>
                  <section
                    className={`content-box-wrapper ${styles['invite-wrapper']}`}
                  >
                    <header>
                      <h3>Invite to Community</h3>
                    </header>
                    <span className={styles['divider']}></span>
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
                <h3>Invite to Community</h3>
              </header>
              <span className={styles['divider']}></span>
              <section>
                <input
                  value={email}
                  name="society"
                  onChange={(e: any) => setEmail(e.target.value)}
                  type="email"
                  id=""
                />
                <span className={styles['input-prefix']}></span>
                <FilledButton onClick={Invitecommunity}>Invite</FilledButton>
              </section>
            </section>

            <section
              className={`content-box-wrapper ${styles['trending-hobbies-side-wrapper']}`}
            >
              <header>
                <h3>Trending hobbies</h3>
              </header>
              <span className={styles['divider']}></span>
              <section>
                <ul>
                  {trendingHobbies?.map((hobby: any) => {
                    if (hobby.profile_image) {
                      console.log('hobby', hobby)
                    }
                    return (
                      <li key={hobby._id}>
                        <Link href={`/hobby/${hobby.slug}`}>
                          <div className={styles['default-img']}></div>
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
    </>
  )
}

export default CommunityLayout
