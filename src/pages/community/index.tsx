import React, { useEffect, useState } from 'react'
import { withAuth } from '@/navigation/withAuth'
import styles from '@/styles/Community.module.css'
import { useSelector } from 'react-redux'
import store, { RootState } from '@/redux/store'
import { getAllPosts } from '@/services/post.service'
import { updatePosts } from '@/redux/slices/post'
import PostCard from '@/components/PostCard/PostCard'
import PostCardSkeletonLoading from '@/components/PostCardSkeletonLoading'
import CommunityPageLayout from '@/layouts/CommunityPageLayout'
import ProfileSwitcher from '@/components/ProfileSwitcher/ProfileSwitcher'
import { checkIfUrlExists } from '@/utils'

type Props = {}

const CommunityHome: React.FC<Props> = ({}) => {
  const { activeProfile } = useSelector((state: RootState) => state.user)
  const { allPosts } = useSelector((state: RootState) => state.post)
  const [isLoadingPosts, setIsLoadingPosts] = useState(false)

  const getPost = async () => {
    const params = new URLSearchParams(`populate=_author,_genre,_hobby`)
    activeProfile?.data?._hobbies.forEach((item: any) => {
      params.append('_hobby', item.hobby._id)
    })

    setIsLoadingPosts(true)
    const { err, res } = await getAllPosts(params.toString())
    if (err) return console.log(err)
    if (res.data.success) {
      store.dispatch(updatePosts(res.data.data.posts))
    }
    setIsLoadingPosts(false)
  }

  useEffect(() => {
    getPost()
  }, [activeProfile])

  // console.log({allPosts});
  return (
    <>
      <CommunityPageLayout activeTab="posts">
        <section className={styles['posts-container']}>
          {allPosts.length === 0 || isLoadingPosts ? (
            <>
              <PostCardSkeletonLoading />
              {/* <PostCardSkeletonLoading />
                <PostCardSkeletonLoading /> */}
            </>
          ) : (
            allPosts.map((post: any) => {
              return <PostCard key={post._id} postData={post} />
            })
          )}
        </section>
      </CommunityPageLayout>
    </>
  )
}

export default withAuth(CommunityHome)
