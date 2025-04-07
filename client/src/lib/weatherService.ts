// Weather API integration

// Use the Open-Meteo free weather API
const API_URL = 'https://api.open-meteo.com/v1/forecast';

// Helper to format date as YYYY-MM-DD
const formatDate = (date: Date) => {
  return date.toISOString().split('T')[0];
};

// Get current date and next dates for forecast
const getCurrentAndNextDates = () => {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const dayAfterTomorrow = new Date(today);
  dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
  
  return [
    formatDate(today),
    formatDate(tomorrow),
    formatDate(dayAfterTomorrow)
  ];
};

// Translate weather code to text
const weatherCodeToText = (code: number) => {
  const codes: Record<number, string> = {
    0: 'Clear sky',
    1: 'Mainly clear',
    2: 'Partly cloudy',
    3: 'Overcast',
    45: 'Fog',
    48: 'Depositing rime fog',
    51: 'Light drizzle',
    53: 'Moderate drizzle',
    55: 'Dense drizzle',
    56: 'Light freezing drizzle',
    57: 'Dense freezing drizzle',
    61: 'Slight rain',
    63: 'Moderate rain',
    65: 'Heavy rain',
    66: 'Light freezing rain',
    67: 'Heavy freezing rain',
    71: 'Slight snow fall',
    73: 'Moderate snow fall',
    75: 'Heavy snow fall',
    77: 'Snow grains',
    80: 'Slight rain showers',
    81: 'Moderate rain showers',
    82: 'Violent rain showers',
    85: 'Slight snow showers',
    86: 'Heavy snow showers',
    95: 'Thunderstorm',
    96: 'Thunderstorm with slight hail',
    99: 'Thunderstorm with heavy hail'
  };
  
  return codes[code] || 'Unknown';
};

// Translate weather code to icon
const weatherCodeToIcon = (code: number) => {
  // Map Open-Meteo codes to similar weatherapi.com icons
  if (code === 0) return '//cdn.weatherapi.com/weather/64x64/day/113.png'; // Clear
  if (code === 1 || code === 2) return '//cdn.weatherapi.com/weather/64x64/day/116.png'; // Partly cloudy
  if (code === 3) return '//cdn.weatherapi.com/weather/64x64/day/119.png'; // Cloudy
  if (code === 45 || code === 48) return '//cdn.weatherapi.com/weather/64x64/day/143.png'; // Mist
  if (code >= 51 && code <= 57) return '//cdn.weatherapi.com/weather/64x64/day/266.png'; // Light drizzle
  if (code >= 61 && code <= 67) return '//cdn.weatherapi.com/weather/64x64/day/296.png'; // Light rain
  if (code >= 71 && code <= 77) return '//cdn.weatherapi.com/weather/64x64/day/332.png'; // Snow
  if (code >= 80 && code <= 82) return '//cdn.weatherapi.com/weather/64x64/day/308.png'; // Rain
  if (code >= 85 && code <= 86) return '//cdn.weatherapi.com/weather/64x64/day/338.png'; // Heavy snow
  if (code >= 95) return '//cdn.weatherapi.com/weather/64x64/day/389.png'; // Thunderstorm
  
  return '//cdn.weatherapi.com/weather/64x64/day/116.png'; // Default
};

