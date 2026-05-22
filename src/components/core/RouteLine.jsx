import { useEffect } from "react";
import { useMap } from "react-leaflet"; // ✅ useMap hook
import L from "leaflet";
import "leaflet-routing-machine";

function RouteLine({ userLocation, destination }) {
  const map = useMap(); // ✅ window.mapInstance nahi — proper React-Leaflet way

  useEffect(() => {
    if (!userLocation || !destination || !map) return;

    const control = L.Routing.control({
      waypoints: [
        L.latLng(userLocation[0], userLocation[1]),
        L.latLng(destination[0], destination[1]),
      ],
      lineOptions: {
        styles: [{ color: "#3b82f6", weight: 4 }],
      },
      addWaypoints: false,
      draggableWaypoints: false,
      fitSelectedRoutes: false, // MapView khud center handle karta hai
      show: false,              // routing UI panel hide
      createMarker: () => null, // default markers mat dikhao
    }).addTo(map); // ✅ map instance directly

    return () => {
      // Cleanup — component unmount ya location change hone par
      try {
        map.removeControl(control);
      } catch (e) {
        // already removed — ignore
      }
    };
  }, [userLocation, destination, map]);

  return null;
}

export default RouteLine;