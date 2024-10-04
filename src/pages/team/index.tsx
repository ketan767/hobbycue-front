import Link from 'next/link'
import styles from './styles.module.css'
import Footer from '@/components/Footer/Footer'
import Head from 'next/head'

export default function index() {
  return (
    <>
      <Head>
        <meta property="og:image" content="/HobbyCue-FB-4Ps.png" />
        <meta property="og:image:secure_url" content="/HobbyCue-FB-4Ps.png" />

        <title>HobbyCue - Team</title>
      </Head>
      <div className={styles.container}>
        <div className={styles.dataSection}>
          <div className={styles.about}>
            <h1>Team</h1>
            <p>
              <span className="font-semibold">Purnima</span> and{' '}
              <span className="font-semibold">Bhaskar</span> are a couple who
              co-founded{' '}
              <span className="font-italic">
                <strong>hobbycue</strong>.com
              </span>{' '}
              Their venture is bootstrapped, with a lot of support from family
              and friends. They are currently incubated as part of the
              Government of Karnataka supported{' '}
              <strong>NASSCOM 10K Startup</strong> Warehouse at Diamond
              District, Bangalore. The company is registered as{' '}
              <strong>Purple Cues</strong> Private Limited.
            </p>
            <div className={styles.imgContent}>
              <img
                src="http://hobbycue.com/wp-content/uploads/2018/06/Purnima-Pic.png"
                alt="Purnima Sambasivan, Co-Founder"
              />
              <div>
                <h2>Purnima Sambasivan, Multi Tasker and Co-Founder</h2>
                <p>
                  Purnima is an adept multi-tasker, and a supermom of two girls.
                  She has done her Master’s in Computer Applications from Madras
                  University. Since starting her career in the IT industry as a
                  developer, she has grown over time into project management. As
                  part of this, she also took appropriate breaks to focus on her
                  family.
                </p>
              </div>
            </div>
            <p>
              Purnima has learnt Carnatic music and Bharatanatyam, and continues
              her passion through practice, performances, and helping organise
              events. She also encourages her daughters to pursue Sports, Games,
              Art, Music (Western & Indian) and Dance (Bharatanatyam), and
              actively participates with them in workshops and practice
              sessions.
            </p>
            <p>
              Purnima is an avid explorer and has travelled across various
              continents and countries over the years. She often springs a good
              crop from her home garden, and recently became a proud mom of a
              pug puppy who is adding joy to the family.
            </p>
            <div className={styles.imgContent}>
              <img
                src="http://hobbycue.com/wp-content/uploads/2018/06/Bhaskar-Pic.png"
                alt="Bhaskar Subramanian, Co-Founder"
              />
              <div>
                <h2>Bhaskar Subramanian, Chief Hobbyist and Co-Founder</h2>
                <p>
                  Bhaskar is a seasoned IT professional with over 2 decades of
                  rich experience across industry verticals and process areas.
                  An alumnus of IIT Kanpur, Bhaskar has worked for clients
                  across the globe in industry domains such as Document
                  Management, Electric Utilities, Oil & Gas, Telecom & Media and
                  Travel & Leisure. On the process side, he has worked on
                  Strategic Business Planning, Program Management, Delivery
                  Management, PreSales and Marketing Support, Automation &
                  Artificial Intelligence.
                </p>
              </div>
            </div>
            <p>
              Bhaskar has been learning violin from his school days and
              continues to attend weekly classes. He picked up keyboards and
              guitars by himself and even started giving backing vocals in his
              rock band. With a ear for music, you can find him pick up chord
              progressions at ease. He is keen to experience different places
              and cultures, and has planned travel with family to over 10
              different countries and multiple regions within India. Bhaskar is
              also an avid photographer and collects memories from his travels.
            </p>
            <p>
              Occasionally, you’ll find Bhaskar dish out an awesome Italian
              cuisine, or run a 10K. He has created several pieces of pencil art
              and has an eye for design. You can find many of his experiences
              through his blog on hobbycue.com.
            </p>
            <img
              src="https://hobbycue.com/wp-content/uploads/2019/07/Team-hobbycue-600x400.jpg"
              alt="Purnima and Bhaskar"
            />
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
                value="https://hobbycue.com/blog/category/activity/"
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
                value="https://hobbycue.com/blog/category/activity/nature"
              >
                &nbsp;&nbsp;&nbsp;Nature&nbsp;&nbsp;(11)
              </option>
              <option
                className="level-1"
                value="https://hobbycue.com/blog/category/activity/travel"
              >
                &nbsp;&nbsp;&nbsp;Travel&nbsp;&nbsp;(20)
              </option>
              <option
                className="level-1"
                value="https://hobbycue.com/blog/category/activity/wellness"
              >
                &nbsp;&nbsp;&nbsp;Wellness&nbsp;&nbsp;(4)
              </option>
              <option
                className="level-0"
                value="https://hobbycue.com/blog/category/arts/"
              >
                Arts&nbsp;&nbsp;(26)
              </option>
              <option
                className="level-1"
                value="https://hobbycue.com/blog/category/arts/artwork"
              >
                &nbsp;&nbsp;&nbsp;Artwork&nbsp;&nbsp;(3)
              </option>
              <option
                className="level-1"
                value="https://hobbycue.com/blog/category/arts/dance"
              >
                &nbsp;&nbsp;&nbsp;Dance&nbsp;&nbsp;(4)
              </option>
              <option
                className="level-1"
                value="https://hobbycue.com/blog/category/arts/literary"
              >
                &nbsp;&nbsp;&nbsp;Literary&nbsp;&nbsp;(5)
              </option>
              <option
                className="level-1"
                value="https://hobbycue.com/blog/category/arts/music"
              >
                &nbsp;&nbsp;&nbsp;Music&nbsp;&nbsp;(9)
              </option>
              <option
                className="level-1"
                value="https://hobbycue.com/blog/category/arts/photography"
              >
                &nbsp;&nbsp;&nbsp;Photography&nbsp;&nbsp;(4)
              </option>
              <option
                className="level-1"
                value="https://hobbycue.com/blog/category/arts/theatre"
              >
                &nbsp;&nbsp;&nbsp;Theatre&nbsp;&nbsp;(2)
              </option>
              <option
                className="level-1"
                value="https://hobbycue.com/blog/category/arts/visual"
              >
                &nbsp;&nbsp;&nbsp;Visual&nbsp;&nbsp;(2)
              </option>
              <option
                className="level-0"
                value="https://hobbycue.com/blog/category/collect/"
              >
                Collect&nbsp;&nbsp;(8)
              </option>
              <option
                className="level-1"
                value="https://hobbycue.com/blog/category/collect-items/"
              >
                &nbsp;&nbsp;&nbsp;Collect Items&nbsp;&nbsp;(1)
              </option>
              <option
                className="level-0"
                value="https://hobbycue.com/blog/category/making/"
              >
                Making&nbsp;&nbsp;(14)
              </option>
              <option
                className="level-1"
                value="https://hobbycue.com/blog/category/making/cooking"
              >
                &nbsp;&nbsp;&nbsp;Cooking&nbsp;&nbsp;(2)
              </option>
              <option
                className="level-1"
                value="https://hobbycue.com/blog/category/making/gardening"
              >
                &nbsp;&nbsp;&nbsp;Gardening&nbsp;&nbsp;(4)
              </option>
              <option
                className="level-1"
                value="https://hobbycue.com/blog/category/making/utility"
              >
                &nbsp;&nbsp;&nbsp;Utility&nbsp;&nbsp;(4)
              </option>
              <option
                className="level-0"
                value="https://hobbycue.com/blog/category/other/"
              >
                Other&nbsp;&nbsp;(8)
              </option>
              <option
                className="level-0"
                value="https://hobbycue.com/blog/category/perform/"
              >
                Perform&nbsp;&nbsp;(2)
              </option>
              <option
                className="level-0"
                value="https://hobbycue.com/blog/category/play/"
              >
                Play&nbsp;&nbsp;(3)
              </option>
              <option
                className="level-1"
                value="https://hobbycue.com/blog/category/play/games"
              >
                &nbsp;&nbsp;&nbsp;Games&nbsp;&nbsp;(1)
              </option>
              <option
                className="level-1"
                value="https://hobbycue.com/blog/category/play/sports"
              >
                &nbsp;&nbsp;&nbsp;Sports&nbsp;&nbsp;(3)
              </option>
              <option
                className="level-0"
                value="https://hobbycue.com/blog/category/uncategorized/"
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
