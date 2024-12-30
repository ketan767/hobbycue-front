import React, { useState, useEffect } from 'react'
import styles from './StatusDropdown.module.css'
import selectIcon from '@/assets/svg/select_icon.svg'
import InProgressIcon from '@/assets/svg/In_progress_icon.svg'
import AcceptedIcon from '@/assets/svg/checked_icon.svg'
import RejectedIcon from '@/assets/svg/cancel_icon.svg'
import Image from 'next/image'
import { MenuItem, Select } from '@mui/material'

const statusOptions = [
  { label: 'New', icon: selectIcon, color: 'gray', status: 'New' },
  {
    label: 'In Progress',
    icon: InProgressIcon,
    color: 'blue',
    status: 'in_progress',
  },
  { label: 'Accepted', icon: AcceptedIcon, color: 'green', status: 'accepted' },
  { label: 'Rejected', icon: RejectedIcon, color: 'red', status: 'rejected' },
]

const StatusDropdown: React.FC<{
  status?: string
  onStatusChange: (status: any) => void
}> = ({ status, onStatusChange }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState(
    statusOptions.find((option) => option.status === status) ||
      statusOptions[0],
  )

  useEffect(() => {
    setSelectedStatus(
      statusOptions.find((option) => option.status === status) ||
        statusOptions[0],
    )
  }, [status])

  const toggleDropdown = () => setIsOpen(!isOpen)

  const selectStatus = (status: any) => {
    setSelectedStatus(status)
    setIsOpen(false)
    onStatusChange(status)
  }

  return (
    <div className={styles.dropdown} onClick={toggleDropdown}>
      <button className={styles.dropdownButton} onClick={toggleDropdown}>
        <span style={{ color: selectedStatus.color}}>
          <Image
            src={selectedStatus.icon}
            alt={selectedStatus.label}
            // width={24}
            // height={24}
          />
          <span className={styles["status-text"]}>{status}</span>
        </span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="8"
          height="6"
          style={{
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s ease',
          }}
          viewBox="0 0 8 6"
          fill="none"
        >
          <path
            d="M6.58665 0.890312L3.99999 3.47698L1.41332 0.890312C1.15332 0.630313 0.73332 0.630313 0.47332 0.890312C0.21332 1.15031 0.21332 1.57031 0.47332 1.83031L3.53332 4.89031C3.79332 5.15031 4.21332 5.15031 4.47332 4.89031L7.53332 1.83031C7.79332 1.57031 7.79332 1.15031 7.53332 0.890312C7.27332 0.636979 6.84665 0.630313 6.58665 0.890312Z"
            fill="#6D747A"
          />
        </svg>
      </button>
      {isOpen && (
        // <ul className={styles.dropdownMenu}>
        //   {statusOptions.map((status) => (
        //     <li
        //       key={status.label}
        //       className={styles.dropdownItem}
        //       onClick={() => selectStatus(status)}
        //     >
        //       <Image
        //         src={status.icon}
        //         alt={status.label}
        //         width={24}
        //         height={24}
        //       />
        //       <span className={styles.dropdownLabel}>{status.label}</span>
        //     </li>
        //   ))}
        // </ul>
        <Select open className={`${styles.dropdownMenu} ${styles['hideSelect']}`}>
          {statusOptions.map((status,i)=><MenuItem key={i}>
          <li
              key={status.label}
              className={styles.dropdownItem}
              onClick={() => selectStatus(status)}
            >
              <Image
                src={status.icon}
                alt={status.label}
                width={24}
                height={24}
              />
              <span className={styles.dropdownLabel}>{status.label}</span>
            </li>
          </MenuItem>)}
        </Select>
      )}
    </div>
  )
}

export default StatusDropdown
