import { GetServerSideProps } from 'next'
import styles from '../styles.module.css'
import Link from 'next/link'

type sitemapMappingObj = {
  loc: string
  lastmod: string
  name: string
}

export const getServerSideProps: GetServerSideProps = async () => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
  const data = [
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
  return {
    props: {
      data: data,
    },
  }
}

const Sitemap = ({ data }: { data: sitemapMappingObj[] }) => {
  return (
    <div className={styles.container}>
      <h1>XML Sitemap</h1>
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
          {data.map((item, i) => (
            <tr
              style={{ background: `${i % 2 === 0 ? '#eee' : '#ffffff'}` }}
              key={i}
            >
              <td>
                <Link href={item.loc}>{item.name}</Link>
              </td>
              <td style={{ textAlign: 'right' }}>{item.lastmod}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Sitemap
