import { FC } from 'react'
import styles from '@/styles/Help.module.css'
import Footer from '@/components/Footer/Footer'
import Link from 'next/link'
import Head from 'next/head'

interface indexProps {}

const index: FC<indexProps> = ({}) => {
  const data = {
    title: 'Help Center',
    cards: [
      {
        title: 'First timer',
        desc: 'Check our Frequently Asked Questions to know about HobbyCue',
        link: 'FAQ',
        href: 'https://hobbycue.com/faq',
      },
      {
        title: 'How to',
        desc: 'Figure out how to navigate through various features of HobbyCue',
        link: 'How to',
        href: 'https://hobbycue.com/how-to',
      },
      {
        title: 'Contact us',
        desc: 'Reach out to us to help you further on any topic.',
        link: 'Contact',
        href: '/contact',
      },
    ],
  }
  return (
    <>
      <Head>
        <meta property="og:image" content="/HobbyCue-FB-4Ps.png" />
        <meta property="og:image:secure_url" content="/HobbyCue-FB-4Ps.png" />

        <title>HobbyCue - Help</title>
      </Head>
      <section className={styles['container']}>
        <div className={styles['cards-container']}>
          <h1>{data.title}</h1>
          <div className={styles['cards-parent']}>
            {data.cards.map((item, i) => (
              <div key={i} className={styles['card']}>
                <h2>{item.title}</h2>
                <p>{item.desc}</p>
                <Link href={item.href}>{item.link}</Link>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className={`site-container ${styles['site-container-footer']}`}>
        <Footer />
      </section>
    </>
  )
}

export default index
