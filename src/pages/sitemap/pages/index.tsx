import { GetServerSideProps } from 'next'
import { ISitemapField } from 'next-sitemap'
import { getAllListingUrls } from '@/services/listing.service'
import styles from '../styles.module.css'

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL

  const { res: pagesRes, err: pagesErr } = await getAllListingUrls()

  if (pagesErr) {
    console.error('Error fetching user or pages URLs:', pagesErr)
    return {
      notFound: true,
    }
  }

  const pagesData: any[] = pagesRes?.data?.data || []

  const pages: ISitemapField[] = pagesData.map((page) => ({
    loc: `${baseUrl}/page/${encodeURIComponent(page.page_url)}`,
    lastmod: page?.updatedAt,
  }))
  return {
    props: {
      data: { pages },
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
    pages: sitemapMappingObj[]
  }
}) => {
  const { pages } = data
  const totalUrls = pages.length
  return (
    <div className={styles.container}>
      <h1>XML Sitemap</h1>
      <p>This page contains total {totalUrls} URLs</p>
      <h2>All Pages</h2>
      <table>
        <thead>
          <tr>
            <th>
              <div>URL</div>
            </th>
            <th>
              <div style={{ textAlign: 'right', display: 'block' }}>
                Last Modified
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {pages?.map((obj, i) => (
            <tr
              style={{ background: `${i % 2 === 0 ? '#eee' : '#ffffff'}` }}
              key={i}
            >
              <td>
                <a href={obj?.loc} target="_blank">
                  {obj?.loc}
                </a>
              </td>
              <td style={{ textAlign: 'right' }}>{obj?.lastmod}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Sitemap
