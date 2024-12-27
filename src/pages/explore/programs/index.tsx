import React, { useState, useEffect, useCallback, useRef } from 'react'
import styles from '../explore.module.css'
import ListingCard from '@/components/ListingCard/ListingCard'
import { useRouter } from 'next/router'
import { getListingSearch } from '@/services/listing.service'
import { GetServerSideProps } from 'next'
import PagesLoader from '@/components/PagesLoader/PagesLoader'
import Head from 'next/head'
import ExploreSearchContainer from '../searchBar/ExploreSearchContainer'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { setSearching } from '@/redux/slices/explore'

type Props = {
  data?: any
  isBlog: boolean
}

const Programs: React.FC<Props> = ({ data: initialData }) => {
  const router = useRouter()
  const { query } = router
  const { keyword } = query
  const { hobby } = query
  const { category } = query
  const { location } = query
  const page_type = query['page-type']

  const [data, setData] = useState(initialData || [])
  const [page, setPage] = useState(1) // Tracks the current page
  const [loading, setLoading] = useState(false) // Indicates if more data is being loaded
  const [hasMore, setHasMore] = useState(true) // Tracks if there are more listings to load
  const [hasNoDataPerma, setHasNoDataPerma] = useState(false)
  const [ShowAutoAddress, setShowAutoAddress] = useState<boolean>(false)
  const [showHobbyDropdown, setShowHobbyDropdown] = useState<boolean>(false)
  const { isSearching } = useSelector((state: RootState) => state.explore)
  const [hoverCardIndex, setHoveredCardIndex] = useState<number>(-1)

  const dispatch = useDispatch()

  const locationDropdownRef = useRef<HTMLDivElement>(null)

  const fetchMoreData = useCallback(async () => {
    console.log('Fetching more data ')
    let queryString = `sort=-createdAt&is_published=true&populate=_hobbies,_address,product_variant,seller&page=${
      page + 1
    }&limit=20`
    if (page_type && page_type !== 'All') {
      let type = 1
      if (page_type === 'Place') {
        type = 2
      } else if (page_type === 'Program') {
        type = 3
      } else if (page_type === 'Product') {
        type = 4
      }
      queryString = `type=${encodeURIComponent(type.toString())}&` + queryString
    } else if (category) {
      queryString =
        `type=3&page_type=${encodeURIComponent(category.toString())}&` +
        queryString
    } else {
      queryString = `type=3&` + queryString
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
    // console.log('Query', queryString)

    if (loading || !hasMore) return
    // alert('Searching more...Page' + page)
    // console.log('Query', queryString)

    setLoading(true)
    try {
      const { res, err } = await getListingSearch(queryString)

      if (err || !res?.data?.data?.length) {
        setHasMore(false)
        setHasNoDataPerma(true)
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
  }, [page, loading, hasMore, keyword, category, hobby, location, page_type])

  useEffect(() => {
    setPage(1)
    setShowHobbyDropdown(false)
    setShowAutoAddress(false)
    setData(initialData)
  }, [keyword, category, hobby, location, page_type])

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 100
      ) {
        if (!hasNoDataPerma) {
          setHasMore(true)
        }
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

  useEffect(() => {
    dispatch(setSearching(false))
  }, [data])

  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
        />
        <meta property="og:image" content="/program_page.png" />
        <meta property="og:image:secure_url" content="/program_page.png" />
        <title>HobbyCue - Explore</title>
      </Head>
      <ExploreSearchContainer
        defaultCategory="Program"
        locationDropdownRef={locationDropdownRef}
        ShowAutoAddress={ShowAutoAddress}
        setShowAutoAddress={setShowAutoAddress}
        showHobbyDropdown={showHobbyDropdown}
        setShowHobbyDropdown={setShowHobbyDropdown}
      />
      <div className={styles.container}>
        {isSearching ? (
          <div className={styles.gridContainer}>
            <PagesLoader />
            <PagesLoader />
            <PagesLoader />
            <PagesLoader />
            <PagesLoader />
            <PagesLoader />
            <PagesLoader />
            <PagesLoader />
            <PagesLoader />
            <PagesLoader />
            <PagesLoader />
            <PagesLoader />
          </div>
        ) : (
          <div className={styles.gridContainer}>
            {data?.map((el: any) => (
              <ListingCard
                column={4}
                key={el._id}
                data={el}
                style={{ minWidth: 271, maxWidth: 700 }}
                hoverCardIndex={hoverCardIndex}
                setHoveredCardIndex={setHoveredCardIndex}
              />
            ))}
            <>{loading && <PagesLoader />}</>
            <>{loading && <PagesLoader />}</>
            <>{loading && <PagesLoader />}</>
            <>{loading && <PagesLoader />}</>
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
  if (query['page-type'] && query['page-type'] !== 'All') {
    let type = 1
    if (query['page-type'] === 'Place') {
      type = 2
    } else if (query['page-type'] === 'Program') {
      type = 3
    } else if (query['page-type'] === 'Product') {
      type = 4
    }
    queryString = `type=${encodeURIComponent(type.toString())}&` + queryString
  } else if (query.category) {
    queryString =
      `type=3&page_type=${encodeURIComponent(query.category.toString())}&` +
      queryString
  } else {
    queryString = `type=3&` + queryString
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

export default Programs
