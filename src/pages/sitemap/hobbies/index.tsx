import { GetServerSideProps } from 'next'
import { ISitemapField } from 'next-sitemap'
import { getAllHobbiesUrls } from '@/services/hobby.service'
import styles from '../styles.module.css'

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
  const { res: hobbyRes, err: hobbyErr } = await getAllHobbiesUrls()

  if (hobbyErr) {
    console.error('Error fetching user or pages URLs:', hobbyErr)
    return {
      notFound: true,
    }
  }
  const hobyData: any[] = hobbyRes?.data?.data || []
  console.log('urls', hobyData)

  const hobby: ISitemapField[] = hobyData.map((page) => ({
    loc: `${baseUrl}/hobby/${encodeURIComponent(page.page_url)}`,
    lastmod: new Date().toISOString(),
  }))
  return {
    props: {
      data: { hobby },
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
    hobby: sitemapMappingObj[]
  }
}) => {
  const { hobby } = data
  const totalUrls = hobby.length
  return (
    <div className={styles.container}>
      <h1>XML Sitemap</h1>
      <p>This page contains total {totalUrls} URLs</p>
      <h2>Users Hobbies</h2>
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
