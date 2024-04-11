import React from 'react'
import PageGridLayout from '@/layouts/PageGridLayout'
import styles from './sidebar.module.css'
import Link from 'next/link'
import { RootState } from '@/redux/store'
import { useSelector } from 'react-redux'
import { usePathname } from 'next/navigation'

type Props = { active: any }

const sidebarItems = [
  {
    text: 'Login & Security',
    link: '/settings/login-security',
  },
  {
    text: 'Visibility & Notification',
    link: '/settings/visibility-notification',
  },
  {
    text: 'Localization & Payments',
    link: '/settings/localization-payments',
  },
  {
    text: 'Account & Data',
    link: '/settings//account-data',
  },
]

const SettingsSidebar: React.FC<Props> = ({ active }) => {
  const pathname = usePathname()
  return (
    <>
      <div className={styles.sidebarContainer}>
        <h1 className={styles.sidebarTitle}> Settings </h1>
        <ul className={styles.sidebarListParent}>
          {sidebarItems.map((item: any) => {
            return (
              <Link
                href={item.link}
                key={item.text}
                className={styles.listLink}
              >
                <div
                  className={`${styles.listItem} ${
                    pathname === item.link ? styles.activeLink : ''
                  }`}
                >
                  {item.text}
                </div>
              </Link>
            )
          })}
        </ul>
      </div>
    </>
  )
}

export default SettingsSidebar
