import { FC, useState, useRef, useEffect } from 'react'
import styles from './CommunityLayout.module.css'
import { useRouter } from 'next/router'
import FilledButton from '@/components/_buttons/FilledButton'
import defaultUserIcon from '@/assets/svg/default-images/default-user-icon.svg'
import Link from 'next/link'
import Image from 'next/image'
import { pageType } from '@/utils'
interface PanelDropdownListProps {
  name: string
  options: any[]
  type?: string
  invite?: boolean
  inviteFunction?: () => Promise<void>
  inviteError?: string
  inviteTextChangeFunc?: (arg0: any) => void
  inviteText?: string
  initialOpen?: boolean
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
}) => {
  const [open, setOpen] = useState(initialOpen ?? false)
  const router = useRouter()
  const [seeMore, setSeeMore] = useState(true)
  const membersContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (type === 'members') {
      if (membersContainerRef.current) {
        const requiredHeight = options.length * 38 + 47
        if (options.length <= 2) {
          membersContainerRef.current.style.height = 'auto'
        } else if (seeMore) {
          membersContainerRef.current.style.height = '161px'
        } else {
          membersContainerRef.current.style.height = requiredHeight + 'px'
        }
      }
    }
  }, [seeMore, options])

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
  return (
    <div className={styles['parent-list']}>
      <div className={styles['list']}>
        <p>{name}</p>
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
                  placeholder=""
                  type="text"
                  autoComplete="new"
                  name=""
                  id=""
                  className={inviteError !== '' ? styles['error-input'] : ''}
                  onChange={inviteTextChangeFunc}
                  value={inviteText}
                />
                <FilledButton onClick={inviteFunction}>Invite</FilledButton>
              </section>
              {inviteError !== '' && (
                <span className={styles['error-invite']}>{inviteError}</span>
              )}
            </div>
          )}
          <div
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
              options
                .slice(0, seeMore ? 3 : options.length)
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
                  </div>
                ))}
            {type === 'members' &&
              options
                .slice(0, seeMore ? 3 : options.length)
                .map((obj: any, idx: number) => (
                  <div key={idx} className={styles['option']}>
                    <div className={styles['member-container']}>
                      <Link
                        href={`/${pageType(obj?.type)}/${obj?.page_url}`}
                        className={styles['img-name']}
                      >
                        {obj?.profile_image ? (
                          <img width={24} height={24} src={obj.profile_image} />
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
                ))}
            {type === 'user members' &&
              options
                .slice(0, seeMore ? 3 : options.length)
                .map((obj: any, idx: number) => (
                  <div key={idx} className={styles['option']}>
                    <div
                      className={`${styles['member-container']} ${styles.userimg}`}
                    >
                      <Link
                        href={`/profile/${obj?.profile_url}`}
                        className={styles['img-name']}
                      >
                        {obj?.profile_image ? (
                          <img width={24} height={24} src={obj.profile_image} />
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
                ))}
            {options.length > 3 && (
              <div className={styles['option'] + ` ${styles['mb-15']}`}>
                <div className={styles['member-container']}>
                  <p
                    onClick={() => {
                      setSeeMore((prev) => !prev)
                    }}
                    className={styles['see-more']}
                  >
                    {seeMore ? 'See more' : 'See less'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default PanelDropdownList
