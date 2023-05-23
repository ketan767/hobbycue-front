import React from 'react'
import PageGridLayout from '@/layouts/PageGridLayout'
import styles from './settings.module.css'
import Link from 'next/link'
import SettingsSidebar from '@/layouts/SettingsSidebar/SettingsSidebar'

type Props = {}


const Settings: React.FC<Props> = ({ }) => {

   return (
      <>
         <PageGridLayout column={2}>
            <SettingsSidebar active='' />
         </PageGridLayout></>
   )
}

export default Settings
