import { withAuth } from '@/navigation/withAuth'
import React, { useState } from 'react'
import styles from './styles.module.css'
import PageGridLayout from '@/layouts/PageGridLayout'
import ProfileSwitcher from '@/components/ProfileSwitcher/ProfileSwitcher'
import { GetServerSideProps } from 'next'
import { getAllEvents, getListingPages } from '@/services/listing.service'
import { getAllPosts } from '@/services/post.service'
import { getAllBlogs } from '@/services/blog.services'
import ListingCard from '@/components/ListingCard/ListingCard'
import { useRouter } from 'next/router'
import BlogCard from '@/components/BlogCard/BlogCard'
import Head from 'next/head'
import BlogFilter from '@/components/Blog/Filter/BlogFilter'
type Hobby = {
  _id: string
  blog_id: string
  genre: any
  hobby: {
    _id: string
    slug: string
    display: string
  }
  createdAt: string
  updatedAt: string
}

type Blog = {
  _id: string
  _hobbies: Hobby[]
  keywords: string[]
  author: Author
  status: string
  createdAt: string
  title: string
  tagline: string
}

type Props = {
  data: any
  isBlog: boolean
}
export interface FormValues {
  hobby: string
  genre: string
  keywords: string
  author: string
  status: string
  startDate: string
  endDate: string
  title: string
  tagline: string
  search: string
}

type Author = {
  full_name: string | null
  display_name: string | null
}

type DataItem = {
  _hobbies: Hobby[]
  keywords: string[]
  author: Author | null
  status: string | null
  createdAt: string
  updatedAt: string
}

const Explore: React.FC<Props> = ({ data }) => {
  const router = useRouter()
  const { type } = router.query
  const [formValues, setFormValues] = useState<FormValues>({
    hobby: '',
    genre: '',
    keywords: '',
    author: '',
    status: '',
    startDate: 'Start Date',
    endDate: 'End Date',
    search: '',
    title: '',
    tagline: '',
  })

  const filterBlogs = (data: Blog[], filters: FormValues): Blog[] => {
    if (
      Object.values(filters).every(
        (value) => !value || value === 'Start Date' || value === 'End Date',
      )
    ) {
      return data
    }

    return data.filter((item) => {
      // Match for search
      const searchMatch = filters.search
        ? [
            item.title?.toLowerCase(),
            item.tagline?.toLowerCase(),
            ...item.keywords.map((k) => k.toLowerCase()),
          ].some((field) => field.includes(filters.search!.toLowerCase()))
        : true

      // If search exists, prioritize it and return results based on it
      if (filters.search) {
        return searchMatch
      }

      // Match for hobbies
      const hobbyMatch = filters.hobby
        ? item._hobbies.some((h) =>
            h.hobby?.display
              .toLowerCase()
              .includes(filters.hobby!.toLowerCase()),
          )
        : true

      // Match for genre
      const genreMatch = filters.genre
        ? item._hobbies.some((h) => {
            return (
              h.genre &&
              h.genre?.display
                ?.toLowerCase()
                .includes(filters.genre!.toLowerCase())
            )
          })
        : true

      // Match for keywords
      const keywordMatch = filters.keywords
        ? item.keywords.some((keyword) =>
            keyword.toLowerCase().includes(filters.keywords!.toLowerCase()),
          )
        : true

      // Match for author
      const authorMatch = filters.author
        ? item.author.full_name &&
          item.author.full_name
            .toLowerCase()
            .includes(filters.author!.toLowerCase())
        : true

      // Match for status
      const statusMatch = filters.status
        ? item.status.toLowerCase() === filters.status!.toLowerCase()
        : true

      // Match for date range
      const startDate =
        filters.startDate !== 'startDate' ? new Date(filters.startDate) : null
      const endDate =
        filters.endDate !== 'End Date' ? new Date(filters.endDate) : null
      const createdAt = new Date(item.createdAt)
      const dateMatch =
        startDate && endDate
          ? createdAt >= startDate && createdAt <= endDate
          : startDate
          ? createdAt >= startDate
          : endDate
          ? createdAt <= endDate
          : true

      // Combine all conditions with logical AND
      return (
        hobbyMatch &&
        genreMatch &&
        keywordMatch &&
        authorMatch &&
        statusMatch &&
        dateMatch
      )
    })
  }

  const filteredData = filterBlogs(data, formValues) || []

  console.warn('filtereddata', filteredData)

  return (
    <>
      <Head>
        <meta property="og:image" content="/HobbyCue-FB-4Ps.png" />
        <meta property="og:image:secure_url" content="/HobbyCue-FB-4Ps.png" />

        <title>HobbyCue - Blog</title>
      </Head>
      <div className={styles['main-container']}>
        <div className={styles['blog-container']}>
          <div className={`${styles.filterContainer} custom-scrollbar`}>
            <BlogFilter formValues={formValues} setFormValues={setFormValues} />
          </div>

          <div className={styles.container}>
            <div className={styles.gridContainer}>
              {filteredData.length > 0 ? (
                filteredData?.map((el: any) => (
                  <BlogCard key={el._id} data={el} />
                ))
              ) : (
                <>
                  <div className={styles['no-posts-div']}>
                    <p className={styles['no-post-text']}>No Blogs available</p>
                  </div>
                  <div className={styles['no-posts-div']}></div>
                  <div className={styles['no-posts-div']}></div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  let data = {}
  let isBlog = false

  const { res, err } = await getAllBlogs(
    `sort=-createdAt&populate=author,_hobbies&status=Published`,
  )
  if (err) return { notFound: true }
  data = res?.data.data?.blog
  isBlog = true

  return {
    props: {
      data: data,
      isBlog,
    },
  }
}

export default Explore
