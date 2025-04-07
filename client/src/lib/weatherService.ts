// Mock data for the weather service
// This will be replaced by real API calls in a production app

export const fetchWeatherData = async (city: string) => {
  // In a real app, this would make an API call to a weather service
  // with the city name and return the real weather data
  
  // For now, return mock data that matches the expected structure
  return {
    location: {
      name: "Los Angeles",
      region: "California",
      country: "USA",
      lat: 34.05,
      lon: -118.24,
      tz_id: "America/Los_Angeles",
      localtime: new Date().toISOString(),
    },
    current: {
      temp_c: 12,
      temp_f: 53.6,
      condition: {
        text: "Partly Cloudy",
        icon: "//cdn.weatherapi.com/weather/64x64/day/116.png",
        code: 1003
      },
      wind_kph: 0,
      wind_mph: 0,
      humidity: 87,
      cloud: 75,
      feelslike_c: 12,
      feelslike_f: 53.6,
      precip_mm: 0.1,
      uv: 4
    },
    forecast: {
      forecastday: [
        {
          date: new Date().toISOString().split('T')[0],
          day: {
            maxtemp_c: 26,
            maxtemp_f: 78.8,
            mintemp_c: 11,
            mintemp_f: 51.8,
            condition: {
              text: "Partly Cloudy",
              icon: "//cdn.weatherapi.com/weather/64x64/day/116.png",
              code: 1003
            },
            uv: 4
          },
          astro: {
            sunrise: "6:18 AM",
            sunset: "7:27 PM",
            moonrise: "9:15 PM",
            moonset: "8:40 AM",
            moon_phase: "Waning Gibbous",
            moon_illumination: "78"
          },
          hour: Array.from({ length: 24 }, (_, i) => ({
            time: new Date(new Date().setHours(i, 0, 0, 0)).toISOString(),
            temp_c: 14 + Math.sin(i / 24 * Math.PI * 2) * 8,
            condition: {
              text: "Partly Cloudy",
              icon: "//cdn.weatherapi.com/weather/64x64/day/116.png",
              code: 1003
            },
            chance_of_rain: i === 18 ? 80 : i === 15 ? 50 : i === 12 ? 60 : i === 9 ? 25 : i === 21 ? 50 : Math.floor(Math.random() * 20)
          }))
        },
        {
          date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
          day: {
            maxtemp_c: 26,
            maxtemp_f: 78.8,
            mintemp_c: 11,
            mintemp_f: 51.8,
            condition: {
              text: "Cloudy",
              icon: "//cdn.weatherapi.com/weather/64x64/day/119.png",
              code: 1006
            },
            uv: 3
          },
          astro: {
            sunrise: "6:19 AM",
            sunset: "7:26 PM",
            moonrise: "10:20 PM",
            moonset: "9:30 AM",
            moon_phase: "Waning Gibbous",
            moon_illumination: "70"
          }
        },
        {
          date: new Date(Date.now() + 172800000).toISOString().split('T')[0],
          day: {
            maxtemp_c: 26,
            maxtemp_f: 78.8,
            mintemp_c: 11,
            mintemp_f: 51.8,
            condition: {
              text: "Rainy",
              icon: "//cdn.weatherapi.com/weather/64x64/day/308.png",
              code: 1189
            },
            uv: 2
          },
          astro: {
            sunrise: "6:20 AM",
            sunset: "7:25 PM",
            moonrise: "11:25 PM",
            moonset: "10:20 AM",
            moon_phase: "Waning Gibbous",
            moon_illumination: "62"
          }
        }
      ]
    }
  };
};
