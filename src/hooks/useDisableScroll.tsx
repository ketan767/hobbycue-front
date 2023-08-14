import { useEffect } from 'react'

//detects if clicked outside elementref
export default function useDisableScroll(ref: any) {
  ref?.current?.addEventListener('scroll', () => {
    if (
      ref?.current?.scrollTop === 0 &&
      ref?.current?.scrollHeight <= ref?.current?.clientHeight
    ) {
      ref?.current?.classList.add('hide-scrollbar')
    } else {
      ref?.current?.classList.remove('hide-scrollbar')
    }
  })
}
