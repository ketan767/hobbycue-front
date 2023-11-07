import React from 'react'
import { useLoadScript, GoogleMap, Marker } from '@react-google-maps/api'
import styles from './styles.module.css'

type Props = {
  lat: number
  lng: number
}

const MapComponent: React.FC<Props> = ({ lat, lng }) => {
  const mapContainerStyle = {
    height: '195px',
  }

  const center = {
    lat: lat,
    lng: lng,
  }
  console.log(typeof lat, typeof lng)

  console.log(center)
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: 'AIzaSyCSFbd4Cf-Ui3JvMvEiXXs9xfGJaveKO_Y',
  })

  if (loadError) return <div>Error loading maps</div>
  if (!isLoaded) return <div>Loading...</div>

  return (
    <div className={styles.mapContainer}>
      <GoogleMap mapContainerClassName={styles.map} zoom={14} center={center}>
        <Marker position={center} />
      </GoogleMap>
    </div>
  )
}

export default MapComponent
