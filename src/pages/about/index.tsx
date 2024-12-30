import Link from 'next/link'
import styles from './styles.module.css'
import Footer from '@/components/Footer/Footer'
import Head from 'next/head'
import CWEimg from '@/assets/image/CWE_logo.png'
import govLogo from '@/assets/image/KarnatakaGovtLogo.png'
import nasComimg from '@/assets/image/nasscom_initiative_img.jpg'

export default function index() {
  return (
    <>
      <Head>
        <meta property="og:image" content="/HobbyCue-FB-4Ps.png" />
        <meta property="og:image:secure_url" content="/HobbyCue-FB-4Ps.png" />

        <title>HobbyCue - About</title>
      </Head>
      <div className={styles.container}>
        <div className={styles.dataSection}>
          <div className={styles.about}>
            <h1>About</h1>
            <p>
              <span className="font-semibold font-italic">hobbycue</span> is a
              social network and a marketplace for hobbyists and hobby
              communities. Find a partner or teacher/expert, join a class or a
              workshop, find a place to practice, or shop for equipment and
              supplies pertaining to your hobby.
            </p>
            <p>
              A <span className="font-italic">cue</span> is a guiding suggestion
              or a hint, a prompt or a stimulus for action. We believe everyone
              is a hobbyist. They just may not explore or express enough. And a
              cue is all that is needed to get them going.
            </p>
            <p>
              <span className="font-italic">hobbycue</span> – because we provide
              cues for your hobby 🙂 Brought to you by Purple Cues Pvt. Ltd. You
              could take the cue from your community members, or cue them in
              based on your knowledge. Read on and explore to know more …
            </p>
            <p>
              <span className="font-semibold font-italic">Why hobbycue</span> :
              Most social networks, search lists and websites today, cut across
              topics. As part of our hobby, we may end up checking multiple
              sites and filter for topics of our interest. What if your hobby is
              at the centre, with a community around it, and we aggregate
              everything that already exists, enrich with new content, and link
              them all?
            </p>
            <p>
              <span className="font-semibold font-italic">What can you do</span>{' '}
              : Sign-in with your e-mail, Google or Facebook login. Update your
              profile to edit your location and hobbies. Browse through content
              related to your hobbies or add new ones. Join the community
              groups, post your queries or help others. And do reach out to us
              with your ideas. Login to view all the content.
            </p>
            <p>
              Company : This site is built and owned by Purple Cues Pvt. Ltd.
              who are incubated at the NASSCOM 10K Startup Warehouse, with
              support from CWE and Govt of Karnataka. Know more at{' '}
              <Link
                className="font-medium"
                target="_blank"
                href={'http://hobbycue.com/purple-cues'}
              >
                http://hobbycue.com/purple-cues
              </Link>
            </p>
            <img
              src={CWEimg.src}
              alt="CWE"
            />
            <img
              src={nasComimg.src}
              alt="Nascomm 10000 Startups"
            />
            <img
              src={govLogo.src}
              alt="Karnataka Government Logo"
            />
            <p>
              <span className="font-semibold">Team</span> : Purnima and Bhaskar
              from Bangalore are the Co-Founding couple. Between them, they have
              several hobbies in common, as well as individual talents in the
              family. More about them and the team at{' '}
              <Link target="_blank" href={'http://hobbycue.com/team'}>
                http://hobbycue.com/team
              </Link>{' '}
            </p>
            <p>
              <span className="font-semibold">Recommendations</span> : Check out
              our user reactions{' '}
              <Link target="_blank" href={'http://hobbycue.com/testimonials'}>
                http://hobbycue.com/testimonials
              </Link>{' '}
            </p>
            <p>
              <span className="font-semibold">Contact</span> : Contact us
              through{' '}
              <Link target="_blank" href={'/contact'}>
                http://hobbycue.com/contact
              </Link>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
