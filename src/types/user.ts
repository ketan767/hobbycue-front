import React, { useState } from 'react'

// Full User interface
interface PhoneNumber {
  number: string | null
  prefix: string | null
}

interface SocialMedia {
  id: string | null
  email: string | null
  picture: string | null
}

interface Preferences {
  community_view: {
    preferred_hobby: {
      hobby: string | null
      genre: string | null
    }
    preferred_location: string | null
    all_locations: boolean
    all_hobbies: boolean
    my_hobbies: boolean
  }
  create_post_pref: {
    preferred_hobby: {
      hobby: string | null
      genre: string | null
    }
    preferred_location: string | null
    all_locations: boolean
    all_hobbies: boolean
  }
  email_visibility: string
  location_visibility: string
  phone_visibility: string
}

interface Session {
  _id: string
  user_id: string
  token: string
  expires_at: string
  LoggedIn_via: string
  device: string
  browser: string
  __v: number
}

export interface User {
  phone: PhoneNumber
  whatsapp_number: PhoneNumber
  facebook: SocialMedia
  google: {
    email: string | null
    id: string | null
    picture: string | null
  }
  preferences: Preferences
  _id: string
  email: string
  is_admin: boolean
  is_password: boolean
  verified: boolean
  otp_for: string | null
  _sessions: Session[]
  _search_history: string[]
  is_onboarded: boolean
  is_account_activated: boolean
  deactivation_date: string | null
  full_name: string
  tagline: string
  display_name: string
  profile_url: string | null
  gender: string | null
  year_of_birth: number | null
  public_email: string | null
  website: string | null
  social_media_urls: string[] | null
  about: string | null
  profile_image: string | null
  cover_image: string | null
  _hobbies: string[]
  _addresses: string[]
  primary_address: string | null
  pinned_post: string | null
  _listings: string[]
  wp_data: string | null
  registration_type: string
  last_loggedIn_via: string
  onboarding_step: string
  completed_onboarding_steps: string[]
  show_welcome: boolean
  last_login: string // ISO Date string
  images: string[]
  createdAt: string // ISO Date string
  updatedAt: string // ISO Date string
}
