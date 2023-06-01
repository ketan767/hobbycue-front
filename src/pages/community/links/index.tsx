import React, { useEffect, useState } from 'react'
import { withAuth } from '@/navigation/withAuth'
import styles from '@/styles/Community.module.css'
import { useSelector } from 'react-redux'
import store, { RootState } from '@/redux/store'
import { getAllPosts } from '@/services/post.service'
import { updatePosts } from '@/redux/slices/post'
import PostCard from '@/components/PostCard/PostCard'
import PostCardSkeletonLoading from '@/components/PostCardSkeletonLoading'
import CommunityPageLayout from '@/layouts/CommunityPageLayout'

type Props = {}

const CommunityLinks: React.FC<Props> = ({}) => {
  return (
    <>
      <CommunityPageLayout activeTab="links">Link tab</CommunityPageLayout>
    </>
  )
}

export default withAuth(CommunityLinks)
