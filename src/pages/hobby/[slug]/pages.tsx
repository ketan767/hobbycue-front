import React, { useCallback, useEffect, useRef, useState } from 'react'
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
import { useMediaQuery } from '@mui/material'
import PagesLoader from '@/components/PagesLoader/PagesLoader'
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
  const [pages, setPages] = useState<any[]>([])
  const [pageNo, setPageNo] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const observer = useRef<IntersectionObserver | null>(null)

  const getPost = async (p = 1) => {
    setLoadingPosts(true)
    const { err, res } = await getHobbyPages(
      `display=${data.display}&limit=10&page=${p}`,
    )

    if (err) {
      setLoadingPosts(false)
      return console.log(err)
    }
    if (res.data.success) {
      setLoadingPosts(false)
      res.data.data.length < 10 ? setHasMore(false) : setHasMore(true)
      setPages((prev: any[]) => {
        let merged = [...prev]
        res.data.data?.forEach((post: any) => {
          if (!merged.some((p: any) => p._id === post._id)) merged.push(post)
        })
        return merged
      })
    }
  }

  useEffect(() => {
    getPost()
  }, [])

  const lastPostElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loadingPosts || !hasMore) return

      const observerCallback = (entries: IntersectionObserverEntry[]) => {
        if (entries[0].isIntersecting && hasMore && !loadingPosts) {
          setPageNo((prevPageNo) => {
            const nextPage = prevPageNo + 1
            getPost(nextPage)
            return nextPage
          })
        }
      }

      if (observer.current) {
        console.log('first disconnect')
        observer.current.disconnect()
      }

      observer.current = new IntersectionObserver(observerCallback)

      if (node) {
        console.log('first observe')
        observer.current.observe(node)
      }

      return () => {
        if (observer.current) observer.current.disconnect()
      }
    },
    [loadingPosts, hasMore],
  )

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
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
        />
      </Head>
      <HobbyPageLayout
        activeTab="pages"
        data={data}
        expandAll={expandAll}
        setExpandAll={handleExpandAll}
      >
        <main className={``}>
          <section className={styles['pages-container']}>
            {pages.length !== 0 &&
              pages.map((post: any, idx: number) => {
                return idx === pages.length - 1 ? (
                  <div ref={lastPostElementRef} className={`page-with-ref`}>
                    <ListingCard key={idx} data={post} />
                  </div>
                ) : (
                  <div className={`page-${idx + 1}`}>
                    <ListingCard key={idx} data={post} />
                  </div>
                )
              })}
            {loadingPosts && (
              <>
                <PagesLoader /> <PagesLoader /> <PagesLoader /> <PagesLoader />
              </>
            )}
          </section>
          {pages.length === 0 && !loadingPosts && (
            <div className={styles['dual-section-wrapper']}>
              <div className={styles['no-posts-container']}>
                <p>No pages available</p>
              </div>
              {!isMobile && (
                <div className={styles['no-posts-container']}></div>
              )}
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
