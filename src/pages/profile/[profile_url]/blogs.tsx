import { useRouter } from 'next/router'
import React, { useState } from 'react'
import styles from './styles.module.css'
import { GetServerSideProps } from 'next'
import { getAllUserDetail } from '@/services/user.service'
import Head from 'next/head'
import ProfileLayout from '@/layouts/ProfilePageLayout'
import PageGridLayout from '@/layouts/PageGridLayout'
import ProfileHobbySideList from '@/components/ProfilePage/ProfileHobbySideList'
import ProfilePagesList from '@/components/ProfilePage/ProfilePagesList/ProfilePagesList'
import { getListingPages } from '@/services/listing.service'
import ProfileNavigationLinks from '@/components/ProfilePage/ProfileHeader/ProfileNavigationLinks'

interface Props {
  data: ProfilePageData
}

const ProfileBlogsPage: React.FC<Props> = ({ data }) => {
  // const { isLoggedIn, user } = useSelector((state: RootState) => state.user)
  const [expandAll,setExpandAll]=useState(false)

  return (
    <>
      <Head>
        <title>{`Posts | ${data.pageData.full_name} | HobbyCue`}</title>
      </Head>

      <ProfileLayout activeTab={'blogs'} data={data} expandAll={expandAll} setExpandAll={setExpandAll}>
        <PageGridLayout column={2}>
          <aside>
            {/* User Hobbies */}
            <ProfileHobbySideList data={data.pageData} expandData={expandAll}/>
            <ProfilePagesList data={data} expandData={expandAll}/>
          </aside>
          <div className={styles['nav-mobile']}>
            <ProfileNavigationLinks activeTab={'blogs'}/>
            </div>
          <section className={styles['pages-container']}>
            <div className={styles['no-posts-div']}>
              <p className={styles['no-posts-text']}>
                This feature is under development. Come back soon to view this
              </p>
            </div>
            <div className={styles['no-posts-div']}></div>
          </section>
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

  const user = res.data?.data?.users[0]

  if (res?.data.success && res.data.data.no_of_users === 0)
    return { notFound: true }

  const { err: error, res: response } = await getListingPages(
    `populate=_hobbies,_address&admin=${user._id}`,
  )

  const data = {
    pageData: res.data.data.users[0],
    postsData: null,
    mediaData: null,
    listingsData: response?.data.data.listings,
    blogsData: null,
  }
  return {
    props: {
      data,
    },
  }
}

export default ProfileBlogsPage
