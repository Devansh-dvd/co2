import { getAllRoutes } from '../services/mapservice.js';
import Fleet from '../models/fleetmodel.js';

export const getRoutes = async (req, res) => {
  try {
    const { origin, destination, vehicles } = req.body;

    if (!origin || !destination || !vehicles || !vehicles.length) {
      return res.status(400).json({
        success: false,
        message: 'origin, destination and vehicles array are required',
      });
    }

    const processedVehicles = [];

    for (const vehicle of vehicles) {
      const { vehicleId, vehicleType, mileageKmpl, evRange } = vehicle;

      const routes = await getAllRoutes(origin, destination, mileageKmpl || 1, evRange || 0);

      const bestRoute = routes.reduce((min, route) => {
        return route.distanceKm / (mileageKmpl || 1) < min.distanceKm / (mileageKmpl || 1) ? route : min;
      });

      processedVehicles.push({
        vehicleId,
        vehicleType,
        mileageKmpl: mileageKmpl || null,
        evRange: evRange || null,
        distanceKm: bestRoute.distanceKm,
        duration: bestRoute.duration,
        fuelConsumedLitres: bestRoute.engineVehicle.fuelConsumedLitres,
        co2EmittedKg: vehicleType === 'ev' ? 0 : bestRoute.engineVehicle.co2EmittedKg,
        isSufficient: vehicleType === 'ev' ? bestRoute.evVehicle.isSufficient : true,
        geometry: bestRoute.geometry,
      });
    }

    const totalCo2 = parseFloat(processedVehicles.reduce((sum, v) => sum + v.co2EmittedKg, 0).toFixed(2));
    const totalFuel = parseFloat(processedVehicles.reduce((sum, v) => sum + v.fuelConsumedLitres, 0).toFixed(2));
    const avgCo2 = parseFloat((totalCo2 / processedVehicles.length).toFixed(2));
    const totalTrees = parseFloat((totalCo2 / 21).toFixed(1));

    const fleet = await Fleet.create({
      currentLocation: {
        lat: processedVehicles[0].geometry.coordinates[0][1],
        lng: processedVehicles[0].geometry.coordinates[0][0],
        address: origin,
      },
      destination: {
        lat: processedVehicles[0].geometry.coordinates.at(-1)[1],
        lng: processedVehicles[0].geometry.coordinates.at(-1)[0],
        address: destination,
      },
      totalVehicles: processedVehicles.length,
      vehicles: processedVehicles,
      fleetSummary: {
        totalCo2EmittedKg: totalCo2,
        totalFuelConsumedLitres: totalFuel,
        avgCo2PerVehicleKg: avgCo2,
        totalTreesEquivalent: totalTrees,
      },
    });

    return res.status(200).json({
      success: true,
      fleet,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};