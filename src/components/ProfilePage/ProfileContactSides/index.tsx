import React, { useEffect, useRef, useState } from 'react'
import styles from './styles.module.css'
import PageContentBox from '@/layouts/PageContentBox'
import { useDispatch, useSelector } from 'react-redux'
import Image from 'next/image'
import { RootState } from '@/redux/store'
import { openModal } from '@/redux/slices/modal'
import Whatsapp from '@/assets/svg/whatsapp.svg'
import Link from 'next/link'
import { updateContactOpenStates } from '@/redux/slices/site'
type Props = {
  data: ProfilePageData['pageData']
  expandData?: boolean
  contactError?: boolean
}

const haveCommonHobby = (currentUser: any, profileUser: any): boolean => {
  return currentUser._hobbies?.some((hobby : any) =>
    profileUser._hobbies?.some((profileHobby : any) => profileHobby.hobby._id === hobby.hobby._id)
  );
};



const canViewField = (currentUser: any, profileUser: any, visibilityType: 'email' | 'phone'): boolean => {
  if(currentUser?.public_email===profileUser?.public_email) return true;
  const visibilityPreference = profileUser?.preferences[`${visibilityType}_visibility`];
  
  switch (visibilityPreference) {
    
    case 'Everyone':
      return true;
    case 'No one':
      return false;
    case 'Having a common Hobby':
      return haveCommonHobby(currentUser, profileUser);
    case 'Common Hobby and City':
      return (
        haveCommonHobby(currentUser, profileUser) &&
        currentUser?.primary_address?.city === profileUser?.primary_address?.city
      );
    case 'Common Society':
      return currentUser?.primary_address?.society === profileUser?.primary_address?.society;
    default:
      return false;
  }
};



