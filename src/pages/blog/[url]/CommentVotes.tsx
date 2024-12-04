import { openModal } from '@/redux/slices/modal'
import { showProfileError } from '@/redux/slices/user'
import { RootState } from '@/redux/store'
import {
  upvotePostComment,
  removevotePostComment,
  downvotePostComment,
} from '@/services/post.service'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styles from './BlogCard.module.css'
import {
  downvoteBlogComment,
  upvoteBlogComment,
} from '@/services/blog.services'
type Props = {
  setRefetch: React.Dispatch<React.SetStateAction<number>>
  comment: any
}

const PostCommentVotes: React.FC<Props> = ({ setRefetch, comment }: Props) => {
  const { activeProfile, user, isLoggedIn } = useSelector(
    (state: RootState) => state.user,
  )
  const [vote, setVote] = useState<{ up: boolean; down: boolean }>({
    up: false,
    down: false,
  })
  const [loading, setLoading] = useState(false)

  /**
   * Set upvote, downvote state initially from the DB
   */
  useEffect(() => {
    const initialUpvote = comment?.up_votes?._users?.some(
      (id: any) => id === user._id,
    )
    if (initialUpvote) setVote({ up: true, down: false })

    const initialDownvote = comment?.down_votes?._users?.some(
      (id: any) => id === user._id,
    )
    if (initialDownvote) setVote({ up: false, down: true })
  }, [user, comment])

  /** Check and Update the Vote status */
  // const updateVoteStatus = () => {
  //   if (activeProfile.type === 'user') {
  //     const isUpVoted = Boolean(
  //       comment.up_votes?._users.find(
  //         (item: any) => item.toString() === activeProfile.data?._id,
  //       ),
  //     )
  //     const isDownVoted = Boolean(
  //       comment.down_votes?._users.find(
  //         (item: any) => item.toString() === activeProfile.data?._id,
  //       ),
  //     )
  //     if (isUpVoted) setVoteStatus('up')
  //     if (isDownVoted) setVoteStatus('down')
  //   } else if (activeProfile.type === 'listing') {
  //     const isUpVoted = Boolean(
  //       comment.up_votes?._listings.find(
  //         (item: any) => item.toString() === activeProfile?.data?._id,
  //       ),
  //     )
  //     const isDownVoted = Boolean(
  //       comment.down_votes?._listings.find(
  //         (item: any) => item.toString() === activeProfile?.data?._id,
  //       ),
  //     )
  //     if (isUpVoted) setVoteStatus('up')
  //     if (isDownVoted) setVoteStatus('down')
  //   } else setVoteStatus(null)
  // }

  // const handleUpVote = async () => {
  //   if (voteStatus !== 'up') {
  //     let jsonData = {
  //       upvoteBy: activeProfile.type, // 'user' | 'listing'
  //       upvoteById: activeProfile.data._id,
  //     }
  //     setVoteStatus('up')
  //     setLoading(true)
  //     const { err, res } = await upvotePostComment(comment._id, jsonData as any)
  //     if (err) {
  //       console.log(err)
  //       setLoading(false)
  //       updateVoteStatus()
  //       return
  //     }
  //     if (res.data.success) {
  //       setLoading(false)
  //       updateComments?.()
  //     }
  //   } else {
  //     let jsonData = {
  //       voteBy: activeProfile.type, // 'user' | 'listing'
  //       userId: activeProfile.data._id,
  //     }
  //     setVoteStatus(null)
  //     setLoading(true)
  //     const { err, res } = await removevotePostComment(
  //       comment._id,
  //       jsonData as any,
  //     )
  //     if (err) {
  //       console.log(err)
  //       setLoading(false)
  //       updateVoteStatus()
  //       return
  //     }
  //     console.log('🚀 ~ file: Votes.tsx:67 ~ handleDownVote ~ res:', res)
  //     if (res.data.success) {
  //       setLoading(false)
  //       updateComments?.()
  //     }
  //   }
  // }

  // const handleDownVote = async () => {
  //   if (voteStatus !== 'down') {
  //     let jsonData = {
  //       downvoteBy: activeProfile.type, // 'user' | 'listing'
  //       downvoteById: activeProfile.data._id,
  //     }
  //     setVoteStatus('down')
  //     setLoading(true)
  //     const { err, res } = await downvotePostComment(
  //       comment._id,
  //       jsonData as any,
  //     )
  //     if (err) {
  //       console.log(err)
  //       setLoading(false)
  //       updateVoteStatus()
  //       return
  //     }
  //     console.log('🚀 ~ file: Votes.tsx:67 ~ handleDownVote ~ res:', res)
  //     if (res.data.success) {
  //       setLoading(false)
  //       updateComments?.()
  //     }
  //   } else {
  //     let jsonData = {
  //       voteBy: activeProfile.type, // 'user' | 'listing'
  //       userId: activeProfile.data._id,
  //     }
  //     setVoteStatus(null)
  //     setLoading(true)
  //     const { err, res } = await removevotePostComment(
  //       comment._id,
  //       jsonData as any,
  //     )
  //     if (err) {
  //       console.log(err)
  //       setLoading(false)
  //       updateVoteStatus()
  //       return
  //     }
  //     console.log('🚀 ~ file: Votes.tsx:67 ~ handleDownVote ~ res:', res)
  //     if (res.data.success) {
  //       setLoading(false)
  //       updateComments?.()
  //     }
  //   }
  // }

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

    setLoading(true)

    switch (action) {
      case 'upvote':
        // for UI change update the state
        setVote({ up: !vote.up, down: false })

        try {
          const { res, err } = await upvoteBlogComment(comment?._id, user?._id)
          if (err)
            console.log(
              'Error upvoting comment at handleActionsWithAuth()',
              err,
            )
          if (!res?.data?.success) {
            throw new Error()
          }
        } catch (err) {
          console.log('Error upvoting comment at handleActionsWithAuth()!')
        }
        break
      case 'downvote':
        // for UI change update the state
        setVote({ up: false, down: !vote.down })

        try {
          const { res, err } = await downvoteBlogComment(
            comment?._id,
            user?._id,
          )
          if (err)
            console.log(
              'Error downvoting comment at handleActionsWithAuth()',
              err,
            )
          if (!res?.data?.success) {
            throw new Error()
          }
        } catch (err) {
          console.log('Error downvoting comment at handleActionsWithAuth()!')
        }
        break
      // case 'bookmark':
      //   showFeatUnderDev()
      //   break
      // case 'repost':
      //   dispatch(
      //     openModal({
      //       type: 'create-post',
      //       closable: true,
      //       propData: { defaultValue: window.location.href },
      //     }),
      //   )
      //   break
      // case 'report':
      //   dispatch(openModal({ type: 'PostReportModal', closable: true }))
      //   break
      // case 'delete':
      //   // <DeletePrompt triggerOpen={true}  /> make a delete states
      //   showFeatUnderDev()
      //   break
    }
    setRefetch((prev) => prev + 1)
    setLoading(false)
    // setShowMenu(false)
  }

  const router = useRouter()
  const dispatch = useDispatch()
  const HandleNotOnboard = () => {
    dispatch(openModal({ type: 'SimpleOnboarding', closable: true }))
  }

  // useEffect(() => {
  //   updateVoteStatus()
  // }, [comment, activeProfile.data, activeProfile.type])

  return (
    <>
      <div className={styles['upvote-downvote']}>
        <div
          onClick={() => (loading ? null : handleActionsWithAuth('upvote'))}
          className={styles['upvote']}
        >
          <svg
            width="24"
            height="21"
            viewBox="0 0 24 21"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6.60083 20H17.1236C17.2136 20 17.2999 19.9642 17.3636 19.9006C17.4273 19.8369 17.463 19.7506 17.463 19.6606V13.89H22.3849C22.4493 13.8888 22.5119 13.8692 22.5655 13.8337C22.6192 13.7982 22.6616 13.7482 22.688 13.6896C22.7143 13.6309 22.7234 13.5659 22.7142 13.5022C22.705 13.4386 22.678 13.3788 22.6361 13.3299L12.1134 1.10999C12.0807 1.07526 12.0413 1.04759 11.9975 1.02867C11.9537 1.00976 11.9065 1 11.8588 1C11.8111 1 11.7639 1.00976 11.7201 1.02867C11.6764 1.04759 11.6369 1.07526 11.6042 1.10999L1.08149 13.3299C1.03931 13.3793 1.01215 13.4396 1.00323 13.5039C0.994301 13.5682 1.00399 13.6337 1.03113 13.6926C1.05828 13.7515 1.10175 13.8014 1.1564 13.8364C1.21105 13.8714 1.27458 13.89 1.33947 13.89H6.26139V19.6606C6.26139 19.7506 6.29715 19.8369 6.36081 19.9006C6.42447 19.9642 6.51081 20 6.60083 20Z"
              stroke="#8064A2"
              stroke-width="2"
              fill={vote.up ? '#8064A2' : ''}
            />
          </svg>
          <p className={styles['count']}>{comment?.up_votes?.count}</p>
        </div>
        <span className={styles['divider']}></span>
        <svg
          onClick={() => (loading ? null : handleActionsWithAuth('downvote'))}
          cursor={'pointer'}
          width="24"
          height="22"
          viewBox="0 0 24 22"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M6.65317 1.9375L17.1759 1.9375C17.2659 1.9375 17.3523 1.97326 17.4159 2.03692C17.4796 2.10058 17.5153 2.18692 17.5153 2.27694V8.04748L22.4373 8.04748C22.5021 8.04747 22.5657 8.06607 22.6203 8.10106C22.675 8.13605 22.7184 8.18597 22.7456 8.24491C22.7727 8.30385 22.7824 8.36933 22.7735 8.43361C22.7646 8.49788 22.7374 8.55825 22.6952 8.60756L12.1725 20.8275C12.1398 20.8622 12.1004 20.8899 12.0566 20.9088C12.0128 20.9277 11.9656 20.9375 11.9179 20.9375C11.8702 20.9375 11.823 20.9277 11.7793 20.9088C11.7355 20.8899 11.696 20.8622 11.6633 20.8275L1.14063 8.60756C1.0988 8.55869 1.07173 8.49894 1.06255 8.43527C1.05338 8.3716 1.06248 8.30664 1.0888 8.24795C1.11513 8.18926 1.15758 8.13925 1.21123 8.10376C1.26488 8.06827 1.3275 8.04875 1.39181 8.04748H6.31373V2.27694C6.31373 2.18692 6.34949 2.10058 6.41315 2.03692C6.47681 1.97326 6.56315 1.9375 6.65317 1.9375Z"
            stroke="#8064A2"
            stroke-width="2"
            fill={vote.down ? '#8064A2' : ''}
          />
        </svg>
      </div>
    </>
  )
}

export default PostCommentVotes
