import React, { useEffect, useState } from 'react'
import styles from './BlogComponents.module.css'
import CustomizedTooltips from '../Tooltip/ToolTip'
import UpvoteIcon from '@/assets/icons/UpvoteIcon'
import BookmarkIcon from '@/assets/icons/BookmarkIcon'
import ShareIcon from '@/assets/icons/ShareIcon'
import MenuIcon from '@/assets/icons/MenuIcon'
import CustomSnackbar from '../CustomSnackbar/CustomSnackbar'
import { useDispatch } from 'react-redux'
import { openModal, updateShareUrl } from '@/redux/slices/modal'
import { useRouter } from 'next/router'
import { isMobile } from '@/utils'

type Props = {
  //   showFeatUnderDev: () => void
  //   handleShare: () => void
  //   handleActions: () => void
  //   handleMenuClick: (action: string) => void
  //   showMenu: boolean
  data: any
}

const BlogActionBar: React.FC<Props> = ({
  //   showFeatUnderDev,
  //   handleShare,
  //   handleActions,
  //   handleMenuClick,
  //   showMenu,
  data,
}) => {
  const [snackbar, setSnackbar] = useState({
    type: 'success',
    display: false,
    message: '',
  })
  const [showMenu, setShowMenu] = useState(false)
  const dispatch = useDispatch()
  const router = useRouter()

  const showFeatUnderDev = () => {
    setSnackbar({
      type: 'warning',
      message: 'This feature is under development.',
      display: true,
    })
  }

  const handleShare = () => {
    dispatch(
      updateShareUrl(`${window.location.origin}/blog/${data?.blog_url?.url}`),
    )
    dispatch(openModal({ type: 'social-media-share', closable: true }))
  }

  const handleActions = () => {
    setShowMenu(!showMenu)
  }

  const handleMenuClick = (action: string) => {
    switch (action) {
      case 'reshare':
        showFeatUnderDev()
        break
      case 'comment':
        router.push('#comments')
        break
      case 'report':
        showFeatUnderDev()
        break
      case 'downvote':
        showFeatUnderDev()
        break
      default:
        console.log('Provide right action for handleMenuClick()!')
        break
    }
    setShowMenu(false)
  }

  useEffect(() => {
    window.addEventListener('click', () => setShowMenu(false))
    return window.removeEventListener('click', () => setShowMenu(false))
  }, [])

  const isMob = isMobile()

  return (
    <div className={styles.actions} onClick={(e) => e.stopPropagation()}>
      <CustomizedTooltips title="UpVote">
        <button onClick={showFeatUnderDev}>
          <UpvoteIcon />
        </button>
      </CustomizedTooltips>
      <CustomizedTooltips title="Bookmark">
        <button onClick={showFeatUnderDev}>
          <BookmarkIcon />
        </button>
      </CustomizedTooltips>
      <CustomizedTooltips title="Share">
        <button onClick={handleShare}>
          <ShareIcon />
        </button>
      </CustomizedTooltips>
      <div style={{ position: 'relative' }}>
        <CustomizedTooltips title="Click to view options">
          <button onClick={handleActions} className={styles.btn}>
            <MenuIcon />
          </button>
        </CustomizedTooltips>
        {showMenu && (
          <div className={`${styles.menu}`}>
            <button onClick={() => handleMenuClick('reshare')}>ReShare</button>
            {!isMob && (
              <button onClick={() => handleMenuClick('comment')}>
                Comment
              </button>
            )}
            <button onClick={() => handleMenuClick('report')}>Report</button>
            <button onClick={() => handleMenuClick('downvote')}>
              Downvote
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
