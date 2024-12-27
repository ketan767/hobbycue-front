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
import { useDispatch, useSelector } from 'react-redux'
import { openModal } from '@/redux/slices/modal'
import { RootState } from '@/redux/store'
import { FormValues } from '@/redux/slices/blog'
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

const blogFilterIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="36"
    height="36"
    viewBox="0 0 36 36"
    fill="none"
  >
    <rect x="0.5" y="0.5" width="35" height="35" rx="7.5" stroke="#8064A2" />
    <path
      d="M16.491 8.50304C19.3013 8.50198 22.0979 8.50076 24.8945 8.5C25.6174 8.4998 26.1861 8.96132 26.3187 9.66832C26.3853 10.0239 26.3058 10.3594 26.1026 10.6569C25.327 11.7923 24.5465 12.9243 23.7679 14.0576C22.863 15.3749 21.9583 16.6922 21.0534 18.0093C20.7646 18.4297 20.4771 18.8509 20.1848 19.2689C20.0923 19.4011 20.049 19.5402 20.0492 19.7023C20.0514 21.843 20.0521 23.9837 20.0495 26.1244C20.0486 26.9012 19.4134 27.5159 18.6354 27.4997C18.3548 27.4938 18.0984 27.4066 17.8691 27.2449C17.4152 26.9248 16.9585 26.6082 16.5108 26.2795C16.134 26.0029 15.9447 25.6202 15.9441 25.1525C15.9419 23.3352 15.9425 21.5179 15.9447 19.7006C15.9449 19.5339 15.8974 19.3914 15.8033 19.2546C14.1416 16.8382 12.4822 14.4204 10.8219 12.0031C10.5357 11.5865 10.2498 11.1697 9.95995 10.7557C9.78902 10.5116 9.6635 10.2473 9.65934 9.94827C9.64857 9.17577 10.196 8.50564 11.0937 8.50297C12.8883 8.49764 14.6828 8.50243 16.491 8.50304ZM13.0649 13.6109C13.2106 13.8255 13.3553 14.0409 13.5024 14.2546C14.4445 15.6233 15.3865 16.9922 16.33 18.3599C16.9076 19.1973 16.8847 19.1665 16.8829 20.0997C16.8796 21.7572 16.8837 23.4147 16.8821 25.0723C16.8819 25.2617 16.9292 25.4202 17.0912 25.5347C17.5187 25.8369 17.9427 26.1441 18.3717 26.444C18.4793 26.5192 18.5973 26.5825 18.741 26.5455C18.9847 26.4827 19.1079 26.3226 19.108 26.0579C19.1087 23.9176 19.1099 21.7774 19.1086 19.6372C19.1084 19.3261 19.1956 19.0444 19.3695 18.7902C20.048 17.7983 20.7287 16.8078 21.4091 15.8171C22.6977 13.9407 23.9862 12.0642 25.2762 10.1888C25.3884 10.0256 25.431 9.86058 25.329 9.67886C25.233 9.50786 25.0773 9.45707 24.8913 9.45709C20.3149 9.45768 15.7384 9.45714 11.162 9.45695C11.1074 9.45695 11.0525 9.456 10.9982 9.46056C10.8001 9.47721 10.6551 9.61585 10.6177 9.81168C10.5846 9.98541 10.6638 10.1182 10.7562 10.2524C11.5231 11.3658 12.288 12.4805 13.0649 13.6109Z"
      fill="#8064A2"
    />
  </svg>
)

const Explore: React.FC<Props> = ({ data }) => {
  const router = useRouter()
  const dispatch = useDispatch()
  const { type } = router.query

  const { formValues } = useSelector((state: RootState) => state.blog)

  const filterBlogs = (data: Blog[], filters: FormValues): Blog[] => {
    if (
      Object.values(filters).every(
        (value) => !value || value === 'Start Date' || value === 'End Date',
      )
    ) {
      return data
    }

    return data.filter((item) => {
      const searchMatch = filters.search
        ? [
            item.title?.toLowerCase(),
            item.tagline?.toLowerCase(),
            ...item.keywords.map((k) => k.toLowerCase()),
          ].some((field) => field.includes(filters.search!.toLowerCase()))
        : true

      if (filters.search) {
        return searchMatch
      }

      const hobbyMatch = filters.hobby
        ? item._hobbies.some((h) => {
            const match = h.hobby?.display
              ?.toLowerCase()
              .includes(filters.hobby!.toLowerCase())
            console.log('Hobby Match Debug:', {
              match,
              hobbyDisplay: h.hobby?.display,
              filterHobby: filters.hobby,
            })
            return match
          })
        : true

      const genreMatch = filters.genre
        ? item._hobbies.some((h) => {
            const match = h.genre?.display
              ?.toLowerCase()
              ?.includes(filters.genre!.toLowerCase())
            console.log('Genre Match Debug:', {
              match,
              genreDisplay: h.genre?.display,
              filterGenre: filters.genre,
            })
            return match
          })
        : true

      const keywordMatch = filters.keywords
        ? item.keywords.some((keyword) =>
            keyword.toLowerCase().includes(filters.keywords!.toLowerCase()),
          )
        : true

      const authorMatch = filters.author
        ? item.author.full_name
            ?.toLowerCase()
            .includes(filters.author!.toLowerCase())
        : true

      const statusMatch = filters.status
        ? item.status.toLowerCase() === filters.status!.toLowerCase()
        : true

      const startDate =
        filters.startDate !== 'Start Date' ? new Date(filters.startDate) : null
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
          {/**
           * Blog Filter for Desktop
           */}
          <div className={`${styles.filterContainer} custom-scrollbar`}>
            <BlogFilter />
          </div>

          {/**
           * Blog Filter for Mobile
           */}
          <div className={styles.mobileFilterContainer}>
            <div className={styles.mobileFilter}>
              <div>Blogs</div>
              <div
                onClick={() =>
                  dispatch(
                    openModal({
                      type: 'BlogFilterMobileModal',
                      closable: true,
                    }),
                  )
                }
              >
                {blogFilterIcon}
              </div>
            </div>
          </div>

          {/**
           * Blogs List
           */}
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
