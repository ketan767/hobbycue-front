export interface Blog {
  _id: string
  title: string
  url: string
  _hobbies: BlogHobby[]
  tags: string[]
  status: 'Draft' | 'Pending' | 'Published'
  author: Author
  keywords: string[]
  sections: Section[]
  createdAt: string // ISO date string
  updatedAt: string // ISO date string
  tagline: string
  cover_pic: string | null
  content: string
  up_votes: VoteData
  down_votes: VoteData
}

export interface BlogHobby {
  _id: string
  blog_id: string
  hobby: HobbyDetails
  genre: HobbyDetails
  createdAt: string // ISO date string
  updatedAt: string // ISO date string
}

export interface HobbyDetails {
  _id: string
  slug: string
  display: string
}

export interface VoteData {
  count: number
  _users: string[] // Array of user IDs
}

export interface Author {
  phone: PhoneInfo
  whatsapp_number: PhoneInfo
  facebook: SocialMedia
  google: GoogleData
  _id: string
  email: string
  password: string | null
  is_admin: boolean
  is_password: boolean
  verified: boolean
  otp: string | null
  otp_expiry_time: string | null
  otp_for: string | null
  _sessions: string[]
  _search_history: string[]
  is_onboarded: boolean
  is_account_activated: boolean
  deactivation_date: string | null
  full_name: string
  tagline: string
  display_name: string
  profile_url: string
  gender: string | null
  year_of_birth: number | null
  public_email: string
  website: string | null
  social_media_urls: string | null
  about: string | null
  profile_image: string
  cover_image: string | null
  _hobbies: string[] // Array of hobby IDs
  _addresses: string[] // Array of address IDs
  primary_address: string
  pinned_post: string | null
  _listings: string[]
  wp_data: string | null
  registration_type: string
  last_loggedIn_via: string
  onboarding_step: string
  completed_onboarding_steps: string[]
  show_welcome: boolean
  last_login: string // ISO date string
  images: string[]
  createdAt: string // ISO date string
  updatedAt: string // ISO date string
}

export interface PhoneInfo {
  number: string | null
  prefix: string | null
}

export interface SocialMedia {
  id: string | null
  email: string | null
  picture: string | null
}

export interface GoogleData {
  email: string | null
  id: string
  picture: string
}

export interface Section {
  subTitle?: string
  text?: string
  image?: string
  imageSize?: string
  imageAlignment?: string
  imageTextWrap?: string
}
