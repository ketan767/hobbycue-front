import { withAuth } from '@/navigation/withAuth'
import React from 'react'
import styles from '@/styles/ExplorePage.module.css'

type Props = {}

const Bookmarks: React.FC<Props> = (props) => {
  return (
    <div className={styles['explore-wrapper']}>
      <div className={styles.explore}>
        <p>This feature is under development. Come back soon to view this</p>
      </div>
    </div>
  )
}

export default Bookmarks
