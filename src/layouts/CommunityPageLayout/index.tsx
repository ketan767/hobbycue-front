import React, { useEffect, useState } from 'react'
import PageContentBox from '@/layouts/PageContentBox'
import PageGridLayout from '@/layouts/PageGridLayout'
import { withAuth } from '@/navigation/withAuth'
import styles from './CommunityLayout.module.css'
import Image from 'next/image'
import { useDispatch, useSelector } from 'react-redux'
import store, { RootState } from '@/redux/store'
import EditIcon from '@/assets/svg/edit-icon.svg'
import { openModal } from '@/redux/slices/modal'
import { getAllPosts } from '@/services/post.service'
import { GetServerSideProps } from 'next'
import { updatePosts } from '@/redux/slices/post'
import PostCard from '@/components/PostCard/PostCard'
import ProfileSwitcher from '@/components/ProfileSwitcher/ProfileSwitcher'
import PostCardSkeletonLoading from '@/components/PostCardSkeletonLoading'
import { checkIfUrlExists } from '@/utils'
import Link from 'next/link'

type Props = {
  activeTab: CommunityPageTabs
  children: React.ReactNode
}

const CommunityLayout: React.FC<Props> = ({ children, activeTab }) => {
  const dispatch = useDispatch()
  const { activeProfile } = useSelector((state: RootState) => state.user)
  const { allPosts } = useSelector((state: RootState) => state.post)
  const [isLoadingPosts, setIsLoadingPosts] = useState(false)

  const [selectedHobby, setSelectedHobby] = useState('')
  const [selectedLocation, setSelectedLocation] = useState('')
  const tabs: CommunityPageTabs[] = [
    'posts',
    'links',
    'pages',
    'store',
    'blogs',
  ]

  const getPost = async () => {
    const params = new URLSearchParams(`populate=_author,_genre,_hobby`)
    activeProfile?.data?._hobbies.forEach((item: any) => {
      params.append('_hobby', item.hobby._id)
    })

    setIsLoadingPosts(true)
    const { err, res } = await getAllPosts(params.toString())
    if (err) return console.log(err)
    if (res.data.success) {
      store.dispatch(updatePosts(res.data.data.posts))
    }
    setIsLoadingPosts(false)
  }

  useEffect(() => {
    getPost()
  }, [activeProfile])

  const handleHobbyClick = async (item: any) => {
    if (selectedHobby !== item.hobby._id) {
      setSelectedHobby(item.hobby._id)
    } else {
      setSelectedHobby('')
    }
  }

  const fetchPosts = async () => {
    const params = new URLSearchParams(`populate=_author,_genre,_hobby`)
    if (selectedHobby !== '') {
      params.append('_hobby', selectedHobby)
    }
    if (selectedLocation !== '') {
      params.append('visibility', selectedLocation)
    }
    setIsLoadingPosts(true)
    const { err, res } = await getAllPosts(params.toString())
    if (err) return console.log(err)
    if (res.data.success) {
      let posts = res.data.data.posts.map((post: any) => {
        let content = post.content.replace(/<img .*?>/g, '')
        return { ...post, content }
      })
      store.dispatch(updatePosts(posts))
    }
    setIsLoadingPosts(false)
  }

  useEffect(() => {
    fetchPosts()
  }, [selectedHobby, selectedLocation])

  const handleLocationClick = async (item: any) => {
    if (item === selectedLocation) {
      setSelectedLocation('')
    } else {
      setSelectedLocation(item)
    }
  }
  return (
    <>
      <PageGridLayout column={3}>
        <aside className={styles['community-left-aside']}>
          <ProfileSwitcher />
          <section
            className={`content-box-wrapper ${styles['hobbies-side-wrapper']}`}
          >
            <header>
              <h3>Hobbies</h3>
              {/* <Image src={EditIcon} alt="Edit" /> */}
            </header>
            <span className={styles['divider']}></span>
            <section>
              <ul>
                {activeProfile.data?._hobbies?.map((hobby: any) => {
                  return (
                    <li
                      key={hobby._id}
                      onClick={() => handleHobbyClick(hobby)}
                      className={
                        selectedHobby === hobby.hobby._id ? styles.selected : ''
                      }
                    >
                      {hobby?.hobby?.display}
                    </li>
                  )
                })}
              </ul>
            </section>
          </section>

          <section
            className={`content-box-wrapper ${styles['location-side-wrapper']}`}
          >
            <header>
              <h3>Location</h3>
              {/* <Image src={EditIcon} alt="Edit" /> */}
            </header>
            <span className={styles['divider']}></span>
            <section>
              <ul>
                {activeProfile.data?._addresses?.map((address: any) => {
                  return (
                    <ul key={address._id}>
                      <li
                        onClick={() => handleLocationClick(address?.city)}
                        className={
                          selectedHobby === address?.city ? styles.selected : ''
                        }
                      >
                        {address?.city}
                      </li>
                      <li
                        onClick={() => handleLocationClick(address?.country)}
                        className={
                          selectedHobby === address?.country
                            ? styles.selected
                            : ''
                        }
                      >
                        {address?.country}
                      </li>
                      <li
                        onClick={() => handleLocationClick(address?.pin_code)}
                        className={
                          selectedHobby === address?.pin_code
                            ? styles.selected
                            : ''
                        }
                      >
                        {address?.pin_code}
                      </li>
                      <li
                        onClick={() => handleLocationClick(address?.society)}
                        className={
                          selectedHobby === address?.society
                            ? styles.selected
                            : ''
                        }
                      >
                        {address?.society}
                      </li>
                      <li
                        onClick={() => handleLocationClick(address?.state)}
                        className={
                          selectedHobby === address?.state
                            ? styles.selected
                            : ''
                        }
                      >
                        {address?.state}
                      </li>
                    </ul>
                  )
                })}
              </ul>
            </section>
          </section>
        </aside>

        <main>
          <header className={styles['community-header']}>
            <div className={styles['top-margin-card']}></div>
            <section
              className={`content-box-wrapper ${styles['start-post-btn-container']}`}
            >
              <button
                onClick={() =>
                  dispatch(openModal({ type: 'create-post', closable: true }))
                }
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
                    <Link
                      key={tab}
                      href={`/community/${tab !== 'posts' ? tab : ''}`}
                    >
                      <li
                        key={idx}
                        className={activeTab === tab ? styles['active'] : ''}
                      >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                      </li>
                    </Link>
                  )
                })}
              </ul>
            </section>
          </header>
          <section className={styles['children-wrapper']}>{children}</section>
        </main>

        <aside className={styles['community-right-aside']}>
          <section
            className={`content-box-wrapper ${styles['invite-wrapper']}`}
          >
            <header>
              <h3>Invite to Community</h3>
            </header>
            <span className={styles['divider']}></span>
            <section>
              <input type="text" name="" id="" />
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
                {[1, 2, 3, 4, 5, 6]?.map((hobby: any) => {
                  return (
                    <li key={hobby}>
                      <div className={styles['default-img']}></div>
                      <span>{`Hobby ${hobby}`}</span>
                    </li>
                  )
                })}
              </ul>
            </section>
          </section>
        </aside>
      </PageGridLayout>
    </>
  )
}

export default CommunityLayout
