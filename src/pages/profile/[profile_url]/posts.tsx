import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'

import { GetServerSideProps } from 'next'
import { getAllUserDetail } from '@/services/user.service'
import Head from 'next/head'
import ProfileLayout from '@/layouts/ProfilePageLayout'
import PageGridLayout from '@/layouts/PageGridLayout'
import ProfileHobbySideList from '@/components/ProfilePage/ProfileHobbySideList'
import { getAllPosts } from '@/services/post.service'
import PostCard from '@/components/PostCard/PostCard'

import styles from '@/styles/ProfilePostsPage.module.css'
import ProfileAddressSide from '@/components/ProfilePage/ProfileAddressSide'
import ProfileContactSide from '@/components/ProfilePage/ProfileContactSides'

interface Props {
  data: ProfilePageData
}

const ProfilePostsPage: React.FC<Props> = ({ data }) => {
  const [loadingPosts, setLoadingPosts] = useState(false)
  const [posts, setPosts] = useState([])

  const getPost = async () => {
    setLoadingPosts(true)
    const { err, res } = await getAllPosts(
      `author_type=User&_author=${data.pageData._id}&populate=_author,_genre,_hobby`
    )
    setLoadingPosts(false)
    if (err) return console.log(err)
    if (res.data.success) {
      setPosts(res.data.data.posts)
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

      <ProfileLayout activeTab={'posts'} data={data}>
        <PageGridLayout column={3}>
          <aside>
            <ProfileHobbySideList data={data.pageData} />
          </aside>
          <main>
            <section className={styles['posts-container']}>
              {loadingPosts ? 'Loading..' : posts.length === 0 && 'No Posts'}
              {posts.map((post: any) => {
                return <PostCard key={post._id} postData={post} />
              })}
            </section>
          </main>
          <aside>
            {/* User Locations */}
            <ProfileAddressSide data={data.pageData} />

            {/* User Contact Details */}
            <ProfileContactSide data={data.pageData} />
          </aside>
        </PageGridLayout>
      </ProfileLayout>
    </>
  )
}

export const getServerSideProps: GetServerSideProps<Props> = async (
  context
) => {
  const { query } = context

  const { err, res } = await getAllUserDetail(
    `profile_url=${query['profile_url']}&populate=_hobbies,_addresses,primary_address,_listings`
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
