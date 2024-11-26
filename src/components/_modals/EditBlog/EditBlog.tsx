import React from 'react'
import styles from './EditBlog.module.css'
import Image from 'next/image'
interface Props {
  setIsModalOpen: any
}

const penIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="17"
    height="17"
    viewBox="0 0 17 17"
    fill="none"
  >
    <g clip-path="url(#clip0_22968_35813)">
      <path
        d="M2.35547 12.0017V14.5017H4.85547L12.2288 7.12833L9.7288 4.62833L2.35547 12.0017ZM14.1621 5.195C14.4221 4.935 14.4221 4.515 14.1621 4.255L12.6021 2.695C12.3421 2.435 11.9221 2.435 11.6621 2.695L10.4421 3.915L12.9421 6.415L14.1621 5.195Z"
        fill="#8064A2"
      />
    </g>
    <defs>
      <clipPath id="clip0_22968_35813">
        <rect
          width="16"
          height="16"
          fill="white"
          transform="translate(0.355469 0.501953)"
        />
      </clipPath>
    </defs>
  </svg>
)
const starIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="19"
    height="19"
    viewBox="0 0 19 19"
    fill="none"
  >
    <path
      d="M9.3554 1.72949L16.0867 5.61586V13.3886L9.3554 17.2749L2.62402 13.3886V5.61586L9.3554 1.72949Z"
      fill="#939CA3"
    />
    <path
      d="M9.04514 5.5235C9.14463 5.22524 9.56649 5.22524 9.66598 5.5235L10.404 7.73536C10.4482 7.86806 10.5719 7.95794 10.7119 7.95905L13.0435 7.97741C13.3579 7.97989 13.4883 8.38111 13.2354 8.56792L11.3599 9.95328C11.2474 10.0364 11.2001 10.1819 11.2422 10.3152L11.9453 12.5384C12.0401 12.8382 11.6988 13.0862 11.443 12.9034L9.54587 11.5477C9.43206 11.4664 9.27906 11.4664 9.16525 11.5477L7.26814 12.9034C7.01232 13.0862 6.67101 12.8382 6.76582 12.5384L7.46887 10.3152C7.51105 10.1819 7.4638 10.0364 7.35128 9.95328L5.47572 8.56792C5.22282 8.38111 5.35318 7.97989 5.66759 7.97741L7.99925 7.95905C8.13913 7.95794 8.26284 7.86806 8.30712 7.73536L9.04514 5.5235Z"
      fill="white"
    />
  </svg>
)
const EditBlog: React.FC<Props> = ({ setIsModalOpen }) => {
  return (
    <section className={styles.mainContainer}>
      <div className={styles.closeButtonContainer}>
        <button
          className={styles.closeButton}
          onClick={() => setIsModalOpen(false)}
        >
          x
        </button>
      </div>

      <div className={styles.containerWrapper}>
        <header className={styles.header}>
          <h2 className={styles.status}>
            Status: <span className={styles.statusSpan}>Draft</span>
          </h2>
          <div className={styles.actionButtons}>
            <button className={styles.previewButton}>Preview</button>
            <button className={styles.publishButton}>Publish</button>
          </div>
        </header>

        {/* blogURL */}
        <div className={styles.blogUrlWrapper}>
          <label className={styles.blogLabel} htmlFor="URL">
            Blog URL <span className={styles.Star}>*</span>{' '}
            <span className={styles.urlSpan}>www.extra.com</span>
          </label>
          <input className={styles.urlInput} type="text" placeholder="URL" />
        </div>

        {/* search pic */}
        <div className={styles.searchPicWrapper}>
          <p className={styles.searchPicText}>
            <span className={styles.searchSpan}>Search Pic:</span>
            <span className={styles.authorSpan}>Author</span>
          </p>
          <div className={styles.searchPicContent}>
            <figure className={styles.searchPicFigure}>
              <Image
                className={styles.searchPicImage}
                height={30}
                width={30}
                src="https://images.unsplash.com/photo-1480455624313-e29b44bbfde1?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt=""
              />
            </figure>
            <div className={styles.searchPicDetails}>
              <h3 className={styles.searchPicTitle}>
                40 Solor Travel Tips to Remember for a Memorable Trip
              </h3>
              <h4 className={styles.searchPicSubtitle}>
                Practical Advise based on Personal Experience
              </h4>
              <p className={styles.searchPicAuthor}>
                Rakesh Shah | 10 Mar 2024
              </p>
            </div>
          </div>
        </div>

        {/* middle content */}
        <div className={styles.middleWrapper}>
          {/* left */}
          <div className={styles.leftContent}>
            <figure className={styles.leftFigure}>
              <Image
                className={styles.leftImage}
                width={30}
                height={30}
                src="https://images.unsplash.com/photo-1622861431895-903d0da34168?q=80&w=1886&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="profile cover"
              />
            </figure>
            <h3 className={styles.leftTitle}>
              40 solo travel tips to remember for a memorable trip
            </h3>
            <p className={styles.leftSubtitle}>
              Practical Advise based on Personal Experience
            </p>
            <div className={styles.leftDetails}>
              <p className={styles.leftAuthorInfo}>
                <span className={styles.leftAuthor}>Akash sing</span>
                <span className={styles.leftDate}>12 sep 2023</span>
              </p>
              <p className={styles.leftTags}>
                <span className={styles.leftStarIcon}>{starIcon}</span>
                <span className={styles.leftTag}>photography</span>
                <span className={styles.leftTag}>tour</span>
              </p>
            </div>
          </div>

          {/* right */}
          <div className={styles.rightContent}>
            <h4 className={styles.blogCardHeader}>
              <span className={styles.blogCardText}>Blog Card pic</span>:
              <span className={styles.blogCardType}>Cover</span>
            </h4>
            <h3 className={styles.keywordsHeader}>KeyWords</h3>
            <textarea className={styles.keywordsTextarea} rows={10}></textarea>
            <div className={styles.hobbiesSection}>
              <h2 className={styles.hobbiesHeader}>
                Hobbies <span className={styles.penIcon}>{penIcon}</span>
              </h2>
              <p className={styles.hobbiesButtons}>
                <button className={styles.hobbyButton}>photography</button>
                <button className={styles.hobbyButton}>photography1</button>
                <button className={styles.hobbyButton}>photography2</button>
                <button className={styles.hobbyButton}>photography3</button>
              </p>
            </div>
          </div>
        </div>

        <div className={styles.footerButtons}>
          <button className={styles.backButton}>Back</button>
          <button className={styles.saveButton}>Save</button>
        </div>
      </div>
    </section>
  )
}

export default EditBlog
