import { GetServerSideProps } from 'next'
import { ISitemapField } from 'next-sitemap'
import { getAllUserUrls } from '@/services/user.service'
import { getAllListingUrls } from '@/services/listing.service'
import { getAllHobbies, getAllHobbiesUrls } from '@/services/hobby.service'
import styles from '../styles.module.css'

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
  const { res: userRes, err: userErr } = await getAllUserUrls()

  if (userErr) {
    console.error('Error fetching user or pages URLs:', userErr)
    return {
      notFound: true,
    }
  }

  const usersData: any[] = userRes?.data?.data || []

  const users: ISitemapField[] = usersData.map((user) => ({
    loc: `${baseUrl}/profile/${encodeURIComponent(user.profile_url)}`,
    lastmod: user?.updatedAt,
  }))

  return {
    props: {
      data: { users },
    },
  }
}

type sitemapMappingObj = {
  loc: string
  lastmod: string
}

const Sitemap = ({
  data,
}: {
  data: {
    users: sitemapMappingObj[]
  }
}) => {
  const { users } = data
  const totalUrls = users.length
  return (
    <div className={styles.container}>
      <h1>XML Sitemap</h1>
      <p>This page contains total {totalUrls} URLs</p>
      <h2>All Users</h2>
      <table>
        <thead>
          <tr>
            <th>
              <div>URL</div>
            </th>
            <th>
              <div style={{textAlign:"right",display:"block"}}>Last Modified</div>
            </th>
          </tr>
        </thead>
        <tbody>
          {users?.map((obj, i) => (
            <tr style={{background:`${i % 2 === 0 ?"#eee":"#ffffff"}`}} key={i}>
              <td>
                <a href={obj?.loc} target="_blank">
                  {obj?.loc}
                </a>
              </td>
              <td style={{textAlign:"right"}}>{obj?.lastmod}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Sitemap
