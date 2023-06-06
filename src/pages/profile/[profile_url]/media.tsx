import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import styles from './styles.module.css'
import { GetServerSideProps } from 'next'
import { getAllUserDetail } from '@/services/user.service'
import Head from 'next/head'
import ProfileLayout from '@/layouts/ProfilePageLayout'
import PageGridLayout from '@/layouts/PageGridLayout'
import { getListingPages } from '@/services/listing.service'
import { getAllPosts } from '@/services/post.service'

interface Props {
  data: ProfilePageData
}

const ProfilePostsPage: React.FC<Props> = ({ data }) => {
  // const { isLoggedIn, user } = useSelector((state: RootState) => state.user)
  const [loadingPosts, setLoadingPosts] = useState(false)
  const [posts, setPosts] = useState([])
  const [media, setMedia] = useState([])

  const getPost = async () => {
    setLoadingPosts(true)
    const { err, res } = await getAllPosts(
      `author_type=User&_author=${data.pageData._id}&populate=_author,_genre,_hobby`,
    )
    setLoadingPosts(false)
    if (err) return console.log(err)
    if (res.data.success) {
      setPosts(res.data.data.posts)
      const allposts = res.data.data.posts
      let tempMedia: any = []
      allposts.forEach((post: any) => {
        if (post.media) {
          if (post.video_url) {
            tempMedia.push({
              type: 'video',
              src: post.video_url,
            })
          } else {
            post.media.forEach((singleMedia: any) => {
              tempMedia.push({
                type: 'image',
                src: singleMedia,
              })
            })
          }
        }
      })
      setMedia(tempMedia)
    }
  }

  useEffect(() => {
    getPost()
  }, [])

  return (
    <>
      <Head>
        <title>{`Posts | ${data.pageData.full_name} | HobbyCue`}</title>
      </Head>

      <ProfileLayout activeTab={'media'} data={data}>
        <PageGridLayout column={3}>
          {media.map((item: any, idx) => {
            return (
              <div key={idx} className={styles.image}>
                {item.type === 'video' ? (
                  <video width="320" height="240" controls={true}>
                    <source src={item.src} type="video/mp4" />
                  </video>
                ) : (
                  <img src={item.src} />
                )}
              </div>
            )
          })}
          <div></div>
        </PageGridLayout>
      </ProfileLayout>
    </>
  )
}
export const getServerSideProps: GetServerSideProps<Props> = async (
  context,
) => {
  const { query } = context

  const { err, res } = await getAllUserDetail(
    `profile_url=${query['profile_url']}&populate=_hobbies,_addresses,primary_address,_listings`,
  )

  if (err) return { notFound: true }

  if (res?.data.success && res.data.data.no_of_users === 0)
    return { notFound: true }

  const data = {
    pageData: res.data.data.users[0],
    postsData: null,
    mediaData: null,
    listingsData: null,
    blogsData: null,
  }
  return {
    props: {
      data,
    },
  }
}

export default ProfilePostsPage
