import { FC } from 'react'
import styles from '@/styles/faq.module.css'

import thankyouimg from '@/assets/image/thankyou.jpg'

interface indexProps {}

const index: FC<indexProps> = ({}) => {
  return (
    <main className={styles['main']}>
      <div className={styles['container']}>
        <section className={styles['white-container']}>
          <h1>Thankyou</h1>
          <div className={styles['list-container']}>
            <h3>
              HobbyCue team would like to express deep gratitude to several
              teams and individuals
            </h3>
            <ul>
              <li>
                <a
                  style={{ color: '#8064A0' }}
                  href="https://nsrcel.org/"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  NSRCEL
                </a>{' '}
                Women’s Startup Program @ IIM Bengaluru
              </li>

              <li>
                <a
                  style={{ color: '#8064A0' }}
                  href="https://cwe.org.in/"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  CWE
                </a>{' '}
                – Catalyst for Women Entrepreneurs and{' '}
                <a
                  style={{ color: '#8064A0' }}
                  href="http://hobbycue.com/profile/preeti-sawhney"
                >
                  Preeti Sawhney
                </a>{' '}
                our mentor
              </li>

              <li>
                <a
                  style={{ color: '#8064A0' }}
                  href="https://10000startups.com/startup-stories"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  NASSCOM 10k Startups
                </a>{' '}
                Warehouse and{' '}
                <a
                  style={{ color: '#8064A0' }}
                  href="https://www.linkedin.com/in/saravanan-sundramurthy-b317103/"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  Saravanan Sundaramurthy
                </a>{' '}
                for help on the ground
              </li>

              <li>
                <a
                  style={{ color: '#8064A0' }}
                  href="https://www.linkedin.com/in/bincymb/"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  Bincy M Balan
                </a>{' '}
                for diligently starting us off on WordPress so beautifully
              </li>

              <li>
                <a
                  style={{ color: '#8064A0' }}
                  href="http://hobbycue.com/profile/srikanth"
                >
                  Srikanth M C
                </a>
                , Murthy H K and friends for several brainstorming sessions
              </li>

              <li>
                <a
                  style={{ color: '#8064A0' }}
                  href="http://hobbycue.com/profile/sambasivan-s"
                >
                  Sambasivan S
                </a>{' '}
                and{' '}
                <a
                  style={{ color: '#8064A0' }}
                  href="http://hobbycue.com/profile/mani-nbs"
                >
                  N B S Mani
                </a>{' '}
                for their trust on us with initial capital investments
              </li>

              <li>
                <a
                  style={{ color: '#8064A0' }}
                  href="http://hobbycue.com/profile/sujuprakash"
                >
                  Sujatha Prakash
                </a>
                ,{' '}
                <a
                  style={{ color: '#8064A0' }}
                  href="http://hobbycue.com/profile/ali-khan"
                >
                  Ali Khan
                </a>
                ,{' '}
                <a
                  style={{ color: '#8064A0' }}
                  href="http://hobbycue.com/profile/minuganesh"
                >
                  Minu Ganesh
                </a>
                ,{' '}
                <a
                  style={{ color: '#8064A0' }}
                  href="http://hobbycue.com/profile/lakshmi79_shivyahoo-co-in"
                >
                  Lakshmi Shivakumar
                </a>{' '}
                for interning with us
              </li>

              <li>
                <a
                  style={{ color: '#8064A0' }}
                  href="http://hobbycue.com/profile/sambasivan-s"
                >
                  Sambasivan S
                </a>
                ,{' '}
                <a
                  style={{ color: '#8064A0' }}
                  href="http://hobbycue.com/profile/sanjay-sambasivan"
                >
                  Sanjay Sambasivan
                </a>
                ,{' '}
                <a
                  style={{ color: '#8064A0' }}
                  href="http://hobbycue.com/profile/vandana-balanath"
                >
                  Vandana Balanath
                </a>{' '}
                and many other bloggers
              </li>

              <li>
                <a
                  style={{ color: '#8064A0' }}
                  href="https://mylistingtheme.com/"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  MyListing Theme
                </a>{' '}
                that gave us the ability to create a standardized look and feel
              </li>

              <li>
                <a
                  style={{ color: '#8064A0' }}
                  href="https://www.meetup.com/bengaluruwordpress/"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  WordPress Bengaluru Community
                </a>{' '}
                and BuddyPress online communities to keep us going
              </li>

              <li>
                <a
                  style={{ color: '#8064A0' }}
                  href="http://hobbycue.com/profile/sambasivan-s"
                >
                  Sambasivan S
                </a>{' '}
                for capturing data on thousands of listing pages
              </li>

              <li>
                Jyothi Jindyala for her thorough validation of our user
                experience
              </li>

              <li>
                <a
                  style={{ color: '#8064A0' }}
                  href="https://banao.tech/"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  Banao Technologies
                </a>{' '}
                for building this on MERN stack; Support from Saurabh and Sayan
              </li>

              <li>
                <a
                  style={{ color: '#8064A0' }}
                  href="https://pahalkadivar.com/"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  Pahal Kadivar
                </a>
                , Nadeem Ashraf for designs;{' '}
                <a
                  style={{ color: '#8064A0' }}
                  href="https://www.linkedin.com/in/devanshdsoni"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  Devansh Soni
                </a>
                ,{' '}
                <a
                  style={{ color: '#8064A0' }}
                  href="http://hobbycue.com/profile/ketan212"
                >
                  Ketan Patil
                </a>{' '}
                for development
              </li>

              <li>
                Hundreds of friends and family members who gave their inputs and
                ideas
              </li>

              <img src={thankyouimg.src} alt="" style={{ width: '100%' }} />
            </ul>
          </div>
        </section>
      </div>
    </main>
  )
}

export default index
