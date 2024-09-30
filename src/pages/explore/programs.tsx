import React, { useState, useEffect, useCallback } from 'react'
import styles from './explore.module.css'
import ListingCard from '@/components/ListingCard/ListingCard'
import { useRouter } from 'next/router'
import { getAllEvents, getListingPages } from '@/services/listing.service'
import { GetServerSideProps } from 'next'
import PagesLoader from '@/components/PagesLoader/PagesLoader'

type Props = {
  data?: any
  isBlog: boolean
}

const Explore: React.FC<Props> = ({ data: initialData }) => {
  const router = useRouter()
  const { type } = router.query

  const [data, setData] = useState(initialData || [])
  const [page, setPage] = useState(2)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)

  const fetchMoreData = useCallback(async () => {
    if (loading || !hasMore) return
    setLoading(true)
    const { res, err } = await getAllEvents()

    if (err || !res?.data?.data?.length) {
      setHasMore(false)
    } else {
      setData((prevData: any) => [...prevData, ...res.data.data])
      setPage(page + 1)
    }
    setLoading(false)
  }, [page, loading, hasMore])

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 100
      ) {
        fetchMoreData()
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [fetchMoreData])

  return (
    <>
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

export const getServerSideProps: GetServerSideProps = async () => {
  const { res, err } = await getAllEvents()

  if (err) return { notFound: true }
  const data = res?.data?.data || []

  return {
    props: {
      data: data,
      isBlog: false,
    },
  }
}

export default Explore
