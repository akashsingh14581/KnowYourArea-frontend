export const getRoute = async (start, end) => {
  try {
    const url = `https://router.project-osrm.org/route/v1/driving/${
      start[1]
    },${start[0]};${end[1]},${end[0]}?overview=full&geometries=geojson&alternatives=true`;

    const res = await fetch(url);
    const data = await res.json();

    if (!data.routes?.length) return [];

    // always pick best route (OSRM already ranks it)
    const bestRoute = data.routes[0];

    return bestRoute.geometry.coordinates.map(([lng, lat]) => [
      lat,
      lng,
    ]);
  } catch (err) {
    console.log("Route error:", err);
    return [];
  }
};