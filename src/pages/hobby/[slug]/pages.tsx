import React, { useEffect, useState } from 'react'
import { GetServerSideProps } from 'next'

import styles from '@/styles/HobbyDetail.module.css'

import { getAllHobbies, getHobbyPages } from '@/services/hobby.service'

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
import ListingCard from '@/components/ListingCard/ListingCard'
import { updateHobbyMenuExpandAll } from '@/redux/slices/site'

type Props = { data: { hobbyData: any } }

const HobbyPostsPage: React.FC<Props> = (props) => {
  const data = props.data.hobbyData

  const dispatch = useDispatch()
  const { hobby } = useSelector((state: RootState) => state?.site.expandMenu)
  const [expandAll, setExpandAll] = useState(hobby)
  const { isLoggedIn, isAuthenticated } = useSelector(
    (state: RootState) => state.user,
  )

  const [loadingPosts, setLoadingPosts] = useState(false)
  const [pages, setPages] = useState([])

  const getPost = async () => {
    setLoadingPosts(true)
    const { err, res } = await getHobbyPages(`${data.display}`)

    if (err) {
      setLoadingPosts(false)
      return console.log(err)
    }
    if (res.data.success) {
      setLoadingPosts(false)
      console.log('pages', res.data.data)
      setPages(res.data.data)
    }
  }

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
  console.log('hobby', data)
  console.log('pages', pages)
  return (
    <>
      {' '}
      <HobbyPageLayout
        activeTab="pages"
        data={data}
        expandAll={expandAll}
        setExpandAll={handleExpandAll}
      >
        <main className={`${styles['display-desktop']}`}>
          <section className={styles['pages-container']}>
            {loadingPosts && <PostCardSkeletonLoading />}
            {pages.length !== 0 &&
              pages.map((post: any, idx: number) => {
                return <ListingCard key={idx} data={post} />
              })}
          </section>
          {pages.length === 0 && !loadingPosts && (
            <div className={styles['dual-section-wrapper']}>
              <div className={styles['no-posts-container']}>
                <p>No pages available</p>
              </div>
            </div>
          )}
        </main>
      </HobbyPageLayout>
      <main className={`${styles['display-mobile']}`}></main>
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
