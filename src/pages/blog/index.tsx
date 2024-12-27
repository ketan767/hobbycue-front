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
import {
  FormValues,
  initialFormValues,
  setFormValues,
} from '@/redux/slices/blog'
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

const blogFilterIconFilled = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="36"
    height="36"
    viewBox="0 0 36 36"
    fill="none"
  >
    <rect x="0.5" y="0.5" width="35" height="35" rx="7.5" stroke="#8064A2" />
    <path
      d="M13.4379 15.2643C12.9606 14.5683 12.4885 13.8788 12.016 13.1895C11.2909 12.1319 10.5634 11.0759 9.84145 10.0162C9.62539 9.69902 9.60881 9.3568 9.78614 9.01805C9.96418 8.67792 10.2573 8.5025 10.6416 8.50181C12.2577 8.49891 13.8738 8.50037 15.4899 8.50035C18.768 8.5003 22.0461 8.50024 25.3242 8.50043C25.8219 8.50046 26.1956 8.78498 26.3084 9.2595C26.3713 9.52449 26.3267 9.77899 26.1725 10.0043C25.2327 11.3775 24.29 12.7487 23.3484 14.1207C22.6207 15.181 21.8931 16.2414 21.1656 17.3018C20.7382 17.9248 20.3131 18.5494 19.8827 19.1702C19.7446 19.3695 19.6809 19.5842 19.6818 19.8255C19.688 21.5027 19.6946 23.1799 19.6937 24.8571C19.6934 25.4873 19.6779 26.1177 19.6594 26.7477C19.6545 26.914 19.6269 27.0831 19.5842 27.2442C19.5237 27.4721 19.3851 27.5391 19.1559 27.4793C18.8891 27.4096 18.6585 27.2665 18.4329 27.1161C17.8805 26.7478 17.3337 26.3709 16.7787 26.0065C16.4622 25.7986 16.3198 25.5141 16.3204 25.1398C16.3234 23.3861 16.3182 21.6324 16.3253 19.8788C16.3266 19.5679 16.2244 19.3109 16.0516 19.0614C15.1785 17.8004 14.3118 16.5348 13.4379 15.2643Z"
      fill="#8064A2"
    />
  </svg>
)

const crossIconSelectedFilter = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
  >
    <g clip-path="url(#clip0_24684_84222)">
      <path
        d="M10.6749 3.33076C10.4474 3.10326 10.0799 3.10326 9.85242 3.33076L6.99992 6.17742L4.14742 3.32492C3.91992 3.09742 3.55242 3.09742 3.32492 3.32492C3.09742 3.55242 3.09742 3.91992 3.32492 4.14742L6.17742 6.99992L3.32492 9.85242C3.09742 10.0799 3.09742 10.4474 3.32492 10.6749C3.55242 10.9024 3.91992 10.9024 4.14742 10.6749L6.99992 7.82242L9.85242 10.6749C10.0799 10.9024 10.4474 10.9024 10.6749 10.6749C10.9024 10.4474 10.9024 10.0799 10.6749 9.85242L7.82242 6.99992L10.6749 4.14742C10.8966 3.92576 10.8966 3.55242 10.6749 3.33076Z"
        fill="#8064A2"
      />
    </g>
    <defs>
      <clipPath id="clip0_24684_84222">
        <rect width="14" height="14" fill="white" />
      </clipPath>
    </defs>
  </svg>
)

const Explore: React.FC<Props> = ({ data }) => {
  const router = useRouter()
  const dispatch = useDispatch()
  const { type } = router.query

  const { formValues } = useSelector((state: RootState) => state.blog)
  const { activeModal } = useSelector((state: RootState) => state.modal)

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
                // className={
                //   activeModal === 'BlogFilterMobileModal'
                //     ? styles.filterIcon
                //     : ''
                // }
              >
                {JSON.stringify(formValues) ===
                JSON.stringify(initialFormValues)
                  ? blogFilterIcon
                  : blogFilterIconFilled}
              </div>
            </div>
            {formValues.hobby ? (
              <div
                className={styles.selectedFilter}
                onClick={() =>
                  dispatch(setFormValues({ ...formValues, hobby: '' }))
                }
              >
                {formValues.hobby}
                {crossIconSelectedFilter}
              </div>
            ) : (
              <></>
            )}
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
