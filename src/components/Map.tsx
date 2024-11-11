import React, { useEffect, useState } from 'react';
import type {
  MapCameraChangedEvent,
  MapMouseEvent
} from '@vis.gl/react-google-maps';
import {
  APIProvider,
  Map,
  AdvancedMarker
} from '@vis.gl/react-google-maps';
import Button from './ui/Button';

type MapWithMarkerProps = {
  defaultLocation: google.maps.LatLngLiteral;
  markerLocation: google.maps.LatLngLiteral | null;
  setMarkerLocation: (location: google.maps.LatLngLiteral) => void;
};

const MapWithMarker: React.FC<MapWithMarkerProps> = ({
  defaultLocation,
  markerLocation,
  setMarkerLocation,
}) => {

  const [currentLocation, setCurrentLocation] = useState<google.maps.LatLngLiteral | null>(null);
  // Handle map clicks to update the marker location
  const handleMapClick = (event: MapMouseEvent) => {
    if (event.detail.latLng) {
      const newLocation = {
        lat: event.detail.latLng.lat,
        lng: event.detail.latLng.lng,
      };
      setMarkerLocation(newLocation);
    }
  };

  const handleUseCurrent = () => {
    currentLocation && setMarkerLocation(currentLocation)
    console.log("pressedBotton", markerLocation)
  }

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const loc = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setCurrentLocation(loc);
      },
      (error) => {
        console.error('Error fetching location', error);
      }
    );
  }, [setMarkerLocation]);

  return (
    <APIProvider apiKey={"AIzaSyA6Lak5aPrq-wD8kLnj7Rho9GN1nP7mEWQ"} onLoad={() => console.log('Maps API has loaded.')}>
      <Map
        defaultZoom={14}
        defaultCenter={defaultLocation}
        mapId='Your_Map_ID_Here'
        onClick={handleMapClick}
        style={{ height: '50vh', width: '100%' }}
        onCameraChanged={(ev: MapCameraChangedEvent) =>
          console.log('camera changed:', ev.detail.center, 'zoom:', ev.detail.zoom)
        }
      >
        {/* Display the marker at the clicked location */}
        {markerLocation && (
          <AdvancedMarker position={markerLocation}>
            <h3 className="absolute top-[-2rem] left-1/2 transform -translate-x-1/2 bg-white text-red-400 font-semibold border border-gray-300 rounded-lg px-3 py-1 shadow-lg">
              Deliver Here
            </h3>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="red" style={{ width: '48px', height: '48px' }}>
              <path fillRule="evenodd" d="m7.539 14.841.003.003.002.002a.755.755 0 0 0 .912 0l.002-.002.003-.003.012-.009a5.57 5.57 0 0 0 .19-.153 15.588 15.588 0 0 0 2.046-2.082c1.101-1.362 2.291-3.342 2.291-5.597A5 5 0 0 0 3 7c0 2.255 1.19 4.235 2.292 5.597a15.591 15.591 0 0 0 2.046 2.082 8.916 8.916 0 0 0 .189.153l.012.01ZM8 8.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" clipRule="evenodd" />
            </svg>
          </AdvancedMarker>

        )}
        {currentLocation && (
          <AdvancedMarker position={currentLocation}>

            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="green" style={{ width: '48px', height: '48px' }}>
              <path fillRule="evenodd" d="m7.539 14.841.003.003.002.002a.755.755 0 0 0 .912 0l.002-.002.003-.003.012-.009a5.57 5.57 0 0 0 .19-.153 15.588 15.588 0 0 0 2.046-2.082c1.101-1.362 2.291-3.342 2.291-5.597A5 5 0 0 0 3 7c0 2.255 1.19 4.235 2.292 5.597a15.591 15.591 0 0 0 2.046 2.082 8.916 8.916 0 0 0 .189.153l.012.01ZM8 8.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" clipRule="evenodd" />
            </svg>
            <h3 className="absolute bottom-[-2rem] left-1/2 transform -translate-x-1/2 bg-white text-green-400 font-semibold border border-gray-300 rounded-lg px-3 py-1 shadow-lg">
              current
            </h3>
          </AdvancedMarker>

        )}

      </Map>
      {(markerLocation == null || markerLocation !== currentLocation) ? <Button
        onClick={handleUseCurrent}
        className="mc-auto px-3 py-2 mt-3 flex bg-green-400 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75"
      >
        Use current location
      </Button>
        : null}
    </APIProvider>
  );
};

export default MapWithMarker;
