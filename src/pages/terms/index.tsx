import { withAuth } from '@/navigation/withAuth'
import React from 'react'
import styles from '@/styles/ExplorePage.module.css'

type Props = {}

const Terms: React.FC<Props> = (props) => {
  return (
    <div style={{margin:"0 auto"}} className={styles['explore-wrapper']+` ${styles['padding-top-12']}`}>
      <div className={styles.terms}>
        <h1 className={styles.pageheading}>Terms and Conditions</h1>

        <p>
          These Terms and Conditions apply for the use of hobbycue.com, a
          service brought to you by Purple Cues Private Limited. Your
          registration as a member of the hobbycue community or the use of any
          of the features or services on hobbycue.com constitutes automatic
          acceptance of these terms and conditions.
        </p>

        <p>
          "Client", "Member", "User", "You" and "Your" refer to you, the person
          accessing this website and accepting these terms and conditions. "The
          Company", "Ourselves", "We", "Our" and "Us" refer to our company,
          Purple Cues Private Limited.
        </p>

        <p>
          Information about the listings of teachers, schools, shops, and
          services posted on the site is obtained from their official websites,
          social media links, and other sources on the internet and, in some
          cases, by calling the owners. While we make best efforts to ensure
          accuracy, the responsibility of validating and deciding to contact or
          purchase lies with you, the user. If you enter into correspondence or
          engage in commercial transactions with third parties listed on
          hobbycue.com, such activity is solely between you and the applicable
          third party. HobbyCue shall have no liability, obligation, or
          responsibility for any such activity. You hereby release HobbyCue from
          all claims arising from such activity.
        </p>

        <p>
          hobbycue.com, at its sole discretion, may edit, delete, or block
          access to any content without notice or liability. We will, however,
          make reasonable efforts to inform you of the changes. If you create an
          account, your name, address, email, and phone number will be stored
          and used to populate the checkout for future orders. When you purchase
          from us, we'll ask you to provide additional information, including
          credit card/payment details. We'll use this information for purposes
          such as sending you information about your account and order,
          processing payments, and responding to requests. When processing
          payments, some of your data will be passed to the payment gateway,
          including information required to process or support the payment, such
          as the purchase total and billing information.
        </p>

        <h2 className={styles.heading}>Ownership</h2>

        <p>
          Except for the Content submitted by members or users, the hobbycue.com
          Service and all aspects thereof, including all copyrights, trademarks,
          and other intellectual property or proprietary rights therein, are
          owned by hobbycue.com. You acknowledge that the hobbycue.com and any
          underlying technology or software used in connection with the
          hobbycue.com Service contain hobbycue.com’s proprietary information.
          You may not modify, reproduce, distribute, create derivative works of,
          publicly display, or in any way exploit any of the content, software,
          and/or materials available on the hobbycue.com Site or hobbycue.com
          Services in whole or in part except as expressly provided in
          hobbycue.com’s policies and procedures. Except as expressly and
          unambiguously provided herein, hobbycue.com and its suppliers do not
          grant you any express or implied rights, and all rights in the
          hobbycue.com Service not expressly granted by hobbycue.com to you are
          retained by hobbycue.com.
        </p>

        <h2 className={styles.heading}>Limitation of Liability</h2>

        <p>
          The site, content, and services are provided as is, without warranty
          or condition of any kind, either expressed or implied. In no event
          shall hobbycue.com be liable for any direct, indirect, incidental,
          consequential damages whatsoever, including, but not limited to,
          damages for the loss of profits, goodwill, use, data, or other
          intangible losses resulting from the use or the inability to use our
          services.
        </p>

        <p>
          hobbycue.com makes no warranty that the sites, content, or services
          will meet your requirements or be available on an uninterrupted,
          secure, or error-free basis. While we would put in best efforts,
          hobbycue.com makes no warranty regarding the quality of any products,
          services, accuracy, timeliness, truthfulness, completeness, or
          information purchased or obtained through the sites, content, or
          services.
        </p>
      </div>
    </div>
  )
}

export default Terms
