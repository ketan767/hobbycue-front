import React, { useRef, useState } from 'react'

import ToggleButton from '@/components/_buttons/ToggleButton'
import styles from './PagesFilter.module.css'


import { ModalState } from '@/pages/admin/pages'
import MyDatePicker from '../../Users/DatePicker'

interface UserFilterProps {
  modalState: ModalState
  setModalState?: React.Dispatch<React.SetStateAction<ModalState>>
  setIsModalOpen?: React.Dispatch<React.SetStateAction<boolean>>
  setApplyFilter?: React.Dispatch<React.SetStateAction<boolean>>
}

export const formatDate = (date: string | Date): string => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }
  return new Date(date).toLocaleDateString(undefined, options)
}

const PagesFilter: React.FC<UserFilterProps> = ({
  modalState,
  setModalState,
  setIsModalOpen,
  setApplyFilter,
}) => {
  const [showStartDateCalender, setShowStartDateCalender] = useState(false)
  const [showEndDateCalender, setShowEndDateCalender] = useState(false)
  const handleOnboardedChange = (value: string) => {
    setModalState?.((prev) => ({ ...prev, edited: value }))
  }

  const handleDateChange = (field: 'start' | 'end', value: Date) => {
    setModalState?.((prev) => ({
      ...prev,
      postedat: { ...prev.postedat, [field]: value },
    }))
  }


  const handlePageCountChange = (
    type: 'upcount' | 'downcount' | 'updowncount' | 'commcount' | 'sharecount' | 'bookmarkcount',
    field: 'min' | 'max',
    value: string
  ) => {
    setModalState?.((prev) => ({
      ...prev,
      [type]: { ...prev[type], [field]: value },
    }));
  };

  const handleStatusChange = (value: string) => {
    setModalState?.((prev) => ({ ...prev, status: value }))
  }

  const handleApply = () => {
    setApplyFilter?.(true)
    setIsModalOpen?.(false)
  }
  const handleClear = () => {
    setModalState?.({
      postedat: { start: '', end: '' },
      edited: '',
      upcount: { min: '', max: '' },
      downcount: { min: '', max: '' },
      updowncount: { min: '', max: '' },
      commcount: { min: '', max: '' },
      sharecount: { min: '', max: '' },
      bookmarkcount: { min: '', max: '' }
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
        {/* Onboarded */}
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Posted At</label>
          <p className={styles.dateRange}>
            <button
              className={styles.dateButton}
              onClick={() => setShowStartDateCalender((pre) => !pre)}
            >
              {modalState.postedat.start
                ? formatDate(modalState.postedat.start)
                : 'start'}
            </button>

            {showStartDateCalender && (
              <MyDatePicker
                updateState={() => setShowStartDateCalender(false)}
                handleDatePick={(date) => handleDateChange('start', date)}
              />
            )}

            <span style={{ color: '#6D747A', margin: '0 4px' }}>-</span>
            <button
              className={styles.dateButton}
              onClick={() => setShowEndDateCalender((pre) => !pre)}
            >
              {modalState.postedat.end
                ? formatDate(modalState.postedat.end)
                : 'end'}
            </button>

            {showEndDateCalender && (
              <MyDatePicker
                updateState={() => setShowEndDateCalender(false)}
                handleDatePick={(date) => handleDateChange('end', date)}
              />
            )}
          </p>
        </div>

        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Edited</label>
          <fieldset className={styles.fieldset}>
            {['Yes', 'No'].map((option) => (
              <p key={option} className={styles.radioGroup}>
                <input
                  type="radio"
                  name="onboarded"
                  id={`onboarded-${option}`}
                  value={option}
                  checked={modalState.edited === option}
                  onChange={(e) => handleOnboardedChange(e.target.value)}
                  className={styles.radioInput}
                />
                <label
                  htmlFor={`onboarded-${option}`}
                  className={styles.radioLabel}
                >
                  {option}
                </label>
              </p>
            ))}
          </fieldset>
        </div>

        {/* Joined */}
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Up Count</label>
          <p className={styles.textRange}>
            <input
              type="text"
              placeholder="Min"
              className={styles.textInput}
              value={modalState.upcount.min || ''}
              onChange={(e) => handlePageCountChange('upcount', 'min', e.target.value)}
            />

            <input
              type="text"
              placeholder="Max"
              className={styles.textInput}
              value={modalState.upcount.max || ''}
              onChange={(e) => handlePageCountChange('upcount','max', e.target.value)}
            />
          </p>
        </div>


        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Down Count</label>
          <p className={styles.textRange}>
            <input
              type="text"
              placeholder="Min"
              className={styles.textInput}
              value={modalState.downcount.min || ''}
              onChange={(e) => handlePageCountChange('downcount','min', e.target.value)}
            />

            <input
              type="text"
              placeholder="Max"
              className={styles.textInput}
              value={modalState.downcount.max || ''}
              onChange={(e) => handlePageCountChange('downcount','max', e.target.value)}
            />
          </p>
        </div>

         <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Up-Down Count</label>
          <p className={styles.textRange}>
            <input
              type="text"
              placeholder="Min"
              className={styles.textInput}
              value={modalState.updowncount.min || ''}
              onChange={(e) => handlePageCountChange('updowncount','min', e.target.value)}
            />

            <input
              type="text"
              placeholder="Max"
              className={styles.textInput}
              value={modalState.updowncount.max || ''}
              onChange={(e) => handlePageCountChange('updowncount','max', e.target.value)}
            />
          </p>
        </div>

        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Comm. Count</label>
          <p className={styles.textRange}>
            <input
              type="text"
              placeholder="Min"
              className={styles.textInput}
              value={modalState.commcount.min || ''}
              onChange={(e) => handlePageCountChange('commcount','min', e.target.value)}
            />

            <input
              type="text"
              placeholder="Max"
              className={styles.textInput}
              value={modalState.commcount.max || ''}
              onChange={(e) => handlePageCountChange('commcount','max', e.target.value)}
            />
          </p>
        </div>

        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Share Count</label>
          <p className={styles.textRange}>
            <input
              type="text"
              placeholder="Min"
              className={styles.textInput}
              value={modalState.sharecount.min || ''}
              onChange={(e) => handlePageCountChange('sharecount','min', e.target.value)}
            />

            <input
              type="text"
              placeholder="Max"
              className={styles.textInput}
              value={modalState.sharecount.max || ''}
              onChange={(e) => handlePageCountChange('sharecount','max', e.target.value)}
            />
          </p>
        </div>
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Bookmark Count</label>
          <p className={styles.textRange}>
            <input
              type="text"
              placeholder="Min"
              className={styles.textInput}
              value={modalState.bookmarkcount.min || ''}
              onChange={(e) => handlePageCountChange('bookmarkcount','min', e.target.value)}
            />

            <input
              type="text"
              placeholder="Max"
              className={styles.textInput}
              value={modalState.bookmarkcount.max || ''}
              onChange={(e) => handlePageCountChange('bookmarkcount','max', e.target.value)}
            />
          </p>
        </div>    
            
      
      </div>
    </main>
  )
}

export default PagesFilter
