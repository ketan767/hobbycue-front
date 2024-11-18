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

type Props = { data: { hobbyData: any; pageData: any } }

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
  const [pages, setPages] = useState(props?.data?.pageData || [])
  const [page, setPage] = useState(2)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const observer = useRef<IntersectionObserver | null>(null)

  const router = useRouter()
  const fetchMoreData = useCallback(async () => {
    if (loading || !hasMore) return
    setLoading(true)
    const { res, err } = await getHobbyPages(
      `display=${data.display}&limit=10&page=${page}&populate=_hobbies`,
    )

    if (err || !res?.data?.data?.length) {
      setHasMore(false)
    } else {
      setPages((prevData: any) => [...prevData, ...res?.data?.data])
      setPage(page + 1)
    }
    setLoading(false)
  }, [page, loading, hasMore])

  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout | null = null

    const handleScroll = () => {
      if (scrollTimeout) clearTimeout(scrollTimeout)

      scrollTimeout = setTimeout(() => {
        if (
          window.innerHeight + document.documentElement.scrollTop >=
          document.documentElement.offsetHeight - 100
        ) {
          fetchMoreData()
        }
      }, 200)
    }

    window.addEventListener('scroll', handleScroll)

    return () => {
      if (scrollTimeout) clearTimeout(scrollTimeout)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [fetchMoreData])

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
  const displayDescMeta = () => {
    if (data?.level === 0) {
      return 'Category'
    } else if (data?.level === 1) {
      return 'Sub-Category'
    } else if (data?.level === 2) {
      return 'Hobby Tag'
    } else if (data?.level === 3) {
      return 'Hobby'
    } else if (data?.level === 5) {
      return 'Genre/Style'
    } else {
      return data?.about ?? ''
    }
  }

  return (
    <>
      <Head>
        {data?.profile_image ? (
          <>
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
            />

            <meta property="og:image" content={`${data?.profile_image}`} />

            <meta
              property="og:image:secure_url"
              content={`${data?.profile_image}`}
            />

            <meta property="og:image:alt" content="Profile picture" />
          </>
        ) : (
          ''
        )}
        <meta property="og:description" content={displayDescMeta()} />
        <title>{`${data?.display} | HobbyCue`}</title>
      </Head>
      <HobbyPageLayout
        activeTab="pages"
        data={data}
        expandAll={expandAll}
        setExpandAll={handleExpandAll}
      >
        <main className={``}>
          <section className={styles['pages-container']}>
            {pages?.length !== 0 &&
              pages?.map((post: any, idx: number) => {
                return idx === pages.length - 1 ? (
                  <ListingCard key={idx} data={post} />
                ) : (
                  <ListingCard key={idx} data={post} />
                )
              })}
            {loading && (
              <>
                <PagesLoader /> <PagesLoader /> <PagesLoader /> <PagesLoader />
              </>
            )}
          </section>
          {pages.length === 0 && !loading && (
            <div
            style={
              isMobile
                ? { marginTop: '8px', height: '100px', borderRadius: '0px' }
                : undefined
            }
             className={styles['dual-section-wrapper']}>
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
  const { res: hobbypageRes, err: HobbyPageErr } = await getHobbyPages(
    `display=${res?.data?.hobbies?.[0]?.display}&limit=10&page=1`,
  )
  const data = {
    hobbyData: res?.data?.hobbies?.[0],
    pageData: hobbypageRes?.data?.data || [],
  }

  return {
    props: {
      data,
    },
  }
}

export default HobbyPostsPage
