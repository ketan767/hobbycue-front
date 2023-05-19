import React from 'react'
import styles from './ListingCard.module.css'
import Link from 'next/link'

type Props = {
  data: any
}

const ListingCard: React.FC<Props> = ({ data }) => {
  return (
    <>
      <Link key={data._id} href={`/page/${data.page_url}`}>
        <li key={data._id}>{data?.title}</li>
        <header></header>
        <section></section>
      </Link>
    </>
  )
}

export default ListingCard
