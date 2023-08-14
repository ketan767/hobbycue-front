import React, { useRef, useState } from 'react';
import { useDispatch } from 'react-redux'
import styles from './ListingHeader.module.css'
import { openModal } from '@/redux/slices/modal';
import useOutsideClick from '@/hooks/useOutsideClick';

type Props = {
  handleClose?: any
}

const Dropdown: React.FC<Props> = ({ handleClose }) => {
  const dispatch = useDispatch()
  const ref = useRef(null)
  useOutsideClick(ref, handleClose)
  const claimModal = () => {
    dispatch(openModal({ type: 'claim-listing', closable: true }))
  }

  return (
    <div className={styles['dropdown']} ref={ref}>
      <ul className={styles['customList']}>
        <li>Claim</li>
        <li>Review</li>
        <li>Report</li>
      </ul>
    </div>
  )
}

export default Dropdown
