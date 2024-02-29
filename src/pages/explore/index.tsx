import { withAuth } from '@/navigation/withAuth'
import React from 'react'
import styles from '@/styles/ExplorePage.module.css'
import PageGridLayout from '@/layouts/PageGridLayout'
import ProfileSwitcher from '@/components/ProfileSwitcher/ProfileSwitcher'

type Props = {}

const Explore: React.FC<Props> = (props) => {
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
              <h1>Explore</h1>
            </div>
          </header>
        </section>
      </aside>
      <div className={styles['explore-wrapper']}>
        <div className={styles.explore}>
          <p>
            The Explore functionality is under development. Use the Search box
            at the top to look up pages on your hobby by other users. If you
            don't find any pages, you may Add Listing Page from the menu at the
            top right corner.{' '}
          </p>
        </div>
      </div>
    </PageGridLayout>
  )
}

export default Explore
