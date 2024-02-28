import { GetServerSideProps } from 'next'
import styles from './styles.module.css'
import Link from 'next/link'

type sitemapMappingObj = {
  loc: string
  lastmod: string
  name: string
}

export const getServerSideProps:GetServerSideProps = async() => {  
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const data = [
    {
      lastmod:new Date().toISOString(),
      loc:"/sitemap/users",
      name:"Users"
    },
    {
      lastmod:new Date().toISOString(),
      loc:"/sitemap/hobbies",
      name:"Hobbies"
    },
    {
      lastmod:new Date().toISOString(),
      loc:"/sitemap/pages",
      name:"Pages"
    },
    {
      lastmod:new Date().toISOString(),
      loc:"/",
      name:`${baseUrl}`
    },
    {
      lastmod:new Date().toISOString(),
      loc:"/activity",
      name:`${baseUrl}/activity`
    },
    {
      lastmod:new Date().toISOString(),
      loc:"/add-listing",
      name:`${baseUrl}/add-listing`
    },
    {
      lastmod:new Date().toISOString(),
      loc:"/admin",
      name:`${baseUrl}/admin`
    },
    {
      lastmod:new Date().toISOString(),
      loc:"/admin/dashboard",
      name:`${baseUrl}/admin/dashboard`
    },
    {
      lastmod:new Date().toISOString(),
      loc:"/bookmarks",
      name:`${baseUrl}/bookmarks`
    },
    {
      lastmod:new Date().toISOString(),
      loc:"/cart",
      name:`${baseUrl}/cart`
    },
    {
      lastmod:new Date().toISOString(),
      loc:"/community",
      name:`${baseUrl}/community`
    },
    {
      lastmod:new Date().toISOString(),
      loc:"/contact",
      name:`${baseUrl}/contact`
    },
    {
      lastmod:new Date().toISOString(),
      loc:"/explore",
      name:`${baseUrl}/explore`
    },
    {
      lastmod:new Date().toISOString(),
      loc:"/hobby",
      name:`${baseUrl}/hobby`
    },
    {
      lastmod:new Date().toISOString(),
      loc:"/notifications",
      name:`${baseUrl}/notifications`
    },
    {
      lastmod:new Date().toISOString(),
      loc:"/orders",
      name:`${baseUrl}/orders`
    },
    {
      lastmod:new Date().toISOString(),
      loc:"/page",
      name:`${baseUrl}/page`
    },
    {
      lastmod:new Date().toISOString(),
      loc:"/page/events",
      name:`${baseUrl}/page/events`
    },
    {
      lastmod:new Date().toISOString(),
      loc:"/page/media",
      name:`${baseUrl}/page/media`
    },
    {
      lastmod:new Date().toISOString(),
      loc:"/page/posts",
      name:`${baseUrl}/page/posts`
    },
    {
      lastmod:new Date().toISOString(),
      loc:"/page/reviews",
      name:`${baseUrl}/page/reviews`
    },
    {
      lastmod:new Date().toISOString(),
      loc:"/page/store",
      name:`${baseUrl}/page/store`
    },
    {
      lastmod:new Date().toISOString(),
      loc:"/privacy",
      name:`${baseUrl}/privacy`
    },
    {
      lastmod:new Date().toISOString(),
      loc:"/profile",
      name:`${baseUrl}/profile`
    },
    {
      lastmod:new Date().toISOString(),
      loc:"/profile/blogs",
      name:`${baseUrl}/profile/blogs`
    },
    {
      lastmod:new Date().toISOString(),
      loc:"/profile/media",
      name:`${baseUrl}/profile/media`
    },
    {
      lastmod:new Date().toISOString(),
      loc:"/profile/pages",
      name:`${baseUrl}/profile/pages`
    },
    {
      lastmod:new Date().toISOString(),
      loc:"/profile/posts",
      name:`${baseUrl}/profile/posts`
    },
    {
      lastmod:new Date().toISOString(),
      loc:"/search",
      name:`${baseUrl}/search`
    },
    {
      lastmod:new Date().toISOString(),
      loc:"/settings",
      name:`${baseUrl}/settings`
    },
    {
      lastmod:new Date().toISOString(),
      loc:"/settings/data-others",
      name:`${baseUrl}/settings/data-others`
    },
    {
      lastmod:new Date().toISOString(),
      loc:"/settings/localization-payments",
      name:`${baseUrl}/settings/localization-payments`
    },
    {
      lastmod:new Date().toISOString(),
      loc:"/settings/login-security",
      name:`${baseUrl}/settings/login-security`
    },
    {
      lastmod:new Date().toISOString(),
      loc:"/settings/visibility-notification",
      name:`${baseUrl}/settings/visibility-notification`
    },
    {
      lastmod:new Date().toISOString(),
      loc:"/terms",
      name:`${baseUrl}/terms`
    },
  ]
  return {
    props:{
      data:data
    }
  }
}

const Sitemap = ({data}:{data:sitemapMappingObj[]}) => {
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
              <div style={{textAlign:"right",display:"block"}}>Last Modified</div>
            </th>
          </tr>
        </thead>
        <tbody>
            {data.map((item,i)=><tr style={{background:`${i % 2 === 0 ?"#eee":"#ffffff"}`}} key={i}>
              <td>
                <Link href={item.loc}>
                  {item.name}
                </Link>
              </td>
              <td style={{textAlign:"right"}}>{item.lastmod}</td>
            </tr>)}
        </tbody>
      </table>
    </div>
  )
}

export default Sitemap
