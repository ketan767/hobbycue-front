import { useMediaQuery } from '@mui/material'
import { usePathname, useRouter } from 'next/navigation'
import React, { FC, useState } from 'react'
import downArrow from '@/assets/svg/chevron-down.svg'
import upArrow from '@/assets/svg/chevron-up.svg'
import styles from './styles.module.css'
import Image from 'next/image'

interface SettingsDropdownLayoutProps {
  children: React.ReactNode
}

const SettingsDropdownLayout: FC<SettingsDropdownLayoutProps> = ({
  children,
}) => {
  const pathname = usePathname()
  const router = useRouter()
  const dropdownArr = [
    {
      text: 'Login & Security',
      link: '/settings/login-security',
      open: pathname === '/settings/login-security',
    },
    {
      text: 'Visibility & Notification',
      link: '/settings/visibility-notification',
      open: pathname === '/settings/visibility-notification',
    },
    {
      text: 'Localization & Payments',
      link: '/settings/localization-payments',
      open: pathname === '/settings/localization-payments',
    },
    {
      text: 'Account & Data',
      link: '/settings/account-data',
      open: pathname === '/settings/account-data',
    },
  ]
  const [layoutArr, setLayoutArr] = useState(dropdownArr)
  const isMobile = useMediaQuery('(max-width:1100px)')
  const openCloseFunc = (i: number) => {
    if (pathname === layoutArr[i].link) {
      setLayoutArr((prev) => {
        const newArr = [...prev]
        newArr[i] = { ...prev[i], open: !prev[i].open }
        return newArr
      })
    } else {
      router.push(layoutArr[i].link)
    }
  }
  if (isMobile) {
    return (
      <div className={styles.container}>
        {layoutArr.map((item, i) => (
          <>
            <div
              onClick={() => {
                openCloseFunc(i)
              }}
              key={i}
              className={styles.singleDropdown}
            >
              <p>{item.text}</p>
              <Image src={item.open ? upArrow : downArrow} alt="" />
            </div>
            {item.open && children}
          </>
        ))}
      </div>
    )
  } else {
    return <>{children}</> // Wrap children in a div
  }
}

export default SettingsDropdownLayout
