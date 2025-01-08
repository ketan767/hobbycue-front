import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import ToggleButton from '@/components/_buttons/ToggleButton'
import styles from './HobbiesFilter.module.css'

import GoogleIcon from '@/assets/svg/admin_google.svg'
import MailIcon from '@/assets/svg/admin_email.svg'
import FacebookIcon from '@/assets/svg/admin_facebook.svg'
// import { ModalState } from '@/pages/admin/users'
import MyDatePicker from '../../Users/DatePicker'
import StatusDropdown from '@/components/_formElements/AdminStatusDropdown'
// import StatusDropdown from '@/components/_formElements/StatusDropdown'

export interface HobbyModalState {
  hobby: string; // Corresponds to the "Hobby" input field
  genre: string; // Corresponds to the "Genre/Style" input field
  requestedBy: string; // Corresponds to the "Requested By" input field
  requestedOn: {
    start: string | Date; // Start date of the "Requested On" range
    end: string | Date;   // End date of the "Requested On" range
  };
  status: string; 
}


interface UserFilterProps {
  modalState: HobbyModalState
  setModalState?: React.Dispatch<React.SetStateAction<HobbyModalState>>
  setIsModalOpen?: React.Dispatch<React.SetStateAction<boolean>>
  setApplyFilter?: React.Dispatch<React.SetStateAction<boolean>>
  onApplyFilter?: ()=>void;
}

export const formatDate = (date: string | Date): string => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }
  return new Date(date).toLocaleDateString(undefined, options)
}

const HobbiesFilter: React.FC<UserFilterProps> = ({
  modalState,
  setModalState,
  setIsModalOpen,
  setApplyFilter,
  onApplyFilter
}) => {
  const modalRef = useRef<HTMLDivElement | null>(null)
  const [showStartDateCalender, setShowStartDateCalender] = useState(false);
  const [showEndDateCalender, setShowEndDateCalender] = useState(false);

  const handleDateChange = (field: 'start' | 'end', value: Date) => {
    setModalState?.((prev) => ({
      ...prev,
      requestedOn: { ...prev.requestedOn, [field]: value },
    }));
  };

  const handleApply = () => {
    setApplyFilter?.(true);
    onApplyFilter?.()
    setIsModalOpen?.(false);
  };

  const handleClear = () => {
    setModalState?.({
      hobby: '',
      genre: '',
      requestedBy: '',
      requestedOn: { start: '', end: '' },
      status: '',
    });
    setIsModalOpen?.(false);
  };

  // Close modal on clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setIsModalOpen?.(false);
      }
    }
  
    // Close modal on pressing 'Esc'
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsModalOpen?.(false);
      }
    }
  
    useEffect(() => {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleKeyDown)
  
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
        document.removeEventListener('keydown', handleKeyDown)
      }
    }, [])

  const handleStatusChange = (value: string) => {
    setModalState?.((prev) => ({ ...prev, status: value }));
  };

  return (
    <main className={styles.modal} ref={modalRef}>
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
        {/* Hobby */}
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Hobby</label>
          <input
            className={styles.input}
            type="text"
            placeholder="Keywords"
            value={modalState.hobby}
            onChange={(e) =>
              setModalState?.((prev) => ({ ...prev, hobby: e.target.value }))
            }
          />
        </div>

        {/* Genre/Style */}
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Genre/Style</label>
          <input
            className={styles.input}
            type="text"
            // placeholder="Keywords"
            value={modalState.genre}
            onChange={(e) =>
              setModalState?.((prev) => ({ ...prev, genre: e.target.value }))
            }
          />
        </div>

        {/* Requested By */}
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Requested By</label>
          <input
            className={styles.input}
            type="text"
            placeholder="Requested By"
            value={modalState.requestedBy}
            onChange={(e) =>
              setModalState?.((prev) => ({
                ...prev,
                requestedBy: e.target.value,
              }))
            }
          />
        </div>

        {/* Requested On */}
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Requested On</label>
          <p className={styles.dateRange}>
            <button
              className={styles.dateButton}
              onClick={() => setShowStartDateCalender((prev) => !prev)}
            >
              {modalState.requestedOn.start
                ? formatDate(modalState.requestedOn.start)
                : 'start'}
            </button>

            {showStartDateCalender && (
              <MyDatePicker
                updateState={() => setShowStartDateCalender(false)}
                handleDatePick={(date) => handleDateChange('start', date)}
              />
            )}

            <span>-</span>
            <button
              className={styles.dateButton}
              onClick={() => setShowEndDateCalender((prev) => !prev)}
            >
              {modalState.requestedOn.end
                ? formatDate(modalState.requestedOn.end)
                : 'end'}
            </button>

            {showEndDateCalender && (
              <MyDatePicker
              minDate={new Date(modalState.requestedOn.start)}
                updateState={() => setShowEndDateCalender(false)}
                handleDatePick={(date) => handleDateChange('end', date)}
              />
            )}
          </p>
        </div>

        {/* Status */}
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Status</label>
          
          <StatusDropdown status = {modalState.status} onStatusChange={(status)=>handleStatusChange(status.status)
          } long={true}/>
        </div>
      </div>
    </main>
  );
};


export default HobbiesFilter
