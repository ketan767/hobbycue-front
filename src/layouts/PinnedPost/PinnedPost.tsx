import React from 'react'
import styles from './styles.module.css'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'

type Props = {
  children: React.ReactNode
  title: String
}

const PostWrapper: React.FC<Props> = ({ children, title }) => {
  return <div className={`${styles['wrapper']}`}>
   <p className={styles.title}>
      {title}
   </p>
   {children}</div>
}

export default PostWrapper
