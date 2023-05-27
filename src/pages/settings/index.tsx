import React from 'react'
import PageGridLayout from '@/layouts/PageGridLayout'
import styles from './settings.module.css'
import Link from 'next/link'
import SettingsSidebar from '@/layouts/SettingsSidebar/SettingsSidebar'
import { withAuth } from '@/navigation/withAuth'

type Props = {}

const Settings: React.FC<Props> = ({}) => {
  return (
    <>
      <PageGridLayout column={2}>
        <SettingsSidebar active="" />
      </PageGridLayout>
    </>
  )
}

export default withAuth(Settings)
