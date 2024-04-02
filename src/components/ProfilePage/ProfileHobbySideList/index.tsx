import React, { useEffect, useState } from 'react'
import styles from './styles.module.css'
import PageContentBox from '@/layouts/PageContentBox'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { openModal } from '@/redux/slices/modal'
import Link from 'next/link'

type Props = {
  data: ProfilePageData['pageData']
  expandData?: boolean
  hobbyError?:boolean
}

const ProfileHobbySideList = ({ data, expandData, hobbyError }: Props) => {
  const { profileLayoutMode } = useSelector((state: RootState) => state.site)
  const [displayData, setDisplayData] = useState(false)
  console.log('data', data)
  const dispatch = useDispatch()

  useEffect(() => {
    if (expandData !== undefined) setDisplayData(expandData)
  }, [expandData])
  const openModalHobbiesModal = () => {
    if(window.innerWidth<1100){
        setDisplayData(true)
      }
    }
    useEffect(()=>{
      openModalHobbiesModal();
      window.addEventListener("resize",openModalHobbiesModal);
      return window.removeEventListener("resize",openModalHobbiesModal)
    },[])

  return (
    <>
      <PageContentBox
        showEditButton={profileLayoutMode === 'edit'}
        onEditBtnClick={() =>
          dispatch(openModal({ type: 'profile-hobby-edit', closable: true }))
        }
        setDisplayData={setDisplayData}
        expandData={expandData}
        initialShowDropdown
        className={hobbyError===true?styles['error']:''}
      >
        <h4 className={styles['heading']}>Hobbies</h4>
        <ul
          className={`${styles['hobby-list']} ${
            displayData && styles['display-mobile-flex']
          }`}
        >
          {data._hobbies.map((item: any) => {
            if (typeof item === 'string') return
            return (
              <Link href={`/hobby/${item?.hobby?.slug}`} key={item._id}>
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
