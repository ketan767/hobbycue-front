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
  const { activeProfile } = useSelector((state: RootState) => state.user)
  const { allPages } = useSelector((state: RootState) => state.post)
  const [isLoadingPosts, setIsLoadingPosts] = useState(false)

  const getPost = async () => {
    const params = new URLSearchParams(`populate=_author,_genre,_hobby`)
    activeProfile?.data?._hobbies.forEach((item: any) => {
      params.append('_hobby', item.hobby._id)
    })

    setIsLoadingPosts(true)
    const { err, res } = await getListingPages('')
    if (err) return console.log(err)
    console.log('resp', res?.data.data.listings);
    if (res?.data.success) {
      store.dispatch(updatePages(res.data.data.listings))
      // let linkPosts = res.data.data.posts.map((post: any) => {
      //   let content = post.content.replace(/<img .*?>/g, '')
      //   return { ...post, content }
      // })
      // linkPosts = linkPosts.filter(
      //   (item: any) => (item.has_link = true),
      // )
      // store.dispatch(updatePosts(linkPosts))
    }
    setIsLoadingPosts(false)
  }

  useEffect(() => {
    getPost()
  }, [activeProfile])

  // console.log({ allPages })
  return (
    <>
      <CommunityPageLayout activeTab="pages">
      <section className={styles['posts-container']}>
          {allPages.length === 0 || isLoadingPosts ? (
            <>
              <PostCardSkeletonLoading />
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
