import { GetServerSideProps } from 'next'
import styles from './styles.module.css'
import Link from 'next/link'

type sitemapMappingObj = {
  loc: string
  lastmod: string
  name: string
}

export const getServerSideProps:GetServerSideProps = async() => {
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
      loc:"/sitemap/all-urls",
      name:"All Other URLs"
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
