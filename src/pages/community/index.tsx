import PostCard from '@/components/PostCard/PostCard'
import PostCardSkeletonLoading from '@/components/PostCardSkeletonLoading'
import CommunityPageLayout from '@/layouts/CommunityPageLayout'
import { withAuth } from '@/navigation/withAuth'
import { openModal } from '@/redux/slices/modal'
import { updateLoading, updatePosts } from '@/redux/slices/post'
import { RootState } from '@/redux/store'
import { getMyProfileDetail } from '@/services/user.service'
import styles from '@/styles/Community.module.css'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

type Props = {}

const CommunityHome: React.FC<Props> = ({}) => {
  const { activeProfile, user } = useSelector((state: RootState) => state.user)
  const { allPosts, loading } = useSelector((state: RootState) => state.post)
  const router = useRouter()
  const dispatch = useDispatch()

  const ShowWelcomeModal = async () => {
    const { err: error, res: response } = await getMyProfileDetail()
    if (
      response?.data?.data?.user?.show_welcome &&
      response?.data?.data.user.is_onboarded
    ) {
      dispatch(openModal({ type: 'user-onboarding-welcome', closable: false }))
    }
  }
  useEffect(() => {
    const modalShown = localStorage.getItem('modal-shown-after-login')
    if (modalShown !== 'true') {
      ShowWelcomeModal()
    }
  }, [user.profile_url])

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
