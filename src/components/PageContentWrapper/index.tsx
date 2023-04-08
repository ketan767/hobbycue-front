import React from 'react'
import styles from './PageContentWrapper.module.css'

type Props = {
  children: React.ReactNode
}

const PageContentWrapper: React.FC<Props> = ({ children }) => {
  return <div className={styles['wrapper']}>{children}</div>
}

export default PageContentWrapper
