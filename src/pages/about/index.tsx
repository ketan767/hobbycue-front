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
          <div className={styles.allPosts}>
            <h2>Blog Posts by Category</h2>
            <select
              onChange={(e) => {
                if (
                  e.target.value === 'Select Category' ||
                  e.target.value === undefined
                ) {
                  return
                } else {
                  window.location.href = e.target.value
                }
              }}
            >
              <option value={undefined}>Select Category</option>
              <option
                className="level-0"
                value="https://blog.hobbycue.com/blog/category/activity/"
              >
                Activity&nbsp;&nbsp;(26)
              </option>
              <option
                className="level-1"
                value="https://hobbycue.com/blog/category/activity/fitness"
              >
                &nbsp;&nbsp;&nbsp;Fitness&nbsp;&nbsp;(2)
              </option>
              <option
                className="level-1"
                value="https://blog.hobbycue.com/blog/category/activity/nature"
              >
                &nbsp;&nbsp;&nbsp;Nature&nbsp;&nbsp;(11)
              </option>
              <option
                className="level-1"
                value="https://blog.hobbycue.com/blog/category/activity/travel"
              >
                &nbsp;&nbsp;&nbsp;Travel&nbsp;&nbsp;(20)
              </option>
              <option
                className="level-1"
                value="https://blog.hobbycue.com/blog/category/activity/wellness"
              >
                &nbsp;&nbsp;&nbsp;Wellness&nbsp;&nbsp;(4)
              </option>
              <option
                className="level-0"
                value="https://blog.hobbycue.com/blog/category/arts/"
              >
                Arts&nbsp;&nbsp;(26)
              </option>
              <option
                className="level-1"
                value="https://blog.hobbycue.com/blog/category/arts/artwork"
              >
                &nbsp;&nbsp;&nbsp;Artwork&nbsp;&nbsp;(3)
              </option>
              <option
                className="level-1"
                value="https://blog.hobbycue.com/blog/category/arts/dance"
              >
                &nbsp;&nbsp;&nbsp;Dance&nbsp;&nbsp;(4)
              </option>
              <option
                className="level-1"
                value="https://blog.hobbycue.com/blog/category/arts/literary"
              >
                &nbsp;&nbsp;&nbsp;Literary&nbsp;&nbsp;(5)
              </option>
              <option
                className="level-1"
                value="https://blog.hobbycue.com/blog/category/arts/music"
              >
                &nbsp;&nbsp;&nbsp;Music&nbsp;&nbsp;(9)
              </option>
              <option
                className="level-1"
                value="https://blog.hobbycue.com/blog/category/arts/photography"
              >
                &nbsp;&nbsp;&nbsp;Photography&nbsp;&nbsp;(4)
              </option>
              <option
                className="level-1"
                value="https://blog.hobbycue.com/blog/category/arts/theatre"
              >
                &nbsp;&nbsp;&nbsp;Theatre&nbsp;&nbsp;(2)
              </option>
              <option
                className="level-1"
                value="https://blog.hobbycue.com/blog/category/arts/visual"
              >
                &nbsp;&nbsp;&nbsp;Visual&nbsp;&nbsp;(2)
              </option>
              <option
                className="level-0"
                value="https://blog.hobbycue.com/blog/category/collect/"
              >
                Collect&nbsp;&nbsp;(8)
              </option>
              <option
                className="level-1"
                value="https://blog.hobbycue.com/blog/category/collect-items/"
              >
                &nbsp;&nbsp;&nbsp;Collect Items&nbsp;&nbsp;(1)
              </option>
              <option
                className="level-0"
                value="https://blog.hobbycue.com/blog/category/making/"
              >
                Making&nbsp;&nbsp;(14)
              </option>
              <option
                className="level-1"
                value="https://blog.hobbycue.com/blog/category/making/cooking"
              >
                &nbsp;&nbsp;&nbsp;Cooking&nbsp;&nbsp;(2)
              </option>
              <option
                className="level-1"
                value="https://blog.hobbycue.com/blog/category/making/gardening"
              >
                &nbsp;&nbsp;&nbsp;Gardening&nbsp;&nbsp;(4)
              </option>
              <option
                className="level-1"
                value="https://blog.hobbycue.com/blog/category/making/utility"
              >
                &nbsp;&nbsp;&nbsp;Utility&nbsp;&nbsp;(4)
              </option>
              <option
                className="level-0"
                value="https://blog.hobbycue.com/blog/category/other/"
              >
                Other&nbsp;&nbsp;(8)
              </option>
              <option
                className="level-0"
                value="https://blog.hobbycue.com/blog/category/perform/"
              >
                Perform&nbsp;&nbsp;(2)
              </option>
              <option
                className="level-0"
                value="https://blog.hobbycue.com/blog/category/play/"
              >
                Play&nbsp;&nbsp;(3)
              </option>
              <option
                className="level-1"
                value="https://blog.hobbycue.com/blog/category/play/games"
              >
                &nbsp;&nbsp;&nbsp;Games&nbsp;&nbsp;(1)
              </option>
              <option
                className="level-1"
                value="https://blog.hobbycue.com/blog/category/play/sports"
              >
                &nbsp;&nbsp;&nbsp;Sports&nbsp;&nbsp;(3)
              </option>
              <option
                className="level-0"
                value="https://blog.hobbycue.com/blog/category/uncategorized/"
              >
                Uncategorized&nbsp;&nbsp;(13)
              </option>
            </select>
            <h2 className={styles.mt40}>1 minute Intro</h2>
            <iframe
              id="video-2866-1_youtube_iframe"
              frameBorder="0"
              allowFullScreen={undefined}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              title="HobbyCue - 1 Minute Intro"
              src="https://www.youtube.com/embed/jd7DWl7woyw?controls=0&amp;rel=0&amp;disablekb=1&amp;showinfo=0&amp;modestbranding=0&amp;html5=1&amp;iv_load_policy=3&amp;autoplay=0&amp;end=0&amp;loop=0&amp;playsinline=0&amp;start=0&amp;nocookie=false&amp;enablejsapi=1&amp;origin=https%3A%2F%2Fhobbycue.com&amp;widgetid=1"
              width="272.5"
              height="153.28125"
            ></iframe>
            <h2 className={styles.mt40}>Recent Posts</h2>
            <Link
              target="_blank"
              href={'https://hobbycue.com/blog/the-4-ps-of-a-hobby/'}
            >
              The 4 Ps of a Hobby
            </Link>
            <Link
              target="_blank"
              href={
                'https://hobbycue.com/blog/what-is-it-like-to-be-an-artreprenuer/'
              }
            >
              What is it like to be an artreprenuer?
            </Link>
            <Link
              target="_blank"
              href={
                'https://hobbycue.com/blog/plan-your-travel-and-tours-on-your-own/'
              }
            >
              Plan your travel and tours on your own…
            </Link>
            <Link
              target="_blank"
              href={'https://hobbycue.com/blog/ponniyin-selvan-characters/'}
            >
              Ponniyin Selvan main characters (and movie cast)
            </Link>
            <Link
              target="_blank"
              href={
                'https://hobbycue.com/blog/balance-in-life-for-holistic-wellness-development/'
              }
            >
              Balance in Life for Holistic Wellness & Development
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
