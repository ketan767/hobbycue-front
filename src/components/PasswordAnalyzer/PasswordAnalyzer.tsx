import React, { useState, useEffect } from 'react'
import styles from './styles.module.css'

type Props = {
  strength: any
}
const PasswordAnalyzer: React.FC<Props> = ({ strength }) => {
  return (
    <div
      className={`${styles['container']} ${
        strength <= 1
          ? styles['strength-1']
          : strength === 2
          ? `${styles['strength-2']} ${styles['strength-1']}`
          : strength >= 3
          ? `${styles['strength-3']} ${styles['strength-2']} ${styles['strength-1']}`
          : ''
      } `}
    >
      <div className={styles['lines']}>
        <div className={`${styles['line']} ${styles['red']} `}></div>
        <div className={`${styles['line']} ${styles['yellow']} `}></div>
        <div className={`${styles['line']} ${styles['green']} `}></div>
      </div>
      <p className={styles['message']}>
        {strength >= 3
          ? 'Strong password'
          : strength === 2
          ? 'Could be stronger'
          : 'Too weak'}
      </p>
    </div>
  )
}

export default PasswordAnalyzer
