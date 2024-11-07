import { GetServerSideProps } from 'next'
import { ISitemapField } from 'next-sitemap'
import { getAllUserUrls } from '@/services/user.service'
import { getAllListingUrls } from '@/services/listing.service'
import { getAllHobbies, getAllHobbiesUrls } from '@/services/hobby.service'
import { pageType } from '@/utils'

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
    loc: `${baseUrl}/${pageType(page?.type)}/${encodeURIComponent(
      page.page_url,
    )}`,
    lastmod: new Date().toISOString(),
  }))

  const hobby: ISitemapField[] = hobyData.map((page) => ({
    loc: `${baseUrl}/hobby/${encodeURIComponent(page.page_url)}`,
    lastmod: new Date().toISOString(),
  }))

  const allOtherPagesData = [
    {
      lastmod: new Date().toISOString(),
      loc: `${baseUrl}`,
    },
    {
      lastmod: new Date().toISOString(),
      loc: `${baseUrl}/activity`,
    },
    {
      lastmod: new Date().toISOString(),
      loc: `${baseUrl}/add-listing`,
    },
    {
      lastmod: new Date().toISOString(),
      loc: `${baseUrl}/admin`,
    },

    {
      lastmod: new Date().toISOString(),
      loc: `${baseUrl}/bookmarks`,
    },
    {
      lastmod: new Date().toISOString(),
      loc: `${baseUrl}/cart`,
    },
    {
      lastmod: new Date().toISOString(),
      loc: `${baseUrl}/community`,
    },
    {
      lastmod: new Date().toISOString(),
      loc: `${baseUrl}/contact`,
    },

    {
      lastmod: new Date().toISOString(),
      loc: `${baseUrl}/hobby`,
    },
    {
      lastmod: new Date().toISOString(),
      loc: `${baseUrl}/hobbies`,
    },
    {
      lastmod: new Date().toISOString(),
      loc: `${baseUrl}/notifications`,
    },
    {
      lastmod: new Date().toISOString(),
      loc: `${baseUrl}/orders`,
    },

    {
      lastmod: new Date().toISOString(),
      loc: `${baseUrl}/privacy`,
    },
    {
      lastmod: new Date().toISOString(),
      loc: 'https://hobbycue.com/explore',
      name: `https://hobbycue.com/explore`,
    },
    {
      lastmod: new Date().toISOString(),
      loc: 'https://hobbycue.com/explore/people',
      name: `https://hobbycue.com/explore/people`,
    },
    {
      lastmod: new Date().toISOString(),
      loc: 'https://hobbycue.com/explore/places',
      name: `https://hobbycue.com/explore/places`,
    },
    {
      lastmod: new Date().toISOString(),
      loc: 'https://hobbycue.com/explore/programs',
      name: `https://hobbycue.com/explore/programs`,
    },
    {
      lastmod: new Date().toISOString(),
      loc: 'https://hobbycue.com/explore/products',
      name: `https://hobbycue.com/explore/products`,
    },
    {
      lastmod: new Date().toISOString(),
      loc: `https://hobbycue.com/search`,
      name: `https://hobbycue.com/search`,
    },

    {
      lastmod: new Date().toISOString(),
      loc: `https://hobbycue.com/terms`,
      name: `https://hobbycue.com/terms`,
    },
    {
      lastmod: new Date().toISOString(),
      loc: 'https://hobbycue.com/blog',
      name: `https://hobbycue.com/blog`,
    },
    {
      lastmod: new Date().toISOString(),
      loc: 'https://hobbycue.com/faq',
      name: `https://hobbycue.com/faq`,
    },
    {
      lastmod: new Date().toISOString(),
      loc: 'https://hobbycue.com/about',
      name: `https://hobbycue.com/about`,
    },
    {
      lastmod: new Date().toISOString(),
      loc: 'https://hobbycue.com/services',
      name: `https://hobbycue.com/services`,
    },
    {
      lastmod: new Date().toISOString(),
      loc: 'https://hobbycue.com/work',
      name: `https://hobbycue.com/work`,
    },

    {
      lastmod: new Date().toISOString(),
      loc: 'https://hobbycue.com/help',
      name: `https://hobbycue.com/help`,
    },
    {
      lastmod: new Date().toISOString(),
      loc: 'https://hobbycue.com/how-to',
      name: `https://hobbycue.com/how-to`,
    },
    {
      lastmod: new Date().toISOString(),
      loc: 'https://hobbycue.com/team',
      name: `https://hobbycue.com/team`,
    },
    {
      lastmod: new Date().toISOString(),
      loc: 'https://hobbycue.com/purple-cues',
      name: `https://hobbycue.com/purple-cues`,
    },
    {
      lastmod: new Date().toISOString(),
      loc: 'https://hobbycue.com/intern',
      name: `https://hobbycue.com/intern`,
    },
    {
      lastmod: new Date().toISOString(),
      loc: 'https://hobbycue.com/intern-links',
      name: `https://hobbycue.com/intern-links`,
    },
    {
      lastmod: new Date().toISOString(),
      loc: 'https://hobbycue.com/terms/',
      name: `https://hobbycue.com/terms/`,
    },
    {
      lastmod: new Date().toISOString(),
      loc: 'https://hobbycue.com/privacy/',
      name: `https://hobbycue.com/privacy/`,
    },
    {
      lastmod: new Date().toISOString(),
      loc: 'https://hobbycue.com/returns/',
      name: `https://hobbycue.com/returns/`,
    },
    {
      lastmod: new Date().toISOString(),
      loc: 'https://hobbycue.com/thank-you/',
      name: `https://hobbycue.com/thank-you/`,
    },
    {
      lastmod: new Date().toISOString(),
      loc: 'https://hobbycue.com/releases/',
      name: `https://hobbycue.com/releases/`,
    },
  ]

  const allBlogsData = [
    // Add links in the required format
    {
      lastmod: new Date().toISOString(),
      loc: 'https://hobbycue.com/blog/',
      name: `https://hobbycue.com/blog/`,
    },
    {
      lastmod: new Date().toISOString(),
      loc: 'https://hobbycue.com/blog/french-indian-stamps/',
      name: `https://hobbycue.com/blog/french-indian-stamps/`,
    },
    {
      lastmod: new Date().toISOString(),
      loc: 'https://hobbycue.com/blog/philatelic-deposit-account/',
      name: `https://hobbycue.com/blog/philatelic-deposit-account/`,
    },
    {
      lastmod: new Date().toISOString(),
      loc: 'https://hobbycue.com/blog/print-your-own-stamp/',
      name: `https://hobbycue.com/blog/print-your-own-stamp/`,
    },
    {
      lastmod: new Date().toISOString(),
      loc: 'https://hobbycue.com/blog/mahatma-gandhi-stamps/',
      name: `https://hobbycue.com/blog/mahatma-gandhi-stamps/`,
    },
    {
      lastmod: new Date().toISOString(),
      loc: 'https://hobbycue.com/blog/champions-champion-slayers/',
      name: `https://hobbycue.com/blog/champions-champion-slayers/`,
    },
    {
      lastmod: new Date().toISOString(),
      loc: 'https://hobbycue.com/blog/diu/',
      name: `https://hobbycue.com/blog/diu/`,
    },
    {
      lastmod: new Date().toISOString(),
      loc: 'https://hobbycue.com/blog/chennai-music-season/',
      name: `https://hobbycue.com/blog/chennai-music-season/`,
    },
    {
      lastmod: new Date().toISOString(),
      loc: 'https://hobbycue.com/blog/lost-internet-treasures/',
      name: `https://hobbycue.com/blog/lost-internet-treasures/`,
    },
    {
      lastmod: new Date().toISOString(),
      loc: 'https://hobbycue.com/blog/gujarat-rann-of-kutch/',
      name: `https://hobbycue.com/blog/gujarat-rann-of-kutch/`,
    },
    {
      lastmod: new Date().toISOString(),
      loc: 'https://hobbycue.com/blog/gujarat-part-1/',
      name: `https://hobbycue.com/blog/gujarat-part-1/`,
    },
    {
      lastmod: new Date().toISOString(),
      loc: 'https://hobbycue.com/blog/jim-corbett-national-park/',
      name: `https://hobbycue.com/blog/jim-corbett-national-park/`,
    },
    {
      lastmod: new Date().toISOString(),
      loc: 'https://hobbycue.com/blog/goa-a-vacation-to-repeat/',
      name: `https://hobbycue.com/blog/goa-a-vacation-to-repeat/`,
    },
    {
      lastmod: new Date().toISOString(),
      loc: 'https://hobbycue.com/blog/our-native-village/',
      name: `https://hobbycue.com/blog/our-native-village/`,
    },
    {
      lastmod: new Date().toISOString(),
      loc: 'https://hobbycue.com/blog/malaysia/',
      name: `https://hobbycue.com/blog/malaysia/`,
    },
    {
      lastmod: new Date().toISOString(),
      loc: 'https://hobbycue.com/blog/super-blue-blood-moon/',
      name: `https://hobbycue.com/blog/super-blue-blood-moon/`,
    },
    {
      lastmod: new Date().toISOString(),
      loc: 'https://hobbycue.com/blog/goa-drive-from-bangalore/',
      name: `https://hobbycue.com/blog/goa-drive-from-bangalore/`,
    },
    {
      lastmod: new Date().toISOString(),
      loc: 'https://hobbycue.com/blog/burma-stamps/',
      name: `https://hobbycue.com/blog/burma-stamps/`,
    },
    {
      lastmod: new Date().toISOString(),
      loc: 'https://hobbycue.com/blog/dancing-stress-buster/',
      name: `https://hobbycue.com/blog/dancing-stress-buster/`,
    },
    {
      lastmod: new Date().toISOString(),
      loc: 'https://hobbycue.com/blog/fascinating-stamps-archaeology/',
      name: `https://hobbycue.com/blog/fascinating-stamps-archaeology/`,
    },
    {
      lastmod: new Date().toISOString(),
      loc: 'https://hobbycue.com/blog/sold-our-mangalore-flat/',
      name: `https://hobbycue.com/blog/sold-our-mangalore-flat/`,
    },
    {
      lastmod: new Date().toISOString(),
      loc: 'https://hobbycue.com/blog/wordpress-basics/',
      name: `https://hobbycue.com/blog/wordpress-basics/`,
    },
    {
      lastmod: new Date().toISOString(),
      loc: 'https://hobbycue.com/blog/navadarshanam/',
      name: `https://hobbycue.com/blog/navadarshanam/`,
    },
    {
      lastmod: new Date().toISOString(),
      loc: 'https://hobbycue.com/blog/pyramid-valley-international/',
      name: `https://hobbycue.com/blog/pyramid-valley-international/`,
    },
    {
      lastmod: new Date().toISOString(),
      loc: 'https://hobbycue.com/blog/kerala-an-epic-tale/',
      name: `https://hobbycue.com/blog/kerala-an-epic-tale/`,
    },
    {
      lastmod: new Date().toISOString(),
      loc: 'https://hobbycue.com/blog/butterflies-at-turahalli/',
      name: `https://hobbycue.com/blog/butterflies-at-turahalli/`,
    },
    {
      lastmod: new Date().toISOString(),
      loc: 'https://hobbycue.com/blog/wholistic-vocalist/',
      name: `https://hobbycue.com/blog/wholistic-vocalist/`,
    },
    {
      lastmod: new Date().toISOString(),
      loc: 'https://hobbycue.com/blog/apd-horticulture-centre/',
      name: `https://hobbycue.com/blog/apd-horticulture-centre/`,
    },
    {
      lastmod: new Date().toISOString(),
      loc: 'https://hobbycue.com/blog/website-basics/',
      name: `https://hobbycue.com/blog/website-basics/`,
    },
    {
      lastmod: new Date().toISOString(),
      loc: 'https://hobbycue.com/blog/kumbhmela-for-art-lovers/',
      name: `https://hobbycue.com/blog/kumbhmela-for-art-lovers/`,
    },
    {
      lastmod: new Date().toISOString(),
      loc: 'https://hobbycue.com/blog/music-band-recording/',
      name: `https://hobbycue.com/blog/music-band-recording/`,
    },
    {
      lastmod: new Date().toISOString(),
      loc: 'https://hobbycue.com/blog/plan-your-travel-and-tours-on-your-own/',
      name: `https://hobbycue.com/blog/plan-your-travel-and-tours-on-your-own/`,
    },
    {
      lastmod: new Date().toISOString(),
      loc: 'https://hobbycue.com/blog/how-i-organized-all-my-photographs/',
      name: `https://hobbycue.com/blog/how-i-organized-all-my-photographs/`,
    },
    {
      lastmod: new Date().toISOString(),
      loc: 'https://hobbycue.com/blog/kala-rasika-inaugural-concert/',
      name: `https://hobbycue.com/blog/kala-rasika-inaugural-concert/`,
    },
    {
      lastmod: new Date().toISOString(),
      loc: 'https://hobbycue.com/blog/a-sky-full-of-liars/',
      name: `https://hobbycue.com/blog/a-sky-full-of-liars/`,
    },
    {
      lastmod: new Date().toISOString(),
      loc: 'https://hobbycue.com/blog/what-is-it-like-to-be-an-artreprenuer/',
      name: `https://hobbycue.com/blog/what-is-it-like-to-be-an-artreprenuer/`,
    },
    {
      lastmod: new Date().toISOString(),
      loc: 'https://hobbycue.com/blog/home-made-pizza/',
      name: `https://hobbycue.com/blog/home-made-pizza/`,
    },
    {
      lastmod: new Date().toISOString(),
      loc: 'https://hobbycue.com/blog/graha-bhedam/',
      name: `https://hobbycue.com/blog/graha-bhedam/`,
    },
    {
      lastmod: new Date().toISOString(),
      loc: 'https://hobbycue.com/blog/nature-at-turahalli/',
      name: `https://hobbycue.com/blog/nature-at-turahalli/`,
    },
    {
      lastmod: new Date().toISOString(),
      loc: 'https://hobbycue.com/blog/technique-and-warm-up/',
      name: `https://hobbycue.com/blog/technique-and-warm-up/`,
    },
    {
      lastmod: new Date().toISOString(),
      loc: 'https://hobbycue.com/blog/gujarat-part-2/',
      name: `https://hobbycue.com/blog/gujarat-part-2/`,
    },
    {
      lastmod: new Date().toISOString(),
      loc: 'https://hobbycue.com/blog/ponniyin-selvan-characters/',
      name: `https://hobbycue.com/blog/ponniyin-selvan-characters/`,
    },
    {
      lastmod: new Date().toISOString(),
      loc: 'https://hobbycue.com/blog/balance-in-life-for-holistic-wellness-development/',
      name: `https://hobbycue.com/blog/balance-in-life-for-holistic-wellness-development/`,
    },
    {
      lastmod: new Date().toISOString(),
      loc: 'https://hobbycue.com/blog/the-4-ps-of-a-hobby',
      name: `https://hobbycue.com/blog/the-4-ps-of-a-hobby`,
    },
    {
      lastmod: new Date().toISOString(),
      loc: 'https://hobbycue.com/blog/my-2024-french-open-experience',
      name: `https://hobbycue.com/blog/my-2024-french-open-experience`,
    },
  ]

  const allUrls: ISitemapField[] = [
    ...allOtherPagesData,
    ...allBlogsData,
    ...users,
    ...pages,
    ...hobby,
  ]

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

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
  return `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
      <loc>${baseUrl}</loc>
    </url>
    ${
      posts &&
      posts
        .map((item) => {
          return `<url><loc>${item?.loc}</loc><lastmod>${item?.lastmod}</lastmod></url>`
        })
        .join('')
    }
  </urlset>
  `
}

export default function Sitemap() {}
