import { withAuth } from '@/navigation/withAuth'
import React from 'react'
import styles from './[type]/explore.module.css'
import PageGridLayout from '@/layouts/PageGridLayout'
import ProfileSwitcher from '@/components/ProfileSwitcher/ProfileSwitcher'
import { GetServerSideProps } from 'next'
import { getAllEvents, getListingPages } from '@/services/listing.service'
import { getAllPosts } from '@/services/post.service'
import { getAllBlogs } from '@/services/blog.services'
import ListingCard from '@/components/ListingCard/ListingCard'
import { useRouter } from 'next/router'
import BlogCard from '@/components/BlogCard/BlogCard'

type Props = {
  data?: any
  isBlog: boolean
}

const Explore: React.FC<Props> = ({ data }) => {
  const router = useRouter()
  const { type } = router.query

  return (
    <>
      <div className={styles.gridContainer}>
        {data?.map((el: any) => (
          <ListingCard
            key={el._id}
            data={el}
            style={{ minWidth: 271, maxWidth: 700 }}
          />
        ))}
      </div>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  let data = {}
  let isBlog = false

  const { res, err } = await getListingPages(
    `&sort=-createdAt&is_published=true&populate=_hobbies,_address`,
  )
  if (err) return { notFound: true }
  data = res?.data?.data?.listings

  if (err) return { notFound: true }
  data = res?.data?.data?.listings

  return {
    props: {
      data: data,
      isBlog,
    },
  }
}

export default Explore
