import React, { useState } from 'react'
import Image from 'next/image'
import styles from './styles.module.css'
import LeftIcon from '@/assets/svg/left.svg'
import RightIcon from '@/assets/svg/right.svg'

type Props = {
  setActiveIdx: any
  activeIdx: number
  images: any
}

const Slider: React.FC<Props> = ({ images }) => {
  const [activeIdx, setActiveIdx] = useState(0)

  const handleChange = (e: any, idx: number) => {
    if (idx + 1 > images.length) {
      setActiveIdx(0)
    } else if (idx < 0) {
      setActiveIdx(images.length - 1)
    } else {
      setActiveIdx(idx)
    }
    e.stopPropagation()
    e.preventDefault()
  }

  return (
    <div className={styles.container}>
      {images.map((item: any, idx: number) => {
        return (
          <img
            src={item}
            alt="img"
            className={`${styles.image} ${
              idx === activeIdx
                ? styles.active
                : idx < activeIdx
                ? styles.prev
                : styles.next
            }`}
            onClick={() => setActiveIdx(idx)}
          />
        )
      })}
      {images.length > 1 && (
        <>
          <Image
            src={LeftIcon}
            alt="left"
            className={`${styles.icon} ${styles.leftIcon}`}
            onClick={(e) => handleChange(e, activeIdx - 1)}
          />
          <Image
            src={RightIcon}
            alt="left"
            className={`${styles.icon} ${styles.rightIcon}`}
            onClick={(e) => handleChange(e, activeIdx + 1)}
          />
        </>
      )}
    </div>
  )
}

export default Slider
