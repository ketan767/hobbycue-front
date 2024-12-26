import AddHobbyImg from '@/assets/image/AddHobbyImg.png'
import { FC, useState, useRef, useEffect } from 'react'
import styles from './CommunityLayout.module.css'
import { useRouter } from 'next/router'
import FilledButton from '@/components/_buttons/FilledButton'
import defaultUserIcon from '@/assets/svg/default-images/default-user-icon.svg'
import Link from 'next/link'
import Image from 'next/image'
import {isMobile, pageType, validateEmail } from '@/utils'
import { CircularProgress } from '@mui/material'
import { searchUsersAdvanced } from '@/services/user.service'
import { RootState } from '@/redux/store'
import { useDispatch, useSelector } from 'react-redux'
import { openModal } from '@/redux/slices/modal'
import { InviteToCommunity } from '@/services/auth.service'
interface PanelDropdownListProps {
  name: string
  options: any[]
  type?: string
  invite?: boolean
  inviteFunction: () => Promise<void>
  inviteError?: string
  inviteTextChangeFunc?: (arg0: any) => void
  inviteText?: string
  initialOpen?: boolean
  handleAddTrendingHobby?: (arg0: any) => void
  seeMoreMembers: number
  clickedSeeLess: boolean
  seeLessMembers: boolean
  setSeeLessMembers: (value: React.SetStateAction<boolean>) => void
  setClickedSeeLess: (value: React.SetStateAction<boolean>) => void
  setSeeMoreMembers: (value: React.SetStateAction<number>) => void
  seeMoreWhatsNew: boolean
  seeMoreTrendHobbies: boolean
  setSeeMoreWhatsNew: (value: React.SetStateAction<boolean>) => void
  setSeeMoreTrendHobbies: (value: React.SetStateAction<boolean>) => void
}

