'use client'

import { FC } from 'react'
import styles from '@/styles/Howto.module.css'
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import WhereToVoteOutlinedIcon from '@mui/icons-material/WhereToVoteOutlined';
import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined';
import SentimentSatisfiedAltOutlinedIcon from '@mui/icons-material/SentimentSatisfiedAltOutlined';
import Link from 'next/link'

interface indexProps {}

const redGoogleSvg = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    height="14"
    width="13.34375"
    viewBox="0 0 488 512"
  >
    <path
      fill="#db4437"
      d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
    />
  </svg>
)
const blueFBSvg = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    height="14"
    width="8.75"
    viewBox="0 0 320 512"
  >
    <path
      fill="#124191"
      d="M279.1 288l14.2-92.7h-88.9v-60.1c0-25.4 12.4-50.1 52.2-50.1h40.4V6.3S260.4 0 225.4 0c-73.2 0-121.1 44.4-121.1 124.7v70.6H22.9V288h81.4v224h100.2V288z"
    />
  </svg>
)
const pencilSvg = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    height="14"
    width="14"
    viewBox="0 0 512 512"
  >
    <path d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z" />
  </svg>
)
const data = [
  {
    title: '1. How to sign up or register as a user in hobbycue.com?',
    card: [
      { para: 'Get to the Sign Up page' },
      {
        para: 'On a laptop you could click on Sign Up at the top right side of the menu',
      },
      {
        para: `On a mobile phone, you could click on the person icon [ `,
        icon: <PersonOutlineOutlinedIcon fontSize="small" />,
        restPara: ' ]',
      },
      {
        para: `On the front page of hobbycue.com, you would also see “Don’t have an account?” below the sign in option`,
      },
      {
        para: `Choose from 3 available options [this can be changed after you are logged in]`,
      },
      {
        para: `Enter a preferred Username, provide an Email and a Password as per the guidelines recommended`,
      },
      {
        para: `Click on Connect with [ `,
        icon: redGoogleSvg,
        restPara: ` ] and ensure you are logged in to Gmail or any other Google service`,
      },
      {
        para: `Click on Connect with [  `,
        icon: blueFBSvg,
        restPara: ` ] and login with your facebook account`,
      },
    ],
    bottom: {
      strong: 'Take me there',
      links: [
        {
          title: undefined,
          linkText: 'http://hobbycue.com/home',
          href: 'http://hobbycue.com/home',
        },
      ],
    },
  },
  {
    title: '2. How do I Edit or Update my user profile and account?',
    card: [
      {
        para: 'Your profile has sections that are visible to your community and preferences on when you get notifications on community activity.  Your account has sections on how you connect and how your orders are shipped or billed.  The profile is not the same as a listing (see next section)',
      },
      {
        para: `Once you are logged in, the “Sign in  |  Sign up” options and person icon [ `,
        icon: <PersonOutlineOutlinedIcon fontSize="small" />,
        restPara: ` ] options at the top will be replaced with your profile picture (or a grey circular profile shadow if you don’t have a pic).    This picture will have a drop down menu option, clicking on which you would see <strong>My Profile</strong>.`,
      },
      {
        para: `Navigate to <strong><a href="http://hobbycue.com/members/me/profile/edit">Edit</a></strong> section to update your name, hobbies, city and about you. You will also find options to <em>Change Profile</em> Photo and <em>Change Cover Image</em>. Here, you will also notice tab named <strong>Settings</strong> where you can set your password, <em>Email</em> preferences, and <em>Profile Visibility</em>.`,
      },
      {
        para: `Next to the My Profile menu option you should find a <strong>My Account</strong> option.  Here you can update your Display name, Google and Facebook account connections, Payment Methods, Address preferences (Billing and Shipping).`,
      },
    ],
    bottom: {
      strong: 'Take me there',
      links: [
        {
          title: 'My Profile: ',
          linkText: 'http://hobbycue.com/members/me/profile/edit',
          href: 'http://hobbycue.com/members/me/profile/edit',
        },
        {
          title: 'My Account: ',
          linkText: 'http://hobbycue.com/my-account/edit-account',
          href: 'http://hobbycue.com/my-account/edit-account',
        },
      ],
    },
  },
  {
    title: '3. What is a Listing?',
    card: [
      {
        para: `A Listing is a page created by the user, to publicise their professional work or business.  Listings appear in search results from Google or through the search or explore options within hobbycue.com.   A user profile on the other hand is visible only to friends and members of hobbycue communities that you are part of.  Listings are the way to advertise or promote yourself or your business or to allow users to contact you.`,
        icon: undefined,
        restPara: undefined,
      },
      {
        para: `One user may own multiple listings.  For example, Shankar Mahadevan can sign-up as a user on hobbycue.com.  But he will not be ‘visible’ to others.  However, he can add a Listing for himself (as a professional or teacher) and include pictures, videos, social media, contact and other details.  He can also add another listing for his organisation Shankar Mahadevan Academy.  Alternately, he could give the responsibility of updating the listings to an assistant (in this case the assistant signs up as a user).`,
        icon: undefined,
        restPara: undefined,
      },
      {
        para: `If you are popular on the social or local media, the hobbycue team have already added your listing, and you have to just claim it to be able to edit it further.  Else, you can add a new listing (of type Person) for yourself.  Apart from a Person type, a Place, Organisation, Event, or Rental equipment can all be added as a Listing.  To view which option is best suited click on the [ `,
        icon: (
          <AddCircleOutlineIcon
            style={{ color: '#8064a2' }}
            fontSize="inherit"
          />
        ),
        restPara: ` <span style="color: #8064a2;"><strong><a href="http://hobbycue.com/add-new">Add New</a></strong></span> ] button.`,
      },
    ],
  },
  {
    title: '4. How do I Add a Listing?',
    card: [
      {
        para: `You can publish a Person, a Place, an Organisation, an Event, or a Rental as a Listing.  To add a listing, click on the [  `,
        icon: <AddCircleOutlineIcon fontSize="inherit" />,
        restPara: ` Add New ] button at the top right of your screen.  Make sure that you have all the details and pictures handy.  The workflow is:`,
      },
      {
        para: 'Choose Listing Type → Choose a Package → Sign in or Register (if not done already) → Fill in the Listing Details',
      },
      {
        para: `Choose Listing Type : If you are unsure, scroll down a bit to understand which Listing Type to use<br/>
          Choose a Package : Opt for a FREE or a Paid package from the options available, and click on [ <strong style="color:#8064a2;">Buy Package −›</strong> ]<br/>
          Sign in or Register : You will be prompted in case you are not logged in (check steps here)<br/>
          Fill in the Listing Details : Follow the instructions no the form – check below for what you’ll need<br/>
          Preview and Submit : Click on [ <strong style="color:#8064a2;">Preview</strong> ] to check how it looks and chose to [ <strong style="color:#8064a2;">Review</strong> ] or [ <strong style="color:#8064a2;">Submit </strong> ]`,
      },
      {
        para: 'What you’ll need …',
      },
      {
        para: `A description of approximately 200 words<br/>
          Pictures for logo (square), cover (elongated header) and gallery (rectangular pics)<br/>
          Social media links (Facebook page, Google Plus, YouTube, SoundCloud, etc.)`,
      },
      {
        para: 'You can upload pictures to hobbycue.com.  For videos, we recommend YouTube and for audio files we recommend SoundCloud.',
      },
      {
        para: `<strong>Category</strong> is used to define the <em style="color:#0096c8;">high level hobby or interest area</em> (such as Music, Art, Fitness, etc.) as well as the <em style="color:#0096c8;">high level type of listing</em> (eg: a Person could be Professional, Teacher, or both; a Place could be a Studio, Auditorium, Classroom, or any combination).   Categories are hierarchical.  A <strong>Tag</strong> is just like a hash-tag and aids in search.  In hobbycue, a Tag details out the category.  For example, within the category Music we may have Vocal, Violin, Flute, etc.  Please refer to the <a href="http://hobbycue.com/hobbies/">http://hobbycue.com/hobbies/</a> for a complete list of Categories and Tags we have.`,
      },
      {
        para: `For all social media – if you don’t have an account choose Create account, Sign Up or Register.  If you see Log in or Sign In you are not signed in.  If you are signed in, you should see your picture and / or name somewhere on the screen.`,
      },
      {
        para: `SoundCloud : Click on [ Edit ] → click on the pencil [ `,
        icon:pencilSvg,
        restPara:` ] if you want to edit → get your Profile URL<br/>
          YouTube : Click on your picture at the top right → My Channel → Get the URL (link appearing on your browser)`,
      },
    ],
    bottom:{
      strong:"Take me there",
      links:[{linkText:"http://hobbycue.com/add-new",href:"http://hobbycue.com/add-new",title:undefined}]
    }
  },
  {
    title: '5. How do I Claim a Listing?',
    card:[
      {
        para:`If you are a popular name, or if you have enough social media presence, the hobbycue team or a community member may have already created a listing for you.  All you have to do is to claim it.  Open the listing and click on the [  `,
        icon:<WhereToVoteOutlinedIcon fontSize='inherit' style={{color:"#8064a2"}}/>,
        restPara:`  <strong style="color:#8064a2;">Claim</strong> ] button.  The workflow is`
      },
      {
        para:"Click on Claim → Sign in or Register (if not done already) → Choose a Package → Submit",
        whitePara:true
      },
      {
        para:`Click on Claim : Just click on the  [ `,
        icon:<WhereToVoteOutlinedIcon fontSize='inherit' style={{color:"#8064a2"}}/>,
        restPara:` <strong style="color:#8064a2;">Claim</strong> ] button.<br/>
        Sign in or Register : You will be prompted in case you are not logged in (check steps here)<br/>
        Choose a Package : Opt for a FREE or a Paid package from the options available, and click on [ <strong style="color:#8064a2;">Buy Package −›</strong> ]<br/>
        Submit  : Fill in your notes if any and click on [ Submit ]`
      }
    ],
    bottom:{
      strong:"Take me there",
      links:[{title:"Search for your Listing :",linkText:"http://hobbycue.com/explore",href:"http://hobbycue.com/explore"}]
    }
  },
  {
    title:"6. How do I View, Edit or Promote my Listing?",
    card:[
      {
        para:"To view, edit, delete or promote your listings, locate the My Listing menu option …",
        icon:undefined,
        restPara:undefined
      },
      {
        para:`This will be visible on the left menu of the dashboard.<br/>
        This can be accessed by clicking on the drop down menu on your name / profile pic at the top`
      },
      {
        para:"Once you are in the My Listing screen, click on Edit, Delete or Promote as required"
      },
      {
        para:"To just view your listings, you can also do the following …"
      },
      {
        para:`Access your profile, and they will appear under a tab called Listings<br/>
        Search for the listing by name or contents`
      },
      {
        para:`Once you have an individual listing open, you can click on the [ `,
        icon:<MoreVertOutlinedIcon fontSize='inherit' style={{color:"#8064a2"}} />,
        restPara:` ] visible at the right most of the row of buttons.  If you do this for listings that you own, you will find an option called Edit Listing.`
      }
    ],
    bottom:{
      strong:"Take me there",
      links:[{title:undefined,href:"http://hobbycue.com/my-account/my-listings",linkText:"http://hobbycue.com/my-account/my-listings"}]
    }
  },
  {
    title:"7. How do I Post a Query to the Community?",
    card:[
      {
        para:"You may want to post an update or a query on your profile page so that your friends can view the same.  But to get a wider reach, you may want to post the query on a group so that all members of the group can view the same.  Posting an update or a query requires you to be on your user Profile screen or on the Community activity section.  Make sure you are logged in ",
        icon:<SentimentSatisfiedAltOutlinedIcon fontSize='inherit'/>,
        restPara:undefined
      }
    ],
    bottom:{
      strong:"Take me there",
      links:[
        {linkText:"http://hobbycue.com/activity",href:"http://hobbycue.com/activity",title:"Community Activity :"},
        {linkText:"here",href:"http://hobbycue.com/how-to/#profile",title:"User Profile : check "},
      ]
    }
  },
  {
    title:"8. How do I create a Blog Post or a Group?",
    card:[
      {
        para:`By default, users of hobbycue.com do not have access to write blog posts or create groups.  You can request for Contributor access to write blog posts and you can request for a Group to be added.  Access these options through [  `,
        icon:<AddCircleOutlineIcon fontSize='inherit' style={{color:"#8064a2"}}/>,
        restPara:`<strong style="color:#8064a2;">Add New</strong> ] button and clicking on “<strong>Add or request other …</strong>” at the bottom.  Make sure you are logged in `,
        extraIcon: <SentimentSatisfiedAltOutlinedIcon fontSize='inherit'/>
      }
    ],
    bottom:{
      strong:"Take me there",
      links:[
        {
          href:"http://hobbycue.com/add-new",
          linkText:"http://hobbycue.com/add-new",
          title:"Add or Request Access: "
        }
      ]
    }
  }
]

