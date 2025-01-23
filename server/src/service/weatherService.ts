import dotenv from 'dotenv';
dotenv.config();

// TODO: Define an interface for the Coordinates object
interface Coordinates {
  lat: number;
  lon: number;
}

// TODO: Define a class for the Weather object

// TODO: Complete the WeatherService class
class WeatherService {
  baseURL: string;
  apiKey: string;
  cityName: string;

  constructor() {
    this.baseURL = process.env.API_BASE_URL || "";
    this.apiKey = process.env.API_KEY || "";
    this.cityName = "";
  }
  // TODO: Create fetchLocationData method
  private async fetchLocationData(query: string): Promise<any> {
    const res = await fetch(query);
    const data = await res.json();
    return data;
  }
  // TODO: Create destructureLocationData method
  private destructureLocationData(locationData: Coordinates): Coordinates {
    const { lat, lon } = locationData;
    return { lat, lon };
  }
  // TODO: Create buildGeocodeQuery method
  private buildGeocodeQuery(address: string): string {
    return `${this.baseURL}/geocode/v1/json?q=${address}&key=${this.apiKey}`;
  }
  // TODO: Create buildWeatherQuery method
  private buildWeatherQuery(coordinates: Coordinates): string {
    const { lat, lon } = coordinates;
    return `${this.baseURL}/weather?lat=${lat}&lon=${lon}&appid=${this.apiKey}`;
  }
  // TODO: Create fetchAndDestructureLocationData method
  private async fetchAndDestructureLocationData() {
    const res = await this.fetchLocationData(this.buildGeocodeQuery(this.cityName));
    const locationData = res.results[0].geometry.location;
    const coordinates = this.destructureLocationData(locationData);
  }
  // TODO: Create fetchWeatherData method
  // private async fetchWeatherData(coordinates: Coordinates) {}
  // TODO: Build parseCurrentWeather method
  // private parseCurrentWeather(response: any) {}
  // TODO: Complete buildForecastArray method
  // private buildForecastArray(currentWeather: Weather, weatherData: any[]) {}
  // TODO: Complete getWeatherForCity method
  async getWeatherForCity(city: string) {
    this.cityName = city;

    // GETTING LATITUDE AND LONGITUDE FOR THE CITYNAME
    // http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}
    const res1 = await fetch(`${this.baseURL}/geo/1.0/direct?q=${this.cityName}&appid=${this.apiKey}`)

    const data1 = await res1.json()

    // console.log(data);
    const lat = data1[0].lat;
    const lon = data1[0].lon;


    // GETTING FORECAST FOR NEXT 5 DAYS
    // api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}
    const res2 = await fetch(`${this.baseURL}/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${this.apiKey}`)

    const data2 = await res2.json()

    // console.log(data2);

    const weatherData = data2.list.filter((weatherInfo: any) => {
      return weatherInfo.dt_txt.includes("12:00:00")
    })


    const forecastData = weatherData.map((weatherInfo: any) => {
      return {
        tempF: weatherInfo.main.temp,
        windSpeed: weatherInfo.wind.speed,
        date: weatherInfo.dt_txt.replace("12:00:00", ""),
        humidity: weatherInfo.main.humidity,
        icon: weatherInfo.weather[0].icon,
        iconDescription: weatherInfo.weather[0].description
      }
    })


    // GETTING THE WEATHERDATA FOR CURRENT DAY
    // https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API key}
    const res3 = await fetch(`${this.baseURL}/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${this.apiKey}`)
    const data3 = await res3.json()

    // console.log(data3)

    const currentWeather = {
      city: data3.name,
      date: new Date().toLocaleDateString(),
      icon: data3.weather[0].icon,
      iconDescription: data3.weather[0].description,
      tempF: data3.main.temp,
      windSpeed: data3.wind.speed,
      humidity: data3.main.humidity
    }

    forecastData.unshift(currentWeather);

    console.log(forecastData);


    return forecastData;
  }
}

export default new WeatherService();
