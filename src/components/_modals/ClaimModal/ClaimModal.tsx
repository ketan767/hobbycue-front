import React from 'react'

import styles from './style.module.css'

type Props = {
  data: ListingPageData['pageData']
}
const ClaimModal = () => {
  const baseURL =
    window.location.protocol +
    '//' +
    window.location.hostname +
    (window.location.port ? ':' + window.location.port : '')
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
          <section className={styles['two-column-grid']}>
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
          </section>
          <div className={styles['input-box']}>
            <label>Listing Page URL</label>
            <div className={styles['street-input-container']}>
              <input type="text" required name="street" />
              <span>{baseURL + '/page/'}</span>
            </div>
          </div>
          <div className={styles['input-box']}>
            <label>How are you related to this listing?</label>
            <div className={styles['street-input-container']}>
              <input
                className={styles['long-input-box']}
                type="text"
                required
                name="street"
              />
            </div>
          </div>
          <div className={styles['input-box']}>
            <label>Website or Social Media page?</label>
            <div className={styles['street-input-container']}>
              <input type="text" required name="street" />
              <span>{'https://'}</span>
            </div>
          </div>
        </section>
        <footer className={styles['footer']}>
          <button className="modal-footer-btn submit">Claim</button>
        </footer>
      </div>
    </>
  )
}

export default ClaimModal
