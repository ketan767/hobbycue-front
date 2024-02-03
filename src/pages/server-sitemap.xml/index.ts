import { GetServerSideProps } from 'next'
import { ISitemapField } from 'next-sitemap'
import { getAllUserUrls } from '@/services/user.service'
import { getAllListingUrls } from '@/services/listing.service'
import { getAllHobbies, getAllHobbiesUrls } from '@/services/hobby.service'

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
  const hobyData: any[] = hobbyRes?.data?.data || [];
  console.log('urls',hobyData)

  const users: ISitemapField[] = usersData.map((user) => ({
    loc: `${baseUrl}/profile/${encodeURIComponent(user.profile_url)}`,
    lastmod: new Date().toISOString(),
  }));

  const pages: ISitemapField[] = pagesData.map((page) => ({
    loc: `${baseUrl}/pages/${encodeURIComponent(page.page_url)}`,
    lastmod: new Date().toISOString(),
  }));
  
  const hobby: ISitemapField[] = hobyData.map((page) => ({
    loc: `${baseUrl}/hobby/${encodeURIComponent(page.page_url)}`,
    lastmod: new Date().toISOString(),
  }));
  
  const allUrls: ISitemapField[] = [...users, ...pages, ...hobby]

  const sitemapJSON = allUrls.map((item) => ({
    loc: item.loc,
    lastmod: item.lastmod,
  }))

  
  const sitemap = generateSiteMap(sitemapJSON)

  ctx.res.setHeader('Content-Type', 'text/xml')
  ctx.res.write(sitemap)
  ctx.res.end()
  return {
    props: {},
  }
}

const generateSiteMap = (data: any) => {
  const posts: { loc: string; lastmod: string }[] = []

  for (const i in data) {
    posts.push(data[i])
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  return `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
      <loc>${baseUrl}</loc>
    </url>
    ${
      posts &&
      posts
        .map((item) => {
          return `<url><loc>${item?.loc}</loc><lastmod>${item?.lastmod}</lastmod></url>`}).join('')
    }
  </urlset>
  `
}

export default function Sitemap() {}