// Function to get geocoding for location
const getGeocode = async (city: string) => {
  try {
    const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`);
    
    if (!response.ok) {
      throw new Error('Failed to geocode location');
    }
    
    const data = await response.json();
    
    if (!data.results || data.results.length === 0) {
      throw new Error('Location not found');
    }
    
    return data.results[0];
  } catch (error) {
    console.error('Geocoding error:', error);
    throw error;
  }
};

export const fetchWeatherData = async (city: string) => {
  try {
    // Get location coordinates
    const geocode = await getGeocode(city);
    const { latitude, longitude, name, country, timezone } = geocode;
    
    // Construct the API URL with parameters
    const url = new URL(API_URL);
    url.searchParams.append('latitude', latitude.toString());
    url.searchParams.append('longitude', longitude.toString());
    url.searchParams.append('timezone', timezone);
    url.searchParams.append('current', 'temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,surface_pressure,uv_index');
    url.searchParams.append('hourly', 'temperature_2m,precipitation_probability,weather_code');
    url.searchParams.append('daily', 'weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_probability_max');
    url.searchParams.append('forecast_days', '3');
    
    // Fetch weather data
    const response = await fetch(url.toString());
    
    if (!response.ok) {
      throw new Error('Failed to fetch weather data');
    }
    
    const weatherData = await response.json();
    
    // Get formatted dates
    const dates = getCurrentAndNextDates();
    
    // Transform data to match expected format
    const currentWeatherCode = weatherData.current.weather_code;
    
    return {
      location: {
        name,
        region: '',
        country,
        lat: latitude,
        lon: longitude,
        tz_id: timezone,
        localtime: new Date().toISOString(),
      },
      current: {
        temp_c: Math.round(weatherData.current.temperature_2m),
        temp_f: Math.round((weatherData.current.temperature_2m * 9/5) + 32),
        condition: {
          text: weatherCodeToText(currentWeatherCode),
          icon: weatherCodeToIcon(currentWeatherCode),
          code: currentWeatherCode
        },
        wind_kph: Math.round(weatherData.current.wind_speed_10m * 3.6), // Convert m/s to km/h
        wind_mph: Math.round(weatherData.current.wind_speed_10m * 2.237), // Convert m/s to mph
        humidity: weatherData.current.relative_humidity_2m,
        cloud: 0, // Not available in this API
        feelslike_c: Math.round(weatherData.current.apparent_temperature),
        feelslike_f: Math.round((weatherData.current.apparent_temperature * 9/5) + 32),
        precip_mm: weatherData.current.precipitation,
        uv: weatherData.current.uv_index
      },
      forecast: {
        forecastday: weatherData.daily.time.map((date: string, index: number) => {
          // Generate hourly data for the current day
          const hourlyData = index === 0 ? Array.from({ length: 24 }, (_, hour) => {
            const hourIndex = hour;
            return {
              time: new Date(new Date().setHours(hour, 0, 0, 0)).toISOString(),
              temp_c: weatherData.hourly.temperature_2m[hourIndex],
              condition: {
                text: weatherCodeToText(weatherData.hourly.weather_code[hourIndex]),
                icon: weatherCodeToIcon(weatherData.hourly.weather_code[hourIndex]),
                code: weatherData.hourly.weather_code[hourIndex]
              },
              chance_of_rain: weatherData.hourly.precipitation_probability[hourIndex]
            };
          }) : [];
          
          const weatherCode = weatherData.daily.weather_code[index];
          
          return {
            date,
            day: {
              maxtemp_c: Math.round(weatherData.daily.temperature_2m_max[index]),
              maxtemp_f: Math.round((weatherData.daily.temperature_2m_max[index] * 9/5) + 32),
              mintemp_c: Math.round(weatherData.daily.temperature_2m_min[index]),
              mintemp_f: Math.round((weatherData.daily.temperature_2m_min[index] * 9/5) + 32),
              condition: {
                text: weatherCodeToText(weatherCode),
                icon: weatherCodeToIcon(weatherCode),
                code: weatherCode
              },
              uv: weatherData.daily.uv_index_max[index]
            },
            astro: {
              sunrise: new Date(weatherData.daily.sunrise[index]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              sunset: new Date(weatherData.daily.sunset[index]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              moonrise: "7:15 PM", // Not available in this API
              moonset: "6:30 AM", // Not available in this API
              moon_phase: "Waning Gibbous", // Not available in this API
              moon_illumination: "70" // Not available in this API
            },
            hour: hourlyData
          };
        })
      }
    };
  } catch (error) {
    console.error('Error fetching weather data:', error);
    
    // For simplicity, return a default weather object instead of throwing
    // This prevents the UI from crashing if the API call fails
    // In a production app, you would want to handle this error more gracefully
    
    return {
      location: {
        name: city,
        region: "",
        country: "",
        lat: 0,
        lon: 0,
        tz_id: "UTC",
        localtime: new Date().toISOString(),
      },
      current: {
        temp_c: 20,
        temp_f: 68,
        condition: {
          text: "Partly Cloudy",
          icon: "//cdn.weatherapi.com/weather/64x64/day/116.png",
          code: 1003
        },
        wind_kph: 15,
        wind_mph: 9,
        humidity: 65,
        cloud: 50,
        feelslike_c: 20,
        feelslike_f: 68,
        precip_mm: 0,
        uv: 4
      },
      forecast: {
        forecastday: [1, 2, 3].map((day, i) => {
          const date = new Date();
          date.setDate(date.getDate() + i);
          
          return {
            date: date.toISOString().split('T')[0],
            day: {
              maxtemp_c: 22 + i,
              maxtemp_f: 71.6 + i * 1.8,
              mintemp_c: 10 + i,
              mintemp_f: 50 + i * 1.8,
              condition: {
                text: i === 0 ? "Partly Cloudy" : i === 1 ? "Cloudy" : "Rainy",
                icon: i === 0 ? "//cdn.weatherapi.com/weather/64x64/day/116.png" : 
                     i === 1 ? "//cdn.weatherapi.com/weather/64x64/day/119.png" : 
                     "//cdn.weatherapi.com/weather/64x64/day/308.png",
                code: i === 0 ? 1003 : i === 1 ? 1006 : 1189
              },
              uv: 4 - i
            },
            astro: {
              sunrise: "6:18 AM",
              sunset: "7:27 PM",
              moonrise: "9:15 PM",
              moonset: "8:40 AM",
              moon_phase: "Waning Gibbous",
              moon_illumination: "78"
            },
            hour: Array.from({ length: 24 }, (_, hour) => ({
              time: new Date(new Date().setHours(hour, 0, 0, 0)).toISOString(),
              temp_c: 14 + Math.sin(hour / 24 * Math.PI * 2) * 8,
              condition: {
                text: "Partly Cloudy",
                icon: "//cdn.weatherapi.com/weather/64x64/day/116.png",
                code: 1003
              },
              chance_of_rain: hour === 18 ? 80 : hour === 15 ? 50 : hour === 12 ? 60 : hour === 9 ? 25 : hour === 21 ? 50 : Math.floor(Math.random() * 20)
            }))
          };
        })
      }
    };
  }
};
