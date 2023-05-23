import React from 'react'
import PageGridLayout from '@/layouts/PageGridLayout'
import styles from './sidebar.module.css'
import Link from 'next/link'

type Props = { active: any }

const sidebarItems = [
   {
      text: 'Login & Security',
      link: '/settings/login-and-security'
   },
   {
      text: 'Visibility & Notification',
      link: '/settings/visibility-and-notification'
   },
   {
      text: 'Localization & Payments',
      link: '/settings/localization-and-payments'
   },
   {
      text: 'Data & Others',
      link: '/settings/data-and-others'
   },
]

const SettingsSidebar: React.FC<Props> = ({ active }) => {

   console.log('ac', active)
   return (
      <>
         <PageGridLayout column={2}>
            <div className={styles.sidebarContainer}>
               <p className={styles.sidebarTitle}> Settings </p>
               <ul>
                  {sidebarItems.map((item: any) => {
                     return <Link href={item.link} key={item.text} className={styles.listItem}>
                        {item.text}
                     </Link>
                  })}
               </ul>
            </div>
         </PageGridLayout></>
   )
}

export default SettingsSidebar
