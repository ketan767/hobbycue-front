import React, { useEffect, useState } from 'react'
import PageContentBox from '@/layouts/PageContentBox'
import PageGridLayout from '@/layouts/PageGridLayout'
import { withAuth } from '@/navigation/withAuth'
import styles from '@/styles/PostPage.module.css'
import Image from 'next/image'
import { useDispatch, useSelector } from 'react-redux'
import store, { RootState } from '@/redux/store'
import EditIcon from '@/assets/svg/edit-icon.svg'
import { openModal } from '@/redux/slices/modal'
import { getAllPosts } from '@/services/post.service'
import { GetServerSideProps } from 'next'
import post, { setActivePost, updatePosts } from '@/redux/slices/post'
import PostCard from '@/components/PostCard/PostCard'
import ProfileSwitcher from '@/components/ProfileSwitcher/ProfileSwitcher'
import PostCardSkeletonLoading from '@/components/PostCardSkeletonLoading'
import { checkIfUrlExists } from '@/utils'
import Link from 'next/link'
import { useRouter } from 'next/router'
import CommunityPageLayout from '@/layouts/CommunityPageLayout'
import { setShowPageLoader } from '@/redux/slices/site'
import Head from 'next/head'

type Props = {
  data: ListingPageData
}

const CommunityLayout: React.FC<Props> = ({ data }) => {
  const router = useRouter()
  const [postId, setPostId] = useState<string | null>(null)

  const getLastIdFromUrl = (url: any) => {
    const urlObj = new URL(url)
    const paths = urlObj.pathname.split('/')
    return paths[paths.length - 1]
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const currUrl = window.location.href
      const extractedId = getLastIdFromUrl(currUrl)
      setPostId(extractedId)
      console.log(`Extracted ID: ${extractedId}`)
    }
  }, [])

  const { activeProfile } = useSelector((state: RootState) => state.user)
  const { allPosts } = useSelector((state: RootState) => state.post)

  const [isLoadingPosts, setIsLoadingPosts] = useState(false)
  const [postData, setPostData] = useState<any>(null)
  const dispatch = useDispatch()

  const getPost = async () => {
    if (!postId) return

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

  const openPostmodal = () => {
    dispatch(setActivePost(postData))
    dispatch(openModal({ type: 'post', closable: false }))
  }

  useEffect(() => {
    if (postId) {
      getPost()
    }
  }, [activeProfile, postId])

  useEffect(() => {
    if (postData?.content) openPostmodal()
  }, [[postData?.content]])

  return (
    <>
      <Head>
        <meta
          property="og:image"
          content={`${data?.postsData?.profile_image}`}
        />
        <meta
          property="og:image:secure_url"
          content={`${data?.postsData?.profile_image}`}
        />
        <meta
          property="og:description"
          content={`${data?.postsData?.tagline ?? ''}`}
        />
        <meta
          property="og:url"
          content={`${process.env.NEXT_PUBLIC_BASE_URL}/page/${data?.postsData?.slug}`}
        />
        <meta property="og:image:alt" content="Profile picture" />
        <title>{`${data.postsData?.visibility} | HobbyCue`}</title>
      </Head>
      <CommunityPageLayout activeTab="posts" singlePostPage={true}>
        <main>
          {!postData || isLoadingPosts ? (
            <>
              <PostCardSkeletonLoading />
            </>
          ) : (
            <PostCard postData={postData} />
          )}
        </main>
      </CommunityPageLayout>
    </>
  )
}

export default CommunityLayout

export const getServerSideProps: GetServerSideProps<Props> = async (
  context,
) => {
  const { params } = context
  console.log('paramssssssssssssssssssssssssssssssss', params)
  const postId = params?.post_id

  const queryParams = new URLSearchParams(
    `populate=_author,_genre,_hobby&_id=6673af18122f27ad62bff9e3`,
  )
  const { err, res } = await getAllPosts(
    `populate=_author,_genre,_hobby&_id=6673af18122f27ad62bff9e3`,
  )

  return {
    props: {
      data: {
        pageData: null, // Adjust based on your actual response structure
        postsData: res.data.data.posts[0],
        mediaData: null,
        reviewsData: null,
        eventsData: null,
        storeData: null,
      },
    },
  }
}
