import { Router, type Request, type Response } from 'express';
const router = Router();

import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

// TODO: POST Request with city name to retrieve weather data
router.post('/', async (req: Request, res: Response) => {
  try {
    const { cityName } = req.body;
  
    // TODO: GET weather data from city name
    const weatherData = await WeatherService.getWeatherForCity(cityName);

    // TODO: save city to search history
    await HistoryService.addCity(cityName);

    res.status(200).json(weatherData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// TODO: GET search history
router.get('/history', async (req: Request, res: Response) => {
  // res.send("This is the history get route")

  const history = await HistoryService.getCities();

  res.json(history)
});

// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (req: Request, res: Response) => {});

export default router;
