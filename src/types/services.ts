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

type UpdateProfilePayload = {
  full_name?: string
  tagline?: string
  display_name?: string
  profile_url?: string
  gender?: 'male' | 'female' | null
  year_of_birth?: string
  phone?: string
  website?: string
  about?: string

  street?: string
  society?: string
  locality?: string
  city?: string
  pin_code?: string
  state?: string
  country?: string
  latitude?: string
  longitude?: string

  is_onboarded?: boolean
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
}
