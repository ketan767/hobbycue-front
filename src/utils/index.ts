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

export const containOnlyNumbers = (value: string) => {
  let a = String(value).match(/^[0-9]*$/gm)
  return a !== null ? true : false
}

export const checkFullname = (value: string) => {
  let a = String(value).match(/\d+$/gm)
  return a !== null ? true : false
}

export const validatePhone = (phone: string) => {
  let a = String(phone).match(
    /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/,
  )
  return a !== null ? true : false
}
export const validateUrl = (url: string) => {
  const regex =
    /^((ftp|http|https):\/\/)?(www.)?(?!.*(ftp|http|https|www.))[a-zA-Z0-9_-]+(\.[a-zA-Z]+)+((\/)[\w#]+)*(\/\w+\?[a-zA-Z0-9_]+=\w+(&[a-zA-Z0-9_]+=\w+)*)?\/?$/

  return regex.test(url)
}

export const dateFormat = new Intl.DateTimeFormat('en-GB', {
  month: 'long',
  day: 'numeric',
})

export const dateFormatShort = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
})

export const checkIfUrlExists = (str: any) => {
  const regex = /(http|https|ftp):\/\/[^\s/$.?#].[^\s]*/g;
  ;

  return regex.test(str)
}

export function getFileType(file: any) {
  if (file.type.match('image.*')) return 'image'

  if (file.type.match('video.*')) return 'video'

  if (file.type.match('audio.*')) return 'audio'

  // etc...

  return 'other'
}

export const isEmpty = (value: string) => {
  if (value === null || value === undefined) return true
  let val = `${value}`
  if (val?.trim() === '') return true
  return false
}
export const getListingTypeName = (num: Number) => {
  return num === 1
    ? 'People'
    : num === 2
    ? 'Place'
    : num === 3
    ? 'Product'
    : 'Program'
}

export const formatDateTime = (dateString: any) => {
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ]
  const date = new Date(dateString)

  const day = date.getDate()
  const month = months[date.getMonth()]
  const year = date.getFullYear().toString().slice(-2)
  const hours = date.getHours()
  const minutes = date.getMinutes()

  return `${day}-${month}-${year}, ${hours}:${minutes}`
}

export const isBrowser = (): boolean => typeof window !== 'undefined';

export const formatDateTimeTwo = (dateString: any) => {
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ]
  const date = new Date(dateString)

  const day = date.getDate()
  const month = months[date.getMonth()]
  const year = date.getFullYear().toString().slice(-2)
  const hours = date.getHours()
  const minutes = date.getMinutes()

  return `${day}-${month}, ${hours}:${minutes}`
}

export const extractPlatform = (deviceString:any) => {
  if (!deviceString) {
    return null;
}
  const keywords = ['linux', 'windows', 'iphone', 'android', 'mac'];
  const regex = new RegExp(keywords.join('|'), 'i');
  const match = deviceString.match(regex); 
  return match ? match[0].toLowerCase() : null; 
}


export const formatPrice = (price: any): string => {
  const priceStr = price.toString();
  const lastThree = priceStr.slice(-3);
  const otherNumbers = priceStr.slice(0, -3);

  if (otherNumbers !== '') {
    const remainingNumbers = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',');
    return `${remainingNumbers},${lastThree}`;
  } else {
    return lastThree;
  }
};
