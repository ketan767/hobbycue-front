import React, { useEffect, useState } from 'react'
import styles from './BlogComponents.module.css'
import CustomizedTooltips from '../Tooltip/ToolTip'
import UpvoteIcon from '@/assets/icons/UpvoteIcon'
import BookmarkIcon from '@/assets/icons/BookmarkIcon'
import ShareIcon from '@/assets/icons/ShareIcon'
import MenuIcon from '@/assets/icons/MenuIcon'
import CustomSnackbar from '../CustomSnackbar/CustomSnackbar'
import { useDispatch, useSelector } from 'react-redux'
import { openModal, updateShareUrl } from '@/redux/slices/modal'
import { useRouter } from 'next/router'
import { isMobile } from '@/utils'
import { RootState } from '@/redux/store'
import { downvoteBlog, upvoteBlog } from '@/services/blog.services'
import RepostIcon from '@/assets/icons/RepostIcon'
import CommentIcon from '@/assets/icons/CommentIcon'
import ReportIcon from '@/assets/icons/ReportIcon'
import DownvoteIcon from '@/assets/icons/DownvoteIcon'
import RepostIconBlog from '@/assets/icons/RepostIconBlog'

type Props = {
  data: any
}

const BlogActionBar: React.FC<Props> = ({ data }) => {
  console.log('asifs data', data)
  const [snackbar, setSnackbar] = useState({
    type: 'success',
    display: false,
    message: '',
  })
  const [showMenu, setShowMenu] = useState(false)
  const [vote, setVote] = useState<{ up: boolean; down: boolean }>({
    up: false,
    down: false,
  })
  const [btnLoading, setBtnLoading] = useState(false)

  const dispatch = useDispatch()
  const router = useRouter()
  const { isLoggedIn, user } = useSelector((state: RootState) => state.user)

  /** Set upvote, downvote state initially from the DB */
  useEffect(() => {
    const initialUpvote = data?.blog_url?.up_votes?._users?.some(
      (id: any) => id === user._id,
    )
    if (initialUpvote) setVote({ up: true, down: false })

    const initialDownvote = data?.blog_url?.down_votes?._users?.some(
      (id: any) => id === user._id,
    )
    if (initialDownvote) setVote({ up: false, down: true })
  }, [user, data])

  const showFeatUnderDev = () => {
    setSnackbar({
      type: 'warning',
      message: 'This feature is under development.',
      display: true,
    })
  }

  const handleActionsWithAuth = async (action: string) => {
    if (!isLoggedIn) {
      dispatch(openModal({ type: 'auth', closable: true }))
      return
    }

    if (!user?.is_onboarded) {
      dispatch(
        openModal({
          type: 'SimpleOnboarding',
          closable: true,
          propData: { showError: true },
        }),
      )
      return
    }

    setBtnLoading(true)

    switch (action) {
      case 'upvote':
        // for UI change update the state
        setVote({ up: !vote.up, down: false })

        try {
          const { res, err } = await upvoteBlog(data?.blog_url?._id, user?._id)
          if (err)
            console.log('Error upvoting blog at handleActionsWithAuth()', err)
          if (!res?.data?.success) {
            throw new Error()
          }
        } catch (err) {
          console.log('Error upvoting blog at handleActionsWithAuth()!')
          setSnackbar({
            display: true,
            message: 'Something went wrong!',
            type: 'error',
          })
        }
        break
      case 'downvote':
        // for UI change update the state
        setVote({ up: false, down: !vote.down })

        try {
          const { res, err } = await downvoteBlog(
            data?.blog_url?._id,
            user?._id,
          )
          if (err)
            console.log('Error downvoting blog at handleActionsWithAuth()', err)
          if (!res?.data?.success) {
            throw new Error()
          }
        } catch (err) {
          console.log('Error downvoting blog at handleActionsWithAuth()!')
          setSnackbar({
            display: true,
            message: 'Something went wrong!',
            type: 'error',
          })
        }
        break
      case 'bookmark':
        showFeatUnderDev()
        break
      case 'repost':
        dispatch(
          openModal({
            type: 'create-post',
            closable: true,
            propData: { defaultValue: window.location.href },
          }),
        )
        break
      case 'report':
        dispatch(openModal({ type: 'PostReportModal', closable: true }))
        break
    }

    setBtnLoading(false)
    setShowMenu(false)
  }

  const handleActionsWithoutAuth = (action: string) => {
    switch (action) {
      case 'share':
        dispatch(
          updateShareUrl(
            `${window.location.origin}/blog/${data?.blog_url?.url}`,
          ),
        )
        dispatch(openModal({ type: 'social-media-share', closable: true }))
        break
      case 'comment':
        router.push('#comments')
        break
    }
    setShowMenu(false)
  }

  // const handleMenuClick = (action: string) => {
  //   switch (action) {
  //     case 'reshare':
  //       showFeatUnderDev()
  //       break
  //     case 'comment':
  //       router.push('#comments')
  //       break
  //     case 'report':
  //       dispatch(openModal({ type: 'PostReportModal', closable: true }))
  //       break
  //     case 'downvote':
  //       showFeatUnderDev()
  //       break
  //     default:
  //       console.log('Provide right action for handleMenuClick()!')
  //       break
  //   }
  //   setShowMenu(false)
  // }

  useEffect(() => {
    window.addEventListener('click', () => setShowMenu(false))
    return () => window.removeEventListener('click', () => setShowMenu(false))
  }, [])

  const isMob = isMobile()

  return (
    <div className={styles.actions} onClick={(e) => e.stopPropagation()}>
      <CustomizedTooltips title="UpVote">
        <button
          disabled={btnLoading}
          onClick={() => handleActionsWithAuth('upvote')}
        >
          <UpvoteIcon fill={vote.up} />
        </button>
      </CustomizedTooltips>
      <CustomizedTooltips title="Bookmark">
        <button onClick={() => handleActionsWithAuth('bookmark')}>
          <BookmarkIcon />
        </button>
      </CustomizedTooltips>
      <CustomizedTooltips title="Share">
        <button onClick={() => handleActionsWithoutAuth('share')}>
          <ShareIcon />
        </button>
      </CustomizedTooltips>
      <div style={{ position: 'relative' }}>
        <CustomizedTooltips title="Click to view options">
          <button onClick={() => setShowMenu(!showMenu)} className={styles.btn}>
            <MenuIcon />
          </button>
        </CustomizedTooltips>
        {showMenu && (
          <div className={`${styles.menu}`}>
            <button onClick={() => handleActionsWithAuth('repost')}>
              <RepostIconBlog /> Repost
            </button>
            {!isMob && (
              <button onClick={() => handleActionsWithoutAuth('comment')}>
                <CommentIcon />
                Comment
              </button>
            )}
            <button onClick={() => handleActionsWithAuth('report')}>
              <ReportIcon /> Report
            </button>
            <button
              disabled={btnLoading}
              onClick={() => handleActionsWithAuth('downvote')}
            >
              <DownvoteIcon fill={vote.down} /> Downvote
            </button>
          </div>
        )}
      </div>
      {isMob && (
        <a href="#comments" className={styles.commentButton}>
          Comments
        </a>
      )}
      <CustomSnackbar
        message={snackbar.message}
        triggerOpen={snackbar.display}
        type={snackbar.type === 'success' ? 'success' : 'error'}
        closeSnackbar={() => {
          setSnackbar((prevValue) => ({ ...prevValue, display: false }))
        }}
      />
    </div>
  )
}

export default BlogActionBar
