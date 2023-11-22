import React, { useEffect } from 'react'
import styles from './style.module.css'
import { Dialog, Modal, Grow, Fade } from '@mui/material'
import Image from 'next/image'

type Props = {}

const PreLoader: React.FC<Props> = (props) => {
  useEffect(() => {
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [])

  return (
    <section className={styles['loader-wrapper']}>
      {/* <Image src={'/logo-trans.png'} priority={true} width={300} height={61} alt="Logo" /> */}
    </section>
  )
}

export default PreLoader
