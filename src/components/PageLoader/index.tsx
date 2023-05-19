import React from 'react'
import styles from './style.module.css'
import { Dialog, Modal, Grow, Fade } from '@mui/material'

type Props = {}

const PageLoader: React.FC<Props> = (props) => {
  return (
    <section className={styles['loader-wrapper']}>
      <div className={styles['loading-card']}></div>
    </section>
  )
}

export default PageLoader
