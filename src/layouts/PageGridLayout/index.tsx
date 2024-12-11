import React from 'react'
import styles from './PageGridLayout.module.css'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'

type Props = {
  children: React.ReactNode
  column: 2 | 3
  responsive?: boolean
  customStyles?: string
  activeTab?: string
}

const PageGridLayout: React.FC<Props> = ({
  children,
  column,
  responsive,
  customStyles,
  activeTab,
}) => {
  const { viewAs } = useSelector((state: RootState) => state.site)
  return (
    <section
      className={` ${styles['container']} ${
        activeTab == 'home' && styles['no-gap']
      } ${viewAs === 'print' && styles['print']} `}
    >
      <div
        data-column={column}
        className={`site-container ${styles['grid-container']} ${
          styles['minheight100vh']
        }  ${responsive ? 'responsive' : ''} ${customStyles || ''}`}
      >
        {children}
      </div>
    </section>
  )
}

export default PageGridLayout
