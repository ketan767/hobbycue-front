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

type Props = {}

const CommunityPages: React.FC<Props> = ({}) => {
  const { activeProfile } = useSelector((state: any) => state.user)
  const { allPages, pagesLoading } = useSelector(
    (state: RootState) => state.post,
  )

  const getPost = async () => {
    const params = new URLSearchParams(`populate=_author,_genre,_hobby`)
    activeProfile?.data?._hobbies.forEach((item: any) => {
      params.append('_hobby', item.hobby._id)
    })
    if (!activeProfile?.data?._hobbies) return
    if (activeProfile?.data?._hobbies.length === 0) return
    const { err, res } = await getListingPages(`${params}`)
    if (err) return console.log(err)
    if (res?.data.success) {
      store.dispatch(updatePages(res.data.data.listings))
    }
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
            </>
          ) : allPages.length === 0 ? (
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
