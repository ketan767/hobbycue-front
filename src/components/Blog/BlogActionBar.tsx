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
import { CircularProgress } from '@mui/material'
import DeletePrompt from '../DeletePrompt/DeletePrompt'
import { setIsEditing } from '@/redux/slices/blog'

type Props = {
  data: any
  // isEditing: boolean
  // setIsEditing: React.Dispatch<React.SetStateAction<boolean>>
  isAuthor: boolean
  vote: { up: boolean; down: boolean }
  setVote: React.Dispatch<
    React.SetStateAction<{
      up: boolean
      down: boolean
    }>
  >
}

const BlogActionBar: React.FC<Props> = ({
  data,
  // setIsEditing,
  // isEditing,
  isAuthor,
  vote,
  setVote,
}) => {
  const [snackbar, setSnackbar] = useState({
    type: 'success',
    display: false,
    message: '',
  })
  const [showMenu, setShowMenu] = useState(false)
  const [btnLoading, setBtnLoading] = useState(false)

  const dispatch = useDispatch()
  const router = useRouter()
  const { isLoggedIn, user } = useSelector((state: RootState) => state.user)
  const { preview, isEditing } = useSelector((state: RootState) => state.blog)

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
      case 'delete':
        // <DeletePrompt triggerOpen={true}  /> make a delete states
        showFeatUnderDev()
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

  useEffect(() => {
    window.addEventListener('click', () => setShowMenu(false))
    return () => window.removeEventListener('click', () => setShowMenu(false))
  }, [])

  const isMob = isMobile()

  const isDraft = data?.blog_url?.status === 'Draft'

  const btnDisabled = (btn: string) => {
    // 2 special cases
    if (preview) return true
    if (data?.blog_url?.status === 'Published') return false
    // For Unpublished status
    if (btn === 'edit') return isEditing
    if (['delete', 'support', 'bookmark'].includes(btn)) return false // never disabled
    return true // for upvote, downvote, share in Unpublihed status
  }

  return (
    <div className={styles.actions} onClick={(e) => e.stopPropagation()}>
      <CustomizedTooltips title="UpVote">
        <button
          disabled={btnDisabled('upvote')}
          onClick={() => handleActionsWithAuth('upvote')}
        >
          {btnLoading ? (
            <CircularProgress color="inherit" size={'24px'} />
          ) : (
            <UpvoteIcon fill={vote.up} />
          )}
        </button>
      </CustomizedTooltips>
      <CustomizedTooltips title="Bookmark">
        <button
          onClick={() => handleActionsWithAuth('bookmark')}
          disabled={btnDisabled('bookmark')}
        >
          <BookmarkIcon />
        </button>
      </CustomizedTooltips>
      <CustomizedTooltips title="Share">
        <button
          onClick={() => handleActionsWithoutAuth('share')}
          disabled={btnDisabled('share')}
        >
          <ShareIcon />
        </button>
      </CustomizedTooltips>
      <div className={styles.viewMenuParent}>
        <CustomizedTooltips title="Click to view options">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className={`${styles.btn} ${showMenu ? styles.active : ''}`}
            // disabled={isEditing}
          >
            <MenuIcon />
          </button>
        </CustomizedTooltips>
        {showMenu && (
          <div className={`${styles.menu}`}>
            {isAuthor || user.is_admin ? (
              <>
                <button
                  onClick={() => {
                    dispatch(setIsEditing(true))
                    setShowMenu(false)
                  }}
                  disabled={btnDisabled('edit')}
                >
                  Edit
                </button>
                <button
                  onClick={() =>
                    dispatch(
                      openModal({ type: 'SupportUserModal', closable: true }),
                    )
                  }
                  disabled={btnDisabled('support')}
                >
                  Support
                </button>
                <button
                  onClick={() => handleActionsWithAuth('delete')}
                  disabled={btnDisabled('delete')}
                >
                  Delete
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => handleActionsWithAuth('repost')}
                  disabled={btnDisabled('repost')}
                >
                  <RepostIconBlog /> Repost
                </button>
                {!isMob && (
                  <button
                    onClick={() => handleActionsWithoutAuth('comment')}
                    disabled={btnDisabled('comment')}
                  >
                    <CommentIcon />
                    Comment
                  </button>
                )}
                <button
                  onClick={() => handleActionsWithAuth('report')}
                  disabled={btnDisabled('report')}
                >
                  <ReportIcon /> Report
                </button>
                <button
                  onClick={() => handleActionsWithAuth('downvote')}
                  disabled={btnDisabled('downvote')}
                >
                  {btnLoading ? (
                    <CircularProgress
                      color="inherit"
                      size={'24px'}
                      style={{ margin: 'auto' }}
                    />
                  ) : (
                    <>
                      <DownvoteIcon fill={vote.down} /> Downvote
                    </>
                  )}
                </button>
              </>
            )}
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
