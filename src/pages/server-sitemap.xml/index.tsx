import {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
} from 'next'
import { ISitemapField } from 'next-sitemap'
import { getAllUserUrls } from '@/services/user.service'
import { getAllListingUrls } from '@/services/listing.service'
import { getAllHobbies } from '@/services/hobby.service'

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
  const { res: userRes, err: userErr } = await getAllUserUrls()

  const { res: pagesRes, err: pagesErr } = await getAllListingUrls()

  const query = ''
  const { res: hobbyRes, err: hobbyErr } = await getAllHobbies(query)

  if (userErr || pagesErr) {
    console.error('Error fetching user or pages URLs:', userErr || pagesErr)
    return {
      notFound: true,
    }
  }

  const usersData: any[] = userRes?.data?.data || []
  const pagesData: any[] = pagesRes?.data?.data || []
  const hobyData: any[] = hobbyRes?.data?.data || []

  const users: ISitemapField[] = usersData.map((user) => ({
    loc: `${baseUrl}/profile/${user.profile_url}`,

    lastmod: new Date().toISOString(),
  }))

  const pages: ISitemapField[] = pagesData.map((page) => ({
    loc: `${baseUrl}/pages/${page.page_url}`,

    lastmod: new Date().toISOString(),
  }))

  const hobby: ISitemapField[] = hobyData.map((page) => ({
    loc: `${baseUrl}/hobby/${page.hobby_url}`,

    lastmod: new Date().toISOString(),
  }))
  const allUrls: ISitemapField[] = [...users, ...pages, ...hobby]

  const sitemapJSON = allUrls.map((item) => ({
    loc: item.loc,
    lastmod: item.lastmod,
  }))

  console.log('Generated sitemap:', sitemapJSON)

  ctx.res.setHeader('Content-Type', 'application/xml')

  return {
    props: {
      sitemapJSON,
    },
  }
}

export default function Site({ sitemapJSON }: { sitemapJSON: object[] }) {
  return (
    <div>
      <pre>{JSON.stringify(sitemapJSON, null, 2)}</pre>
    </div>
  )
}
