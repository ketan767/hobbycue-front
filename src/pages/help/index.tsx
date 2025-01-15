import { FC, useEffect, useRef, useState } from 'react'
import styles from '@/styles/Help.module.css'
import Footer from '@/components/Footer/Footer'
import Link from 'next/link'
import Head from 'next/head'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { GetOtherPage, updateOtherPage } from '@/services/admin.service'

interface indexProps {}

const index: FC<indexProps> = ({}) => {
  const { user } = useSelector((state: RootState) => state.user)
  const [title, setTitle] = useState('')
  const titleRef = useRef<HTMLTextAreaElement | null>(null)
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

  const updateTitle = async () => {
    try {
      const formData = {
        title: title,
      }
      const data = await updateOtherPage('help', formData)
      console.log('Updated ', data)
    } catch (error) {
      console.log('error', error)
    }
  }

  useEffect(() => {
    const fetchBrands = async () => {
      const result = await GetOtherPage('help')
      const currTitle = result.res.data[0] ? result.res.data[0].title : ''
      setTitle(currTitle)
    }

    fetchBrands()
  }, [user])

  return (
    <>
      <Head>
        <meta property="og:image" content="/HobbyCue-FB-4Ps.png" />
        <meta property="og:image:secure_url" content="/HobbyCue-FB-4Ps.png" />
        <title>HobbyCue - Help</title>
      </Head>
      <div style={{ backgroundColor: '#f4f4f4' }}>
        <section className={styles['container']}>
          <aside className={styles.aside}>
            {user?.is_admin ? (
              <textarea
                placeholder="Title"
                value={title || ''}
                name="title"
                onChange={(e) => setTitle(e.target.value)}
                onBlur={() => updateTitle()}
                ref={titleRef}
                onKeyDown={(e) => e.key === 'Enter' && titleRef.current?.blur()}
              ></textarea>
            ) : (
              <div>{title || ''}</div>
            )}
          </aside>
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
      </div>
      <section className={`site-container ${styles['site-container-footer']}`}>
        <Footer />
      </section>
    </>
  )
}

export default index
