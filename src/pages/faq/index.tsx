import { FC } from 'react'
import styles from '@/styles/faq.module.css'

import collectingImg from '@/assets/image/collecting-recording.jpg'
import cookingImg from '@/assets/image/cooking.jpg'
import outdoorImg from '@/assets/image/outdoor.jpg'
import squashImg from '@/assets/image/squash.jpg'
import musicImg from '@/assets/image/music.jpg'
import literaryImg from '@/assets/image/literary.jpg'
import Image from 'next/image'
import Head from 'next/head'

interface indexProps {}

const tableData = [
  ['Physical', 'Clothing', 'Nature', 'Sports', 'Dance', 'Painting'],
  ['Record', 'Food', 'Outdoor', 'Games', 'Music', 'Photography'],
  ['', 'Garden', 'Animal', 'Fitness', 'Theatre', 'Literary'],
  ['', 'Model', 'Travel', '', '', ''],
  ['', 'Utility', '', '', '', ''],
]

const cardsData = [
  {
    title: 'Collecting, Recording',
    img: collectingImg,
    desc: 'Stamps, Coins, Currency, Art, Antiques, Music, Memorabilia, Spotting and Record keeping such as birds, jokes, travel itineraries, etc.',
  },
  {
    title: 'Making, Tinkering',
    img: cookingImg,
    desc: 'Creating Scaled Models, 3D Printing, Dresses, Cooking, Gardening, etc. DIY Home and Utility building, Tinkering including Restoring & Repairing.',
  },
  {
    title: 'Activity Participation',
    img: outdoorImg,
    desc: 'Nature (Mountain, Forest, Water, Aero, Desert) & Adventure, Safari, Park, Picnicking, etc. Require physical abilities, but are not competitive.',
  },
  {
    title: 'Sports, Games',
    img: squashImg,
    desc: 'Sports and Games, Indoors and Outdoors, Video and Online, Guessing and Role playing games, usually Competitive.',
  },
  {
    title: 'Arts – Performing',
    img: musicImg,
    desc: 'Music, Dance, Theatre – Singing, Playing Musical Instruments, Dancing, Acting, Magic, Stand-up and other stage based.',
  },
  {
    title: 'Arts – Visual, Literary',
    img: literaryImg,
    desc: 'Visual Arts such as Painting, Photography, Movie making. Literary Arts such as Reading, Viewing, Listening, etc.',
  },
]

const index: FC<indexProps> = ({}) => {
  return (
    <>
      <Head>
        <meta property="og:image" content="/HobbyCue-FB-4Ps.png" />
        <meta property="og:image:secure_url" content="/HobbyCue-FB-4Ps.png" />

        <title>HobbyCue - FAQ</title>
      </Head>
      <main className={styles['main']}>
        <div className={styles['container']}>
          <section className={styles['white-container']}>
            <h1>FAQ</h1>
            <div className={styles['list-container']}>
              <h3>What is hobbycue all about?</h3>
              <p>
                Simply put, hobbycue has Cues for your Hobby 🙂 It is a
                community blog for sharing your experiences and learning from
                each other. Hobbies are categorised, and a Cue could be in the
                form of a blog, a reference to a teacher/coach, an
                equipment/part supplier, etc. – all pertaining to the hobby. In
                this website you can jump across hobby categories or simply
                search for Cues. Check the About page for a basic why and what.
                We’ll soon have a post with more details.
              </p>
              <hr />
              <h3>How are hobbies organised?</h3>
              <p>
                To make it easier, hobbies in hobbycue are categorised based on
                research work done by Dr. Robert Stebbins called ‘Serious
                Leisure’. If you find anything missing or incorrect, do let us
                know. Do note that we are still in a beta phase of this whole
                concept and happy to fine tune all content.
              </p>
              <p>
                If you find anything missing or incorrect, do let us know. Do
                note that we are still in a beta phase of this whole concept and
                happy to fine tune all content.
              </p>
              <div className={styles['table-container']}>
                <table>
                  <thead>
                    <tr>
                      <th>Collect</th>
                      <th>Make</th>
                      <th>Activity</th>
                      <th>Play</th>
                      <th>Arts Perform</th>
                      <th>Arts Visuals & Lit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tableData.map((arr, i) => (
                      <tr key={i}>
                        {arr.map((str, index) => (
                          <td key={index}>{str}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className={styles['card-container']}>
                {cardsData.map((card, i) => (
                  <div key={i} className={styles['card']}>
                    <Image src={card.img} alt="" />
                    <strong>{card.title}</strong>
                    <p>{card.desc}</p>
                  </div>
                ))}
              </div>
              <hr />
              <h3>
                Why can’t I Like, Comment, Find or Add friends and content?
              </h3>
              <p>
                You must be signed in to hobbycue to Like or Comment on pages
                and posts. If you are visiting the site for the first time, you
                may see options to sign in with Facebook or Google. If you do
                not want to link any of these, you can always Register with an
                e-mail ID. If you are already signed in, you should see your
                image and/or name at the top right corner of hobbycue.
              </p>
              <hr />
              <h3>How do I add a new Blog Post?</h3>
              <p>
                You must be signed in to add a new post to hobbycue. If you are
                signed in from a laptop, you should see a “New +” icon at the
                top right. If you are signed in from a mobile device, you should
                see a “+” icon. Click on that and get started.
              </p>
              <p>
                As of now, every new post is moderated. We want no spam here!
                This can be removed for users who complete a certain number of
                posts and reviews.
              </p>
              <h4>a) What are the Guidelines for Posting Blogs?</h4>
              <p>
                hobbycue is for experience sharing. While your profile details
                and preferences are private, all your posts are public. Avoid
                personal information in your post. Avoid politics, religion, sex
                or other objectionable content.
              </p>
              <h4>
                b) I already have my blog posts on another site. Can I get them
                into hobbycue?
              </h4>
              <p>
                Awesome! If you would like to get them over to hobbycue, it is
                easy. Export your blog to an XML file as shown below, we can
                import to hobbycue.
              </p>
              <ol>
                <li>
                  From another WordPress site : Check this WordPress support
                  page.
                </li>
                <li>
                  From Blogspot or Blogger : Check this Google guide, or this
                  YouTube video.
                </li>
                <li>Anything else? : Let us know at info@hobbycue.com</li>
              </ol>
              <hr />
              <h3>What is a Listing? How do I add one?</h3>
              <p>
                A Listing is to have an entry of your business or brand in
                hobbycue database with an intent to collaborate with the
                community. A Listing could be to teach a hobby, collaborate with
                other hobbyists or to buy or sell supplies or products relevant
                to the hobby. Click here to Add a Listing.
              </p>
              <hr />
              <h3>How do you ensure privacy of my data?</h3>
              <p>
                We value the privacy of your data. Your login information,
                location and cookies are used only to deliver an automatically
                personalised experience. Passwords are encrypted, no data is
                shared with 3rd party, and there will be no spam e-mails from
                us. Check out our privacy policy for more details.
              </p>
              <hr />
              <p>
                For any further queries, please reach out to info@hobbycue.com
              </p>
            </div>
          </section>
        </div>
      </main>
    </>
  )
}

export default index
