import React from 'react'
import styles from './PageContentBox.module.css'

type Props = {
  children: React.ReactNode
}

const PageContentBox: React.FC<Props> = ({ children }) => {
  return <div className={styles['wrapper']}>{children}</div>
}

export default PageContentBox
