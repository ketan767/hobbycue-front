import React from 'react'
import styles from './visibility.module.css'
import PageGridLayout from '@/layouts/PageGridLayout'
import SettingsSidebar from '@/layouts/SettingsSidebar/SettingsSidebar'
import EditIcon from '../../../assets/svg/edit-colored.svg'
import GoogleIcon from '../../../assets/svg/google-icon.svg'
import FacebookIcon from '../../../assets/svg/facebook-icon.svg'
import Image from 'next/image'
import OutlinedButton from '@/components/_buttons/OutlinedButton'
import RadioButton from '@/components/radioButton/radioButton'

type Props = {}
const options = [
   'Everyone',
   'My City',
   'My Pincode',
   'My Locality',
   'My Society',
]
const VisibilityAndNotification: React.FC<Props> = ({ }) => {

   return (
      <>
         <PageGridLayout column={2}>
            <SettingsSidebar active='' />
            <div className={styles.container}>
               <p className={`${styles.textLight} ${styles.title}`}> By default, who can view </p>

               <div className={`${styles.viewOptionContainer}`}>
                  <p className={`${styles.textDark}`}>  View my posts </p>
                  <div>
                     <select name='Select' className={styles.select}>
                        {options.map((item: any) => {
                           return <option key={item} className={styles.option}>
                              {item}
                           </option>
                        })}
                     </select>
                  </div>
               </div>

               <div className={`${styles.viewOptionContainer}`}>
                  <p className={`${styles.textDark}`}>  View my E-Mail ID </p>
                  <div>
                     <select name='Select' className={styles.select}>
                        {options.map((item: any) => {
                           return <option key={item} className={styles.option}>
                              {item}
                           </option>
                        })}
                     </select>
                  </div>
               </div>

               <div className={styles.line}></div>

               <p className={`${styles.textLight} ${styles.title}`}> Notify me when someone </p>
               <div className={styles.notifyEditContainer}>
                  <p className={`${styles.textDark}`}>
                     Mentions me using "@rakesh-shah"
                  </p>
                  <RadioButton active={false} />
               </div>
               <div className={styles.notifyEditContainer}>
                  <p className={`${styles.textDark}`}>
                     Comments on my post
                  </p>
                  <RadioButton active={true} />
               </div>
               <div className={styles.notifyEditContainer}>
                  <p className={`${styles.textDark}`}>
                     Accepts my request to join hobbycue
                  </p>
                  <RadioButton active={true} />
               </div>
               <div className={styles.notifyEditContainer}>
                  <p className={`${styles.textDark}`}>
                     Invites me to join a group
                  </p>
                  <RadioButton active={true} />
               </div>
               <div className={styles.notifyEditContainer}>
                  <p className={`${styles.textDark}`}>
                     Upvotes my content
                  </p>
                  <RadioButton active={true} />
               </div>
               <div className={styles.notifyEditContainer}>
                  <p className={`${styles.textDark}`}>
                     Shares my content
                  </p>
                  <RadioButton active={true} />
               </div>


               <div className={`${styles.viewOptionContainer} ${styles.emailUpdates}`}>
                  <p className={`${styles.textDark}`}>  Email updates </p>
                  <div>
                     <select name='Select' className={styles.select}>
                        {options.map((item: any) => {
                           return <option key={item} className={styles.option}>
                              {item}
                           </option>
                        })}
                     </select>
                  </div>
               </div>
            </div>
         </PageGridLayout>
      </>

   )
}

export default VisibilityAndNotification
