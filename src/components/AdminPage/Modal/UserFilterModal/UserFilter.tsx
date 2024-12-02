import React, { useRef } from 'react'
import Image from 'next/image'
import ToggleButton from '@/components/_buttons/ToggleButton'
import styles from './UserFilter.module.css'

import GoogleIcon from '@/assets/svg/admin_google.svg'
import MailIcon from '@/assets/svg/admin_email.svg'
import FacebookIcon from '@/assets/svg/admin_facebook.svg'
import { ModalState } from '@/pages/admin/users'

interface UserFilterProps {
  modalState: ModalState
  setModalState?: React.Dispatch<React.SetStateAction<ModalState>>
  setIsModalOpen?: React.Dispatch<React.SetStateAction<boolean>>
  setApplyFilter?: React.Dispatch<React.SetStateAction<boolean>>
}

const formatDate = (date: string): string => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }
  return new Date(date).toLocaleDateString(undefined, options)
}

const UserFilter: React.FC<UserFilterProps> = ({
  modalState,
  setModalState,
  setIsModalOpen,
  setApplyFilter,
}) => {
  const startDateRef = useRef<HTMLInputElement>(null)
  const endDateRef = useRef<HTMLInputElement>(null)

  const handleOnboardedChange = (value: string) => {
    setModalState?.((prev) => ({ ...prev, onboarded: value }))
  }

  const handleDateChange = (field: 'start' | 'end') => {
    const ref = field === 'start' ? startDateRef.current : endDateRef.current
    if (ref) {
      setModalState?.((prev) => ({
        ...prev,
        joined: { ...prev.joined, [field]: ref.value },
      }))
    }
  }

  const handleLoginModeChange = (mode: string) => {
    setModalState?.((prev) => {
      const exists = prev.loginModes.includes(mode)
      const updatedModes = exists
        ? prev.loginModes.filter((m) => m !== mode)
        : [...prev.loginModes, mode]
      return { ...prev, loginModes: updatedModes }
    })
  }

  const handlePageCountChange = (field: 'min' | 'max', value: string) => {
    setModalState?.((prev) => ({
      ...prev,
      pageCount: { ...prev.pageCount, [field]: value },
    }))
  }

  const handleStatusChange = (value: string) => {
    setModalState?.((prev) => ({ ...prev, status: value }))
  }

  const handleApply = () => {
    setApplyFilter?.(true)
    setIsModalOpen?.(false)
  }

  return (
    <main className={styles.modal}>
      <div className={styles.modalHeader}>
        <h2 className={styles.modalTitle}>Filter</h2>
        <button className={styles.applyButton} onClick={handleApply}>
          Apply
        </button>
      </div>
      <div className={styles.modalBody}>
        {/* Onboarded */}
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Onboarded</label>
          <fieldset className={styles.fieldset}>
            {['Yes', 'No', 'Both'].map((option) => (
              <p key={option} className={styles.radioGroup}>
                <input
                  type="radio"
                  name="onboarded"
                  id={`onboarded-${option}`}
                  value={option}
                  checked={modalState.onboarded === option}
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
          <label className={styles.filterLabel}>Joined</label>
          <p className={styles.dateRange}>
            <button
              className={styles.dateButton}
              onClick={() => startDateRef.current?.showPicker()}
            >
              {modalState.joined.start
                ? formatDate(modalState.joined.start)
                : 'Start Date'}
            </button>
            <input
              type="date"
              ref={startDateRef}
              className={styles.hiddenDateInput}
              onChange={() => handleDateChange('start')}
            />
            <span>-</span>
            <button
              className={styles.dateButton}
              onClick={() => endDateRef.current?.showPicker()}
            >
              {modalState.joined.end
                ? formatDate(modalState.joined.end)
                : 'End Date'}
            </button>
            <input
              type="date"
              ref={endDateRef}
              className={styles.hiddenDateInput}
              onChange={() => handleDateChange('end')}
            />
          </p>
        </div>

        {/* Login Mode */}
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Login Mode</label>
          <fieldset className={styles.LoginMode}>
            {[
              { name: 'Google', icon: GoogleIcon },
              { name: 'Email', icon: MailIcon },
              { name: 'Facebook', icon: FacebookIcon },
            ].map((mode) => (
              <p key={mode.name} className={styles.checkboxGroup}>
                <input
                  type="checkbox"
                  id={`login-${mode.name}`}
                  value={mode.name.toLowerCase()}
                  checked={modalState.loginModes.includes(
                    mode.name.toLowerCase(),
                  )}
                  onChange={() =>
                    handleLoginModeChange(mode.name.toLowerCase())
                  }
                  className={styles.checkboxInput}
                />
                <label
                  htmlFor={`login-${mode.name}`}
                  className={styles.checkboxLabel}
                >
                  <Image
                    width={20}
                    height={20}
                    src={mode.icon}
                    alt={`${mode.name} Icon`}
                  />
                </label>
              </p>
            ))}
          </fieldset>
        </div>

        {/* Page Count */}
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Page Count</label>
          <p className={styles.textRange}>
            <input
              type="text"
              placeholder="Min"
              className={styles.textInput}
              value={modalState.pageCount.min || ''}
              onChange={(e) => handlePageCountChange('min', e.target.value)}
            />
            <span className={styles.rangeSeparator}>-</span>
            <input
              type="text"
              placeholder="Max"
              className={styles.textInput}
              value={modalState.pageCount.max || ''}
              onChange={(e) => handlePageCountChange('max', e.target.value)}
            />
          </p>
        </div>

        {/* Status */}
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Status</label>
          <ToggleButton
            isOn={modalState.status === 'active'}
            handleToggle={() =>
              handleStatusChange(
                modalState.status === 'active' ? 'deactivate' : 'active',
              )
            }
          />
          <p className={styles.radioGroup}>
            <input
              type="radio"
              name="status"
              id="status-both"
              checked={modalState.status === 'both'}
              onChange={() => handleStatusChange('both')}
              className={styles.radioInput}
            />
            <label htmlFor="status-both" className={styles.radioLabel}>
              Both
            </label>
          </p>
        </div>
      </div>
    </main>
  )
}

export default UserFilter
