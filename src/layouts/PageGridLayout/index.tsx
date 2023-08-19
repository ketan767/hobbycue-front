import React from 'react'
import styles from './PageGridLayout.module.css'

type Props = {
  children: React.ReactNode
  column: 2 | 3
  responsive?: boolean
  customStyles?: string
}

const PageGridLayout: React.FC<Props> = ({
  children,
  column,
  responsive,
  customStyles,
}) => {
  return (
    <section className={` ${styles['container']}`}>
      <div
        data-column={column}
        className={`site-container ${styles['grid-container']} ${
          responsive ? 'responsive' : ''
        } ${customStyles || ''}`}
      >
        {children}
      </div>
    </section>
  )
}

export default PageGridLayout
