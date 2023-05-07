import React, { useEffect } from 'react'
import PageContentBox from '@/layouts/PageContentBox'
import PageGridLayout from '@/layouts/PageGridLayout'
import { withAuth } from '@/navigation/withAuth'
import styles from '@/styles/Community.module.css'
import Image from 'next/image'
import { useSelector } from 'react-redux'
import store, { RootState } from '@/redux/store'
import DefaultProfileImage from '@/assets/svg/default-profile.svg'
import EditIcon from '@/assets/svg/edit-icon.svg'
import { openModal } from '@/redux/slices/modal'
import { getAllPosts } from '@/services/post.service'
import { GetServerSideProps } from 'next'
import { updatePosts } from '@/redux/slices/post'
import PostCard from '@/components/PostCard/PostCard'

type Props = {}

const Community: React.FC<Props> = ({}) => {
  const { user } = useSelector((state: RootState) => state.user)
  const { allPosts } = useSelector((state: RootState) => state.post)

  const getPost = async () => {
    const { err, res } = await getAllPosts(`populate=_author,_genre,_hobby`)
    if (err) return console.log(err)
    if (res.data.success) {
      store.dispatch(updatePosts(res.data.data.posts))
    }
  }

  useEffect(() => {
    getPost()
  }, [])

  return (
    <>
      <PageGridLayout column={3}>
        <aside className={styles['community-left-aside']}>
          <section className={`content-box-wrapper ${styles['profile-switcher']}`}>
            <Image src={user?.profile_image || DefaultProfileImage} alt="" />
            <p className={styles['name']}>{user?.full_name}</p>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clip-path="url(#clip0_25_51286)">
                <path
                  d="M15.88 9.29055L12 13.1705L8.11998 9.29055C7.72998 8.90055 7.09998 8.90055 6.70998 9.29055C6.31998 9.68055 6.31998 10.3105 6.70998 10.7005L11.3 15.2905C11.69 15.6805 12.32 15.6805 12.71 15.2905L17.3 10.7005C17.69 10.3105 17.69 9.68055 17.3 9.29055C16.91 8.91055 16.27 8.90055 15.88 9.29055Z"
                  fill="#08090A"
                />
              </g>
              <defs>
                <clipPath id="clip0_25_51286">
                  <rect width="24" height="24" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </section>

          <section className={`content-box-wrapper ${styles['hobbies-side-wrapper']}`}>
            <header>
              <h3>Hobbies</h3>
              <Image src={EditIcon} alt="Edit" />
            </header>
            <span className={styles['divider']}></span>
            <section>
              <ul>
                {user?._hobbies?.map((hobby: any) => {
                  return <li key={hobby._id}>{hobby?.hobby?.display}</li>
                })}
              </ul>
            </section>
          </section>

          <section className={`content-box-wrapper ${styles['location-side-wrapper']}`}>
            <header>
              <h3>Location</h3>
              <Image src={EditIcon} alt="Edit" />
            </header>
            <span className={styles['divider']}></span>
            <section>
              <ul>
                {user?._addresses?.map((address: any) => {
                  return <li key={address._id}>{address?.city}</li>
                })}
              </ul>
            </section>
          </section>
        </aside>

        <main>
          <header className={styles['community-header']}>
            <section className={`content-box-wrapper ${styles['start-post-btn-container']}`}>
              <button
                onClick={() => store.dispatch(openModal({ type: 'create-post', closable: true }))}
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
            <section className={`content-box-wrapper ${styles['navigation-links']}`}>
              <ul>
                <li className={styles['active']}>Posts</li>
                <li>Links</li>
                <li>Pages</li>
                <li>Store</li>
                <li>Blogs</li>
              </ul>
            </section>
          </header>

          <section className={styles['posts-container']}>
            {allPosts.length === 0 && 'No Posts'}
            {allPosts.map((post: any) => {
              return <PostCard key={post._id} data={post} />
            })}
          </section>
        </main>

        <aside className={styles['community-right-aside']}>
          <section className={`content-box-wrapper ${styles['invite-wrapper']}`}>
            <header>
              <h3>Invite to Community</h3>
            </header>
            <span className={styles['divider']}></span>
            <section>
              <input type="text" name="" id="" />
            </section>
          </section>

          <section className={`content-box-wrapper ${styles['trending-hobbies-side-wrapper']}`}>
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

export default withAuth(Community)
