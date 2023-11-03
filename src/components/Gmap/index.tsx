import React from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import styles from './styles.module.css'

type Props = {
  lat: any
  lng: any
}

const MapComponent: React.FC<Props> = ({ lat, lng }) => {
  const position = [lat, lng]

  return (
    <MapContainer className={styles['map-container']}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker position={position}>
        <Popup>
          A pretty CSS3 popup. <br /> Easily customizable.
        </Popup>
      </Marker>
    </MapContainer>
  )
}

export default MapComponent
