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
      loc: `${baseUrl}/explore`,
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
      loc: `${baseUrl}/search`,
    },
    {
      lastmod: new Date().toISOString(),
      loc: `${baseUrl}/settings`,
    },
    {
      lastmod: new Date().toISOString(),
      loc: `${baseUrl}/settings/account-data`,
    },
    {
      lastmod: new Date().toISOString(),
      loc: `${baseUrl}/settings/localization-payments`,
    },
    {
      lastmod: new Date().toISOString(),
      loc: `${baseUrl}/settings/login-security`,
    },
    {
      lastmod: new Date().toISOString(),
      loc: `${baseUrl}/settings/visibility-notification`,
    },
    {
      lastmod: new Date().toISOString(),
      loc: `${baseUrl}/terms`,
    },
    {
      lastmod: new Date().toISOString(),
      loc: 'https://blog.hobbycue.com',
      name: `https://blog.hobbycue.com`,
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
      loc: 'https://hobbycue.com/landing-page',
      name: `https://hobbycue.com/landing-page`,
    },
    {
      lastmod: new Date().toISOString(),
      loc: 'https://blog.hobbycue.com/help',
      name: `https://blog.hobbycue.com/help`,
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
      loc: 'https://blog.hobbycue.com/purple-cues',
      name: `https://blog.hobbycue.com/purple-cues`,
    },
    {
      lastmod: new Date().toISOString(),
      loc: 'https://hobbycue.com/intern',
      name: `https://hobbycue.com/intern`,
    },
    {
      lastmod: new Date().toISOString(),
      loc: 'https://blog.hobbycue.com/intern-links',
      name: `https://blog.hobbycue.com/intern-links`,
    },
    {
      lastmod: new Date().toISOString(),
      loc: 'https://blog.hobbycue.com/terms/',
      name: `https://blog.hobbycue.com/terms/`,
    },
    {
      lastmod: new Date().toISOString(),
      loc: 'https://blog.hobbycue.com/privacy/',
      name: `https://blog.hobbycue.com/privacy/`,
    },
    {
      lastmod: new Date().toISOString(),
      loc: 'https://blog.hobbycue.com/returns/',
      name: `https://blog.hobbycue.com/returns/`,
    },
    {
      lastmod: new Date().toISOString(),
      loc: 'https://blog.hobbycue.com/thank-you/',
      name: `https://blog.hobbycue.com/thank-you/`,
    },
    {
      lastmod: new Date().toISOString(),
      loc: 'https://blog.hobbycue.com/releases/',
      name: `https://blog.hobbycue.com/releases/`,
    },
  ]

  const allBlogsData = [
    // Add links in the required format
    {
      lastmod: new Date().toISOString(),
      loc: 'https://blog.hobbycue.com/blog/',
      name: `https://blog.hobbycue.com/blog/`,
    },
    {
      lastmod: new Date().toISOString(),
      loc: 'https://blog.hobbycue.com/blog/french-indian-stamps/',
      name: `https://blog.hobbycue.com/blog/french-indian-stamps/`,
    },
    {
      lastmod: new Date().toISOString(),
      loc: 'https://blog.hobbycue.com/blog/philatelic-deposit-account/',
      name: `https://blog.hobbycue.com/blog/philatelic-deposit-account/`,
    },
    {
      lastmod: new Date().toISOString(),
      loc: 'https://blog.hobbycue.com/blog/print-your-own-stamp/',
      name: `https://blog.hobbycue.com/blog/print-your-own-stamp/`,
    },
    {
      lastmod: new Date().toISOString(),
      loc: 'https://blog.hobbycue.com/blog/mahatma-gandhi-stamps/',
      name: `https://blog.hobbycue.com/blog/mahatma-gandhi-stamps/`,
    },
    {
      lastmod: new Date().toISOString(),
      loc: 'https://blog.hobbycue.com/blog/champions-champion-slayers/',
      name: `https://blog.hobbycue.com/blog/champions-champion-slayers/`,
    },
    {
      lastmod: new Date().toISOString(),
      loc: 'https://blog.hobbycue.com/blog/diu/',
      name: `https://blog.hobbycue.com/blog/diu/`,
    },
    {
      lastmod: new Date().toISOString(),
      loc: 'https://blog.hobbycue.com/blog/chennai-music-season/',
      name: `https://blog.hobbycue.com/blog/chennai-music-season/`,
    },
    {
      lastmod: new Date().toISOString(),
      loc: 'https://blog.hobbycue.com/blog/lost-internet-treasures/',
      name: `https://blog.hobbycue.com/blog/lost-internet-treasures/`,
    },
    {
      lastmod: new Date().toISOString(),
      loc: 'https://blog.hobbycue.com/blog/gujarat-rann-of-kutch/',
      name: `https://blog.hobbycue.com/blog/gujarat-rann-of-kutch/`,
    },
    {
      lastmod: new Date().toISOString(),
      loc: 'https://blog.hobbycue.com/blog/gujarat-part-1/',
      name: `https://blog.hobbycue.com/blog/gujarat-part-1/`,
    },
    {
      lastmod: new Date().toISOString(),
      loc: 'https://blog.hobbycue.com/blog/jim-corbett-national-park/',
      name: `https://blog.hobbycue.com/blog/jim-corbett-national-park/`,
    },
    {
      lastmod: new Date().toISOString(),
      loc: 'https://blog.hobbycue.com/blog/goa-a-vacation-to-repeat/',
      name: `https://blog.hobbycue.com/blog/goa-a-vacation-to-repeat/`,
    },
    {
      lastmod: new Date().toISOString(),
      loc: 'https://blog.hobbycue.com/blog/our-native-village/',
      name: `https://blog.hobbycue.com/blog/our-native-village/`,
    },
    {
      lastmod: new Date().toISOString(),
      loc: 'https://blog.hobbycue.com/blog/malaysia/',
      name: `https://blog.hobbycue.com/blog/malaysia/`,
    },
    {
      lastmod: new Date().toISOString(),
      loc: 'https://blog.hobbycue.com/blog/super-blue-blood-moon/',
      name: `https://blog.hobbycue.com/blog/super-blue-blood-moon/`,
    },
    {
      lastmod: new Date().toISOString(),
      loc: 'https://blog.hobbycue.com/blog/goa-drive-from-bangalore/',
      name: `https://blog.hobbycue.com/blog/goa-drive-from-bangalore/`,
    },
    {
      lastmod: new Date().toISOString(),
      loc: 'https://blog.hobbycue.com/blog/burma-stamps/',
      name: `https://blog.hobbycue.com/blog/burma-stamps/`,
    },
    {
      lastmod: new Date().toISOString(),
      loc: 'https://blog.hobbycue.com/blog/dancing-stress-buster/',
      name: `https://blog.hobbycue.com/blog/dancing-stress-buster/`,
    },
    {
      lastmod: new Date().toISOString(),
      loc: 'https://blog.hobbycue.com/blog/fascinating-stamps-archaeology/',
      name: `https://blog.hobbycue.com/blog/fascinating-stamps-archaeology/`,
    },
    {
      lastmod: new Date().toISOString(),
      loc: 'https://blog.hobbycue.com/blog/sold-our-mangalore-flat/',
      name: `https://blog.hobbycue.com/blog/sold-our-mangalore-flat/`,
    },
    {
      lastmod: new Date().toISOString(),
      loc: 'https://blog.hobbycue.com/blog/wordpress-basics/',
      name: `https://blog.hobbycue.com/blog/wordpress-basics/`,
    },
    {
      lastmod: new Date().toISOString(),
      loc: 'https://blog.hobbycue.com/blog/navadarshanam/',
      name: `https://blog.hobbycue.com/blog/navadarshanam/`,
    },
    {
      lastmod: new Date().toISOString(),
      loc: 'https://blog.hobbycue.com/blog/pyramid-valley-international/',
      name: `https://blog.hobbycue.com/blog/pyramid-valley-international/`,
    },
    {
      lastmod: new Date().toISOString(),
      loc: 'https://blog.hobbycue.com/blog/kerala-an-epic-tale/',
      name: `https://blog.hobbycue.com/blog/kerala-an-epic-tale/`,
    },
    {
      lastmod: new Date().toISOString(),
      loc: 'https://blog.hobbycue.com/blog/butterflies-at-turahalli/',
      name: `https://blog.hobbycue.com/blog/butterflies-at-turahalli/`,
    },
    {
      lastmod: new Date().toISOString(),
      loc: 'https://blog.hobbycue.com/blog/wholistic-vocalist/',
      name: `https://blog.hobbycue.com/blog/wholistic-vocalist/`,
    },
    {
      lastmod: new Date().toISOString(),
      loc: 'https://blog.hobbycue.com/blog/apd-horticulture-centre/',
      name: `https://blog.hobbycue.com/blog/apd-horticulture-centre/`,
    },
    {
      lastmod: new Date().toISOString(),
      loc: 'https://blog.hobbycue.com/blog/website-basics/',
      name: `https://blog.hobbycue.com/blog/website-basics/`,
    },
    {
      lastmod: new Date().toISOString(),
      loc: 'https://blog.hobbycue.com/blog/kumbhmela-for-art-lovers/',
      name: `https://blog.hobbycue.com/blog/kumbhmela-for-art-lovers/`,
    },
    {
      lastmod: new Date().toISOString(),
      loc: 'https://blog.hobbycue.com/blog/music-band-recording/',
      name: `https://blog.hobbycue.com/blog/music-band-recording/`,
    },
    {
      lastmod: new Date().toISOString(),
      loc: 'https://blog.hobbycue.com/blog/plan-your-travel-and-tours-on-your-own/',
      name: `https://blog.hobbycue.com/blog/plan-your-travel-and-tours-on-your-own/`,
    },
    {
      lastmod: new Date().toISOString(),
      loc: 'https://blog.hobbycue.com/blog/how-i-organized-all-my-photographs/',
      name: `https://blog.hobbycue.com/blog/how-i-organized-all-my-photographs/`,
    },
    {
      lastmod: new Date().toISOString(),
      loc: 'https://blog.hobbycue.com/blog/kala-rasika-inaugural-concert/',
      name: `https://blog.hobbycue.com/blog/kala-rasika-inaugural-concert/`,
    },
    {
      lastmod: new Date().toISOString(),
      loc: 'https://blog.hobbycue.com/blog/a-sky-full-of-liars/',
      name: `https://blog.hobbycue.com/blog/a-sky-full-of-liars/`,
    },
    {
      lastmod: new Date().toISOString(),
      loc: 'https://blog.hobbycue.com/blog/what-is-it-like-to-be-an-artreprenuer/',
      name: `https://blog.hobbycue.com/blog/what-is-it-like-to-be-an-artreprenuer/`,
    },
    {
      lastmod: new Date().toISOString(),
      loc: 'https://blog.hobbycue.com/blog/home-made-pizza/',
      name: `https://blog.hobbycue.com/blog/home-made-pizza/`,
    },
    {
      lastmod: new Date().toISOString(),
      loc: 'https://blog.hobbycue.com/blog/graha-bhedam/',
      name: `https://blog.hobbycue.com/blog/graha-bhedam/`,
    },
    {
      lastmod: new Date().toISOString(),
      loc: 'https://blog.hobbycue.com/blog/nature-at-turahalli/',
      name: `https://blog.hobbycue.com/blog/nature-at-turahalli/`,
    },
    {
      lastmod: new Date().toISOString(),
      loc: 'https://blog.hobbycue.com/blog/technique-and-warm-up/',
      name: `https://blog.hobbycue.com/blog/technique-and-warm-up/`,
    },
    {
      lastmod: new Date().toISOString(),
      loc: 'https://blog.hobbycue.com/blog/gujarat-part-2/',
      name: `https://blog.hobbycue.com/blog/gujarat-part-2/`,
    },
    {
      lastmod: new Date().toISOString(),
      loc: 'https://blog.hobbycue.com/blog/ponniyin-selvan-characters/',
      name: `https://blog.hobbycue.com/blog/ponniyin-selvan-characters/`,
    },
    {
      lastmod: new Date().toISOString(),
      loc: 'https://blog.hobbycue.com/blog/balance-in-life-for-holistic-wellness-development/',
      name: `https://blog.hobbycue.com/blog/balance-in-life-for-holistic-wellness-development/`,
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
