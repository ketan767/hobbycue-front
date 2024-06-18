import React, { useEffect, useState } from 'react'
import Head from 'next/head'
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
import post, { setActivePost, updatePosts } from '@/redux/slices/post'
import PostCard from '@/components/PostCard/PostCard'
import ProfileSwitcher from '@/components/ProfileSwitcher/ProfileSwitcher'
import PostCardSkeletonLoading from '@/components/PostCardSkeletonLoading'
import { checkIfUrlExists } from '@/utils'
import Link from 'next/link'
import { useRouter } from 'next/router'
import CommunityPageLayout from '@/layouts/CommunityPageLayout'
import { setShowPageLoader } from '@/redux/slices/site'
import { getAllUserDetail } from '@/services/user.service'
import { getListingPages } from '@/services/listing.service'

type Props = {
  data: {
    pageData: any
    postsData: any
    mediaData: any
    listingsData: any
    blogsData: any
  }
}

const CommunityLayout: React.FC<Props> = ({ data }) => {
  const router = useRouter()
  const [postId, setPostId] = useState<string | null>(null)
  const [postData, setPostData] = useState<any>(null)
  const [isLoadingPosts, setIsLoadingPosts] = useState(false)
  const dispatch = useDispatch()

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
      router.push('/community')
    }
    setIsLoadingPosts(false)
  }

  const openPostmodal = () => {
    if (postData) {
      dispatch(setActivePost(postData))
      dispatch(openModal({ type: 'post', closable: false }))
    }
  }

  useEffect(() => {
    if (postId) {
      getPost()
    }
  }, [postId])

  useEffect(() => {
    if (postData?.content) openPostmodal()
  }, [postData?.content])

  return (
    <>
      <Head>
        <title>{postData ? postData.title : 'Loading...'}</title>
        <meta
          property="og:title"
          content={postData ? postData.title : 'Loading...'}
        />
        <meta
          property="og:description"
          content={postData ? postData.description : 'Description'}
        />
        <meta
          property="og:image"
          content={postData ? postData.image : '/default-image.png'}
        />
        <meta
          property="og:url"
          content={typeof window !== 'undefined' ? window.location.href : ''}
        />
      </Head>
      <CommunityPageLayout activeTab="posts" singlePostPage={true}>
        <main>
          {!postData || isLoadingPosts ? (
            <PostCardSkeletonLoading />
          ) : (
            <PostCard postData={postData} />
          )}
        </main>
      </CommunityPageLayout>
    </>
  )
}

export default CommunityLayout
