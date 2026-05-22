import { useMap } from "react-leaflet";
import { useEffect, useRef } from "react";

function ChangeMapCenter({ center }) {
  const map = useMap();
  const lastCenterRef = useRef(null);
  const timeoutRef    = useRef(null);

  useEffect(() => {
    if (!center) return;

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    // Same center pe dobara flyTo mat karo
    if (
      lastCenterRef.current &&
      lastCenterRef.current[0] === center[0] &&
      lastCenterRef.current[1] === center[1]
    ) return;

    lastCenterRef.current = center;

    timeoutRef.current = setTimeout(() => {
      map.flyTo(center, 16, {
        animate: true,
        duration: 0.8,
        easeLinearity: 0.25,
      });
    }, 50);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [center, map]);

  return null;
}

export default ChangeMapCenter;