import { GetServerSideProps } from 'next'
import { ISitemapField } from 'next-sitemap'
import { getAllUserUrls } from '@/services/user.service'
import { getAllListingUrls } from '@/services/listing.service'
import { getAllHobbies, getAllHobbiesUrls } from '@/services/hobby.service'
import styles from './styles.module.css'

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
  const { res: userRes, err: userErr } = await getAllUserUrls()

  const { res: pagesRes, err: pagesErr } = await getAllListingUrls()

  const { res: hobbyRes, err: hobbyErr } = await getAllHobbiesUrls()

  if (userErr || pagesErr) {
    console.error('Error fetching user or pages URLs:', userErr || pagesErr)
    return {
      notFound: true,
    }
  }

  const usersData: any[] = userRes?.data?.data || []
  const pagesData: any[] = pagesRes?.data?.data || []
  const hobyData: any[] = hobbyRes?.data?.data || []
  console.log('urls', hobyData)

  const users: ISitemapField[] = usersData.map((user) => ({
    loc: `${baseUrl}/profile/${encodeURIComponent(user.profile_url)}`,
    lastmod: new Date().toISOString(),
  }))

  const pages: ISitemapField[] = pagesData.map((page) => ({
    loc: `${baseUrl}/pages/${encodeURIComponent(page.page_url)}`,
    lastmod: new Date().toISOString(),
  }))

  const hobby: ISitemapField[] = hobyData.map((page) => ({
    loc: `${baseUrl}/hobby/${encodeURIComponent(page.page_url)}`,
    lastmod: new Date().toISOString(),
  }))
  return {
    props: {
      data: { users, pages, hobby },
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
    pages: sitemapMappingObj[]
    hobby: sitemapMappingObj[]
  }
}) => {
  const { users, pages, hobby } = data
  const totalUrls = [...users, ...pages, ...hobby].length
  return (
    <div className={styles.container}>
      <h1>XML Sitemap</h1>
      <p>This page contains total {totalUrls} URLs</p>
      <h2>Users Table</h2>
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
      <h2>Pages Table</h2>
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
          {pages?.map((obj, i) => (
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
      <h2>Hobby Table</h2>
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
          {hobby?.map((obj, i) => (
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
