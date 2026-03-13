import Request from "../models/requestmodel.js";
import { getAllRoutes } from "../services/mapservice.js";

export const registerVehicle = async (req, res) => {
  try {
    const {
      vehicleId,
      vehicleType,
      currentLocation,
      destination,
      engineVehicle,
      evVehicle,
    } = req.body;

    if (!vehicleId || !vehicleType || !currentLocation || !destination) {
      return res.status(400).json({
        success: false,
        message:
          "vehicleId, vehicleType, currentLocation and destination are required",
      });
    }

    if (vehicleType === "ev" && !evVehicle?.distanceRange) {
      return res.status(400).json({
        success: false,
        message: "evVehicle.distanceRange is required for EV vehicles",
      });
    }

    if (
      (vehicleType === "petrol" || vehicleType === "diesel") &&
      !engineVehicle?.mileage
    ) {
      return res.status(400).json({
        success: false,
        message: "engineVehicle.mileage is required for petrol/diesel vehicles",
      });
    }

    const vehicle = await Request.create({
      vehicleId,
      vehicleType,
      currentLocation,
      destination,
      engineVehicle: vehicleType !== "ev" ? engineVehicle : undefined,
      evVehicle: vehicleType === "ev" ? evVehicle : undefined,
    });

    const mileageKmpl = engineVehicle?.mileage || 1;
    const evRange = evVehicle?.distanceRange || 0;


    const originCoords = {
      lat: vehicle.currentLocation.lat,
      lng: vehicle.currentLocation.lng,
    };

    const destCoords = {
      lat: vehicle.destination.lat,
      lng: vehicle.destination.lng,
    };

    
    const routes = await getAllRoutes(
      originCoords,
      destCoords,
      mileageKmpl,
      evRange
    );

    // Find best route
    const bestRoute = routes.reduce((min, route) => {
      return route.distanceKm / mileageKmpl < min.distanceKm / mileageKmpl
        ? route
        : min;
    });

    return res.status(201).json({
      success: true,
      message: "Vehicle registered and routes calculated",
      vehicle,
      totalRoutes: routes.length,
      bestRoute,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: `Vehicle with id ${req.body.vehicleId} already exists`,
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};