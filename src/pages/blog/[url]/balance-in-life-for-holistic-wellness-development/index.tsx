import React from 'react'
import styles from './styles.module.css'
import BookmarkIcon from '@mui/icons-material/Bookmark'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import ShareIcon from '@mui/icons-material/Share'
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied'
import { useDispatch } from 'react-redux'
import ChatBubbleIcon from '@mui/icons-material/ChatBubble'
import { openModal, updateShareUrl } from '@/redux/slices/modal'
import Footer from '@/components/Footer/Footer'

export default function Index() {
  const dispatch = useDispatch()
  const openShareModal = () => {
    dispatch(updateShareUrl(`${window.location.href}`))
    dispatch(openModal({ type: 'social-media-share', closable: true }))
  }
  return (
    <>
      <main className={styles['container']}>
        <section className={styles['top']}>
          <h1>Balance in Life for Holistic Wellness & Development</h1>
          <div className={styles['buttons']}>
            <ul>
              <BookmarkIcon />
              <p>Wellness</p>
            </ul>
            <ul>
              <CalendarMonthIcon />
              <p>Sep 27</p>
            </ul>
            <ul onClick={openShareModal}>
              <ShareIcon />
              <p>Share post</p>
            </ul>
          </div>
          <img
            src="https://hobbycue.com/wp-content/uploads/2021/09/2021-09-11-10-Copy-1024x332.png"
            alt=""
          />
        </section>
        <section className={styles['content']}>
          <h2>A few Frameworks for Reference</h2>
          <img
            src="https://hobbycue.com/wp-content/uploads/2021/09/2021-09-11-10-Copy-1536x497.png"
            alt=""
          />
          <p>
            During one of the ‘parenting lecture’ sessions with my daughter, I
            was trying to make her appreciate a balance in her daily routine
            addressing her learning, creativity, health, fitness, social and
            mental aspects. It was an extempore speech at that time, but I got
            curious about the idea and did some research that turned out to be a
            really interesting journey for me. There have been so many closely
            related fields of study — I have just summarized some of them for
            you to draw your own inspiration …
          </p>
          <br />
          <p>The closest framework was the Wellness Wheel</p>
          <img
            src="https://hobbycue.com/wp-content/uploads/2021/09/WW-descriptions_341161_25240_v2.jpg"
            alt=""
          />
          <br />
          <p className={styles['source']}>
            Source:{' '}
            <a
              target="_blank"
              href="https://medicine.yale.edu/urology/education/residents/wellness/"
            >
              Resident Wellness Program — yale.edu
            </a>
          </p>
          <ul>
            <li>Physical — health, nutrition, hygiene, exercise, sports</li>
            <li>Emotional — feelings, anxiety, stress, self esteem</li>
            <li>Intellectual — creativity, mental, hobbies, expression</li>
            <li>Social — family, friends, cultural, community</li>
            <li>
              Spiritual — motivation, meditation, gratitude, prayers, family
              rituals
            </li>
            <li>Environmental — mindfulness, knowledge, responsibility</li>
            <li>Occupational — career, education, learning, outcomes</li>
            <li>Financial — income, expense, time, assets, provident</li>
          </ul>
          <p>
            I have also seen versions with 7 or 6 sections. This is often done
            by combining the Financial aspect with Occupational. Environmental
            may also get dropped or get associated with Social.
          </p>
          <div className={styles['info']}>
            <p>
              A popular way to check for balance is to imagine these segments to
              be the spokes of a wheel. Colour in each segment based on your
              level of satisfaction out of 10. Now look at the wheel … would it
              be a smooth ride or a bumpy one? Use this to figure out where to
              focus your energy on trying to obtain more peace and happiness.
            </p>
            <a
              target="_blank"
              href="https://medium.com/r/?url=https%3A%2F%2Fthewheelofwellness.wordpress.com%2Fwellness-wheel%2F"
            >
              <img
                src="https://hobbycue.com/wp-content/uploads/2021/09/good-life-balance-wheel-template-1.jpg"
                alt=""
              />
            </a>
          </div>
          <br />
          <hr />
          <br />
          <div className={styles['info']}>
            <a
              target="_blank"
              href="https://medium.com/r/?url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DUADbDgpeP7Y"
            >
              <img
                src="https://hobbycue.com/wp-content/uploads/2021/09/Picture3.png"
                alt=""
              />
            </a>
            <div>
              <p>
                A typical day for most people involves four kinds of activities
                as depicted here. But the scope for experimentation is perhaps
                the highest through the use of ‘free time’. One can go beyond
                relaxation and casual activities to ‘serious leisure’ pursuits
                including hobbies, side projects, volunteering and amateur work.
                And many of these will cater to one or more forms of wellness
                and balance.
              </p>
              <em>
                Ref:{' '}
                <a target="_blank" href="https://www.seriousleisure.net/">
                  Serious Leisure Perspective
                </a>
              </em>
            </div>
          </div>
          <br />
          <hr />
          <br />
          <div className={styles['info']}>
            <div>
              <p>
                Ikigai is a Japanese concept that means “a reason for being”, a
                sense of purpose in our lives. The elements of Ikigai can be{' '}
                <a
                  target="_blank"
                  href="https://commons.wikimedia.org/wiki/File:IkigaiAndDimensionsForABalancedLife.jpg"
                >
                  mapped to Wellness
                </a>{' '}
                too.
              </p>
              <p>Valued experiences for Ikigai could come from:</p>
              <p>• enjoyment: here and now</p>
              <p>• effort: challenges</p>
              <p>• stimulation: newness</p>
              <p>• comfort: familiarity</p>
              <p>
                We can’t increase our Ikigai by doing the same thing, for
                example effort, effort, effort…
              </p>
              <p>It has to be balanced, and sometimes disengaged too.</p>
              <em style={{ marginTop: '5px' }}>
                Ref:{' '}
                <a
                  target="_blank"
                  href="https://ikigaitribe.com/ikigai/podcast04/"
                >
                  Finding Ikigai in Leisure
                </a>
              </em>
            </div>
            <a
              target="_blank"
              href="https://medium.com/r/?url=https%3A%2F%2Fichi.pro%2Fikigai-no-jissen-gaido-anata-ga-sonzaisuru-riyu-13720319897157"
            >
              <img
                src="https://hobbycue.com/wp-content/uploads/2021/09/Picture1-1.jpg"
                alt=""
              />
            </a>
          </div>
          <br />
          <hr />
          <br />
          <div className={styles['info']}>
            <a
              target="_blank"
              href="https://medium.com/r/?url=https%3A%2F%2Fwww.kennethmd.com%2Fbody-mind-spirit-biopsychosocial-spiritual-model-of-health%2F"
            >
              <img
                src="https://hobbycue.com/wp-content/uploads/2021/09/Picture2.png"
                alt=""
              />
            </a>
            <div>
              <p>You might be familiar with</p>
              <strong>Mind • Body • Spirit</strong>
              <p>
                or a similar combination involving <strong>Soul</strong>. Many
                of these have religious connotations too. Here’s one that talks
                about <strong>Social</strong> as well. It is often said that
                human beings are social animals — our thoughts and actions
                depend a lot on the environment.
              </p>
              <p>
                I thought these were age-old ways of looking at life, but
                interestingly Wikipedia calls this as{' '}
                <a
                  target="_blank"
                  href="https://en.wikipedia.org/wiki/Mind,_Body,_Spirit"
                >
                  New Age
                </a>
                .
              </p>
            </div>
          </div>
          <br />
          <hr />
          <br />
          <div className={styles['info']}>
            <p>
              And as a bonus, here is a very interesting take involving the
              mind, body, spirit and emotions with the four directions, four
              elements, four healing activities, that are mapped to flavors of
              aromatherapy 🙂
            </p>
            <a
              target="_blank"
              href="https://medium.com/r/?url=https%3A%2F%2Faromaticstudies.com%2Fthe-wellness-wheel-by-heidi-nielsen%2F"
            >
              <img
                src="https://hobbycue.com/wp-content/uploads/2021/09/Wellness-Wheel.jpg"
                alt=""
              />
            </a>
          </div>
          <br />
          <hr />
          <br />
          <p>
            For best results, these aspects need to be included in our daily
            lives. There are also frameworks on the approach to balance and
            wellness, but maybe that’s for another day. As mentioned earlier, I
            have only summarized some of them for you to draw your own
            inspiration …
          </p>
          <br />
          <hr />
          <br />
          <div className={styles['details']}>
            <p>
              Bhaskar is a Multi-Hobbyist, Blogger, Tech & Design Enthusiast and
              Entrepreneur.
            </p>
            <p>Please login to hobbycue to leave a comment below.</p>
          </div>
          <br />
          <br />
          <div className={styles['categories']}>
            <button>Fitness</button>
            <button>Health</button>
            <button>Hobby</button>
            <button>Social</button>
          </div>
          <br />
          <br />
          <h2 style={{ width: '100%', textAlign: 'center' }}>Comments</h2>
          <br />
          <div style={{ margin: '0px auto', color: 'gray' }}>
            <SentimentVeryDissatisfiedIcon fontSize="large" />
          </div>
          <p style={{ width: '100%', textAlign: 'center' }}>No comments yet.</p>
          <br />
          <div className={styles['comment-add']}>
            <div style={{ display: 'flex', gap: '5px' }}>
              <ChatBubbleIcon style={{ color: 'rgb(177, 177, 177)' }} />{' '}
              <strong>Add a comment</strong>
            </div>
            <p>You must be logged in to post a comment.</p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
