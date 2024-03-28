import React, { useEffect, useState } from 'react'
import { withAuth } from '@/navigation/withAuth'
import styles from '@/styles/Community.module.css'
import { useSelector } from 'react-redux'
import store, { RootState } from '@/redux/store'
import { getAllPosts } from '@/services/post.service'
import {
  updatePages,
  updatePosts,
  updatePagesLoading,
} from '@/redux/slices/post'
import PostCard from '@/components/PostCard/PostCard'
import PostCardSkeletonLoading from '@/components/PostCardSkeletonLoading'
import CommunityPageLayout from '@/layouts/CommunityPageLayout'
import { getListingPages } from '@/services/listing.service'
import ListingCard from '@/components/ListingCard/ListingCard'

type Props = {}

const CommunityPages: React.FC<Props> = ({}) => {
  const { activeProfile } = useSelector((state: any) => state.user)
  const { allPages, pagesLoading } = useSelector(
    (state: RootState) => state.post,
  )

  const getPost = async () => {
    const params = new URLSearchParams(
      `populate=_hobbies,_address&is_published=true`,
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

  return (
    <>
      <CommunityPageLayout activeTab="pages">
        <section className={styles['pages-container']}>
          {pagesLoading ? (
            <>
              <PostCardSkeletonLoading />
              <PostCardSkeletonLoading />
              <PostCardSkeletonLoading />
            </>
          ) : allPages?.length === 0 ? (
            <p>No pages found</p>
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
