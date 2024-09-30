import React, { useEffect, useState } from 'react'
import { GetServerSideProps } from 'next'

import styles from '@/styles/HobbyDetail.module.css'

import { getAllHobbies } from '@/services/hobby.service'

import { useRouter } from 'next/router'
import Link from 'next/link'
import PageContentBox from '@/layouts/PageContentBox'
import PageGridLayout from '@/layouts/PageGridLayout'
import HobbyPageLayout from '@/layouts/HobbyPageLayout'
import ProfileSwitcher from '@/components/ProfileSwitcher/ProfileSwitcher'
import { getAllPosts } from '@/services/post.service'
import { RootState } from '@/redux/store'
import { useDispatch, useSelector } from 'react-redux'
import PostCardSkeletonLoading from '@/components/PostCardSkeletonLoading'
import PostCard from '@/components/PostCard/PostCard'
import { openModal } from '@/redux/slices/modal'
import { updateHobbyMenuExpandAll } from '@/redux/slices/site'
import { useMediaQuery } from '@mui/material'
import Head from 'next/head'

type Props = { data: { hobbyData: any } }

const HobbyPostsPage: React.FC<Props> = (props) => {
  const data = props.data.hobbyData

  const dispatch = useDispatch()
  const { hobby } = useSelector((state: RootState) => state?.site.expandMenu)
  const [expandAll, setExpandAll] = useState(hobby)
  const { isLoggedIn, isAuthenticated } = useSelector(
    (state: RootState) => state.user,
  )
  const isMobile = useMediaQuery('(max-width:1100px)')
  useEffect(() => {
    if (isMobile) {
      setExpandAll(false)
    }
  }, [isMobile])

  const [loadingPosts, setLoadingPosts] = useState(false)
  const [posts, setPosts] = useState([])

  const getPost = async () => {
    setLoadingPosts(true)
    const queryParam =
      data?.level === 5
        ? `_genre=${data._id}&populate=_author,_genre,_hobby`
        : `_hobby=${data._id}&populate=_author,_genre,_hobby`

    const { err, res } = await getAllPosts(queryParam)

    if (err) return console.log(err)
    if (res.data.success) {
      setPosts(res.data.data.posts)
    }
    setLoadingPosts(false)
  }
  console.log('post', posts)
  useEffect(() => {
    getPost()
  }, [])

  const router = useRouter()

  useEffect(() => {
    // Save scroll position when navigating away from the page
    const handleRouteChange = () => {
      sessionStorage.setItem('scrollPositionhobby', window.scrollY.toString())
    }

    // Restore scroll position when navigating back to the page
    const handleScrollRestoration = () => {
      const scrollPosition = sessionStorage.getItem('scrollPositionhobby')
      if (scrollPosition) {
        window.scrollTo(0, parseInt(scrollPosition, 10))
        sessionStorage.removeItem('scrollPositionhobby')
      }
    }

    router.events.on('routeChangeStart', handleRouteChange)

    router.events.on('routeChangeComplete', handleScrollRestoration)

    return () => {
      router.events.off('routeChangeStart', handleRouteChange)
      router.events.off('routeChangeComplete', handleScrollRestoration)
    }
  }, [])

  const handleExpandAll: (value: boolean) => void = (value) => {
    setExpandAll(value)
    dispatch(updateHobbyMenuExpandAll(value))
  }

  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
        />
      </Head>
      <div>
        <HobbyPageLayout
          activeTab="posts"
          data={data}
          expandAll={expandAll}
          setExpandAll={handleExpandAll}
        >
          <main className={`${styles['display-desktop']}`}>
            {/* {isLoggedIn && (
            <div className={styles['start-post-btn']}>
              <button
                onClick={() => {
                  if (isLoggedIn)
                    dispatch(openModal({ type: 'create-post', closable: true }))
                  else dispatch(openModal({ type: 'auth', closable: true }))
                }}
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="inherit">
                  <path
                    d="M11.1429 6.85745H6.85714V11.1432C6.85714 11.6146 6.47143 12.0003 6 12.0003C5.52857 12.0003 5.14286 11.6146 5.14286 11.1432V6.85745H0.857143C0.385714 6.85745 0 6.47173 0 6.00031C0 5.52888 0.385714 5.14316 0.857143 5.14316H5.14286V0.857448C5.14286 0.386019 5.52857 0.000305176 6 0.000305176C6.47143 0.000305176 6.85714 0.386019 6.85714 0.857448V5.14316H11.1429C11.6143 5.14316 12 5.52888 12 6.00031C12 6.47173 11.6143 6.85745 11.1429 6.85745Z"
                    fill="inherit"
                  />
                </svg>
                <span>Start a post</span>
              </button>
            </div>
          )} */}

            <section className={`${styles['posts-container']}`}>
              {loadingPosts ? (
                <>
                  <PostCardSkeletonLoading />
                  <PostCardSkeletonLoading />
                  <PostCardSkeletonLoading />
                </>
              ) : (
                posts.length === 0 &&
                isLoggedIn && (
                  <div className={styles['no-posts-container']}>
                    <p>No posts available</p>
                  </div>
                )
              )}
              {isLoggedIn ? (
                posts.map((post: any) => {
                  return (
                    <PostCard
                      key={post._id}
                      postData={post}
                      currentSection="posts"
                    />
                  )
                })
              ) : (
                <div className={styles['no-posts-container']}>
                  <p
                    className="cursor-pointer"
                    onClick={() => {
                      dispatch(openModal({ type: 'auth', closable: true }))
                    }}
                  >
                    Login to see the posts
                  </p>
                </div>
              )}
            </section>
          </main>
          <main className={`${styles['display-mobile']}`}>
            <section className={`${styles['posts-container']}`}>
              {loadingPosts ? (
                <>
                  <PostCardSkeletonLoading />
                  <PostCardSkeletonLoading />
                  <PostCardSkeletonLoading />
                </>
              ) : (
                posts.length === 0 && (
                  <div className={styles['no-posts-container']}>
                    <p>No posts available</p>
                  </div>
                )
              )}
              {posts.map((post: any) => {
                return <PostCard key={post._id} postData={post} />
              })}
            </section>
          </main>
        </HobbyPageLayout>
      </div>
    </>
  )
}

export const getServerSideProps: GetServerSideProps<Props> = async (
  context,
) => {
  const { query } = context

  const { err, res } = await getAllHobbies(
    `slug=${query.slug}&populate=category,sub_category,tags,related_hobbies`,
  )

  if (err) return { notFound: true }

  if (res?.data.success && res.data.no_of_hobbies === 0)
    return { notFound: true }

  const data = {
    hobbyData: res.data?.hobbies?.[0],
  }
  return {
    props: {
      data,
    },
  }
}

export default HobbyPostsPage
