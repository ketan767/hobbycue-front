import React, { useState, useEffect, useCallback } from 'react'
import styles from './explore.module.css'
import ListingCard from '@/components/ListingCard/ListingCard'
import BlogCard from '@/components/BlogCard/BlogCard'
import { useRouter } from 'next/router'
import { getAllEvents, getListingPages } from '@/services/listing.service'
import { getAllPosts } from '@/services/post.service'
import { GetServerSideProps } from 'next'

type Props = {
  initialData: any
  initialType: string
}

const Explore: React.FC<Props> = ({ initialData, initialType }) => {
  const router = useRouter()
  const { type } = router.query

  const [data, setData] = useState(initialData || [])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)

  const fetchData = useCallback(
    async (pageNum = 1) => {
      let res, err
      setLoading(true)

      switch (type) {
        case 'people':
          ;({ res, err } = await getListingPages(
            `type=1&sort=-createdAt&is_published=true&populate=_hobbies,_address&page=${pageNum}&limit=20`,
          ))
          break
        case 'places':
          ;({ res, err } = await getListingPages(
            `type=2&sort=-createdAt&is_published=true&populate=_hobbies,_address&page=${pageNum}&limit=20`,
          ))
          break
        case 'programs':
          ;({ res, err } = await getAllEvents())
          break
        case 'products':
          ;({ res, err } = await getListingPages(
            `type=4&sort=-createdAt&is_published=true&populate=_hobbies,seller,product_variant,_address&page=${pageNum}&limit=20`,
          ))
          break
        case 'posts':
          ;({ res, err } = await getAllPosts(
            `sort=-createdAt&populate=_author,_hobby&page=${pageNum}&limit=20`,
          ))
          break
        default:
          return
      }

      if (err || !res?.data?.data?.listings?.length) {
        setHasMore(false)
      } else {
        const newData =
          type === 'posts'
            ? res.data.data.posts
            : res.data.data.listings || res.data.data
        setData(pageNum === 1 ? newData : [...data, ...newData])
      }
      setLoading(false)
    },
    [type],
  )

  useEffect(() => {
    fetchData(1)
    setPage(1)
    setHasMore(true)
  }, [type, fetchData])

  const fetchMoreData = () => {
    if (!loading && hasMore) {
      fetchData(page + 1)
      setPage((prevPage) => prevPage + 1)
    }
  }

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
          {data?.map((el: any) =>
            type === 'posts' ? (
              <BlogCard key={el._id} data={el} />
            ) : (
              <ListingCard
                key={el._id}
                data={el}
                style={{ minWidth: 271, maxWidth: 400 }}
              />
            ),
          )}
        </div>
        {loading && <p>Loading more...</p>}
        {!hasMore && <p>No more items available.</p>}
      </div>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { query } = context
  const { type } = query
  let data = {}

  const fetchInitialData = async () => {
    switch (type) {
      case 'people':
        const { res: peopleRes, err: peopleErr } = await getListingPages(
          `type=1&sort=-createdAt&is_published=true&populate=_hobbies,_address&page=1&limit=20`,
        )
        if (peopleErr) return { notFound: true }
        return peopleRes?.data?.data?.listings
      case 'places':
        const { res: placesRes, err: placesErr } = await getListingPages(
          `type=2&sort=-createdAt&is_published=true&populate=_hobbies,_address&page=1&limit=20`,
        )
        if (placesErr) return { notFound: true }
        return placesRes?.data?.data?.listings
      case 'programs':
        const { res: programsRes, err: programsErr } = await getAllEvents()
        if (programsErr) return { notFound: true }
        return programsRes?.data?.data
      case 'products':
        const { res: productsRes, err: productsErr } = await getListingPages(
          `type=4&sort=-createdAt&is_published=true&populate=_hobbies,seller,product_variant,_address&page=1&limit=20`,
        )
        if (productsErr) return { notFound: true }
        return productsRes?.data?.data?.listings
      case 'posts':
        const { res: postsRes, err: postsErr } = await getAllPosts(
          `sort=-createdAt&populate=_author,_hobby&page=1&limit=20`,
        )
        if (postsErr) return { notFound: true }
        return postsRes?.data?.data?.posts
      default:
        return { notFound: true }
    }
  }

  data = await fetchInitialData()

  return {
    props: {
      initialData: data,
      initialType: type,
    },
  }
}

export default Explore
