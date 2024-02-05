import React, { SetStateAction, useEffect, useRef, useState } from 'react'
import styles from '@/styles/HobbyDetail.module.css'

import ProfileHeader from '../../components/ProfilePage/ProfileHeader/ProfileHeader'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { useRouter } from 'next/router'
import { updateProfileLayoutMode } from '@/redux/slices/site'
import ProfileHeaderSmall from '@/components/ProfilePage/ProfileHeader/ProfileHeaderSmall'
import HobbyPageHeader from '@/components/HobbyPage/HobbyHeader/HobbyHeader'
import PageGridLayout from '../PageGridLayout'
import { getAllHobbies, getHobbyMembers } from '@/services/hobby.service'
import ProfileSwitcher from '@/components/ProfileSwitcher/ProfileSwitcher'
import PageContentBox from '../PageContentBox'
import Link from 'next/link'
import HobbyPageHeaderSmall from '@/components/HobbyPage/HobbyHeader/HobbyPageHeaderSmall'
import ChevronDown from '@/assets/svg/chevron-down.svg'
import Image from 'next/image'
import HobbyNavigationLinks from '@/components/HobbyPage/HobbyHeader/HobbyNavigationLinks'
import defaultUserIcon from '@/assets/svg/default-images/default-user-icon.svg'
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
  const [showSmallHeader, setShowSmallHeader] = useState(false)
  const [members, setMembers] = useState([])
  const hideLastColumnPages = ['pages', 'blogs']
  const [hideLastColumn, sethideLastColumn] = useState(false)
  const router = useRouter()
  const [seeAll, setSeeAll] = useState(false)
  const [loading, setLoading] = useState(true)
  const [showMembers, setShowMembers] = useState(false)
  const [showHobbiesClassification, setShowHobbiesClassification] =
    useState(false)

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
    console.log('mem', res.data)
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
  }, [])

  const toggleMembers = () => {
    setSeeAll(!seeAll)
  }
  return (
    <>
      {/* Profile Page Header - Profile and Cover Image with Action Buttons */}
      <HobbyPageHeader data={data} activeTab={activeTab} />
      {showSmallHeader && (
        <HobbyPageHeaderSmall data={data} activeTab={activeTab} />
      )}

      <div
        onClick={() => {
          if (setExpandAll !== undefined)
            setExpandAll(!expandAll)
        }}
        className={styles['expand-all']}
      >
        {expandAll ? <p>Collapse All</p> : <p>Expand All</p>}
        <Image
          src={ChevronDown}
          className={`${expandAll ? styles['rotate-180'] :''}`}
          alt=""
        />
      </div>

      <PageGridLayout column={!hideLastColumn ? 3 : 2}>
        <aside className={`custom-scrollbar ${styles['hobby-left-aside']} ${expandAll?"":styles['display-none']}`}>
          <PageContentBox
            showEditButton={false}
            setDisplayData={setShowHobbiesClassification}
          >
            <h4 className={styles['heading']}>Hobbies Classification</h4>
            <div
              className={`${styles['display-desktop']}${
                showHobbiesClassification ? ' ' + styles['display-mobile'] : ''
              }`}
            >
              <ul className={styles['classification-items']}>
                <Link href={`/hobby/${data?.category?.slug}`}>
                  <li>{data?.category?.display}</li>
                </Link>
                <Link href={`/hobby/${data?.sub_category?.slug}`}>
                  <li>{data?.sub_category?.display}</li>
                </Link>
                {data?.tags &&
                  data?.tags.map((tag: any, idx: number) => {
                    return (
                      <Link key={idx} href={`/hobby/${tag?.slug}`}>
                        <li>{tag.display}</li>
                      </Link>
                    )
                  })}
                <li className={styles['active']}>{data?.display}</li>
              </ul>
            </div>
          </PageContentBox>
        </aside>
        <main className={styles['display-desktop']}>{children}</main>

        {!hideLastColumn && (
          <aside className={expandAll?"":styles['display-none']}>
            <div className={styles['members']}>
              <div className={styles['heading']}>
                <h4>Members</h4>
                <Image
                  src={ChevronDown}
                  alt=""
                  onClick={() => setShowMembers((prevValue) => !prevValue)}
                  className={`${styles['display-mobile']} ${
                    showMembers ? styles['rotate-180'] : ''
                  }`}
                />
              </div>
              <hr
                className={`${styles['display-desktop']}${
                  showMembers ? ' ' + styles['display-flex-mobile'] : ''
                }`}
              />
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
                          <Link href={`/profile/${user.profile_url}`}>
                            <div className={styles['hobbies-members']}>
                              <Image
                                className={styles['member-img']}
                                width="24"
                                height="24"
                                src={user.profile_image || defaultUserIcon}
                                alt=""
                              />
                              <div>{user.full_name}</div>
                            </div>
                          </Link>
                        </p>
                      ))}
                    {members.length > 5 && !seeAll && (
                      <p className={styles.seeAllBtn} onClick={toggleMembers}>
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
        <main className={styles['display-mobile']}>{children}</main>
        <div className={`${styles['display-mobile']}`}>
          <HobbyNavigationLinks activeTab={activeTab} />
        </div>
      </PageGridLayout>
    </>
  )
}

export default HobbyPageLayout
