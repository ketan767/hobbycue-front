import { FC, useState } from 'react'
import styles from './CommunityLayout.module.css'
import { useRouter } from 'next/router'
import FilledButton from '@/components/_buttons/FilledButton'
import Link from 'next/link'

interface PanelDropdownListProps {
  name: string
  options: any[]
  type?: string
  inviteFunction?: () => Promise<void>
  inviteError?: string
  inviteTextChangeFunc?: (arg0: any) => void
  inviteText?: string
}

const PanelDropdownList: FC<PanelDropdownListProps> = ({
  name,
  options,
  type,
  inviteFunction,
  inviteError,
  inviteText,
  inviteTextChangeFunc,
}) => {
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const [seeMore, setSeeMore] = useState(true)

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
        fill-opacity="0.5"
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
          {type === 'members' && (
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
            className={
              styles['options-parent'] +
              `
            ${type === 'members' && styles['no-gap']}
            ${type === 'members' && styles['no-padding']}
          `
            }
          >
            {type !== 'members' &&
              options.map((obj: any, idx: number) => (
                <div key={idx} className={styles['option']}>
                  {/* For Hobbies */}
                  {obj?.display ? (
                    <div
                      onClick={() => {
                        router.push(`/hobby/${obj?.slug}`)
                      }}
                      className={styles['hobby-option']}
                    >
                      {hobbyIcon}
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
                      <Link href={`/profile/` + obj?.slug}>{obj?.name}</Link>
                      {obj?.admin === true && (
                        <button className={styles['admin-btn']}>
                          Location Admin
                        </button>
                      )}
                    </div>
                  </div>
                ))}
            {type === 'members' && options.length > 3 && (
              <div className={styles['option'] + ` ${styles['mb-15']}`}>
                <div className={styles['member-container']}>
                  <p
                    onClick={() => {
                      setSeeMore((prev) => !prev)
                    }}
                    className={styles['see-more']}
                  >
                    {seeMore ? 'See all' : 'See less'}
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
