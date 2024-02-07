import { withAuth } from '@/navigation/withAuth'
import React from 'react'
import styles from '@/styles/ExplorePage.module.css'
import PageGridLayout from '@/layouts/PageGridLayout'
import ProfileSwitcher from '@/components/ProfileSwitcher/ProfileSwitcher'

type Props = {}

const MyActivity: React.FC<Props> = (props) => {
  return (
    <PageGridLayout column={2}>
      <aside className={`${styles['community-left-aside']} custom-scrollbar`}>
        <div className={styles.profileSwitcherWrapper}>
          <ProfileSwitcher />
        </div>
        <section
          className={`content-box-wrapper ${styles['hobbies-side-wrapper']}`}
        >
          <header className={styles['header']}>
            <div className={styles['heading']}>
              <h1>Activity</h1>
            </div>
          </header>
        </section>
      </aside>
      <div className={styles['explore-wrapper']}>
        <div className={styles.explore}>
          <p>This feature is under development. Come back soon to view this</p>
        </div>
      </div>
    </PageGridLayout>
  )
}

export default MyActivity
