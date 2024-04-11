import React from 'react'
import PageGridLayout from '@/layouts/PageGridLayout'
import styles from './settings.module.css'
import Link from 'next/link'
import SettingsSidebar from '@/layouts/SettingsSidebar/SettingsSidebar'
import { withAuth } from '@/navigation/withAuth'
import { useMediaQuery } from '@mui/material'
import SettingsDropdownLayout from '@/layouts/SettingsDropdownLayout'

type Props = {}

const Settings: React.FC<Props> = ({}) => {
  const isMobile = useMediaQuery('(max-width:1100px)')
  return (
    <>
      {isMobile && (
        <aside
          className={`custom-scrollbar static-position settings-container`}
        >
          <section className={`content-box-wrapper`}>
            <header>
              <div className={'settings-title'}>
                <h1>Settings</h1>
              </div>
            </header>
          </section>
        </aside>
      )}
      <PageGridLayout column={2}>
        {isMobile ? (
          <SettingsDropdownLayout> </SettingsDropdownLayout>
        ) : (
          <SettingsSidebar active="" />
        )}
      </PageGridLayout>
    </>
  )
}

export default withAuth(Settings)
