import React, { useEffect, useState } from 'react'
import { getAllHobbies } from '@/services/hobby.service'

import { GetServerSideProps } from 'next'
import { getListingPages } from '@/services/listing.service'
import store, { RootState } from '@/redux/store'
import { useSelector } from 'react-redux'
import Link from 'next/link'

type Props = {
  data: any
}
const MyListingPages: React.FC<Props> = ({ data }) => {
  const { user } = useSelector((state: RootState) => state.user)

  const [listings, setListings] = useState([])

  const getData = async () => {
    const { err, res } = await getListingPages(`admin=${user._id}`)
    if (err) return console.log(err)
    if (res && res.data.success) setListings(res.data.data.listings)
  }
  useEffect(() => {
    getData()
  }, [user])

  return (
    <>
      <div className={`site-container`}>
        <br />
        <h1>My Listings </h1>
        <br />

        <ul>
          {listings.map((page: any) => {
            return (
              <>
                <li>
                  <Link key={page._id} href={`/page/${page.page_url}`}>
                    {page.title}
                  </Link>
                </li>
              </>
            )
          })}
        </ul>
      </div>
    </>
  )
}

export default MyListingPages
