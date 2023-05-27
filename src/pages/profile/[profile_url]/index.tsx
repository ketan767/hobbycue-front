import { useRouter } from 'next/router'
import React, { useState, useEffect } from 'react'

import { GetServerSideProps } from 'next'
import { getAllUserDetail } from '@/services/user.service'
import Head from 'next/head'
import ProfileLayout from '@/layouts/ProfilePageLayout'
import { useDispatch, useSelector } from 'react-redux'
import store, { RootState } from '@/redux/store'
import PageGridLayout from '@/layouts/PageGridLayout'
import ProfileHobbySideList from '@/components/ProfilePage/ProfileHobbySideList'
import PageContentBox from '@/layouts/PageContentBox'
import { openModal } from '@/redux/slices/modal'

import styles from '@/styles/ProfileHomePage.module.css'
import ProfileAddressSide from '@/components/ProfilePage/ProfileAddressSide'
import ProfileContactSide from '@/components/ProfilePage/ProfileContactSides'

interface Props {
  data: ProfilePageData
}

const ProfileHome: React.FC<Props> = ({ data }) => {
  const dispatch = useDispatch()
  const { profileLayoutMode } = useSelector((state: RootState) => state.site)

  const [pageData, setPageData] = useState(data.pageData)

  return (
    <>
      <Head>
        <title>{`${data.pageData.full_name} | HobbyCue`}</title>
      </Head>

      <ProfileLayout activeTab={'home'} data={data}>
        {data.pageData && (
          <PageGridLayout column={3}>
            <aside>
              {/* User Hobbies */}
              <ProfileHobbySideList data={pageData} />
            </aside>

            <main>
              {/* User About */}
              <PageContentBox
                showEditButton={profileLayoutMode === 'edit'}
                onEditBtnClick={() =>
                  dispatch(
                    openModal({ type: 'profile-about-edit', closable: true })
                  )
                }
              >
                <h4>About</h4>
                <div
                  dangerouslySetInnerHTML={{ __html: pageData?.about }}
                ></div>
              </PageContentBox>

              {/* User Information */}
              <PageContentBox
                showEditButton={profileLayoutMode === 'edit'}
                onEditBtnClick={() =>
                  dispatch(
                    openModal({ type: 'profile-general-edit', closable: true })
                  )
                }
              >
                <h4>Profile URL</h4>
                <div>{pageData.profile_url}</div>
                <h4>Year Of Birth</h4>
                <div>{pageData.year_of_birth}</div>
              </PageContentBox>
            </main>

            <aside>
              {/* User Locations */}
              <ProfileAddressSide data={pageData} />

              {/* User Contact Details */}
              <ProfileContactSide data={pageData} />
            </aside>
          </PageGridLayout>
        )}
      </ProfileLayout>
    </>
  )
}

export const getServerSideProps: GetServerSideProps<Props> = async (
  context
) => {
  const { query } = context

  const { err, res } = await getAllUserDetail(
    `profile_url=${query['profile_url']}&populate=_hobbies,_addresses,primary_address,_listings,_listings,_listings`
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

export default ProfileHome
