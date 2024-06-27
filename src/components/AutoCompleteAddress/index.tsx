import React, { useState } from 'react'
import { LoadScript, Autocomplete } from '@react-google-maps/api'

interface AutocompleteInputProps {
  onPlaceSelected: (place: google.maps.places.PlaceResult) => void
  inputValue: string
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const AutocompleteInput: React.FC<AutocompleteInputProps> = ({
  onPlaceSelected,
  inputValue,
  onInputChange,
}) => {
  const [autocomplete, setAutocomplete] =
    useState<google.maps.places.Autocomplete | null>(null)

  const handleLoad = (
    autocompleteInstance: google.maps.places.Autocomplete,
  ) => {
    setAutocomplete(autocompleteInstance)
    console.log('Autocomplete instance loaded:', autocompleteInstance)
  }

  const handlePlaceChanged = () => {
    if (autocomplete) {
      const place = autocomplete.getPlace()
      console.log('Place selected:', place)
      onPlaceSelected(place)
    } else {
      console.log('Autocomplete is not loaded yet!')
    }
  }

  return (
    <LoadScript
      googleMapsApiKey="AIzaSyCSFbd4Cf-Ui3JvMvEiXXs9xfGJaveKO_Y"
      libraries={['places']}
    >
      <Autocomplete onLoad={handleLoad} onPlaceChanged={handlePlaceChanged}>
        <input
          type="text"
          placeholder="Enter a location"
          value={inputValue}
          onChange={onInputChange}
          name="address"
        />
      </Autocomplete>
    </LoadScript>
  )
}

export default AutocompleteInput
