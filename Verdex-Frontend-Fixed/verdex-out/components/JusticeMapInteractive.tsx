import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const goldIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-gold.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34]
});

function RecenterMap({ location }: { location: any }) {
  const map = useMap();

  useEffect(() => {
    if (location) {
      map.flyTo(
        [location.latitude, location.longitude],
        14,
        { duration: 1.5 }
      );
    }
  }, [location, map]);

  return null;
}

export default function JusticeMapInteractive({ locations, selectedLocation, setSelectedLocation }: any) {
  return (
    <MapContainer
      center={
        selectedLocation
          ? [selectedLocation.latitude, selectedLocation.longitude]
          : [28.6139, 77.2090]
      }
      zoom={13}
      className="w-full h-full rounded-[32px] z-10"
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />
      <RecenterMap location={selectedLocation} />
      
      {locations.map((location: any) => (
        <Marker
          key={location.name}
          position={[location.latitude, location.longitude]}
          icon={goldIcon}
          eventHandlers={{
            click: () => setSelectedLocation(location)
          }}
        >
          <Popup>
            <div className="text-black min-w-[220px]">
              <h3 className="font-bold text-lg">{location.name}</h3>
              <p>{location.type}</p>
              <p>{location.distance} km away</p>
              <p>Queue Time: {location.queueTime}</p>
              <p>Success Rate: {location.successRate}</p>
              <p>Languages: {location.languages?.join(", ")}</p>

              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${location.latitude},${location.longitude}`}
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-block rounded-lg bg-[#C9A45C] px-4 py-2 text-black font-medium"
              >
                Get Directions
              </a>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
