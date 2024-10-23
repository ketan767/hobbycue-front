import React, { useState, useEffect, useCallback, useRef } from 'react'
import styles from './explore.module.css'
import ListingCard from '@/components/ListingCard/ListingCard'
import { useRouter } from 'next/router'
import { getListingSearch } from '@/services/listing.service'
import { GetServerSideProps } from 'next'
import PagesLoader from '@/components/PagesLoader/PagesLoader'
import Head from 'next/head'
import ExploreSearchContainer from './searchBar/ExploreSearchContainer'

type Props = {
  data?: any
  isBlog: boolean
}

const Explore: React.FC<Props> = ({ data: initialData }) => {
  const router = useRouter()
  const { query } = router
  const { keyword } = query
  const { hobby } = query
  const { category } = query
  const { location } = query
  const { sub_category } = query

  const [data, setData] = useState(initialData || [])
  const [page, setPage] = useState(1) // Tracks the current page
  const [loading, setLoading] = useState(false) // Indicates if more data is being loaded
  const [hasMore, setHasMore] = useState(true) // Tracks if there are more listings to load
  const [ShowAutoAddress, setShowAutoAddress] = useState<boolean>(false)
  const locationDropdownRef = useRef<HTMLDivElement>(null)

  const fetchMoreData = useCallback(async () => {
    console.log('Fetching more data ')
    let queryString = `sort=-createdAt&is_published=true&populate=_hobbies,_address,product_variant,seller&page=${
      page + 1
    }&limit=20`

    if (category && category !== 'All') {
      let type = 1
      if (category === 'Place') {
        type = 2
      } else if (category === 'Program') {
        type = 3
      } else if (category === 'Product') {
        type = 4
      }
      queryString = `type=${encodeURIComponent(type.toString())}&` + queryString
    } else if (sub_category) {
      queryString =
        `page_type=${encodeURIComponent(sub_category.toString())}&` +
        queryString
    }

    if (keyword) {
      queryString =
        `title=${encodeURIComponent(keyword.toString())}&` + queryString
    }
    if (hobby) {
      queryString =
        `hobby=${encodeURIComponent(hobby.toString())}&` + queryString
    }
    if (location) {
      queryString =
        `city=${encodeURIComponent(location.toString())}&` + queryString
    }

    // alert('Loading:' + loading + '...' + 'HasMore' + hasMore)
    if (loading || !hasMore) return
    // alert('Fetching more data')

    setLoading(true)
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
      setHasMore(false)
    } finally {
      setLoading(false)
    }
  }, [page, loading, hasMore, keyword, category, hobby, location, sub_category])

  useEffect(() => {
    setData(initialData)
  }, [keyword, category, hobby, location, sub_category])

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop + 50 >=
        document.documentElement.offsetHeight
      ) {
        setHasMore(true)
        fetchMoreData()
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [fetchMoreData])

  const handleClickOutside = (event: MouseEvent) => {
    if (
      locationDropdownRef.current &&
      !locationDropdownRef.current.contains(event.target as Node)
    ) {
      setShowAutoAddress(false)
    }
  }

  useEffect(() => {
    if (ShowAutoAddress) {
      window.addEventListener('mousedown', handleClickOutside)
    } else {
      window.removeEventListener('mousedown', handleClickOutside)
    }
    return () => window.removeEventListener('mousedown', handleClickOutside)
  }, [ShowAutoAddress])

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
      <ExploreSearchContainer
        locationDropdownRef={locationDropdownRef}
        ShowAutoAddress={ShowAutoAddress}
        setShowAutoAddress={setShowAutoAddress}
      />
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

export const getServerSideProps: GetServerSideProps = async (context) => {
  let queryString = `sort=-createdAt&is_published=true&populate=_hobbies,_address,product_variant,seller&page=1&limit=20`
  const { query } = context
  if (query.category && query.category !== 'All') {
    let type = 1
    if (query.category === 'Place') {
      type = 2
    } else if (query.category === 'Program') {
      type = 3
    } else if (query.category === 'Product') {
      type = 4
    }
    queryString = `type=${encodeURIComponent(type.toString())}&` + queryString
  } else if (query.sub_category) {
    queryString =
      `page_type=${encodeURIComponent(query.sub_category.toString())}&` +
      queryString
  }
  if (query.keyword) {
    queryString =
      `title=${encodeURIComponent(query.keyword.toString())}&` + queryString
  }
  if (query.hobby) {
    queryString =
      `hobby=${encodeURIComponent(query.hobby.toString())}&` + queryString
  }
  if (query.location) {
    queryString =
      `city=${encodeURIComponent(query.location.toString())}&` + queryString
  }

  console.log('titleContext', query.keyword)
  console.log('query.category', query.category)
  console.log('query.sub_category', query.sub_category)
  console.log('query.hobby', query.hobby)
  console.log('query.location', query.location)

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
