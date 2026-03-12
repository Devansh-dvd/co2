import mongoose from 'mongoose';

const vehicleRouteSchema = new mongoose.Schema({
  vehicleId: { type: String, required: true },
  vehicleType: { type: String, enum: ['engine', 'ev'], required: true },
  mileageKmpl: { type: Number },
  evRange: { type: Number },
  distanceKm: { type: Number, required: true },
  duration: { type: String, required: true },
  fuelConsumedLitres: { type: Number, default: 0 },
  co2EmittedKg: { type: Number, required: true },
  isSufficient: { type: Boolean },
  geometry: { type: Object },
});

const fleetSchema = new mongoose.Schema(
  {
    currentLocation: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
      address: { type: String, required: true },
    },

    destination: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
      address: { type: String, required: true },
    },

    totalVehicles: { type: Number, required: true },

    vehicles: [vehicleRouteSchema],

    fleetSummary: {
      totalCo2EmittedKg: { type: Number, required: true },
      totalFuelConsumedLitres: { type: Number, required: true },
      avgCo2PerVehicleKg: { type: Number, required: true },
      totalTreesEquivalent: { type: Number },
    },
  },
  { timestamps: true }
);

const Fleet = mongoose.model('Fleet', fleetSchema);

export default Fleet;