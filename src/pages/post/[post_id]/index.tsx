import React, { useEffect, useState } from 'react'
import PageContentBox from '@/layouts/PageContentBox'
import PageGridLayout from '@/layouts/PageGridLayout'
import { withAuth } from '@/navigation/withAuth'
import styles from '@/styles/PostPage.module.css'
import Image from 'next/image'
import { useSelector } from 'react-redux'
import store, { RootState } from '@/redux/store'
import EditIcon from '@/assets/svg/edit-icon.svg'
import { openModal } from '@/redux/slices/modal'
import { getAllPosts } from '@/services/post.service'
import { GetServerSideProps } from 'next'
import { updatePosts } from '@/redux/slices/post'
import PostCard from '@/components/PostCard/PostCard'
import ProfileSwitcher from '@/components/ProfileSwitcher/ProfileSwitcher'
import PostCardSkeletonLoading from '@/components/PostCardSkeletonLoading'
import { checkIfUrlExists } from '@/utils'
import Link from 'next/link'
import { useRouter } from 'next/router'

type Props = {}

const CommunityLayout: React.FC<Props> = ({}) => {
  const router = useRouter()
  const postId = router.query.post_id

  const { activeProfile } = useSelector((state: RootState) => state.user)
  const { allPosts } = useSelector((state: RootState) => state.post)

  const [isLoadingPosts, setIsLoadingPosts] = useState(false)
  const [postData, setPostData] = useState<any>(null)

  const getPost = async () => {
    const params = new URLSearchParams(
      `populate=_author,_genre,_hobby&_id=${postId}`,
    )

    setIsLoadingPosts(true)
    const { err, res } = await getAllPosts(params.toString())
    if (err) return console.log(err)
    if (res.data.success) {
      setPostData(res.data.data.posts?.[0])
    }
    setIsLoadingPosts(false)
  }

  useEffect(() => {
    const data = allPosts.find((post: any) => post?._id?.toString() === postId)
    if (data) return setPostData(data)
    else getPost()
  }, [activeProfile])

  return (
    <>
      <PageGridLayout column={3}>
        <aside className={styles['community-left-aside']}>
          <ProfileSwitcher />
          <section
            className={`content-box-wrapper ${styles['hobbies-side-wrapper']}`}
          >
            <header>
              <h3>Hobbies</h3>
              {/* <Image src={EditIcon} alt="Edit" /> */}
            </header>
            <span className={styles['divider']}></span>
            <section>
              <ul>
                {activeProfile.data?._hobbies?.map((hobby: any) => {
                  return <li key={hobby._id}>{hobby?.hobby?.display}</li>
                })}
              </ul>
            </section>
          </section>

          <section
            className={`content-box-wrapper ${styles['location-side-wrapper']}`}
          >
            <header>
              <h3>Location</h3>
              {/* <Image src={EditIcon} alt="Edit" /> */}
            </header>
            <span className={styles['divider']}></span>
            <section>
              <ul>
                {activeProfile.data?._addresses?.map((address: any) => {
                  return <li key={address._id}>{address?.city}</li>
                })}
              </ul>
            </section>
          </section>
        </aside>

        <main>
          {!postData || isLoadingPosts ? (
            <PostCardSkeletonLoading />
          ) : (
            <PostCard postData={postData} />
          )}
        </main>

        <aside className={styles['community-right-aside']}>
          <section
            className={`content-box-wrapper ${styles['invite-wrapper']}`}
          >
            <header>
              <h3>Invite to Community</h3>
            </header>
            <span className={styles['divider']}></span>
            <section>
              <input type="text" name="" id="" />
            </section>
          </section>
        </aside>
      </PageGridLayout>
    </>
  )
}

export default CommunityLayout
