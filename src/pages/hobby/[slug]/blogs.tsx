import React, { useEffect, useState } from 'react'
import { GetServerSideProps } from 'next'

import styles from '@/styles/HobbyDetail.module.css'

import { getAllHobbies, getHobbyBlogs } from '@/services/hobby.service'

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
import { getAllBlogs } from '@/services/blog.services'
import BlogLoader from '@/components/BlogsLoader/BlogLoader'
import BlogCard from '@/components/BlogCard/BlogCard'
import Head from 'next/head'
import { htmlToPlainTextAdv } from '@/utils'

type Props = {
  data: { hobbyData: any }
  unformattedAbout?: string
  previewLine1: string
}
const HobbyBlogsPage: React.FC<Props> = (props) => {
  const data = props.data.hobbyData

  const { hobby } = useSelector((state: RootState) => state?.site.expandMenu)
  const [expandAll, setExpandAll] = useState(hobby)
  const dispatch = useDispatch()
  const { isLoggedIn, isAuthenticated } = useSelector(
    (state: RootState) => state.user,
  )
  const [loadingPosts, setLoadingPosts] = useState(false)
  const [blogs, setBlogs] = useState([])
  const handleExpandAll: (value: boolean) => void = (value) => {
    setExpandAll(value)
    dispatch(updateHobbyMenuExpandAll(value))
  }
  const isMobile = useMediaQuery('(max-width:1100px)')
  useEffect(() => {
    if (isMobile) {
      setExpandAll(false)
    }
  }, [isMobile])
  const router = useRouter()

  const getPost = async () => {
    setLoadingPosts(true)
    const { err, res } = await getHobbyBlogs(`${data.display}`)
    console.warn('blogsssss', res?.data)
    if (err) {
      setLoadingPosts(false)
      return console.log(err)
    }
    if (res.data.success) {
      setLoadingPosts(false)

      setBlogs(res?.data?.data)
    }
  }

  useEffect(() => {
    getPost()
  }, [])

  useEffect(() => {
    const handleRouteChange = () => {
      sessionStorage.setItem('scrollPositionhobby', window.scrollY.toString())
    }

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
        <meta
          property="og:description"
          content={
            props?.previewLine1 +
            ' ⬢ ' +
            props?.unformattedAbout +
            ' • ' +
            data?.display +
            ' ' +
            'hobby community'
          }
        />
        <title>{`${data?.display} | HobbyCue`}</title>
      </Head>
      <HobbyPageLayout
        activeTab="blogs"
        data={data}
        expandAll={expandAll}
        setExpandAll={handleExpandAll}
      >
        <main className={`${styles['dual-section-wrapper']}`}>
          <section className={styles['store-container']}>
            {loadingPosts && (
              <>
                <BlogLoader /> <BlogLoader /> <BlogLoader />{' '}
              </>
            )}
            {blogs.length !== 0 &&
              blogs.map((post: any, idx: number) => {
                return <BlogCard key={idx} data={post} />
              })}
            {blogs.length === 0 && !loadingPosts && (
              <>
                <div
                  style={
                    isMobile
                      ? {
                          marginTop: '8px',
                          height: '100px',
                          borderRadius: '0px',
                        }
                      : undefined
                  }
                  className={styles['no-posts-container']}
                >
                  <p>No Blogs available</p>
                </div>
                {!isMobile && (
                  <>
                    <div className={styles['no-posts-container']}>
                      <p></p>
                    </div>
                    <div className={styles['no-posts-container']}>
                      <p></p>
                    </div>
                  </>
                )}
              </>
            )}
          </section>
        </main>
      </HobbyPageLayout>
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
    pageData: null,
    postsData: null,
    mediaData: null,
    listingsData: null,
    blogsData: null,
    hobbyData: res.data?.hobbies?.[0] ?? [],
  }
  const unformattedAbout = htmlToPlainTextAdv(
    res.data?.hobbies?.[0]?.description,
  )

  const hobbyType =
    data?.hobbyData?.level === 0
      ? 'Category'
      : data?.hobbyData?.level === 1
      ? 'Sub-Category'
      : data?.hobbyData?.level === 2
      ? 'Hobby Tag'
      : data?.hobbyData?.level === 3
      ? 'Hobby'
      : data?.hobbyData?.level === 5
      ? 'Genre/Style'
      : 'Hobby'

  const additionalInfo =
    data?.hobbyData?.level !== 0
      ? (data?.hobbyData?.category?.display
          ? ' | ' + data?.hobbyData?.category?.display
          : '') +
        (data?.hobbyData?.level > 1 && data?.hobbyData?.sub_category?.display
          ? ', ' + data?.hobbyData?.sub_category?.display
          : '')
      : ''
  const previewLine1 = `${hobbyType}${additionalInfo}`
  return {
    props: {
      data,
      unformattedAbout,
      previewLine1,
    },
  }
}

export default HobbyBlogsPage
