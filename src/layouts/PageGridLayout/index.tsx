import React from 'react'
import styles from './PageGridLayout.module.css'

type Props = {
  children: React.ReactNode
  column: 2 | 3
  responsive?: boolean
}

const PageGridLayout: React.FC<Props> = ({ children, column, responsive }) => {
  return (
    <>
      <section className={` ${styles['container']}`}>
        <div
          data-column={column}
          className={`site-container ${styles['grid-container']} ${responsive ? 'responsive' : ''} `}
        >
          {children}
        </div>
      </section>
    </>
  )
}

export default PageGridLayout
