import React from 'react'
import Image from 'next/image'
import styles from './localization.module.css'
import PageGridLayout from '@/layouts/PageGridLayout'
import SettingsSidebar from '@/layouts/SettingsSidebar/SettingsSidebar'
import AddIcon from '../../../assets/svg/add.svg'
import EditIcon from '../../../assets/svg/vertical-bars.svg'
import RadioUnselected from '../../../assets/svg/radio-unselected.svg'
import RadioSelected from '../../../assets/svg/radio-selected.svg'
import InputSelect from '@/components/InputSelect/inputSelect'

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
               <div className={`${styles.flex} ${styles.addSectionContainer}`}>
                  <p className={`${styles.textLight}`}> Addresses </p>
                  <div className={`${styles.flex}`}>
                     <Image src={AddIcon} width={16} height={16} alt='add' className={styles.addIcon} />
                     <p className={styles.textColored}> add new location</p>
                  </div>
               </div>

               <div className={`${styles.cardContainer}`}>
                  <div className={`${styles.addressLeft}`}>
                     <Image src={RadioUnselected} width={16} height={16} alt='radio' className={styles.addIcon} />
                     <div className={styles.addressContent}>
                        <p className={`${styles.textDark} ${styles.labelText}`}>  Home Address 1 </p>
                        <p className={`${styles.textLight} ${styles.addressText}`}>
                           <span className={styles.addressText}>
                              33/B Home Sweet Home, ABC Road.
                           </span>
                           <span className={styles.addressText}>
                              Valsad 360001
                           </span>
                           <span className={styles.addressText}>
                              Gujarat, India
                           </span>
                        </p>
                     </div>
                  </div>
                  <Image src={EditIcon} width={16} height={16} alt='edit' className={styles.addIcon} />
               </div>

               <div className={`${styles.cardContainer}`}>
                  <div className={`${styles.addressLeft}`}>
                     <Image src={RadioUnselected} width={16} height={16} alt='radio' className={styles.addIcon} />
                     <div className={styles.addressContent}>
                        <p className={`${styles.textDark} ${styles.labelText}`}>  Office Address 1 </p>
                        <p className={`${styles.textLight} ${styles.addressText}`}>
                           <span className={styles.addressText}>
                              33/B Home Sweet Home, ABC Road.
                           </span>
                           <span className={styles.addressText}>
                              Valsad 360001
                           </span>
                           <span className={styles.addressText}>
                              Gujarat, India
                           </span>
                        </p>
                     </div>
                  </div>
                  <Image src={EditIcon} width={16} height={16} alt='edit' className={styles.addIcon} />
               </div>
               <div className={`${styles.cardContainer}`}>
                  <div className={`${styles.addressLeft}`}>
                     <Image src={RadioUnselected} width={16} height={16} alt='radio' className={styles.addIcon} />
                     <div className={styles.addressContent}>
                        <p className={`${styles.textDark} ${styles.labelText}`}>  Home Address 2 </p>
                        <p className={`${styles.textLight} ${styles.addressText}`}>
                           <span className={styles.addressText}>
                              33/B Home Sweet Home, ABC Road.
                           </span>
                        </p>
                     </div>
                  </div>
                  <Image src={EditIcon} width={16} height={16} alt='edit' className={styles.addIcon} />
               </div>

               <div className={styles.line}></div>

               <div className={`${styles.flex} ${styles.addSectionContainer}`}>
                  <p className={`${styles.textLight}`}> Payment options </p>
                  <div className={`${styles.flex}`}>
                     <Image src={AddIcon} width={16} height={16} alt='add' className={styles.addIcon} />
                     <p className={styles.textColored}> add a credit or debit card </p>
                  </div>
               </div>

               <div className={`${styles.cardContainer}`}>
                  <div className={`${styles.addressLeft}`}>
                     <Image src={RadioUnselected} width={16} height={16} alt='radio' className={styles.addIcon} />
                     <div className={styles.addressContent}>
                        <p className={`${styles.textDark} ${styles.labelText}`}>  Visa ending in 1234 </p>
                        <p className={`${styles.textLight} ${styles.addressText}`}>
                           <span className={styles.addressText}>
                              Expire: 09/2070F
                           </span>
                        </p>
                     </div>
                  </div>
                  <Image src={EditIcon} width={16} height={16} alt='edit' className={styles.addIcon} />
               </div>
               <div className={`${styles.cardContainer}`}>
                  <div className={`${styles.addressLeft}`}>
                     <Image src={RadioUnselected} width={16} height={16} alt='radio' className={styles.addIcon} />
                     <div className={styles.addressContent}>
                        <p className={`${styles.textDark} ${styles.labelText}`}>  RuPay ending in 1234 </p>
                        <p className={`${styles.textLight} ${styles.addressText}`}>
                           <span className={styles.addressText}>
                              Expire: 09/2070F
                           </span>
                        </p>
                     </div>
                  </div>
                  <Image src={EditIcon} width={16} height={16} alt='edit' className={styles.addIcon} />
               </div>

               <p className={`${styles.textLight}`}> Localization </p>

               <div className={`${styles.flex} ${styles.localizationContainer}`}>
                  <p className={`${styles.textDark} ${styles.labelText}`}>  Language </p>
                  <InputSelect options={options} />
               </div>
               <div className={`${styles.flex} ${styles.localizationContainer}`}>
                  <p className={`${styles.textDark} ${styles.labelText}`}>  Distance </p>
                  <InputSelect options={options} />
               </div>
               <div className={`${styles.flex} ${styles.localizationContainer}`}>
                  <p className={`${styles.textDark} ${styles.labelText}`}>  Currency </p>
                  <InputSelect options={options} />
               </div>

            </div>
         </PageGridLayout>
      </>

   )
}

export default VisibilityAndNotification
