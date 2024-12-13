import React, { useRef, useState } from 'react'
import Image from 'next/image'
import ToggleButton from '@/components/_buttons/ToggleButton'
import styles from './SearchFilter.module.css'

import GoogleIcon from '@/assets/svg/admin_google.svg'
import MailIcon from '@/assets/svg/admin_email.svg'
import FacebookIcon from '@/assets/svg/admin_facebook.svg'
import { ModalState } from '@/pages/admin/searchHistory'
import MyDatePicker from '../../Users/DatePicker/DatePicker'
import FilterDropdown from './FilterDropDown/FilterDropDown'
import UserDropdown from './UserDropDown/UserDropDown'

interface SearchFilterProps {
  modalState: ModalState
  setModalState?: React.Dispatch<React.SetStateAction<ModalState>>
  setIsModalOpen?: React.Dispatch<React.SetStateAction<boolean>>
  setApplyFilter?: React.Dispatch<React.SetStateAction<boolean>>
}

const SearchFilter: React.FC<SearchFilterProps> = ({
  modalState,
  setModalState,
  setIsModalOpen,
  setApplyFilter,
}) => {
  const [showStartDateCalender, setShowStartDateCalender] = useState(false)
  const [showEndDateCalender, setShowEndDateCalender] = useState(false)
  const handleOnboardedChange = (value: string) => {
    setModalState?.((prev) => ({ ...prev, onboarded: value }))
  }

  const handleApply = () => {
    setApplyFilter?.(true)
    setIsModalOpen?.(false)
  }
  const handleClear = () => {
    setModalState?.({
      onboarded: '',
      joined: { start: '', end: '' },
      loginModes: [],
      pageCount: { min: '', max: '' },
      status: '',
    })
    setIsModalOpen?.(false)
  }
  console.log(modalState)
  return (
    <main className={styles.modal}>
      <div className={styles.modalHeader}>
        <h2 className={styles.modalTitle}>Filter</h2>
        <div className={styles.wrapper}>
          <button className={styles.clearButton} onClick={handleClear}>
            Clear
          </button>
          <button className={styles.applyButton} onClick={handleApply}>
            Apply
          </button>
        </div>
      </div>
      <div className={styles.modalBody}>
        <FilterDropdown />
        <UserDropdown />

        <div className={styles.keyword}>
          <label htmlFor="">Keywords</label>

          <input type="text" placeholder="Keywords" />
        </div>
      </div>
    </main>
  )
}

export default SearchFilter
