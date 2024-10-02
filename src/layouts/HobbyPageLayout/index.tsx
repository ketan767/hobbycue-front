import React, { SetStateAction, useEffect, useRef, useState } from 'react'
import styles from '@/styles/HobbyDetail.module.css'

import ProfileHeader from '../../components/ProfilePage/ProfileHeader/ProfileHeader'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { useRouter } from 'next/router'
import {
  updateAboutOpenState,
  updateHobbyOpenState,
  updateMembersOpenStates,
  updateProfileLayoutMode,
} from '@/redux/slices/site'
import ProfileHeaderSmall from '@/components/ProfilePage/ProfileHeader/ProfileHeaderSmall'
import HobbyPageHeader from '@/components/HobbyPage/HobbyHeader/HobbyHeader'
import PageGridLayout from '../PageGridLayout'
import { getAllHobbies, getHobbyMembers } from '@/services/hobby.service'
import ProfileSwitcher from '@/components/ProfileSwitcher/ProfileSwitcher'
import PageContentBox from '../PageContentBox'
import Link from 'next/link'
import HobbyPageHeaderSmall from '@/components/HobbyPage/HobbyHeader/HobbyPageHeaderSmall'
import ChevronDown from '@/assets/svg/chevron-down.svg'
import DoubleChevron from '@/assets/svg/doubble_chevron.svg'
import Image from 'next/image'
import HobbyNavigationLinks from '@/components/HobbyPage/HobbyHeader/HobbyNavigationLinks'
import defaultUserIcon from '@/assets/svg/default-images/default-user-icon.svg'
import { openModal } from '@/redux/slices/modal'
import { SetLinkviaAuth } from '@/redux/slices/user'
import { useMediaQuery } from '@mui/material'
import EditIcon from '@/assets/svg/edit-colored.svg'

type Props = {
  activeTab: HobbyPageTabs
  data: any
  children: React.ReactNode
  setExpandAll: (value: boolean) => void
  expandAll?: boolean
}

