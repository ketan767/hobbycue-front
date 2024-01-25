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
import { updateHobbyMenuExpandAll } from '@/redux/slices/site'

type Props = { data: { hobbyData: any } }

const HobbyPostsPage: React.FC<Props> = (props) => {
  const data = props.data.hobbyData

  const dispatch = useDispatch()
  const { hobby } = useSelector((state: RootState) => state?.site.expandMenu)
  const [expandAll, setExpandAll] = useState(hobby)
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

  const handleExpandAll: (value: boolean) => void = (value) => {
    setExpandAll(value)
    dispatch(updateHobbyMenuExpandAll(value))
  }

  return (
    <>
      {' '}
      <HobbyPageLayout
        activeTab="pages"
        data={data}
        expandAll={expandAll}
        setExpandAll={handleExpandAll}
      >
        <main className={`${styles['display-desktop']}`}>
          <section className={styles['pages-container']}>
            {!isLoggedIn || (loadingPosts && <PostCardSkeletonLoading />)}
            {pages.map((post: any) => {
              return <ListingCard key={post._id} data={post} />
            })}
          </section>
          {pages.length === 0 && (
            <div className={styles['dual-section-wrapper']}>
              <div className={styles['no-posts-container']}>
                <p>
                  No pages available
                </p>
              </div>
            </div>
          )}
        </main>
      </HobbyPageLayout>
      <main className={`${styles['display-mobile']}`}></main>
    </>
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
