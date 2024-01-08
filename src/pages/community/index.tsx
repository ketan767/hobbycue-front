import PostCard from '@/components/PostCard/PostCard'
import PostCardSkeletonLoading from '@/components/PostCardSkeletonLoading'
import CommunityPageLayout from '@/layouts/CommunityPageLayout'
import { withAuth } from '@/navigation/withAuth'
import { updateLoading, updatePosts } from '@/redux/slices/post'
import { RootState } from '@/redux/store'
import { getAllPosts } from '@/services/post.service'
import styles from '@/styles/Community.module.css'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

type Props = {}

const CommunityHome: React.FC<Props> = ({}) => {
  const { activeProfile } = useSelector((state: RootState) => state.user)
  const { allPosts, loading } = useSelector((state: RootState) => state.post)
  const router = useRouter()
  const dispatch = useDispatch()

  const [isBlurred, setIsBlurred] = useState(false)

  useEffect(() => {
    // Blur the screen after mounting
    setIsBlurred(true)

    // Remove the blur after 20 seconds
    const blurTimeout = setTimeout(() => {
      setIsBlurred(false)
    }, 20000)

    // Clean up the timeout to avoid memory leaks
    return () => clearTimeout(blurTimeout)
  }, [])

  const getPost = async () => {
    const params = new URLSearchParams(`populate=_author,_genre,_hobby`)
    activeProfile?.data?._hobbies.forEach((item: any) => {
      params.append('_hobby', item.hobby._id)
    })
    if (!activeProfile?.data?._hobbies) return
    if (activeProfile?.data?._hobbies.length === 0) return
    dispatch(updateLoading(true))
    const { err, res } = await getAllPosts(params.toString())
    if (err) return console.log(err)
    if (res.data.success) {
      console.log('resp', res.data)
      let posts = res.data.data.posts.map((post: any) => {
        let content = post.content.replace(/<img .*?>/g, '')
        return { ...post, content }
      })
      dispatch(updatePosts(posts))
    }
    dispatch(updateLoading(false))
  }

  useEffect(() => {
    if (allPosts.length === 0) getPost()
  }, [activeProfile])

  return (
    <>
      <CommunityPageLayout activeTab="posts">
        <section className={styles['posts-container']}>
          {loading ? (
            <>
              <PostCardSkeletonLoading />
              <PostCardSkeletonLoading />
              <PostCardSkeletonLoading />
            </>
          ) : allPosts.length > 0 ? (
            allPosts.map((post: any) => {
              return (
                <PostCard
                  key={post._id}
                  postData={post}
                  currentSection="posts"
                />
              )
            })
          ) : allPosts.length === 0 ? (
            <div className={styles['no-posts-div']}>
              <p className={styles['no-posts-text']}>
                There were no posts for the hobby and the location you have
                chosen.
                <br />
                Add other hobbies to your profile, or be the first one to start
                a conversation on yours
              </p>
              <div
                style={{
                  display: 'flex',
                  flex: 1,
                  justifyContent: 'center',
                }}
              ></div>
            </div>
          ) : (
            <></>
          )}
        </section>
      </CommunityPageLayout>
    </>
  )
}

export default withAuth(CommunityHome)
