import React, { useEffect, useState } from 'react'
import styles from './styles.module.css'
import PageContentBox from '@/layouts/PageContentBox'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { openModal } from '@/redux/slices/modal'
import Link from 'next/link'
import { updateHobbyOpenState } from '@/redux/slices/site'

type Props = {
  data: ProfilePageData['pageData']
  expandData?: boolean
  hobbyError?: boolean
}

const ProfileHobbySideList = ({ data, expandData, hobbyError }: Props) => {
  const { profileLayoutMode, hobbyStates } = useSelector(
    (state: RootState) => state.site,
  )
  const [displayData, setDisplayData] = useState(true)
  console.log('data', { data })
  const dispatch = useDispatch()

  useEffect(() => {
    if (hobbyStates && typeof hobbyStates[data?._id] === 'boolean') {
      setDisplayData(hobbyStates[data?._id])
    } else if (data._id) {
      dispatch(updateHobbyOpenState({ [data._id]: displayData }))
    }
  }, [data._id, hobbyStates])

  useEffect(() => {
    if (expandData !== undefined) {
      setDisplayData(expandData)
    }
  }, [expandData])
  const openModalHobbiesModal = () => {
    if (window.innerWidth > 1100) {
      setDisplayData(true)
    }
  }
  useEffect(() => {
    // openModalHobbiesModal();
    // window.addEventListener("resize",openModalHobbiesModal);
    // return window.removeEventListener("resize",openModalHobbiesModal)
  }, [])

  return (
    <>
      <PageContentBox
        showEditButton={profileLayoutMode === 'edit'}
        onEditBtnClick={() =>
          dispatch(openModal({ type: 'profile-hobby-edit', closable: true }))
        }
        setDisplayData={(arg0: boolean) => {
          setDisplayData((prev) => {
            dispatch(updateHobbyOpenState({ [data._id]: !prev }))
            return !prev
          })
        }}
        expandData={displayData}
        initialShowDropdown
        className={hobbyError === true ? styles['error'] : ''}
      >
        <h4
          className={
            styles['heading'] + ` ${hobbyError && styles['error-label']}`
          }
        >
          Hobbies
        </h4>
        {hobbyError && displayData && (
          <p className={styles['error-text'] + ` ${styles['absolute-text']}`}>
            At least one hobby is mandatory
          </p>
        )}
        <ul
          className={`${styles['hobby-list']} ${
            hobbyStates?.[data?._id] && styles['display-mobile-flex']
          }`}
        >
          {data._hobbies.map((item: any) => {
            if (typeof item === 'string') return
            return (
              <Link
                href={`/hobby/${item?.genre?.slug ?? item?.hobby?.slug}`}
                key={item._id}
              >
                <li>
                  {item?.hobby?.display}
                  {item?.genre && ` - ${item?.genre?.display} `}
                </li>
              </Link>
            )
          })}
        </ul>
      </PageContentBox>
    </>
  )
}

export default ProfileHobbySideList
