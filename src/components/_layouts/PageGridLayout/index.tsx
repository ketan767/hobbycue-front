import React from 'react'
import styles from './PageGridLayout.module.css'

type Props = {
  children: React.ReactNode
  column: 2 | 3
}

const PageGridLayout: React.FC<Props> = ({ children, column }) => {
  return (
    <>
      <section className={` ${styles['container']}`}>
        <div data-column={column} className={`site-container ${styles['grid-container']}`}>
          {children}
        </div>
      </section>
    </>
  )
}

export default PageGridLayout
