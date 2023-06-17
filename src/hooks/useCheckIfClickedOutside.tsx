import React, { useRef, useEffect } from 'react'

/**
 * Hook that alerts clicks outside of the passed ref
 */
function useCheckIfClickedOutside(ref: React.MutableRefObject<any>, cb: () => void) {
  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event: any) {
      if (ref.current && !ref.current.contains(event.target)) {
        cb()
      }
    }
    // Bind the event listener
    document.addEventListener('click', handleClickOutside)
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('click', handleClickOutside)
    }
  }, [ref])
}

export default useCheckIfClickedOutside
