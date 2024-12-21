import React, { useEffect, useState } from 'react'
import { withAuth } from '@/navigation/withAuth'
import styles from '@/styles/Community.module.css'
import { useSelector } from 'react-redux'
import store, { RootState } from '@/redux/store'
import {
  updatePages,
  updatePagesLoading,
} from '@/redux/slices/post'
import PostCard from '@/components/PostCard/PostCard'
import PostCardSkeletonLoading from '@/components/PostCardSkeletonLoading'
import CommunityPageLayout from '@/layouts/CommunityPageLayout'
import { getListingPages } from '@/services/listing.service'
import ListingCard from '@/components/ListingCard/ListingCard'
import PagesLoader from '@/components/PagesLoader/PagesLoader'

type Props = {}

const CommunityPages: React.FC<Props> = ({}) => {
  const { activeProfile } = useSelector((state: any) => state.user)
  const { allPages, pagesLoading } = useSelector(
    (state: RootState) => state.post,
  )

  const getPost = async () => {
    const params = new URLSearchParams(
      `populate=_hobbies,_address&is_published=true&type=1&type=2&type=3`,
    )

    if (
      !activeProfile?.data?._hobbies ||
      activeProfile?.data?._hobbies.length === 0
    )
      return

    const { err, res } = await getListingPages(`${params}`)
    if (err) return console.log(err)
    if (res?.data.success) {
      store.dispatch(updatePages(res.data.data.listings))
    }
    store.dispatch(updatePagesLoading(false))
  }

  useEffect(() => {
    getPost()
  }, [activeProfile])

  return (
    <>
      <CommunityPageLayout activeTab="pages">
        <section className={styles['pages-container']}>
          {pagesLoading ? (
            <>
              <PagesLoader />
              <PagesLoader />
              <PagesLoader />
              <PagesLoader />
            </>
          ) : allPages?.length === 0 ? (
            <>
              <div className={styles['no-posts-div']}>
                <p className={styles['no-posts-text']}>No pages available</p>
                <div
                  style={{
                    display: 'flex',
                    flex: 1,
                    justifyContent: 'center',
                  }}
                ></div>
              </div>
              <div className={styles['no-posts-div']}>
                <p className={styles['no-posts-text']}>No pages available</p>
                <div
                  style={{
                    display: 'flex',
                    flex: 1,
                    justifyContent: 'center',
                  }}
                ></div>
              </div>
            </>
          ) : (
            allPages.map((post: any) => {
              return <ListingCard key={post._id} data={post} />
            })
          )}
        </section>
      </CommunityPageLayout>
    </>
  )
}

export default withAuth(CommunityPages)
