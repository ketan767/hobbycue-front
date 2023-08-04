import React, { useEffect, useState } from 'react'
import { withAuth } from '@/navigation/withAuth'
import styles from '@/styles/Community.module.css'
import { useDispatch, useSelector } from 'react-redux'
import store, { RootState } from '@/redux/store'
import { getAllPosts } from '@/services/post.service'
import { updateLoading, updatePosts } from '@/redux/slices/post'
import PostCard from '@/components/PostCard/PostCard'
import PostCardSkeletonLoading from '@/components/PostCardSkeletonLoading'
import CommunityPageLayout from '@/layouts/CommunityPageLayout'

type Props = {}

const CommunityLinks: React.FC<Props> = ({}) => {
  const { activeProfile } = useSelector((state: RootState) => state.user)
  const { allPosts, loading } = useSelector((state: RootState) => state.post)
  const dispatch = useDispatch()
  const getPost = async () => {
    const params = new URLSearchParams(
      `has_link=true&populate=_author,_genre,_hobby`,
    )
    activeProfile?.data?._hobbies.forEach((item: any) => {
      params.append('_hobby', item.hobby._id)
    })
    if (!activeProfile?.data?._hobbies) return
    if (activeProfile?.data?._hobbies.length === 0) return
   
    dispatch(updateLoading(true))
    const { err, res } = await getAllPosts(params.toString())
    if (err) return console.log(err)
    if (res.data.success) {
      let linkPosts = res.data.data.posts.map((post: any) => {
        let content = post.content.replace(/<img .*?>/g, '')
        return { ...post, content }
      })
      linkPosts = linkPosts.filter((item: any) => (item.has_link === true))
      dispatch(updatePosts(linkPosts))
    }
    dispatch(updateLoading(false))
  }

  useEffect(() => {
    getPost()
  }, [activeProfile])

  let posts = [...allPosts]
  posts = posts.filter((item: any) => (item.has_link === true))
  return (
    <>
      <CommunityPageLayout activeTab="links">
        <section className={styles['pages-container']}>
          {loading ? (
            <>
              <PostCardSkeletonLoading />
            </>
          ) : posts.length > 0 ? (
            posts.map((post: any) => {
              return <PostCard key={post._id} postData={post} />
            })
          ) : posts.length === 0 ? (
            <>No posts found</>
          ) : (
            <></>
          )}
        </section>
      </CommunityPageLayout>
    </>
  )
}

export default withAuth(CommunityLinks)
