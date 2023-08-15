import React, { useRef, useState } from 'react'
import Image from 'next/image'
import styles from './localization.module.css'
import PageGridLayout from '@/layouts/PageGridLayout'
import SettingsSidebar from '@/layouts/SettingsSidebar/SettingsSidebar'
import AddIcon from '../../../assets/svg/add.svg'
import EditIcon from '../../../assets/svg/vertical-bars.svg'
import RadioUnselected from '../../../assets/svg/radio-unselected.svg'
import RadioSelected from '../../../assets/svg/radio-selected.svg'
import InputSelect from '@/components/InputSelect/inputSelect'
import { withAuth } from '@/navigation/withAuth'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { openModal } from '@/redux/slices/modal'
import useCheckIfClickedOutside from '@/hooks/useCheckIfClickedOutside'

type Props = {
  address: any
  handleAddressEdit: any
}
const Address: React.FC<Props> = ({ address, handleAddressEdit }) => {
  const [optionsActive, setOptionsActive] = useState(false)
  const editRef: any = useRef(null)
  useCheckIfClickedOutside(editRef, () => setOptionsActive(false))

  return (
    <div className={`${styles.cardContainer}`} key={address._id}>
      <div className={`${styles.addressLeft}`}>
        <Image
          src={RadioUnselected}
          width={16}
          height={16}
          alt="radio"
          className={styles.addIcon}
        />
        <div className={styles.addressContent}>
          <p className={`${styles.textDark} ${styles.labelText}`}>
            {address.label ? address.label : '-'}
          </p>
          <p className={`${styles.textLight} ${styles.addressText}`}>
            <span className={styles.addressText}>
              {address.society && `${address.society}, `}
              {address.street && `${address.street}`}
            </span>
            <span className={styles.addressText}>
              {address.city && `${address.city}, `}
              {address.pin_code && `${address.pin_code}`}
            </span>
            <span className={styles.addressText}>
              {address.state && `${address.state}, `}
              {address.country && `${address.country}`}
            </span>
          </p>
        </div>
      </div>
      <div className={styles['edit-icon-container']} ref={editRef}>
        <Image
          src={EditIcon}
          width={16}
          height={16}
          alt="edit"
          className={styles.addIcon}
          onClick={() => setOptionsActive(true)}
        />
        <ul
          className={`${styles.optionsContainer} ${
            optionsActive ? styles['options-active'] : ''
          } `}
        >
          <li onClick={() => handleAddressEdit(address._id)}>Edit</li>
          <li>Delete</li>
        </ul>
      </div>
    </div>
  )
}

export default Address
