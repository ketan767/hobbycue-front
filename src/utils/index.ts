import DefaultProfileImage from '@/assets/svg/default-profile.svg'

export const validateEmail = (email: string) => {
  let a = String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    )
  return a !== null ? true : false
}
export const validatePassword = (password: string) => {
  let a = String(password).match(
    /(?=[A-Za-z0-9@#$%^&+!=]+$)^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@#$%^&+!=])(?=.{8,}).*$/g,
  )
  return a !== null ? true : false
}

export const isEmptyField = (value: string) => {
  let a = String(value).match(/((\r\n|\n|\r)$)|(^(\r\n|\n|\r))|^\s*$/gm)
  return a !== null ? true : false
}

export const validatePhone = (phone: string) => {
  let a = String(phone).match(/^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/)
  return a !== null ? true : false
}

export const dateFormat = new Intl.DateTimeFormat('en-GB', { month: 'long', day: 'numeric' })

// #TODO
export const DEFAULT_PROFILE_IMAGES = {
  user: DefaultProfileImage,
}