const ProfileContactSide = ({ data, expandData, contactError }: Props) => {
  const { profileLayoutMode, contactStates } = useSelector(
    (state: RootState) => state.site,
  )
  const { user } = useSelector((state: RootState) => state.user)
  const ulRef = useRef(null)
  const dispatch = useDispatch()
  const [showText, setShowText] = useState(false)
  const [displayData, setDisplayData] = useState(false)

  useEffect(() => {
    const ulElement: any = ulRef.current
    const hasListItems = ulElement?.getElementsByTagName('li')
    if (hasListItems) {
      setShowText(false)
    } else {
      setShowText(true)
    }
  }, [data])

  useEffect(() => {
    if (contactStates && typeof contactStates[data?._id] === 'boolean') {
      setDisplayData(contactStates[data?._id])
    } else if (data._id) {
      dispatch(updateContactOpenStates({ [data._id]: displayData }))
    }
  }, [data._id, contactStates])

  useEffect(() => {
    if (expandData !== undefined) setDisplayData(expandData)
  }, [expandData])

  const itsMe = data?.public_email === user?.public_email

  return (
    <>
      {data?.website || profileLayoutMode === 'edit' ? (
        <>
          <PageContentBox
            showEditButton={profileLayoutMode === 'edit'}
            onEditBtnClick={() =>
              dispatch(
                openModal({ type: 'profile-contact-edit', closable: true }),
              )
            }
            setDisplayData={(arg0: boolean) => {
              setDisplayData((prev) => {
                dispatch(updateContactOpenStates({ [data._id]: !prev }))
                return !prev
              })
            }}
            expandData={displayData}
            className={contactError ? styles['error'] : ''}
          >
            <h4 className={styles['heading']}>Contact Information</h4>
            <ul
              className={`${styles['contact-wrapper']} ${
                displayData && styles['display-mobile-flex']
              }`}
            >
              {/* Phone */}
              {data.phone.number && itsMe && (
                <Link href={`tel:${data.phone.prefix + data?.phone.number}`}>
                  <li className={styles['list-item']}>
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clipPath="url(#clip0_230_34018)">
                        <path
                          d="M19.23 15.2578L16.69 14.9678C16.08 14.8978 15.48 15.1078 15.05 15.5378L13.21 17.3778C10.38 15.9378 8.06004 13.6278 6.62004 10.7878L8.47004 8.93781C8.90004 8.50781 9.11004 7.90781 9.04004 7.29781L8.75004 4.77781C8.63004 3.76781 7.78004 3.00781 6.76004 3.00781H5.03004C3.90004 3.00781 2.96004 3.94781 3.03004 5.07781C3.56004 13.6178 10.39 20.4378 18.92 20.9678C20.05 21.0378 20.99 20.0978 20.99 18.9678V17.2378C21 16.2278 20.24 15.3778 19.23 15.2578Z"
                          fill="#8064A2"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_230_34018">
                          <rect width="24" height="24" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>

                    <span>{`${data.phone.prefix} ${data.phone.number}`} </span>
                  </li>
                </Link>
              )}

              {/* WhatsApp Number */}
              {data.whatsapp_number.number && itsMe && (
                <a
                  href={`https://wa.me/${
                    data?.whatsapp_number?.prefix +
                    data?.whatsapp_number?.number
                  }`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <li className={styles['list-item']}>
                    <Image
                      src={Whatsapp}
                      alt="whatsapp"
                      width={24}
                      height={24}
                    />

                    <span>
                      {`${data.whatsapp_number.prefix} ${data.whatsapp_number.number}`}{' '}
                    </span>
                  </li>
                </a>
              )}

              {/* Email */}
              {data.public_email && itsMe && (
                <Link href={`mailto:${data?.public_email}`}>
                  <li className={styles['list-item']}>
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clipPath="url(#clip0_230_34011)">
                        <path
                          d="M20 4H4C2.9 4 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM19.6 8.25L12.53 12.67C12.21 12.87 11.79 12.87 11.47 12.67L4.4 8.25C4.15 8.09 4 7.82 4 7.53C4 6.86 4.73 6.46 5.3 6.81L12 11L18.7 6.81C19.27 6.46 20 6.86 20 7.53C20 7.82 19.85 8.09 19.6 8.25Z"
                          fill="#8064A2"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_230_34011">
                          <rect width="24" height="24" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>

                    <span>{data.public_email} </span>
                  </li>
                </Link>
              )}

              {/* Website */}
              {data.website && (
                <a
                  href={data.website}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <li className={styles['list-item']}>
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle cx="12" cy="12" r="12" fill="#8064A2" />
                      <path
                        d="M17.3333 15.9974C18.0667 15.9974 18.6667 15.3974 18.6667 14.6641V7.9974C18.6667 7.26406 18.0667 6.66406 17.3333 6.66406H6.66667C5.93333 6.66406 5.33333 7.26406 5.33333 7.9974V14.6641C5.33333 15.3974 5.93333 15.9974 6.66667 15.9974H4.66667C4.3 15.9974 4 16.2974 4 16.6641C4 17.0307 4.3 17.3307 4.66667 17.3307H19.3333C19.7 17.3307 20 17.0307 20 16.6641C20 16.2974 19.7 15.9974 19.3333 15.9974H17.3333ZM7.33333 7.9974H16.6667C17.0333 7.9974 17.3333 8.2974 17.3333 8.66406V13.9974C17.3333 14.3641 17.0333 14.6641 16.6667 14.6641H7.33333C6.96667 14.6641 6.66667 14.3641 6.66667 13.9974V8.66406C6.66667 8.2974 6.96667 7.9974 7.33333 7.9974Z"
                        fill="white"
                      />
                    </svg>

                    <span>{data.website} </span>
                  </li>
                </a>
              )}

              {!data.website &&
                !data.public_email &&
                !data.whatsapp_number &&
                !data.phone && (
                  <p
                    className={`${styles['text']} ${
                      showText ? styles['show'] : styles['hide']
                    } `}
                  >
                    No contact information
                  </p>
                )}
            </ul>
          </PageContentBox>
        </>
      ) : (
        <>
          <PageContentBox
            showEditButton={false}
            setDisplayData={(arg0: boolean) => {
              setDisplayData((prev) => {
                dispatch(updateContactOpenStates({ [data._id]: !prev }))
                return !prev
              })
            }}
            expandData={displayData}
            className={contactError ? styles['error'] : ''}
          >
            <h4 className={styles['heading']}>Contact Information</h4>
            <ul
              className={`${styles['contact-wrapper']} ${
                displayData && styles['display-mobile-flex']
              }`}
            >
              {/* Phone */}
              {data.phone.number && canViewField(user, data, 'phone') && (
                <Link href={`tel:${data.phone.prefix + data?.phone.number}`}>
                  <li className={styles['list-item']}>
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clipPath="url(#clip0_230_34018)">
                        <path
                          d="M19.23 15.2578L16.69 14.9678C16.08 14.8978 15.48 15.1078 15.05 15.5378L13.21 17.3778C10.38 15.9378 8.06004 13.6278 6.62004 10.7878L8.47004 8.93781C8.90004 8.50781 9.11004 7.90781 9.04004 7.29781L8.75004 4.77781C8.63004 3.76781 7.78004 3.00781 6.76004 3.00781H5.03004C3.90004 3.00781 2.96004 3.94781 3.03004 5.07781C3.56004 13.6178 10.39 20.4378 18.92 20.9678C20.05 21.0378 20.99 20.0978 20.99 18.9678V17.2378C21 16.2278 20.24 15.3778 19.23 15.2578Z"
                          fill="#8064A2"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_230_34018">
                          <rect width="24" height="24" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>

                    <span>{`${data.phone.prefix} ${data.phone.number}`} </span>
                  </li>
                </Link>
              )}

              {/* WhatsApp Number */}
              {data.whatsapp_number.number && itsMe && (
                <a
                  href={`https://wa.me/${
                    data?.whatsapp_number?.prefix +
                    data?.whatsapp_number?.number
                  }`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <li className={styles['list-item']}>
                    <Image
                      src={Whatsapp}
                      alt="whatsapp"
                      width={24}
                      height={24}
                    />

                    <span>
                      {`${data.whatsapp_number.prefix} ${data.whatsapp_number.number}`}{' '}
                    </span>
                  </li>
                </a>
              )}

              {/* Email */}
              {data.public_email && canViewField(user, data, 'email') && (
                <Link href={`mailto:${data?.public_email}`}>
                  <li className={styles['list-item']}>
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clipPath="url(#clip0_230_34011)">
                        <path
                          d="M20 4H4C2.9 4 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM19.6 8.25L12.53 12.67C12.21 12.87 11.79 12.87 11.47 12.67L4.4 8.25C4.15 8.09 4 7.82 4 7.53C4 6.86 4.73 6.46 5.3 6.81L12 11L18.7 6.81C19.27 6.46 20 6.86 20 7.53C20 7.82 19.85 8.09 19.6 8.25Z"
                          fill="#8064A2"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_230_34011">
                          <rect width="24" height="24" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>

                    <span>{data.public_email} </span>
                  </li>
                </Link>
              )}

              {/* Website */}
              {data.website && (
                <a
                  href={data.website}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <li className={styles['list-item']}>
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle cx="12" cy="12" r="12" fill="#8064A2" />
                      <path
                        d="M17.3333 15.9974C18.0667 15.9974 18.6667 15.3974 18.6667 14.6641V7.9974C18.6667 7.26406 18.0667 6.66406 17.3333 6.66406H6.66667C5.93333 6.66406 5.33333 7.26406 5.33333 7.9974V14.6641C5.33333 15.3974 5.93333 15.9974 6.66667 15.9974H4.66667C4.3 15.9974 4 16.2974 4 16.6641C4 17.0307 4.3 17.3307 4.66667 17.3307H19.3333C19.7 17.3307 20 17.0307 20 16.6641C20 16.2974 19.7 15.9974 19.3333 15.9974H17.3333ZM7.33333 7.9974H16.6667C17.0333 7.9974 17.3333 8.2974 17.3333 8.66406V13.9974C17.3333 14.3641 17.0333 14.6641 16.6667 14.6641H7.33333C6.96667 14.6641 6.66667 14.3641 6.66667 13.9974V8.66406C6.66667 8.2974 6.96667 7.9974 7.33333 7.9974Z"
                        fill="white"
                      />
                    </svg>

                    <span>{data.website} </span>
                  </li>
                </a>
              )}

              {!data.website &&
                !data.public_email &&
                !data.whatsapp_number &&
                !data.phone && (
                  <p
                    className={`${styles['text']} ${
                      showText ? styles['show'] : styles['hide']
                    } `}
                  >
                    No contact information
                  </p>
                )}
            </ul>
          </PageContentBox>
        </>
      )}
    </>
  )
}

export default ProfileContactSide
