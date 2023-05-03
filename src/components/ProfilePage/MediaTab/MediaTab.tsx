import React from 'react'

import PageContentBox from '@/layouts/PageContentBox'
import PageGridLayout from '@/layouts/PageGridLayout'

import { openModal } from '@/redux/slices/modal'
import { useDispatch } from 'react-redux'

import styles from './MediaTab.module.css'

type Props = {}

const MediaTab: React.FC<Props> = ({}) => {
  const dispatch = useDispatch()
  return (
    <>
      <PageGridLayout column={3}>
        <aside>Left</aside>

        <main>Main</main>

        <aside>RIght</aside>
      </PageGridLayout>
    </>
  )
}

export default MediaTab
