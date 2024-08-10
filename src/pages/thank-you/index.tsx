import { FC } from 'react'
import styles from '@/styles/faq.module.css'

import thankyouimg from "@/assets/image/thankyou.jpg";


interface indexProps {
  
}


const index: FC<indexProps> = ({}) => {
  return (
  <main className={styles['main']}>
  <div className={styles['container']}>
    <section className={styles['white-container']}>
        <h1>Thankyou</h1>
        <div className={styles['list-container']}>
            <h3>HobbyCue team would like to express deep gratitude to several teams and individuals</h3>
            <ul>
                <li>NSRCEL Women’s Startup Program @ IIM Bengaluru</li>
                <li>CWE – Catalyst for Women Entrepreneurs and Preeti Sawhney our mentor</li>
                <li>NASSCOM 10k Startups Warehouse and Saravanan Sundaramurthy for help on the ground</li>
                <li>Bincy M Balan for diligently starting us off on WordPress so beautifully</li>
                <li>Srikanth M C, Murthy H K and friends for several brainstorming sessions</li>
                <li>Sambasivan S and N B S Mani for their trust on us with initial capital investments</li>
                <li>Sujatha Prakash, Ali Khan, Minu Ganesh, Lakshmi Shivakumar for interning with us</li>
                <li>Sambasivan S, Sanjay Sambasivan, Vandana Balanath and many other bloggers</li>
                <li>MyListing Theme that gave us the ability to create a standardized look and feel</li>
                <li>WordPress Bengaluru Community and BuddyPress online communities to keep us going</li>
                <li>Sambasivan S for capturing data on thousands of listing pages</li>
                <li>Jyothi Jindyala for her thorough validation of our user experience</li>
                <li>Banao Technologies for building this on MERN stack; Support from Saurabh and Sayan</li>
                <li>Pahal Kadivar, Nadeem Ashraf for designs; Devansh Soni, Ketan Patil for development</li>
                <li>Hundreds of friends and family members who gave their inputs and ideas</li>
                <img src={thankyouimg.src} alt="" style={{width:'100%'}} />
            </ul>
        </div>
    </section>
  </div></main>)
}

export default index