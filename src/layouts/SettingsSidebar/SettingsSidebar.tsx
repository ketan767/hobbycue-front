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
    link: '/settings/data-others',
  },
]

const SettingsSidebar: React.FC<Props> = ({ active }) => {
  const pathname = usePathname();
  return (
    <>
      <div className={styles.sidebarContainer}>
        <p className={styles.sidebarTitle}> Settings </p>
        <ul>
          {sidebarItems.map((item: any) => {
            return (
              <Link
                href={item.link}
                key={item.text}
                className={styles.listLink}
              >
              <div className={`${styles.listItem} ${pathname===item.link?styles.activeLink:""}`}>
                  {item.text}</div>
              </Link>
            )
          })}
        </ul>
      </div>
    </>
  )
}

export default SettingsSidebar
