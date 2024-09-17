import { withAuth } from '@/navigation/withAuth'
import React from 'react'
import styles from './explore.module.css'
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
  data: any
}

const Explore: React.FC<Props> = ({ data }) => {
  const router = useRouter()
  const { type } = router.query

  return (
    <>
      {/* <PageGridLayout column={2}>
        <aside className={`${styles['community-left-aside']} custom-scrollbar`}>
          <div className={styles.profileSwitcherWrapper}>
            <ProfileSwitcher />
          </div>
          <section
            className={`content-box-wrapper ${styles['hobbies-side-wrapper']}`}
          >
            <header className={styles['header']}>
              <div className={styles['heading']}>
                <h1>Explore</h1>
              </div>
            </header>
          </section>
        </aside>
        <div className={styles['explore-wrapper']}>
          <div className={styles.explore}>
            <p>
              The Explore functionality is under development. Use the Search box
              at the top to look up pages on your hobby by other users. If you
              don't find any pages, you may Add Listing Page from the menu at
              the top right corner.{' '}
            </p>
          </div>
        </div>
      </PageGridLayout> */}
      <div className={styles.gridContainer}>
        {data?.map((el: any) =>
          type === 'blogs' ? (
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
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const { type } = params!
  let data = {}

  const explorePeople = async () => {
    const { res, err } = await getListingPages(
      `type=1&sort=-createdAt&is_published=true&populate=_hobbies,_address`,
    )
    if (err) return { notFound: true }
    data = res?.data?.data?.listings
  }

  const explorePlaces = async () => {
    const { res, err } = await getListingPages(
      `type=2&sort=-createdAt&is_published=true&populate=_hobbies,_address`,
    )
    if (err) return { notFound: true }
    data = res?.data?.data?.listings
  }

  const exploreEvents = async () => {
    const { res, err } = await getAllEvents()
    if (err) return { notFound: true }
    data = res?.data?.data
  }

  const exploreProducts = async () => {
    const { res, err } = await getListingPages(
      `type=4&sort=-createdAt&is_published=true&populate=_hobbies,seller,product_variant,_address`,
    )
    if (err) return { notFound: true }
    data = res?.data?.data?.listings
  }

  const explorePosts = async () => {
    const { res, err } = await getAllPosts(
      `sort=-createdAt&populate=_author,_hobby`,
    )
    if (err) return { notFound: true }
    data = res?.data?.data?.posts
  }

  const exploreBlogs = async () => {
    const { res, err } = await getAllBlogs(
      `sort=-createdAt&populate=author,_hobbies&status=Published`,
    )
    if (err) return { notFound: true }
    data = res?.data.data?.blog
  }

  switch (type) {
    case 'people':
      await explorePeople()
      break
    case 'places':
      await explorePlaces()
      break
    case 'programs':
      await exploreEvents()
      break
    case 'products':
      await exploreProducts()
      break
    case 'posts':
      await explorePosts()
      break
    case 'blogs':
      await exploreBlogs()
      break
    default:
      return { notFound: true }
  }

  return {
    props: {
      data: data,
    },
  }
}

export default Explore
