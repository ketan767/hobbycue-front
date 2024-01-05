// components/AudioPlayer.tsx
import dynamic from 'next/dynamic'
import React, { useEffect, useState } from 'react'

const AudioPlayer = dynamic(() => import('react-h5-audio-player'), {
  ssr: false,
  loading: () => <div>Loading...</div>,
})

interface AudioProps {
  audioSrc: string
}

const AudioPlayerComponent: React.FC<AudioProps> = ({ audioSrc }) => {
  const [src, setSrc] = useState('')

  useEffect(() => {
    // Set the audio source when the component mounts or the audioSrc prop changes
    if (audioSrc) {
      setSrc(`/audio/${audioSrc}.mp4`)
    }
  }, [audioSrc])

  return (
    <div>
      <AudioPlayer
        src={src}
        autoPlay
        showJumpControls={false}
        customAdditionalControls={[]}
        customVolumeControls={[]}
        layout="horizontal-reverse"
        style={{ width: '100%' }}
      />
    </div>
  )
}

export default AudioPlayerComponent