const HobbyPageLayout: React.FC<Props> = ({
  children,
  activeTab,
  data,
  expandAll,
  setExpandAll,
}) => {
  console.warn({ tags: data.tags })
  const dispatch = useDispatch()
  const { AboutStates, hobbyStates, membersStates } = useSelector(
    (state: RootState) => state.site,
  )
  const [showSmallHeader, setShowSmallHeader] = useState(false)
  const [members, setMembers] = useState([])
  const hideLastColumnPages = ['pages', 'blogs', 'links', 'store']
  const [hideLastColumn, sethideLastColumn] = useState(false)
  const router = useRouter()
  const [seeAll, setSeeAll] = useState(false)
  const [loading, setLoading] = useState(true)
  const [showAbout, setShowAbout] = useState(true)
  const [showMembers, setShowMembers] = useState(false)
  const [showHobbiesClassification, setShowHobbiesClassification] =
    useState(true)
  const [showkeywords, setShowKeywords] = useState(false)

  const { user } = useSelector((state: RootState) => state.user)

  useEffect(() => {
    if (window.innerWidth >= 1300) setShowHobbiesClassification(false)
  })

  useEffect(() => {
    if (hideLastColumnPages.includes(activeTab)) {
      sethideLastColumn(true)
    } else {
      sethideLastColumn(false)
    }
  }, [activeTab])
  const { isLoggedIn, isAuthenticated } = useSelector(
    (state: RootState) => state.user,
  )

  const [nextLevels, setNextLevels] = useState([])

  const fetchAndUpdateNextLevels = async (q: string) => {
    const { err, res } = await getAllHobbies(q)
    if (err) return router.push('/hobby')
    setNextLevels(res.data?.hobbies)
  }
  function checkScroll() {
    const scrollValue = window.scrollY || document.documentElement.scrollTop

    if (scrollValue >= 308) setShowSmallHeader(true)
    else setShowSmallHeader(false)
  }
  console.log('setmem', members)
  const getMembers = async () => {
    setLoading(true)
    const { err, res } = await getHobbyMembers(`${data._id}`)
    console.log('mem', res?.data)
    if (err) return console.log(err)
    if (res?.data) {
      if (res?.data?.users) {
        setMembers(res.data.users.filter((user: any) => user !== null))
      }
    }
    setLoading(false)
  }

  useEffect(() => {
    window.addEventListener('scroll', checkScroll)
    getMembers()
    // return window.removeEventListener('scroll', checkScroll)
  }, [data, router.asPath])

  useEffect(() => {
    if (hobbyStates && typeof hobbyStates[data?._id] === 'boolean') {
      setShowHobbiesClassification(hobbyStates[data?._id])
    } else if (data._id) {
      dispatch(updateHobbyOpenState({ [data._id]: showHobbiesClassification }))
    }
  }, [data._id, hobbyStates])

  useEffect(() => {
    if (expandAll !== undefined) {
      setShowAbout(expandAll)
      setShowHobbiesClassification(expandAll)
      setShowMembers(expandAll)
      setShowKeywords(expandAll)
    }
  }, [expandAll])

  useEffect(() => {
    if (membersStates && typeof membersStates[data?._id] === 'boolean') {
      setShowMembers(membersStates[data?._id])
    } else if (data._id) {
      dispatch(updateMembersOpenStates({ [data._id]: showMembers }))
    }
  }, [data._id, membersStates])

  useEffect(() => {
    if (AboutStates && typeof AboutStates[data?._id] === 'boolean') {
      setShowAbout(AboutStates[data?._id])
    } else if (data._id) {
      dispatch(updateAboutOpenState({ [data._id]: showAbout }))
    }
  }, [data._id, AboutStates])

  const toggleMembers = () => {
    setSeeAll(!seeAll)
  }
  console.log('dataonhobbbypage', data)
  const handleMemberClick = (user: any) => {
    if (isLoggedIn) {
      router.push(`/profile/${user.profile_url}`)
    } else {
      dispatch(SetLinkviaAuth(`/profile/${user.profile_url}`))
      dispatch(openModal({ type: 'auth', closable: true }))
    }
  }
  const isMobile = useMediaQuery('(max-width:1100px)')
  return (
    <>
      {/* Profile Page Header - Profile and Cover Image with Action Buttons */}
      <HobbyPageHeader data={data} activeTab={activeTab} />
      {showSmallHeader && (
        <HobbyPageHeaderSmall data={data} activeTab={activeTab} />
      )}

      <div className={`${styles['display-mobile']}`}>
        <HobbyNavigationLinks activeTab={activeTab} />
      </div>

      <PageGridLayout column={!hideLastColumn ? 3 : 2}>
        {activeTab === activeTab && (
          <aside
            className={`custom-scrollbar ${styles['hobby-left-aside']}
            
          `}
          >
            {activeTab === 'home' && (
              <>
                <div
                  onClick={() => {
                    if (setExpandAll !== undefined) setExpandAll(!expandAll)
                  }}
                  className={styles['expand-all']}
                >
                  {expandAll ? <p>See less</p> : <p>See more</p>}
                  <Image
                    width={15}
                    height={15}
                    src={DoubleChevron}
                    className={`${expandAll ? styles['rotate-180'] : ''}`}
                    style={{ transition: 'all 0.3s ease' }}
                    alt=""
                  />
                </div>
              </>
            )}
            <div className={styles['display-mobile']}>
              {activeTab == 'home' && data?.description?.length > 0 && (
                <PageContentBox
                  showEditButton={false}
                  setDisplayData={() => {
                    setShowAbout((prev) => !prev)
                    dispatch(updateAboutOpenState({ [data._id]: !showAbout }))
                  }}
                  expandData={showAbout}
                >
                  <h4 className={styles['heading']}>
                    {'About'}
                    {user?.is_admin && (
                      <Image
                        className={styles['pencil-edit']}
                        src={EditIcon}
                        alt="edit"
                        onClick={() =>
                          router.push(`/admin/hobby/edit/${data?.slug}`)
                        }
                      />
                    )}
                  </h4>
                  {showAbout && (
                    <div
                      dangerouslySetInnerHTML={{ __html: data?.description }}
                    ></div>
                  )}
                </PageContentBox>
              )}
            </div>
            {(!isMobile || (isMobile && activeTab === 'home')) && (
              <>
                <PageContentBox
                  showEditButton={false}
                  initialShowDropdown
                  setDisplayData={(arg0: boolean) => {
                    setShowHobbiesClassification((prev) => {
                      dispatch(updateHobbyOpenState({ [data._id]: !prev }))
                      return !prev
                    })
                  }}
                  expandData={showHobbiesClassification}
                >
                  <h4 className={styles['heading']}>
                    {'Hobbies Classification'}
                    {user?.is_admin && (
                      <Image
                        className={styles['pencil-edit']}
                        src={EditIcon}
                        alt="edit"
                        onClick={() =>
                          router.push(`/admin/hobby/edit/${data?.slug}`)
                        }
                      />
                    )}
                  </h4>
                  <div
                    className={`${styles['display-desktop']}${
                      showHobbiesClassification
                        ? ' ' + styles['display-mobile']
                        : ''
                    }`}
                  >
                    <ul className={styles['classification-items']}>
                      {data?.category?.slug && (
                        <Link href={`/hobby/${data?.category?.slug}`}>
                          <li>{data?.category?.display}</li>
                        </Link>
                      )}
                      {data?.sub_category?.slug && (
                        <Link href={`/hobby/${data?.sub_category?.slug}`}>
                          <li>{data?.sub_category?.display}</li>
                        </Link>
                      )}
                      {data?.tags &&
                        data?.tags.map((tag: any, idx: number) => {
                          return tag.slug ? (
                            <Link key={idx} href={`/hobby/${tag?.slug}`}>
                              <li>{tag.display}</li>
                            </Link>
                          ) : null
                        })}
                      <li className={styles['active']}>
                        <p>{data?.display}</p>
                      </li>
                    </ul>
                  </div>
                </PageContentBox>
              </>
            )}
            {/* Keywords */}
            {isMobile && activeTab == 'home' && (
              <PageContentBox
                showEditButton={false}
                initialShowDropdown
                setDisplayData={(arg0: boolean) => {
                  setShowKeywords((prev) => {
                    return !prev
                  })
                }}
                expandData={showkeywords}
              >
                <h4 className={styles['heading']}>
                  {'Keywords'}
                  {user?.is_admin && (
                    <Image
                      className={styles['pencil-edit']}
                      src={EditIcon}
                      alt="edit"
                      onClick={() =>
                        router.push(`/admin/hobby/edit/${data?.slug}`)
                      }
                    />
                  )}
                </h4>
                <div
                  className={`${styles['display-desktop']}${
                    showkeywords ? ' ' + styles['display-mobile'] : ''
                  }`}
                >
                  <ul className={styles['classification-items']}>
                    {data?.keywords &&
                      data?.keywords.map((tag: any, idx: number) => {
                        return tag ? <li>{tag}</li> : null
                      })}
                    <li className={styles['active']}></li>
                  </ul>
                </div>
              </PageContentBox>
            )}
          </aside>
        )}

        <main className={styles['display-desktop']}>{children}</main>

        {/* {!hideLastColumn && ( */}
        {(isMobile || !hideLastColumn) && (
          <>
            {(activeTab === 'home' || (activeTab === 'posts' && !isMobile)) && (
              <aside>
                <div className={styles['members']}>
                  <div className={styles['heading']}>
                    <h4>Members</h4>
                    <Image
                      src={ChevronDown}
                      alt=""
                      onClick={() => {
                        setShowMembers((prev) => {
                          dispatch(
                            updateMembersOpenStates({ [data._id]: !prev }),
                          )
                          return !prev
                        })
                      }}
                      className={`${styles['display-mobile']} ${
                        showMembers ? styles['rotate-180'] : ''
                      }`}
                    />
                  </div>

                  <div
                    className={`${styles['member-list']} ${
                      styles['display-desktop']
                    }${showMembers ? ' ' + styles['display-flex-mobile'] : ''}`}
                  >
                    {loading ? (
                      <p>Loading...</p>
                    ) : members.length > 0 ? (
                      <>
                        {members
                          .slice(0, seeAll ? members.length : 5)
                          .map((user: any, idx: number) => (
                            <p key={idx}>
                              <div
                                onClick={() => {
                                  handleMemberClick(user)
                                }}
                              >
                                <div className={styles['hobbies-members']}>
                                  {user.profile_image ? (
                                    <img
                                      className={styles['member-img']}
                                      width="24"
                                      height="24"
                                      src={user.profile_image}
                                      alt=""
                                    />
                                  ) : (
                                    <Image
                                      className={styles['member-img']}
                                      width="24"
                                      height="24"
                                      src={defaultUserIcon}
                                      alt=""
                                    />
                                  )}
                                  <div>{user.full_name}</div>
                                </div>
                              </div>
                            </p>
                          ))}
                        {members.length > 5 && !seeAll && (
                          <p
                            className={styles.seeAllBtn}
                            onClick={toggleMembers}
                          >
                            See All
                          </p>
                        )}
                      </>
                    ) : (
                      <>
                        <p className={styles.noMembers}>
                          No members for this hobby!
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </aside>
            )}
          </>
        )}

        <main
          className={`${styles['display-mobile']} ${styles['mob-min-height']}`}
        >
          {children}
        </main>
      </PageGridLayout>
    </>
  )
}

export default HobbyPageLayout
