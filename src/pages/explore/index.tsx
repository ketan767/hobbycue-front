import { withAuth } from '@/navigation/withAuth'
import React from 'react'
import styles from '@/styles/ExplorePage.module.css'

type Props = {}

const Explore: React.FC<Props> = (props) => {
  return (
    <div className={styles['explore-wrapper']}>
      <div className={styles.explore}>
        <p>
          The Explore functionality is under development. You may use the search
          feature in the top navigation bar
        </p>
      </div>
    </div>
  )
}

export default Explore
