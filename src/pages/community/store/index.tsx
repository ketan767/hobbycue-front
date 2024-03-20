import React, { useEffect, useState } from 'react'
import { withAuth } from '@/navigation/withAuth'
import styles from '@/styles/Community.module.css'
import { useSelector } from 'react-redux'
import store, { RootState } from '@/redux/store'
import { getAllPosts } from '@/services/post.service'
import { updatePages, updatePosts } from '@/redux/slices/post'
import PostCard from '@/components/PostCard/PostCard'
import PostCardSkeletonLoading from '@/components/PostCardSkeletonLoading'
import CommunityPageLayout from '@/layouts/CommunityPageLayout'
import { getListingPages } from '@/services/listing.service'
import ListingCard from '@/components/ListingCard/ListingCard'
import { useMediaQuery } from '@mui/material'

type Props = {}

const CommunityBlogs: React.FC<Props> = ({}) => {
  const { activeProfile } = useSelector((state: any) => state.user)
  const { allPages, pagesLoading } = useSelector(
    (state: RootState) => state.post,
  )

  const isMobile = useMediaQuery('(max-width:1100px)');

  return (
    <>
      <CommunityPageLayout activeTab="store">
        {/* <section className={styles['pages-container']}> */}
        <main className={`${styles['dual-section-wrapper']}`}>
          <div className={styles['no-posts-container']}>
            <p>
              This feature is under development. Come back soon to view this
            </p>
          </div>
          {isMobile ? null : (
            <>
              <div className={styles['no-posts-container']}></div>
              <div className={styles['no-posts-container']}></div>
            </>
          )}
        </main>
        {/* </section> */}
      </CommunityPageLayout>
    </>
  )
}

export default withAuth(CommunityBlogs)
