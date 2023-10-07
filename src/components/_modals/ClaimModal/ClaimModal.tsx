import React from 'react'

import styles from './style.module.css'

type Props = {
  data: ListingPageData['pageData']
}
const ClaimModal = () => {
  return (
    <>
      <div className={styles['modal-wrapper']}>
        <header className={styles['header']}>
          <h4 className={styles['heading']}>{'Claim Listing'}</h4>
        </header>

        <hr />
        <section className={styles['body']}>
          {/* Logged in as  */}
          <div className={styles['input-box']}>
            <label>Logged In As</label>
            <div className={styles['street-input-container']}>
              <input type="text" required name="street" />
            </div>
          </div>
          <div className={styles['input-box']}>
            <label>Email ID</label>
            <div className={styles['street-input-container']}>
              <input type="text" required name="street" />
            </div>
          </div>
          <div className={styles['input-box']}>
            <label>Phone Number</label>
            <div className={styles['street-input-container']}>
              <input type="text" required name="street" />
            </div>
          </div>
          <div className={styles['input-box']}>
            <label>Listing Page URL</label>
            <div className={styles['street-input-container']}>
              <input type="text" required name="street" />
            </div>
          </div>
          <div className={styles['input-box']}>
            <label>How are you related to this listing?</label>
            <div className={styles['street-input-container']}>
              <input type="text" required name="street" />
            </div>
          </div>
          <div className={styles['input-box']}>
            <label>Website or Social Media page?</label>
            <div className={styles['street-input-container']}>
              <input type="text" required name="street" />
            </div>
          </div>
        </section>
        <footer className={styles['footer']}>
          <button className="modal-footer-btn cancel">Claim</button>
        </footer>
      </div>
    </>
  )
}

export default ClaimModal
