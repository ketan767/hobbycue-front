import React, { useEffect, useState } from 'react'
import { GetServerSideProps } from 'next'

import styles from '@/styles/HobbyDetail.module.css'

import { getAllHobbies, getHobbyPages } from '@/services/hobby.service'

import { useRouter } from 'next/router'
import Link from 'next/link'
import PageContentBox from '@/layouts/PageContentBox'
import PageGridLayout from '@/layouts/PageGridLayout'
import HobbyPageLayout from '@/layouts/HobbyPageLayout'
import ProfileSwitcher from '@/components/ProfileSwitcher/ProfileSwitcher'
import { getAllPosts } from '@/services/post.service'
import { RootState } from '@/redux/store'
import { useDispatch, useSelector } from 'react-redux'
import PostCardSkeletonLoading from '@/components/PostCardSkeletonLoading'
import PostCard from '@/components/PostCard/PostCard'
import { openModal } from '@/redux/slices/modal'
import ListingCard from '@/components/ListingCard/ListingCard'

type Props = { data: { hobbyData: any } }

const HobbyPostsPage: React.FC<Props> = (props) => {
  const data = props.data.hobbyData

  const dispatch = useDispatch()

  const { isLoggedIn, isAuthenticated } = useSelector(
    (state: RootState) => state.user,
  )

  const [loadingPosts, setLoadingPosts] = useState(false)
  const [pages, setPages] = useState([])

  const getPost = async () => {
    setLoadingPosts(true)
    const { err, res } = await getHobbyPages(`${data._id}`)
    setLoadingPosts(false)
    if (err) return console.log(err)
    if (res.data.success) {
      console.log('pages', res.data.data.listings)
      setPages(res.data.data.listings)
    }
  }

  useEffect(() => {
    getPost()
  }, [])

  return (
    <HobbyPageLayout activeTab="pages" data={data}>
      <main>
        {/* <section className={styles['pages-container']}>
          {!isLoggedIn || loadingPosts ? (
            <PostCardSkeletonLoading />
          ) : (
            pages.length === 0 && <p className={styles.noMembers}>No pages</p>
          )}
          {pages.map((post: any) => {
            return <ListingCard key={post._id} data={post} />
          })}
        </section> */}
      </main>
    </HobbyPageLayout>
  )
}

export const getServerSideProps: GetServerSideProps<Props> = async (
  context,
) => {
  const { query } = context

  const { err, res } = await getAllHobbies(
    `slug=${query.slug}&populate=category,sub_category,tags,related_hobbies`,
  )

  if (err) return { notFound: true }

  if (res?.data.success && res.data.no_of_hobbies === 0)
    return { notFound: true }

  const data = {
    hobbyData: res.data?.hobbies?.[0],
  }
  return {
    props: {
      data,
    },
  }
}

export default HobbyPostsPage
