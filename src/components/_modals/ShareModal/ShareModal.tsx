import React, { useState } from 'react'
import styles from './ShareModal.module.css'
import Image from 'next/image'
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
import Facebook from '@/assets/svg/share/facebook.svg'
import Twitter from '@/assets/svg/share/twitter.svg'
import Whatsapp from '@/assets/svg/share/whatsapp.svg'
import Telegram from '@/assets/svg/share/telegram.svg'
import Linkedin from '@/assets/svg/share/linkedin.svg'
import Instagram from '@/assets/svg/share/instagram.svg'
import Mail from '@/assets/svg/share/mail.svg'
import Copy from '@/assets/svg/share/copy.svg'
import { closeModal } from '@/redux/slices/modal'
import { useDispatch } from 'react-redux'
import { SnackbarState } from '../ModalManager'

type Props = {
  triggerSnackbar:(data:SnackbarState)=>void
}

const ShareModal:React.FC<Props>=({triggerSnackbar})=>{
  const dispatch = useDispatch()
  const { shareUrl } = useSelector((state: RootState) => state.modal)

  const handleInstagramShare = () => {
    const instagramShareLink = `https://www.instagram.com/?caption=${shareUrl}`
    window.open(instagramShareLink, '_blank')
  }

  const handleModalClose=()=>{
    navigator.clipboard.writeText(shareUrl)
    dispatch(closeModal())
    triggerSnackbar?.({
      show:true,
      message:'Link Copied'
    })
  }

  return (
    <div className={styles['modal-wrapper']}>
      <section className={styles['body']}>
        <FacebookShareButton url={shareUrl}>
          <Image src={Facebook} alt="Facebook" />
          Facebook
        </FacebookShareButton>
        <TwitterShareButton url={shareUrl}>
          <Image src={Twitter} alt="Twitter" />
          Twitter
        </TwitterShareButton>
        <WhatsappShareButton url={shareUrl}>
          <Image src={Whatsapp} alt="Whatsapp" />
          WhatsApp
        </WhatsappShareButton>
        <TelegramShareButton url={shareUrl}>
          <Image src={Telegram} alt="Telegram" />
          Telegram
        </TelegramShareButton>

        <LinkedinShareButton url={shareUrl}>
          <Image src={Linkedin} alt="Linkedin" />
          LinkedIn
        </LinkedinShareButton>

        <button onClick={handleInstagramShare}>
          <Image src={Instagram} alt="Instagram" />
          Instagram
        </button>

        <EmailShareButton url={shareUrl}>
          <Image src={Mail} alt="Mail" />
          Mail
        </EmailShareButton>

        <button
          onClick={handleModalClose}
        >
          <Image src={Copy} alt="Copy" />
          Copy Link
        </button>
      </section>
    </div>
  )
}


export default ShareModal