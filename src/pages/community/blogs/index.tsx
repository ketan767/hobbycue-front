import React, { useEffect, useState } from 'react'
import { withAuth } from '@/navigation/withAuth'
import styles from '@/styles/Community.module.css'
import { useSelector } from 'react-redux'
import store, { RootState } from '@/redux/store'
import { getAllPosts } from '@/services/post.service'
import {
  updateBlogs,
  updatePages,
  updatePagesLoading,
  updatePosts,
} from '@/redux/slices/post'
import PostCard from '@/components/PostCard/PostCard'
import PostCardSkeletonLoading from '@/components/PostCardSkeletonLoading'
import CommunityPageLayout from '@/layouts/CommunityPageLayout'
import { getListingPages } from '@/services/listing.service'
import ListingCard from '@/components/ListingCard/ListingCard'
import { useMediaQuery } from '@mui/material'
import { getAllBlogs } from '@/services/blog.services'
import BlogCard from '@/components/BlogCard/BlogCard'
import BlogLoader from '@/components/BlogsLoader/BlogLoader'

type Props = {}

const CommunityBlogs: React.FC<Props> = ({}) => {
  const { activeProfile } = useSelector((state: any) => state.user)
  const { allBlogs, pagesLoading } = useSelector(
    (state: RootState) => state.post,
  )

  function filterBlogsByHobbyDisplayNames(blogs: any, hobbyDisplayNames: any) {
    return blogs.filter((blog: any) =>
      blog._hobbies.some((hobby: any) =>
        hobbyDisplayNames.includes(hobby.hobby.display),
      ),
    )
  }

  const getPost = async () => {
    const params = new URLSearchParams(
      `populate=_hobbies,author&status=Published`,
    )

    if (
      !activeProfile?.data?._hobbies ||
      activeProfile?.data?._hobbies.length === 0
    )
      return

    const { err, res } = await getAllBlogs(`${params}`)
    if (err) return console.log(err)
    if (res?.data.success) {
      const hobbyDisplayNames = activeProfile.data._hobbies.map(
        (hobby: any) => hobby.hobby.display,
      )

      const filteredBlogs = filterBlogsByHobbyDisplayNames(
        res.data.data.blog,
        hobbyDisplayNames,
      )
      console.warn('filteredblogsssssssss', filteredBlogs)
      store.dispatch(updateBlogs(filteredBlogs))
      store.dispatch(updatePagesLoading(false))
    }
  }

  useEffect(() => {
    getPost()
  })

  const isMobile = useMediaQuery('(max-width:1100px)')

  return (
    <>
      <CommunityPageLayout activeTab="blogs">
        <section className={styles['blog-container']}>
          {pagesLoading ? (
            <>
              <BlogLoader />
              <BlogLoader />
              <BlogLoader />
              <BlogLoader />
              <BlogLoader />
              <BlogLoader />
            </>
          ) : allBlogs?.length === 0 ? (
            <>
              <div
              style={
                isMobile
                  ? { marginTop: '8px', height: '100px', borderRadius: '0px' }
                  : undefined
              }
              className={styles['no-posts-div']}>
                <p className={styles['no-posts-text']}>No Blogs available</p>
                <div
                  style={{
                    display: 'flex',
                    flex: 1,
                    justifyContent: 'center',
                  }}
                ></div>
              </div>
              <div
              style={
                isMobile
                  ? { marginTop: '8px', height: '100px', borderRadius: '0px' }
                  : undefined
              }
              className={styles['no-posts-div']}>
                <p className={styles['no-posts-text']}>No Blogs available</p>
                <div
                  style={{
                    display: 'flex',
                    flex: 1,
                    justifyContent: 'center',
                  }}
                ></div>
              </div>
            </>
          ) : (
            allBlogs?.map((post: any) => {
              return <BlogCard key={post._id} data={post} />
            })
          )}
        </section>
      </CommunityPageLayout>
    </>
  )
}

export default withAuth(CommunityBlogs)
