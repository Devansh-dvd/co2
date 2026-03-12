import { getAllRoutes } from '../services/mapservice.js';

export const getRoutes = async (req, res) => {
  try {
    const { origin, destination, mileageKmpl, evRange } = req.body;

    if (!origin || !destination || !mileageKmpl || !evRange) {
      return res.status(400).json({
        success: false,
        message: 'origin, destination, mileageKmpl and evRange are required',
      });
    }

    const routes = await getAllRoutes(origin, destination, mileageKmpl, evRange);

    return res.status(200).json({
      success: true,
      totalRoutes: routes.length,
      routes,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};