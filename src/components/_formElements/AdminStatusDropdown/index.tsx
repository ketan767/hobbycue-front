import React, { useState, useEffect, useRef } from 'react';
import styles from './styles.module.css';
import selectIcon from '@/assets/svg/select_icon.svg';
import InProgressIcon from '@/assets/svg/In_progress_icon.svg';
import AcceptedIcon from '@/assets/svg/checked_icon.svg';
import RejectedIcon from '@/assets/svg/cancel_icon.svg';
import Image from 'next/image';

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
];

const StatusDropdown: React.FC<{
  status?: string;
  isOpen?: boolean;
  onToggle?: () => void;
  onStatusChange: (status: any) => void;
  long?: boolean;
}> = ({ status, isOpen, onToggle, onStatusChange, long }) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isControlled = isOpen !== undefined && onToggle !== undefined;
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isDropdownOpen = isControlled ? isOpen : internalIsOpen;

  const selectedStatus =
    statusOptions.find((option) => option.status === status) || statusOptions[0];

  const toggleDropdown = () => {
    if (isControlled) {
      onToggle?.();
    } else {
      setInternalIsOpen((prev) => !prev);
    }
  };

  const closeDropdown = () => {
    if (isControlled) {
      onToggle?.();
    }
    setInternalIsOpen(false);
  };

  const selectStatus = (status: any) => {
    onStatusChange(status);
    closeDropdown();
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        closeDropdown();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className={styles.dropdown} ref={dropdownRef}>
      <button
        className={styles.dropdownButton}
        onClick={toggleDropdown}
        aria-expanded={isDropdownOpen}
        style={{
          width: long ? '180px' : '66px',
          justifyContent: long ? 'space-between' : 'space-around',
          padding: long ? '4px' : '0px',
        }}
      >
        
        <span>
          <Image src={selectedStatus.icon} alt={selectedStatus.label} />
          {long&&(
          <span className={styles.statusLabel}>
          {selectedStatus.label}
        </span>
        )}
        </span>
        
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="8"
          height="6"
          style={{
            transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
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
      {isDropdownOpen && (
        <ul
          className={styles.dropdownMenu}
          style={{
            width: long ? '180px' : '140px',
            ...(long ? { left: '0px' } : { right: '0px' }),
          }}
        >
          {statusOptions.map((status) => (
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
          ))}
        </ul>
      )}
    </div>
  );
};

export default StatusDropdown;

