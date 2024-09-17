import React, { useEffect, useState } from 'react'
import { withAuth } from '@/navigation/withAuth'
import styles from '@/styles/Community.module.css'
import { useSelector } from 'react-redux'
import store, { RootState } from '@/redux/store'
import { getAllPosts } from '@/services/post.service'
import {
  updatePages,
  updatePagesLoading,
  updatePosts,
} from '@/redux/slices/post'
import PostCard from '@/components/PostCard/PostCard'
import PostCardSkeletonLoading from '@/components/PostCardSkeletonLoading'
import CommunityPageLayout from '@/layouts/CommunityPageLayout'
import { getListingPages } from '@/services/listing.service'
import ListingCard from '@/components/ListingCard/ListingCard'
import { useMediaQuery } from '@mui/material'
import PagesLoader from '@/components/PagesLoader/PagesLoader'

type Props = {}

const CommunityBlogs: React.FC<Props> = ({}) => {
  const { activeProfile } = useSelector((state: any) => state.user)
  const { allPages, pagesLoading } = useSelector(
    (state: RootState) => state.post,
  )

  const getPost = async () => {
    const params = new URLSearchParams(
      `populate=_hobbies,_address&is_published=true&type=4`,
    )

    if (
      !activeProfile?.data?._hobbies ||
      activeProfile?.data?._hobbies.length === 0
    )
      return

    const { err, res } = await getListingPages(`${params}`)
    if (err) return console.log(err)
    if (res?.data.success) {
      const hobbyDisplayNames = activeProfile.data._hobbies.map(
        (hobby: any) => hobby.hobby.display,
      )

      const filteredListings = filterListingsByHobbyDisplayNames(
        res.data.data.listings,
        hobbyDisplayNames,
      )
      store.dispatch(updatePages(filteredListings))
    }
    store.dispatch(updatePagesLoading(false))
  }

  function filterListingsByHobbyDisplayNames(
    listings: any,
    hobbyDisplayNames: any,
  ) {
    return listings.filter((listing: any) =>
      listing._hobbies.some((hobby: any) =>
        hobbyDisplayNames.includes(hobby.hobby.display),
      ),
    )
  }

  useEffect(() => {
    getPost()
  }, [activeProfile])

  const isMobile = useMediaQuery('(max-width:1100px)')

  return (
    <>
      <CommunityPageLayout activeTab="store">
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

export default withAuth(CommunityBlogs)
