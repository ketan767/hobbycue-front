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
import { getListingPages } from '@/services/listing.service'
import ListingCard from '@/components/ListingCard/ListingCard'
import PagesLoader from '@/components/PagesLoader/PagesLoader'

type Props = { data: { hobbyData: any } }

const HobbyStorePage: React.FC<Props> = (props) => {
  const data = props.data.hobbyData

  const [loadingPosts, setLoadingPosts] = useState(false)
  const [products, setProducts] = useState([])
  const { hobby } = useSelector((state: RootState) => state?.site.expandMenu)
  const [expandAll, setExpandAll] = useState(hobby)
  const dispatch = useDispatch()
  const { isLoggedIn, isAuthenticated } = useSelector(
    (state: RootState) => state.user,
  )
  const isMobile = useMediaQuery('(max-width:1100px)')
  useEffect(() => {
    if (isMobile) {
      setExpandAll(false)
    }
  }, [isMobile])
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

  useEffect(() => {
    ;(async () => {
      setLoadingPosts(true)
      const { err, res } = await getListingPages(
        `type=4&populate=_hobbies,product_variant,seller`,
      )

      if (err) {
        setLoadingPosts(false)
        return console.log(err)
      }
      if (res?.data?.success) {
        const tempArr = res?.data?.data?.listings?.filter((el: any) =>
          el?._hobbies?.some(
            (el2: any) => el2?.hobby?.display === data?.display,
          ),
        )
        setLoadingPosts(false)
        setProducts(tempArr)
      }
    })()
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
      <HobbyPageLayout
        activeTab="store"
        data={data}
        expandAll={expandAll}
        setExpandAll={handleExpandAll}
      >
        <main className={``}>
          <section className={styles['pages-container']}>
            {loadingPosts && (
              <>
                <PagesLoader /> <PagesLoader /> <PagesLoader /> <PagesLoader />{' '}
              </>
            )}
            {!loadingPosts &&
              products.length !== 0 &&
              products?.map((product: any) => (
                <ListingCard data={product} key={product?.id} />
              ))}
          </section>
          {!loadingPosts && products.length === 0 && (
            <div className={styles['dual-section-wrapper']}>
              <div className={styles['no-posts-container']}>
                <p>No products available</p>
              </div>
              {!isMobile && (
                <div className={styles['no-posts-container']}></div>
              )}
            </div>
          )}
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
    hobbyData: res.data?.hobbies?.[0],
  }
  return {
    props: {
      data,
    },
  }
}

export default HobbyStorePage
