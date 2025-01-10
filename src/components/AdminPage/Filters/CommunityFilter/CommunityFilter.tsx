import React, { useEffect, useRef, useState } from 'react'
import styles from './CommunityFilter.module.css'
export interface CommunitiesModalState {
  hobby: string; // Corresponds to the "Hobby" input field
  Location: string; // Corresponds to the "Location" input field
  pageCount: { min: string; max: string }
  userCount : { min: string; max: string } 
}


interface UserFilterProps {
  modalState: CommunitiesModalState
  setModalState?: React.Dispatch<React.SetStateAction<CommunitiesModalState>>
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

const CommunityFilter: React.FC<UserFilterProps> = ({
  modalState,
  setModalState,
  setIsModalOpen,
  setApplyFilter,
  onApplyFilter
}) => {
  const modalRef = useRef<HTMLDivElement | null>(null)

  const handlePageCountChange = (field: 'min' | 'max', value: string) => {
    setModalState?.((prev) => ({
      ...prev,
      pageCount: { ...prev.pageCount, [field]: value },
    }))
  }

  const handleUserCountChange = (field: 'min' | 'max', value: string) => {
    setModalState?.((prev) => ({
      ...prev,
      pageCount: { ...prev.userCount, [field]: value },
    }))
  }

  const handleApply = () => {
    setApplyFilter?.(true);
    onApplyFilter?.()
    setIsModalOpen?.(false);
  };

  const handleClear = () => {
    setModalState?.({
      hobby: '',
      Location: '',
      userCount: { min: '', max: '' },
      pageCount: { min: '', max: '' }
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

        {/* Location */}
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Location</label>
          <input
            className={styles.input}
            type="text"
            // placeholder="Keywords"
            value={modalState.Location}
            onChange={(e) =>
              setModalState?.((prev) => ({ ...prev, Location: e.target.value }))
            }
          />
        </div>

        {/* Post */}
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Post Count</label>
          <p className={styles.textRange}>
            <input
              type="text"
              placeholder="Min"
              className={styles.textInput}
              value={modalState.pageCount.min || ''}
              onChange={(e) => handlePageCountChange('min', e.target.value)}
            />

            <input
              type="text"
              placeholder="Max"
              className={styles.textInput}
              value={modalState.pageCount.max || ''}
              onChange={(e) => handlePageCountChange('max', e.target.value)}
            />
          </p>
        </div>

        {/* User */}
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>User Count</label>
          <p className={styles.textRange}>
            <input
              type="text"
              placeholder="Min"
              className={styles.textInput}
              value={modalState.userCount.min || ''}
              onChange={(e) => handleUserCountChange('min', e.target.value)}
            />
            <span className={styles.rangeSeparator}/>
            <input
              type="text"
              placeholder="Max"
              className={styles.textInput}
              value={modalState.userCount.max || ''}
              onChange={(e) => handleUserCountChange('max', e.target.value)}
            />
          </p>
        </div>


       
      </div>
    </main>
  );
};


export default CommunityFilter
