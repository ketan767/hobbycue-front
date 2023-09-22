import React, { useState } from 'react'
import styles from './styles.module.css'
import PageContentBox from '@/layouts/PageContentBox'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { openModal } from '@/redux/slices/modal'
import Tooltip from '@/components/Tooltip/ToolTip'
import FacebookIcon from '@/assets/svg/Facebook.svg'
import TwitterIcon from '@/assets/svg/Twitter.svg'
import InstagramIcon from '@/assets/svg/Instagram.svg'
import BehanceIcon from '@/assets/svg/Behance.svg'
import BGGIcon from '@/assets/svg/BGG.svg'
import ChessIcon from '@/assets/svg/Chess.com.svg'
import DeviantArtIcon from '@/assets/svg/DeviantArt.svg'
import GoodreadsIcon from '@/assets/svg/GoodReads.svg'
import PinterestIcon from '@/assets/svg/Pinterest.svg'
import SmuleIcon from '@/assets/svg/Smule.svg'
import SoundCloudIcon from '@/assets/svg/Soundcloud.svg'
import StravaIcon from '@/assets/svg/Strava.svg'
import TripAdvisorIcon from '@/assets/svg/Tripadvisor.svg'
import UltimateGuitarIcon from '@/assets/svg/Ultimate-Guitar.svg'
import YouTubeIcon from '@/assets/svg/Youtube.svg'
import Image from 'next/image'
import Link from 'next/link'

type Props = {
  data: ProfilePageData['pageData']
}

const ProfileSocialMediaSide = ({ data }: Props) => {
  const { profileLayoutMode } = useSelector((state: RootState) => state.site)
  const { user } = useSelector((state: any) => state.user)
  console.log('user', user)

  const dispatch = useDispatch()
  return (
    <>
      <PageContentBox
        showEditButton={profileLayoutMode === 'edit'}
        onEditBtnClick={() =>
          dispatch(openModal({ type: 'social-media-edit', closable: true }))
        }
      >
        <h4 className={styles['heading']}>Social Media</h4>
        <ul className={styles['contact-wrapper']}>
          {user?.social_media_urls?.facebook_url && (
            <Tooltip title="Facebook">
              <Link href={user.social_media_urls.facebook_url}>
                <Image src={FacebookIcon} alt="Facebook" />
              </Link>
            </Tooltip>
          )}
          {user?.social_media_urls?.twitter_url && (
            <Tooltip title="Twitter">
              <Link href={user.social_media_urls.twitter_url}>
                <Image src={TwitterIcon} alt="Twitter" />
              </Link>
            </Tooltip>
          )}
          {user?.social_media_urls?.instagram_url && (
            <Tooltip title="Instagram">
              <Link href={user.social_media_urls.instagram_url}>
                <Image src={InstagramIcon} alt="Instagram" />
              </Link>
            </Tooltip>
          )}
          {user?.social_media_urls?.behance_url && (
            <Tooltip title="Behance">
              <Link href={user.social_media_urls.behance_url}>
                <Image src={BehanceIcon} alt="Behance" />
              </Link>
            </Tooltip>
          )}
          {user?.social_media_urls?.bgg_url && (
            <Tooltip title="BoardGameGeek">
              <Link href={user.social_media_urls.bgg_url}>
                <Image src={BGGIcon} alt="BoardGameGeek" />
              </Link>
            </Tooltip>
          )}
          {user?.social_media_urls?.chess_url && (
            <Tooltip title="Chess">
              <Link href={user.social_media_urls.chess_url}>
                <Image src={ChessIcon} alt="Chess" />
              </Link>
            </Tooltip>
          )}
          {user?.social_media_urls?.deviantarts_url && (
            <Tooltip title="DeviantArt">
              <Link href={user.social_media_urls.deviantarts_url}>
                <Image src={DeviantArtIcon} alt="DeviantArt" />
              </Link>
            </Tooltip>
          )}
          {user?.social_media_urls?.goodreads_url && (
            <Tooltip title="Goodreads">
              <Link href={user.social_media_urls.goodreads_url}>
                <Image src={GoodreadsIcon} alt="Goodreads" />
              </Link>
            </Tooltip>
          )}
          {user?.social_media_urls?.pinterest_url && (
            <Tooltip title="Pinterest">
              <Link href={user.social_media_urls.pinterest_url}>
                <Image src={PinterestIcon} alt="Pinterest" />
              </Link>
            </Tooltip>
          )}
          {user?.social_media_urls?.smule_url && (
            <Tooltip title="Smule">
              <Link href={user.social_media_urls.smule_url}>
                <Image src={SmuleIcon} alt="Smule" />
              </Link>
            </Tooltip>
          )}
          {user?.social_media_urls?.soundcloud_url && (
            <Tooltip title="SoundCloud">
              <Link href={user.social_media_urls.soundcloud_url}>
                <Image src={SoundCloudIcon} alt="SoundCloud" />
              </Link>
            </Tooltip>
          )}
          {user?.social_media_urls?.strava_url && (
            <Tooltip title="Strava">
              <Link href={user.social_media_urls.strava_url}>
                <Image src={StravaIcon} alt="Strava" />
              </Link>
            </Tooltip>
          )}
          {user?.social_media_urls?.tripadvisor_url && (
            <Tooltip title="TripAdvisor">
              <Link href={user.social_media_urls.tripadvisor_url}>
                <Image src={TripAdvisorIcon} alt="TripAdvisor" />
              </Link>
            </Tooltip>
          )}
          {user?.social_media_urls?.ultimate_guitar_url && (
            <Tooltip title="Ultimate Guitar">
              <Link href={user.social_media_urls.ultimate_guitar_url}>
                <Image src={UltimateGuitarIcon} alt="Ultimate Guitar" />
              </Link>
            </Tooltip>
          )}
          {user?.social_media_urls?.youtube_url && (
            <Tooltip title="YouTube">
              <Link href={user.social_media_urls.youtube_url}>
                <Image src={YouTubeIcon} alt="YouTube" />
              </Link>
            </Tooltip>
          )}
        </ul>
      </PageContentBox>
    </>
  )
}

export default ProfileSocialMediaSide
