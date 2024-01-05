import {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
} from 'next'
import { ISitemapField } from 'next-sitemap'
import { getAllUserUrls } from '@/services/user.service'
import { get } from 'http'

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { res, err } = await getAllUserUrls()
  if (err) {
    console.error('Error fetching user URLs:', err)
    return {
      notFound: true,
    }
  }

  const usersres: any[] = res?.data?.data

  const users: ISitemapField[] = usersres.map((user) => ({
    loc: `https://hobbycue-front.vercel.app/profile/${user.profile_url}`,
    lastmod: new Date().toISOString(),
  }))

  // Generate XML manually from the users array
  const generateXML = (users: ISitemapField[]): string => {
    let xmlString = '<?xml version="1.0" encoding="UTF-8"?>\n'
    xmlString +=
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'

    users.forEach((user) => {
      xmlString += '\t<url>\n'
      xmlString += `\t\t<loc>${user.loc}</loc>\n`
      xmlString += `\t\t<lastmod>${user.lastmod}</lastmod>\n`
      xmlString += '\t</url>\n'
    })

    xmlString += '</urlset>'
    return xmlString
  }

  const sitemapString = generateXML(users)
  console.log('Generated sitemap:', sitemapString)

  return {
    props: {
      users,
      sitemapXML: sitemapString,
    },
  }
}

export default function Site({ sitemapXML }: { sitemapXML: string }) {
  return (
    <div>
      <pre>{sitemapXML}</pre>
    </div>
  )
}