const PanelDropdownList: FC<PanelDropdownListProps> = ({
  name,
  options,
  type,
  invite,
  inviteFunction,
  inviteError,
  inviteText,
  inviteTextChangeFunc,
  initialOpen,
  handleAddTrendingHobby,
  seeMoreMembers,
  clickedSeeLess,
  seeLessMembers,
  setClickedSeeLess,
  setSeeLessMembers,
  setSeeMoreMembers,
  seeMoreTrendHobbies,
  seeMoreWhatsNew,
  setSeeMoreTrendHobbies,
  setSeeMoreWhatsNew,
}) => {
  const [open, setOpen] = useState(initialOpen ?? false)
  const router = useRouter()
  // const [seeMore, setSeeMore] = useState(true)
  const isMob = isMobile();
  const [seeMoreHobbies, setSeeMoreHobbies] = useState(0)
  const [email, setEmail] = useState('')
  const [filteredUsers, setFilteredUsers] = useState([])
  const [filtersUsersLoading, setFilteredUsersLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const membersContainerRef = useRef<HTMLDivElement>(null)
  const [showModal, setShowModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState<any>()
  const [inviteBtnLoader, setInviteBtnLoader] = useState(false)
  const { activeProfile, user, isLoggedIn, listing } = useSelector(
    (state: RootState) => state.user,
  )
  const { allPosts, filters, post_pagination } = useSelector(
    (state: RootState) => state.post,
  )

  const [snackbar, setSnackbar] = useState({
    type: 'success',
    display: false,
    message: '',
  })
  const dispatch = useDispatch()

  const fetchUsers = async (query: string) => {
    setFilteredUsersLoading(true)
    try {
      let searchCriteria = {
        name: query,
      }
      const { res, err } = await searchUsersAdvanced(searchCriteria)
      // console.log('Data : ', res.data)

      setFilteredUsers(res.data)
      setFilteredUsersLoading(false)
    } catch (error) {
      setFilteredUsersLoading(false)
      console.error('Error fetching users:', error)
    }
  }
  useEffect(() => {
    if (showModal) {
      const query = email.slice(1)
      console.log(query)
      fetchUsers(query || '')
    }
  }, [email, showModal])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value
    setEmail(input)
    setErrorMessage('')

    if (input.startsWith('@') && input.length > 1) {
      setShowModal(true)
    } else {
      setShowModal(false)
    }
  }

  const handleUserSelect = (selectedUser: any) => {
    setEmail(selectedUser.display_name)
    setSelectedUser(selectedUser)
    setShowModal(false)
  }

  const Invitecommunity = async () => {
    if (!isLoggedIn) {
      dispatch(openModal({ type: 'auth', closable: true }))
      return
    }

    let to = email

    if (!to || to === '') {
      setErrorMessage('This field is required')
      return
    }

    if (selectedUser?.display_name === email) {
      to = selectedUser?.email
    }

    if (!validateEmail(to) && selectedUser?.display_name !== email) {
      setErrorMessage('Please enter a valid email')
      return
    }
    setErrorMessage('')
    const name = activeProfile?.data.full_name
    const _id = activeProfile?.data?._id
    const hobby_id = filters?.hobby
    const location = filters?.location || ''
    setInviteBtnLoader(true)

    const { err, res } = await InviteToCommunity({
      to,
      name,
      _id,
      hobby_id,
      location,
    })
    if (res.data?.success) {
      setInviteBtnLoader(false)
      setSnackbar({
        display: true,
        type: 'success',
        message: 'Invitation sent',
      })
      setEmail('')
      setSelectedUser({})
    }
    if (err) {
      setEmail('')
      setInviteBtnLoader(false)
      setSnackbar({
        display: true,
        type: 'error',
        message: 'Invitation failed.',
      })
    }
  }

  const ArrowSvg = ({ rotate }: { rotate?: boolean }) => {
    return (
      <svg
        tabIndex={0}
        onClick={() => setOpen((prev) => !prev)}
        style={{ rotate: rotate === true ? '180deg' : '0deg' }}
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
      >
        <g clip-path="url(#clip0_12804_121264)">
          <path
            d="M13.237 7.74375L10.0036 10.9771L6.77031 7.74375C6.44531 7.41875 5.92031 7.41875 5.59531 7.74375C5.27031 8.06875 5.27031 8.59375 5.59531 8.91875L9.42031 12.7437C9.74531 13.0687 10.2703 13.0687 10.5953 12.7437L14.4203 8.91875C14.7453 8.59375 14.7453 8.06875 14.4203 7.74375C14.0953 7.42708 13.562 7.41875 13.237 7.74375Z"
            fill="#6D747A"
          />
        </g>
        <defs>
          <clipPath id="clip0_12804_121264">
            <rect width="20" height="20" fill="white" />
          </clipPath>
        </defs>
      </svg>
    )
  }

  const hobbyIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="29"
      height="32"
      viewBox="0 0 29 32"
      fill="none"
    >
      <path
        d="M13.1697 0.556239C13.7804 0.211073 14.5273 0.211073 15.138 0.556239L27.2918 7.4258C27.9195 7.78061 28.3077 8.44586 28.3077 9.16693V22.8331C28.3077 23.5541 27.9195 24.2194 27.2918 24.5742L15.138 31.4438C14.5273 31.7889 13.7804 31.7889 13.1697 31.4438L1.01588 24.5742C0.388147 24.2194 0 23.5541 0 22.8331V9.16693C0 8.44586 0.388148 7.78061 1.01589 7.4258L13.1697 0.556239Z"
        fill="#969696"
        fillOpacity="0.5"
      />
      <path
        d="M14 6.66797L16.2865 13.5209L23.5106 13.5778L17.6996 17.87L19.8779 24.7581L14 20.558L8.12215 24.7581L10.3004 17.87L4.48944 13.5778L11.7135 13.5209L14 6.66797Z"
        fill="white"
      />
    </svg>
  )

  useEffect(() => {
    if (isMob) {
      setOpen(true)
    }
  }, [])
  return (
    <div className={styles['parent-list']}>
      <div className={styles['list']}>
        <p className={!open ? styles.activeP : ''}>{name}</p>
        <ArrowSvg rotate={open} />
      </div>
      {open && (
        <>
          {invite && (
            <div
              className={
                styles['member-invite'] +
                ` ${styles['invite-wrapper']} ${styles['pos-relative']}`
              }
            >
              <section>
                <input
                  placeholder="Email or @ mention "
                  type="text"
                  autoComplete="new"
                  name=""
                  id=""
                  className={inviteError !== '' ? styles['error-input'] : ''}
                  onChange={handleInputChange}
                  value={email}
                />
                {showModal && (
                  <div className={styles['modal-container']}>
                    <ul className={styles['modal-list']}>
                      <h4
                        className={styles['user-name']}
                        style={{
                          fontWeight: '600',
                          marginLeft: '12px',
                          marginTop: '8px',
                        }}
                      >
                        HobbyCue
                      </h4>
                      {filteredUsers.length > 0 ? (
                        filteredUsers.map((user: any) => (
                          <li
                            key={user.id}
                            className={styles['modal-item']}
                            onClick={() => handleUserSelect(user)}
                          >
                            <img
                              src={user.profile_image || defaultUserIcon.src} // Ensure `defaultUserIcon` is defined
                              alt={user.full_name}
                              className={styles['profile-pic']}
                            />
                            <div>
                              <p className={styles['user-name']}>
                                {user.full_name.length > 23
                                  ? user.full_name.slice(0, 23) + '...'
                                  : user.full_name}
                              </p>
                              <p
                                className={styles['user-name']}
                                style={{ fontSize: 12 }}
                              >
                                {user.tagline
                                  ? user.tagline.slice(0, 25) + '...'
                                  : ''}
                              </p>
                            </div>
                          </li>
                        ))
                      ) : !filtersUsersLoading ? (
                        <li className={styles['modal-item']}>No users found</li>
                      ) : (
                        <li className={styles['modal-item']}>loading...</li>
                      )}
                    </ul>
                  </div>
                )}
                <FilledButton onClick={inviteFunction}>Invite</FilledButton>
              </section>
              {inviteError !== '' && (
                <span className={styles['error-invite']}>{inviteError}</span>
              )}
            </div>
          )}
          <div
            style={
              type === 'user members' || type === 'members'
                ? { gap: '0px' }
                : { gap: '7px' }
            }
            ref={membersContainerRef}
            className={
              styles['options-parent'] +
              `
            ${type === 'members' && styles['no-gap']}
            ${type === 'members' && styles['no-padding']}
            ${type === 'user members' && styles['no-gap']}
            ${type === 'user members' && styles['no-padding']}
          `
            }
          >
            {type !== 'members' &&
              type !== 'user members' &&
              options
                .slice(0, seeMoreTrendHobbies ? 3 : options.length)
                .map((obj: any, idx: number) => (
                  <div key={idx} className={styles['option']}>
                    {/* For Hobbies */}
                    {obj?.display ? (
                      <div
                        onClick={() => {
                          router.push(`/hobby/${obj?.slug}`)
                        }}
                        className={styles['hobby-option']}
                      >
                        {obj?.profile_image ? (
                          <div className={styles['border-div']}>
                            <img
                              className={styles.profileImage}
                              src={obj?.profile_image}
                            ></img>
                          </div>
                        ) : (
                          <svg
                            className={styles.polygonOverlay}
                            width={40}
                            viewBox="0 0 160 160"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M80 0L149.282 40V120L80 160L10.718 120V40L80 0Z"
                              fill="#969696"
                              fillOpacity="0.5"
                            />
                            <path
                              d="M79.6206 46.1372C79.7422 45.7727 80.2578 45.7727 80.3794 46.1372L87.9122 68.7141C87.9663 68.8763 88.1176 68.9861 88.2885 68.9875L112.088 69.175C112.472 69.178 112.632 69.6684 112.323 69.8967L93.1785 84.0374C93.041 84.139 92.9833 84.3168 93.0348 84.4798L100.211 107.173C100.327 107.539 99.9097 107.842 99.5971 107.619L80.2326 93.7812C80.0935 93.6818 79.9065 93.6818 79.7674 93.7812L60.4029 107.619C60.0903 107.842 59.6731 107.539 59.789 107.173L66.9652 84.4798C67.0167 84.3168 66.959 84.139 66.8215 84.0374L47.6773 69.8967C47.3682 69.6684 47.5276 69.178 47.9118 69.175L71.7115 68.9875C71.8824 68.9861 72.0337 68.8763 72.0878 68.7141L79.6206 46.1372Z"
                              fill="white"
                            />
                          </svg>
                        )}

                        <p>{obj?.display}</p>
                      </div>
                    ) : null}
                    <img
                      src={AddHobbyImg.src}
                      height={20}
                      width={20}
                      alt="Add"
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleAddTrendingHobby?.(obj)}
                    />
                  </div>
                ))}
            {type === 'members' &&
              options.slice(0, seeMoreWhatsNew ? 3 : options.length).map(
                (obj: any, idx: number) =>
                  obj && (
                    <div key={idx} className={styles['option']}>
                      <div
                        className={
                          styles['member-container'] +
                          ' ' +
                          styles['whatsNewContainer']
                        }
                      >
                        <Link
                          href={`/${pageType(obj?.type)}/${obj?.page_url}`}
                          className={
                            styles['img-name'] + ' ' + styles['whatsNewImg']
                          }
                        >
                          {obj?.profile_image ? (
                            <img
                              width={24}
                              height={24}
                              src={obj.profile_image}
                            />
                          ) : (
                            <Image
                              width={24}
                              height={24}
                              src={defaultUserIcon}
                              alt=""
                            />
                          )}

                          <p>{obj?.title}</p>
                        </Link>
                        {obj?.admin === true && (
                          <button className={styles['admin-btn']}>
                            Location Admin
                          </button>
                        )}
                      </div>
                    </div>
                  ),
              )}
            {type === 'user members' &&
              options
                ?.slice(
                  0,
                  seeMoreMembers === 0 || clickedSeeLess ? 3 : options.length,
                )
                .map(
                  (obj: any, idx: number) =>
                    obj && (
                      <div key={idx} className={styles['option']}>
                        <div
                          className={`${styles['member-container']} ${styles.userimg}`}
                        >
                          <Link
                            href={`/profile/${obj?.profile_url}`}
                            className={styles['img-name']}
                          >
                            {obj?.profile_image ? (
                              <img
                                width={24}
                                height={24}
                                src={obj.profile_image}
                              />
                            ) : (
                              <Image
                                width={24}
                                height={24}
                                src={defaultUserIcon}
                                alt=""
                              />
                            )}

                            <p>{obj?.full_name}</p>
                          </Link>
                          {obj?.admin === true && (
                            <button className={styles['admin-btn']}>
                              Location Admin
                            </button>
                          )}
                        </div>
                      </div>
                    ),
                )}
            {type === 'user members' &&
              (options.length > 3 && seeLessMembers ? (
                <div
                  onClick={() => {
                    setSeeLessMembers(false)
                    setClickedSeeLess(true)
                  }}
                  className={styles['see-all']}
                >
                  <p>See less</p>
                </div>
              ) : (
                <div
                  onClick={() => {
                    setSeeMoreMembers((prev) => prev + 1)
                    setClickedSeeLess(false)
                  }}
                  className={styles['see-all']}
                >
                  <p>See more</p>
                </div>
              ))}
            {type !== 'user members' && options.length > 3 && (
              <div
                onClick={() => {
                  type === 'members'
                    ? setSeeMoreWhatsNew((prev) => !prev)
                    : setSeeMoreTrendHobbies((prev) => !prev)
                }}
                className={styles['see-all']}
              >
                <p>
                  {(type === 'members' ? seeMoreWhatsNew : seeMoreTrendHobbies)
                    ? 'See more'
                    : 'See less'}
                </p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default PanelDropdownList
