type CallbackFunction = (err: any, res: any) => void
type ApiReturnObject = { res: any; err: any }

interface SignInPayload {
  email: string
  password: string
}

interface RegisterPayload {
  email: string
  otp: string
}
interface ChangePasswordPayload {
  currentPassword: string
  newPassword: string
}

type UpdateProfilePayload = {
  full_name?: string
  tagline?: string
  display_name?: string
  profile_url?: string
  gender?: 'male' | 'female' | null
  year_of_birth?: string
  phone?: {number: string, prefix: string}
  website?: string
  about?: string
  public_email?: string
  street?: string
  society?: string
  locality?: string
  city?: string
  pin_code?: string
  state?: string
  country?: string
  latitude?: string
  longitude?: string
  video_url?: string
  images?: any
  is_onboarded?: boolean
  pinned_post?: string
  _hobbies? : any
  social_media_urls?: any
  primary_address?: any;
  onboarding_step?: string;
  completed_onboarding_steps?: any;
  show_welcome?: any
}

type ProfileAddressPayload = {
  street: string
  society: string
  locality: string
  city: string
  pin_code: string
  state: string
  country: string
  latitude: string
  longitude: string
  set_as_primary?: boolean
  onboarding_step?: string
  completed_onboarding_steps?: any
}

interface ClaimListingPayload {
  userId?: string,
   listingId?: any,
  name: string
  email: string
  phonenumber: string
  phonePrefix: string
  pageUrl: string
  HowRelated: string
  link: string
}

interface InvitetoHobbycuePayload {
  to:string
}

interface InviteToCommunityPayload {
  to:string
  name: string
  _id: string
  hobby_id: string
  location: string
}

interface ContactToOwner {
  to:string
  name:string
  senderName:string
  sub:string
  message:string
  
}

interface ContactUspayload {
  name: string;
  email: string;
  phone: {
    number: string | null;
    prefix: string | null;
  };
  whatsapp_number?: {
    number: string | null;
    prefix: string | null;
  };
  YouAre: string;
  Regarding: string;
  description: string | null;
  user_id: string 
}

interface supportPayload {
  description: string
  name?: string
  email?: string
  user_id?: string
  type: string

}


interface ReportPayload {
  description: string
  name?: string
  email?: string
  user_id?: string
  type: string
  reported_user_id?:string
}