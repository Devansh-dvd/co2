import fetch from 'node-fetch';

const OSRM_BASE = 'https://router.project-osrm.org/route/v1/driving';
const NOMINATIM_BASE = 'https://nominatim.openstreetmap.org';
const CO2_PER_LITRE = 2.31;

const geocodeAddress = async (address) => {
  const url = `${NOMINATIM_BASE}/search?q=${encodeURIComponent(address)}&format=json&limit=1`;
  const res = await fetch(url, { headers: { 'User-Agent': 'co2-app/1.0' } });
  const data = await res.json();
  if (!data.length) throw new Error(`Location not found: ${address}`);
  return {
    lat: parseFloat(data[0].lat),
    lng: parseFloat(data[0].lon),
  };
};

const fetchRoutes = async (originCoords, destCoords) => {
  const url =
    `${OSRM_BASE}/` +
    `${originCoords.lng},${originCoords.lat};` +
    `${destCoords.lng},${destCoords.lat}` +
    `?alternatives=3&geometries=geojson&overview=full`;
  const res = await fetch(url);
  const data = await res.json();
  if (data.code !== 'Ok') throw new Error(`OSRM error: ${data.message || 'Failed to fetch routes'}`);
  return data.routes;
};

const calculateCO2 = (distanceKm, mileageKmpl) => {
  const fuelConsumed = parseFloat((distanceKm / mileageKmpl).toFixed(2));
  const co2Emitted = parseFloat((fuelConsumed * CO2_PER_LITRE).toFixed(2));
  return { fuelConsumed, co2Emitted };
};

const formatDuration = (seconds) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return h > 0 ? `${h} hr ${m} mins` : `${m} mins`;
};

export const getAllRoutes = async (origin, destination, mileageKmpl, evRange) => {
  const [originCoords, destCoords] = await Promise.all([
    geocodeAddress(origin),
    geocodeAddress(destination),
  ]);

  const rawRoutes = await fetchRoutes(originCoords, destCoords);

  const routes = rawRoutes.map((route, index) => {
    const distanceKm = parseFloat((route.distance / 1000).toFixed(2));
    const durationRaw = route.duration;
    const { fuelConsumed, co2Emitted } = calculateCO2(distanceKm, mileageKmpl);
    const evRangeAfter = parseFloat((evRange - distanceKm).toFixed(2));

    return {
      routeIndex: index + 1,
      distanceKm,
      duration: formatDuration(durationRaw),
      durationSeconds: durationRaw,
      geometry: route.geometry,
      engineVehicle: {
        mileageKmpl,
        fuelConsumedLitres: fuelConsumed,
        co2EmittedKg: co2Emitted,
      },
      evVehicle: {
        totalRangeKm: evRange,
        rangeAfterTrip: evRangeAfter,
        co2EmittedKg: 0,
        isSufficient: evRange >= distanceKm,
      },
      comparison: {
        co2SavedKg: co2Emitted,
        treesEquivalent: parseFloat((co2Emitted / 21).toFixed(1)),
      },
    };
  });

  return routes;
};