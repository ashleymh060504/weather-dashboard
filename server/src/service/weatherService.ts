import dotenv from 'dotenv';
dotenv.config();

// TODO: Define an interface for the Coordinates object
interface Coordinates {
  lat: number;
  lon: number;
}

// TODO: Define a class for the Weather object
class Weather {
  city: string;
  date: string;
  icon: string;
  iconDescription: string;
  tempF: number;
  windSpeed: number;
  humidity: number;

  constructor(city: string, date: string, icon: string, iconDescription: string, tempF: number, windSpeed: number, humidity: number) {
    this.city = city;
    this.date = date;
    this.icon = icon;
    this.iconDescription = iconDescription;
    this.tempF = tempF;
    this.windSpeed = windSpeed;
    this.humidity = humidity;
  }
}

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
    return `${this.baseURL}/geo/1.0/direct?q=${address}&appid=${this.apiKey}`;
  }

  // TODO: Create fetchAndDestructureLocationData method
  private async fetchAndDestructureLocationData() {
    const res = await this.fetchLocationData(this.buildGeocodeQuery(this.cityName));
    const lat = res[0].lat;
    const lon = res[0].lon;
    const locationData = { lat, lon }
    const coordinates = this.destructureLocationData(locationData);
    return coordinates;
  }

    // TODO: Create buildWeatherQuery method
    private buildWeatherQuery(coordinates: Coordinates): string {
      const { lat, lon } = coordinates;
      return `${this.baseURL}/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${this.apiKey}`;
    }

  // TODO: Create fetchWeatherData method
  private async fetchWeatherData(coordinates: Coordinates) {
    const res = await fetch(this.buildWeatherQuery(coordinates))
    const data = await res.json()
    return data;
  }

  // TODO: Build parseCurrentWeather method
  private parseCurrentWeather(response: any) {
    const weatherData = response.list.filter((weatherInfo: any) => {
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

    return forecastData;
  }
  
  // TODO: Complete buildForecastArray method
  private buildForecastArray(currentWeather: Weather, weatherData: any[]) {
    weatherData.unshift(currentWeather);
    console.log(weatherData);
    return weatherData;
  }

  // TODO: Complete getWeatherForCity method
  async getWeatherForCity(city: string) {
    this.cityName = city;

    // GETTING LATITUDE AND LONGITUDE FOR THE CITYNAME
    // http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}
    // const res1 = await fetch(this.buildGeocodeQuery(this.cityName))

    // const data1 = await res1.json()

    // // console.log(data);
    // const lat = data1[0].lat;
    // const lon = data1[0].lon;

    const coordinates = await this.fetchAndDestructureLocationData()

    const response = await this.fetchWeatherData(coordinates)
    

    // GETTING FORECAST FOR NEXT 5 DAYS
    // api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}
    const forecastData = this.parseCurrentWeather(response)

    // console.log(data2);


    // GETTING THE WEATHERDATA FOR CURRENT DAY
    // https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API key}
    const res3 = await fetch(`${this.baseURL}/data/2.5/weather?lat=${coordinates.lat}&lon=${coordinates.lon}&units=imperial&appid=${this.apiKey}`)
    const data3 = await res3.json()

    // console.log(data3)

    // const currentWeather = {
    //   city: data3.name,
    //   date: new Date().toLocaleDateString(),
    //   icon: data3.weather[0].icon,
    //   iconDescription: data3.weather[0].description,
    //   tempF: data3.main.temp,
    //   windSpeed: data3.wind.speed,
    //   humidity: data3.main.humidity
    // }
    const currentWeather = new Weather(data3.name, new Date().toLocaleDateString(), data3.weather[0].icon, data3.weather[0].description, data3.main.temp, data3.wind.speed, data3.main.humidity)

    const forecastArray = this.buildForecastArray(currentWeather, forecastData)

    return forecastArray;
  }
}

export default new WeatherService();
