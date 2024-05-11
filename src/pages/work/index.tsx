import Link from 'next/link'
import styles from './styles.module.css'
import Footer from '@/components/Footer/Footer'

export default function index() {
  return (
    <>
      <div className={styles.container}>
        <div className={styles.dataSection}>
          <div className={styles.about}>
            <h1>Work or Hobby?</h1>
            <p>
              We never knew how exciting it would be to create something new.
              Especially, if it is on the internet making an attempt to get
              people off the internet 🙂 Come, discover a whole new world of
              startup work and hobbies that point to the same direction!
            </p>
            <p>
              Check out our Internship or Returnship opportunities at{' '}
              <Link href={'https://hobbycue.com/intern'}>
                https://hobbycue.com/intern.
              </Link>{' '}
              (sign-in required)
            </p>
            <p>
              Want to assess your own hobby challenges? Take the survey at{' '}
              <Link href={'https://hobbycue.com/survey'}>
                https://hobbycue.com/survey
              </Link>
            </p>
            <p>
              Keywords: Work, Hobby, Job, Calling, Career, Passion, Vocation,
              Avocation, Gig, Side Hustle, Moonlighting, Freelance
            </p>

            <Link
              target="_blank"
              href={'http://blog.hobbycue.com/intern-links'}
            >
              http://blog.hobbycue.com/intern-links
            </Link>
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
                value="https://blog.hobbycue.com/blog/category/activity/fitness"
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
              src="https://www.youtube.com/embed/jd7DWl7woyw?controls=0&amp;rel=0&amp;disablekb=1&amp;showinfo=0&amp;modestbranding=0&amp;html5=1&amp;iv_load_policy=3&amp;autoplay=0&amp;end=0&amp;loop=0&amp;playsinline=0&amp;start=0&amp;nocookie=false&amp;enablejsapi=1&amp;origin=https%3A%2F%2Fblog.hobbycue.com&amp;widgetid=1"
              width="272.5"
              height="153.28125"
            ></iframe>
            <h2 className={styles.mt40}>Recent Posts</h2>
            <Link
              target="_blank"
              href={'https://blog.hobbycue.com/blog/the-4-ps-of-a-hobby/'}
            >
              The 4 Ps of a Hobby
            </Link>
            <Link
              target="_blank"
              href={
                'https://blog.hobbycue.com/blog/what-is-it-like-to-be-an-artreprenuer/'
              }
            >
              What is it like to be an artreprenuer?
            </Link>
            <Link
              target="_blank"
              href={
                'https://blog.hobbycue.com/blog/plan-your-travel-and-tours-on-your-own/'
              }
            >
              Plan your travel and tours on your own…
            </Link>
            <Link
              target="_blank"
              href={
                'https://blog.hobbycue.com/blog/ponniyin-selvan-characters/'
              }
            >
              Ponniyin Selvan main characters (and movie cast)
            </Link>
            <Link
              target="_blank"
              href={
                'https://blog.hobbycue.com/blog/balance-in-life-for-holistic-wellness-development/'
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
