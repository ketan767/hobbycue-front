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

type Props = {}

const CommunityLinks: React.FC<Props> = ({}) => {
  const { activeProfile } = useSelector((state: RootState) => state.user)
  const { allPosts } = useSelector((state: RootState) => state.post)
  const [isLoadingPosts, setIsLoadingPosts] = useState(false)

  const getPost = async () => {
    const params = new URLSearchParams(`has_link=true&populate=_author,_genre,_hobby`)
    activeProfile?.data?._hobbies.forEach((item: any) => {
      params.append('_hobby', item.hobby._id)
    })

    setIsLoadingPosts(true)
    const { err, res } = await getAllPosts(params.toString())
    if (err) return console.log(err)
    if (res.data.success) {
      let linkPosts = res.data.data.posts.map((post: any) => {
        let content = post.content.replace(/<img .*?>/g, '')
        return { ...post, content }
      })
      // console.log('postss', linkPosts)
      linkPosts = linkPosts.filter((item: any) => (item.has_link = true))
      store.dispatch(updatePosts(linkPosts))
    }
    setIsLoadingPosts(false)
  }

  useEffect(() => {
    getPost()
  }, [activeProfile])

  // console.log({ allPosts })
  return (
    <>
      <CommunityPageLayout activeTab="links">
        <section className={styles['pages-container']}>
          {allPosts.length === 0 || isLoadingPosts ? (
            <>
              <PostCardSkeletonLoading />
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

export default withAuth(CommunityLinks)
