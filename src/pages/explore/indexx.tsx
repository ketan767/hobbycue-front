import React, { useState, useEffect, useCallback } from 'react'
import styles from './explore.module.css'
import ListingCard from '@/components/ListingCard/ListingCard'
import { useRouter } from 'next/router'
import { getListingPages, getListingSearch } from '@/services/listing.service'
import { GetServerSideProps } from 'next'
import PagesLoader from '@/components/PagesLoader/PagesLoader'
import Head from 'next/head'
import ExploreSearchContainer from './searchBar/ExploreSearchContainer'
import { useLocation } from 'react-router-dom'

type Props = {
  data?: any
  isBlog: boolean
}

const Explore: React.FC<Props> = ({ data: initialData }) => {
  const router = useRouter()
  const { query } = router
  const { q } = query

  const [data, setData] = useState(initialData || [])
  const [page, setPage] = useState(1) // Tracks the current page
  const [loading, setLoading] = useState(false) // Indicates if more data is being loaded
  const [hasMore, setHasMore] = useState(true) // Tracks if there are more listings to load

  const fetchMoreData = useCallback(async () => {
    console.log('Fetching more data')
    // alert("Fetchig the data...")
    let queryString = ''
    if (q === undefined) {
      queryString += `&sort=-createdAt&is_published=true&populate=_hobbies,_address,product_variant,seller&page=${
        page + 1
      }&limit=20`
    } else {
      queryString +=
        `title=${encodeURIComponent(q.toString())}` +
        `&sort=-createdAt&is_published=true&populate=_hobbies,_address,product_variant,seller&page=${
          page + 1
        }&limit=20`
    }

    console.log('tagline', q)

    if (loading || !hasMore) return
    setLoading(true)

    // const { res, err } = await getListingPages(
    //   `&sort=-createdAt&is_published=true&populate=_hobbies,_address,product_variant,seller&page=${
    //     page + 1
    //   }&limit=20`,
    // )

    try {
      const { res, err } = await getListingSearch(queryString)

      if (err || !res?.data?.data?.length) {
        setHasMore(false)
      } else {
        setData((prevData: any) => [...prevData, ...res.data.data])
        setPage((prevPage) => prevPage + 1)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }, [page, loading, hasMore])

  useEffect(() => {
    setData(initialData)
  }, [initialData])

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop + 50 >=
        document.documentElement.offsetHeight
      ) {
        fetchMoreData()
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [fetchMoreData])

  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
        />
        <meta property="og:image" content="/HobbyCue-FB-4Ps.png" />
        <meta property="og:image:secure_url" content="/HobbyCue-FB-4Ps.png" />

        <title>HobbyCue - Explore</title>
      </Head>
      <ExploreSearchContainer />
      <div className={styles.container}>
        <div className={styles.gridContainer}>
          {data?.map((el: any) => (
            <ListingCard
              column={4}
              key={el._id}
              data={el}
              style={{ minWidth: 271, maxWidth: 700 }}
            />
          ))}
        </div>
        {loading && (
          <div className={styles.gridContainer}>
            <PagesLoader />
            <PagesLoader />
            <PagesLoader />
            <PagesLoader />
          </div>
        )}
        {!hasMore && <p>No more listings available.</p>}
      </div>
    </>
  )
}

// export const getServerSideProps: GetServerSideProps = async (context) => {
//   let queryString = ''
//   const { query } = context
//   if (query.q === undefined) {
//     queryString += `&sort=-createdAt&is_published=true&populate=_hobbies,_address,product_variant,seller&page=1&limit=20`
//   } else {
//     queryString += `title=${encodeURIComponent(query.q.toString())}`
//     queryString += `&sort=-createdAt&is_published=true&populate=_hobbies,_address,product_variant,seller&page=1&limit=20`
//   }
//   console.log('taglineCOntext', query.q)
//   console.log('queryString', queryString)

//   let result
//   try {
//     result = await getListingSearch(queryString)
//   } catch (err) {
//     console.error('Error fetching listings:', err)
//     return { notFound: true }
//   }
//   console.log('result', result.res && result.res.data)
//   // const { res, err } = await getListingPages(
//   //   `&sort=-createdAt&is_published=true&populate=_hobbies,_address,product_variant,seller&page=1&limit=20`,
//   // )
//   // if (err) return { notFound: true }
//   const data = result.res && result.res.data ? result.res.data.data || [] : []
//   return {
//     props: {
//       data: data,
//       isBlog: false,
//     },
//   }
// }
export const getServerSideProps: GetServerSideProps = async (context) => {
  let queryString = ''
  const { query } = context

  if (!query.q) {
    queryString = `&sort=-createdAt&is_published=true&populate=_hobbies,_address,product_variant,seller&page=1&limit=20`
  } else {
    queryString =
      `title=${encodeURIComponent(query.q.toString())}` +
      `&sort=-createdAt&is_published=true&populate=_hobbies,_address,product_variant,seller&page=1&limit=20`
  }

  console.log('taglineContext', query.q)
  console.log('queryString', queryString)

  let result
  try {
    result = await getListingSearch(queryString)
  } catch (err) {
    console.error('Error fetching listings:', err)
    return { notFound: true }
  }

  const data = result.res && result.res.data ? result.res.data.data || [] : []
  return {
    props: {
      data: data,
      isBlog: false,
    },
  }
}

export default Explore