import React from 'react'
import Footer from '@/components/Footer/Footer'

const index: FC<indexProps> = ({}) => {
  const whiteParaChecker = (CARD:any) => {
    if("whitePara" in CARD){
      return styles['white-para']
    }else{
     return ""
    }
  }
  return (
    <main className={styles['main']}>
      <section className={styles['container']}>
        {data.map((obj, i) => (
          <div key={i} className={styles['card']}>
            <h2>{obj.title}</h2>
            {obj?.card?.map((CARD, index) => {
              if("extraIcon" in CARD){
                return (
                  <li key={index} className={whiteParaChecker(CARD)}>
                    <p
                      dangerouslySetInnerHTML={{
                        __html: CARD.para ?? '',
                      }}
                    ></p>
                    <p className={styles['icon-container']}>{CARD?.icon}</p>
                    <p
                      dangerouslySetInnerHTML={{ __html: CARD?.restPara ?? '' }}
                    ></p>
                    <p className={styles['icon-container']}>{CARD.extraIcon}</p>
                  </li>
                )
              }
              return (
                <li key={index} className={whiteParaChecker(CARD)}>
                  <p
                    dangerouslySetInnerHTML={{
                      __html: CARD.para ?? '',
                    }}
                  ></p>
                  <p className={styles['icon-container']}>{CARD?.icon}</p>
                  <p
                    dangerouslySetInnerHTML={{ __html: CARD?.restPara ?? '' }}
                  ></p>
                </li>
              )
            })}
            {obj.bottom && (
              <div className={styles['bottom-section']}>
                {obj.bottom?.strong && <strong>{obj.bottom?.strong} :</strong>}
                {obj.bottom.links.map((LINK, numIndex) => (
                  <div className={styles['links-section']} key={numIndex}>
                    {LINK.title && <p>{LINK.title}</p>}
                    {<Link href={LINK.href}>{LINK.linkText}</Link>}
                    {obj.bottom.links.length > 1 &&
                      numIndex !== obj.bottom.links.length - 1 && (
                        <p className={styles['vertical-breaker']}>{' | '}</p>
                      )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </section>
      <Footer/>
    </main>
  )
}

export default index
