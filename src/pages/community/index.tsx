import welcomWishIcon from '@/assets/image/welcome-wishlist.png'
import tipsSliceIconLeft from '@/assets/svg/tips-slice-left.svg'
import tipsSliceIconRight from '@/assets/svg/tips-slice-right.svg'
import TipsCard from '@/components/Onboarding/TIps'
import Welcome from '@/components/Onboarding/Welcome'
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

  // onboarding tips
  const welcomeContent = {
    iconSrc: welcomWishIcon,
    title: 'Welcome to HobbyCue',
    description:
      'Choose from one of the options to continue. You can always find them on the top navigation.',
  }

  const myCommunity = {
    title: 'My Community',
    description: 'Communities specific to your Hobbies + Location.',
    sliceIcon: tipsSliceIconLeft,
    customStyle: { position: 'absolute', top: -155, left: 120 },
  }

  const searchTips = {
    title: 'Search',
    description: 'Search the site and you may find your next cue.',
    sliceIcon: tipsSliceIconLeft,
    customStyle: { position: 'absolute', top: -155, left: 450 },
  }

  const myProfileTips = {
    title: 'My Profile',
    description: 'View your Profile, Add Pics, Social and more.',
    sliceIcon: tipsSliceIconRight,
    customStyle: { position: 'absolute', top: -155, right: 50, zIndex: 50 },
  }

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
              >
                <Welcome {...(welcomeContent as any)} />
              </div>
              <TipsCard {...(myCommunity as any)} />
              <TipsCard {...(searchTips as any)} />
              <TipsCard {...(myProfileTips as any)} />
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
