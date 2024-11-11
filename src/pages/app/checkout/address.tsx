import Button from '@/src/components/ui/Button';
import dynamic from 'next/dynamic';
import React, { useState } from 'react';

const MapWithMarker = dynamic(() => import('../../../components/Map'), { ssr: false });
const ParentComponent = () => {
  // Default location (could come from props, state, or API)
  const defaultLocation = { lat: 30.336813, lng: 78.022688 };

  // State to store the selected marker location
  const [markerLocation, setMarkerLocation] = useState<google.maps.LatLngLiteral | null>(defaultLocation);

  // Function to handle sending the location to the backend
  const handleLocationSubmit = async () => {
    if (markerLocation) {
      // Replace this with your actual backend API call
      console.log('Location sent to backend:', markerLocation);
    }
  };

  return (
    <div className="min-h-screen bg-bg-gray pb-14 pt-48 px-32 md:pt-40 lg:pt-36">
      <h1>Select Delivery Location</h1>
      <MapWithMarker
        defaultLocation={defaultLocation}
        markerLocation={markerLocation}
        setMarkerLocation={setMarkerLocation} // Pass the state setter to update the location
      />
      <Button onClick={handleLocationSubmit}>Confirm Location</Button>
    </div>
  );
};

export default ParentComponent;

// Dynamically import the Map component only on the client side
