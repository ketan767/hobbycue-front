import React, { useEffect, useRef, useState } from 'react'
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

type Props = {
  activeTab: HobbyPageTabs
  data: any
  children: React.ReactNode
}

const HobbyPageLayout: React.FC<Props> = ({ children, activeTab, data }) => {
  const [showSmallHeader, setShowSmallHeader] = useState(false)
  const [members, setMembers] = useState([])
  const hideLastColumnPages = ['pages', 'blogs']
  const [hideLastColumn, sethideLastColumn] = useState(false)
  const router = useRouter()
  const [seeAll, setSeeAll] = useState(false)
  const [loading, setLoading] = useState(true)

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

      {/* Profile Page Body, where all contents of different tabs appears. */}
      <PageGridLayout column={!hideLastColumn ? 3 : 2}>
        <aside className={`custom-scrollbar ${styles['hobby-left-aside']}`}>
          <PageContentBox showEditButton={false}>
            <h4 className={styles['heading']}>Hobbies Classification</h4>
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
          </PageContentBox>
        </aside>
        <main>{children}</main>

        {!hideLastColumn && (
          <aside>
            <div className={styles['members']}>
              <h4 className={styles['heading']}>Members</h4>
              <hr />
              <div className={styles['member-list']}>
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
                              <img
                                className={styles['member-img']}
                                width="24"
                                height="24"
                                src={user.profile_image}
                              ></img>
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
      </PageGridLayout>
    </>
  )
}

export default HobbyPageLayout
