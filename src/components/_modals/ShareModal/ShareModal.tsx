import React, { useState } from 'react'
import styles from './ShareModal.module.css'
import Image from 'next/image'
import Facebook from '@/assets/svg/facebook-icon.svg'
import Twitter from '@/assets/svg/twitter-icon.svg'
import Instagram from '@/assets/svg/insta-icon.svg'
import Whatsapp from '@/assets/svg/whatsapp.svg'
import {
  EmailShareButton,
  FacebookShareButton,
  HatenaShareButton,
  InstapaperShareButton,
  LineShareButton,
  LinkedinShareButton,
  LivejournalShareButton,
  MailruShareButton,
  OKShareButton,
  PinterestShareButton,
  PocketShareButton,
  RedditShareButton,
  TelegramShareButton,
  TumblrShareButton,
  TwitterShareButton,
  ViberShareButton,
  VKShareButton,
  WhatsappShareButton,
  WorkplaceShareButton,
} from 'react-share'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'

export default function ShareModal() {
  const {shareUrl} = useSelector((state:RootState) => state.modal)
  console.log(shareUrl);
  return (
    <div className={styles['modal-wrapper']}>
      <section className={styles['body']}>
        <FacebookShareButton url={shareUrl}>
          <Image src={Facebook} alt="Facebook" />
        </FacebookShareButton>
        <TwitterShareButton url={shareUrl}>
          <Image src={Twitter} alt="Facebook" />
        </TwitterShareButton>
        <InstapaperShareButton url={shareUrl}>
          <Image src={Instagram} alt="Facebook" />
        </InstapaperShareButton>
        <WhatsappShareButton url={shareUrl}>
          <Image src={Whatsapp} alt="Facebook" />
        </WhatsappShareButton>
      </section>
    </div>
  )
}
