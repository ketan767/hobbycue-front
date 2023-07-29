import React, { useState } from 'react';
import { useDispatch } from 'react-redux'
import styles from './ListingHeader.module.css'
import { openModal } from '@/redux/slices/modal';

const Dropdown = () => {
  const [selectedOption, setSelectedOption] = useState('option1');
  const dispatch = useDispatch()
  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const claimModal = () => {
    dispatch(openModal({ type: 'claim-listing', closable: true }))
  }

  return (
    <div className="dropdown">
      <ul className={styles['customList']}>
        <li><a className="option1" onClick={claimModal} >claim</a></li>
        <li><a className="option2" >Review</a></li>
        <li><a className="option3" >Report</a></li>
      </ul>
    </div>
  );
};

export default Dropdown;
