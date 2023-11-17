import React, { useState, useEffect, useRef } from 'react'

import styles from './style.module.css'
import { useSelector } from 'react-redux'

type Props = {
  data: ListingPageData['pageData']
}

const ClaimModal = () => {
  const pageURL = window.location.href
  let userData = useSelector((store: any) => store.user.user)
  const [formData, setFormData] = useState({
    profileName: userData.full_name,
    email: userData.email,
    phone: userData.phone,
    pageUrl: pageURL,
    userRelation: '',
    websiteLink: '',
  })


  const handleInputChange = (e: any) => {
    let { value, name } = e.target
    setFormData((prevValue) => ({
      ...prevValue,
      [name]: value,
    }))
  }

  const nextButtonRef = useRef<HTMLButtonElement | null>(null)
  useEffect(() => {
    const handleKeyPress = (event: any) => {
      if (event.key === 'Enter') {
        nextButtonRef.current?.focus()
      }
    }

    window.addEventListener('keydown', handleKeyPress)

    return () => {
      window.removeEventListener('keydown', handleKeyPress)
    }
  }, [])
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
              <input
                type="text"
                required
                name="profileName"
                value={formData.profileName}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <section className={styles['two-column-grid']}>
            <div className={styles['input-box']}>
              <label>Email ID</label>
              <div className={styles['street-input-container']}>
                <input
                  type="text"
                  required
                  name="email"
                  onChange={handleInputChange}
                  value={formData.email}
                />
              </div>
            </div>
            <div className={styles['input-box']}>
              <label>Phone Number</label>
              <div className={styles['street-input-container']}>
                <input
                  type="text"
                  required
                  name="phone"
                  onChange={handleInputChange}
                  value={formData.phone}
                />
              </div>
            </div>
          </section>
          <div className={styles['input-box']}>
            <label>Listing Page URL</label>
            <div className={styles['street-input-container']}>
              <input
                type="text"
                required
                name="pageUrl"
                onChange={handleInputChange}
                value={formData.pageUrl}
              />
            </div>
          </div>
          <div className={styles['input-box']}>
            <label>How are you related to this listing?</label>
            <div className={styles['street-input-container']}>
              <textarea
                className={styles['long-input-box']}
                required
                name="userRelation"
                onChange={handleInputChange}
                value={formData.userRelation}
              />
            </div>
          </div>
          <div className={styles['input-box']}>
            <label>Website or Social Media page?</label>
            <div className={styles['street-input-container']}>
              <input
                type="text"
                required
                name="websiteLink"
                onChange={handleInputChange}
                value={formData.websiteLink}
              />
            </div>
          </div>
        </section>
        <footer className={styles['footer']}>
          <button ref={nextButtonRef} className="modal-footer-btn submit">
            Claim
          </button>
        </footer>
      </div>
    </>
  )
}

export default ClaimModal
