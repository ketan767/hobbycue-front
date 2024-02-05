import React, { useEffect, useState } from 'react'
import { GetServerSideProps } from 'next'

import styles from '@/styles/HobbyDetail.module.css'

import { getAllHobbies } from '@/services/hobby.service'

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
import { updateHobbyMenuExpandAll } from '@/redux/slices/site'

type Props = { data: { hobbyData: any } }

const HobbyStorePage: React.FC<Props> = (props) => {
  const data = props.data.hobbyData

  const { hobby } = useSelector((state: RootState) => state?.site.expandMenu)
  const [expandAll, setExpandAll] = useState(hobby)
  const dispatch = useDispatch()
  const { isLoggedIn, isAuthenticated } = useSelector(
    (state: RootState) => state.user,
  )

  const handleExpandAll: (value: boolean) => void = (value) => {
    setExpandAll(value)
    dispatch(updateHobbyMenuExpandAll(value))
  }

  return (
    <>
      <HobbyPageLayout
        activeTab="store"
        data={data}
        expandAll={expandAll}
        setExpandAll={handleExpandAll}
      >
        <main className={`${styles['display-desktop']}`}>
          <div className={styles['no-posts-container']}>
            <p>
              This feature is under development. Come back soon to view this
            </p>
          </div>{' '}
        </main>
      </HobbyPageLayout>
      <main className={`${styles['display-mobile']}`}>
        <div className={styles['no-posts-container']}>
          <p>No posts available</p>
        </div>{' '}
      </main>
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

export default HobbyStorePage
