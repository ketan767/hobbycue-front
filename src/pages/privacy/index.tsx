import { withAuth } from '@/navigation/withAuth'
import React from 'react'
import styles from '@/styles/ExplorePage.module.css'

type Props = {}

const Privacy: React.FC<Props> = (props) => {
  return (
    <div
      className={styles['explore-wrapper'] + ` ${styles['side-margin-auto']}`}
    >
      <div className={styles.terms}>
        <h1 className={styles.pageheading}>Privacy Policy</h1>

        <p>[Updated: 27-Nov-2018]</p>

        <h2 className={styles.heading}>Introduction</h2>
        <p>
          Purple Cues Pvt Ltd (“PCPL”) is the licensed owner of the service
          hobbycue.com (also referred to as our website, site, or platform).
          This Privacy Policy applies to information collected when you visit,
          access, or use the services that are available through our website. By
          visiting, accessing, or using our website, you are agreeing to the
          terms of this Privacy Policy.
        </p>
        <h2 className={styles.heading}>Registered User Information</h2>
        <p>
          When you sign up to become a Registered User, you need to provide
          personal information such as your name, email ID, personal phone
          number, password, location, and gender. Our website also prompts you
          to optionally share your profile picture. By submitting your personal
          information on our website, you are explicitly consenting to the use
          of your information for the purpose of enhancing your future
          experience. For our website to recognise you as a registered member,
          you must sign in with your email address and password. And if you do
          not explicitly logout, our website remembers you so that you do not
          have to sign in for any subsequent visits. In such cases, your email
          and password are never shared by our with anybody. In addition,
          Registered Users may choose to use their Facebook or Google login
          accounts to automatically populate certain information on our
          registration page. If you use such third party logins, you are
          authorising us to collect, store, and use, in accordance with this
          Privacy Policy, any and all information that you agreed that Facebook
          or such other third parties could provide to us through their
          application programming interface. You control the information that we
          receive from Facebook or Google including, but not limited to, your
          first and last name, username, profile picture, unique identifiers and
          access tokens, and e-mail address.
        </p>
        <h2 className={styles.heading}>Third-Party Transactions</h2>
        <p>
          If you create an account, your name, address, email and phone number
          will be stored and used to populate the checkout for future orders. If
          you purchase a service, purchase a product, book a venue, or book
          tickets for an event through our website, you will be required to
          provide certain information to our third-party payment processors in
          accordance to the terms and conditions of their privacy policies and
          terms of use. Such information may include a debit or credit card
          number, expiration date, billing and shipping addresses. You authorise
          our third-party payment vendors to collect, process, and store this
          information. We do not store or process this information and disclaim
          any liability that may arise from such transactions.
        </p>
        <h2 className={styles.heading}>Cookies</h2>
        <p>
          Similar to most websites, our website utilises “Cookies” and Web
          server logs to collect information about how our website is used.
          Cookies are small pieces of information that are stored by your
          browser on your computer’s hard drive. Cookies allow Web servers to
          recognise your computer and collect information about how you use our
          website. We use cookies and your website usage information for
          identification and analysis. Most web browsers automatically accept
          cookies. By changing the options on your web browser or using certain
          software programs, you can control how and whether cookies will be
          accepted by your browser. We understand and support your right to
          block cookies. However, blocking cookies may disable certain features
          on our website and may make it impossible for you to use certain
          services available on our website.
        </p>
        <h2 className={styles.heading}>Session Data</h2>
        <p>
          When you view, access, or use our website, we automatically log the
          session data. Session data is general information about your
          computer’s connection to the Internet and is anonymous and not linked
          to any personal information. Session data consists of information such
          as the IP address, operating system, browser used by you and the
          activities conducted by you on our website. We collect session data to
          help us analyse the items users are likely to click on most, the
          manner in which users click preferences on our website, number of
          users browsing our website, frequency and time spent on our website.
          Session data also helps us diagnose problems with our servers and lets
          us administer our systems better. Although such data does not identify
          any visitor personally, it is possible to determine the Internet
          Service Provider (ISP) and the approximate geographic location from an
          IP address.
        </p>
        <h2 className={styles.heading}>Comments</h2>
        <p>
          When you leave comments on our website, we collect the data shown in
          the comments form, your IP address, and browser user agent string to
          help detect any potential spam. An anonymised string created from your
          email address (also called a hash) may be provided to the Gravatar
          service to see if you are using it. You can read the Gravatar service
          Privacy Policy here: https://automattic.com/privacy/
        </p>
        <h2 className={styles.heading}>External Sites</h2>
        <p>
          Our website may contain links to third-party websites (“External
          Sites”). We have no control over the privacy practices of these
          External Sites. These websites may collect data about you, use
          cookies, embed additional third-party tracking, and monitor your
          interaction with that embedded content. As such, we are not
          responsible for the privacy policies of those External Sites. You
          should check the applicable third-party privacy policy and terms of
          use when visiting any External Sites, and before providing any
          personal information to such External Sites.
        </p>
        <h2 className={styles.heading}>Use of Information</h2>
        <p>
          Personal information provided by Registered Users is available to all
          users and visitors of our website. Personal information may also be
          published on our website as a part of any user’s search results. Our
          website authorised third parties, and service partners may use your
          information to support your interaction with us and to provide our
          services and products to you. Our website also collects other personal
          details including, but not limited to your feedback, suggestions,
          views, posts, media, comments, and articles that may be
          shared/volunteered by you on our discussion forums or other pages on
          our website. Such information, being in the public domain, is
          available to all our website’s users and visitors. We are not
          responsible for any third party use of your information, and this
          Privacy Policy does not apply to any information that you share in any
          of the above methods. In addition, please ensure that you do not
          violate any copyright laws if you cross-post information from other
          third party sources. The onus for such compliance is with you and we
          disclaim any liability that way arise from such copyright violations.
        </p>
        <h2 className={styles.heading}>
          Access to Personal and Account Information
        </h2>
        <p>
          If you have an account or posted comments on our website, you may send
          an email request to info@hobbycue.com to receive the personal data we
          hold about you. After you sign in, you may correct or update your
          account information by updating your user profile. Administrators of
          our website may also edit your personal information. You may choose to
          send us an email request to delete your personal data from our
          website. However, we retain the legal right to save any data we are
          obliged to keep for administrative, legal, or security purposes.
        </p>
        <h2 className={styles.heading}>
          Retention Period of Personal Information
        </h2>
        <p>
          We will retain your personal information for as long as it serves the
          purposes for which it was initially collected as stated in this
          Privacy Policy or subsequently authorised. We may continue processing
          your personal information for longer periods, but only for the time
          and to the extent that such processing serves valid purposes such as
          analysis, administrative, legal, and security purposes, and is subject
          to the protection of this Privacy Policy. After such time periods have
          expired, we may either delete your personal information or retain it
          in a form such that it does not identify you personally.
        </p>
        <h2 className={styles.heading}>Data Security and Privacy</h2>
        <p>
          We are committed to the security and privacy of the personal
          information that we collect in accordance with this Privacy Policy. We
          will implement reasonable and appropriate security measures to protect
          your personal information from loss, misuse and unauthorised access,
          disclosure, alteration and destruction, taking into account the risks
          involved in the processing and the nature of such data, and comply
          with applicable laws and regulations.
        </p>
        <h2 className={styles.heading}>Disclosure to Third Parties</h2>
        <p>
          We may be required to disclose personal information in response to
          lawful requests by public authorities or third parties, including, but
          not limited to purposes such as judicial and legal requirements,
          regulatory compliance, outsourcing our support services, and
          protection of any and all of our rights or property.
        </p>
        <h2 className={styles.heading}>Children’s Privacy</h2>
        <p>
          We require that users of the site are at least 13 years old and have
          their own e-mail ID. We do not knowingly collect any personal
          information from children under the age of 13 through our website. If
          you are under the age of 13, please do not give us any personal
          information. We encourage parents and legal guardians to monitor their
          children’s Internet usage and to help enforce our Privacy Policy by
          instructing their children never to provide personal information to us
          without their permission. If you have reason to believe that a child
          under the age of 13 has provided personal information to us, please
          contact us at info@hobbycue.com so that we may take immediate steps to
          delete the child’s information.{' '}
        </p>
        <h2 className={styles.heading}>Revisions to this Privacy Policy</h2>
        <p>
          This Privacy Policy is effective as of the date stated at the top of
          this Privacy Policy. However, in connection with specific products or
          services offered by us, you may be provided with privacy policies or
          statements that substitute or supplement this Privacy Policy. In
          addition, we may change this Privacy Policy from time to time and post
          the changes on our website as soon as they go into effect. Please
          refer to this Privacy Policy on a regular basis. By accessing or using
          our website after we make any changes to this Privacy Policy, you are
          deemed to have accepted such changes.
        </p>
        <h2 className={styles.heading}>Queries / Concerns</h2>
        <p>
          For any queries or concerns regarding the Privacy Policy of our
          website, you may send an email to info@hobbycue.com
        </p>
      </div>
    </div>
  )
}

export default Privacy
