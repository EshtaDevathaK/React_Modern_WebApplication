import { FC, useMemo } from "react";
import { MapPin, Plus } from "lucide-react";
import { getWeatherIcon } from "@/lib/weatherIcons";
import { formatDate } from "@/lib/weatherUtils";
import { getWeatherPhoto } from "@/lib/seasonalPhotos";

interface CurrentWeatherProps {
  weather: any;
}

const CurrentWeather: FC<CurrentWeatherProps> = ({ weather }) => {
  // Handle API data structure variations and check for valid data
  if (!weather || !weather.current || !weather.location) {
    console.error("CurrentWeather: Invalid weather data structure:", weather);
    return (
      <div className="bg-white rounded-xl p-6 shadow-lg text-center">
        <p className="text-lg font-semibold text-red-500">Weather data unavailable</p>
        <p className="text-gray-600 mt-2">Please try refreshing or search for another location</p>
      </div>
    );
  }
  
  const currentWeather = weather.current;
  const location = weather.location;
  
  // Extract weather condition text with fallbacks for different API structures
  let weatherCondition = "Unknown";
  if (currentWeather.condition && currentWeather.condition.text) {
    weatherCondition = currentWeather.condition.text;
  } else if (currentWeather.weather && currentWeather.weather[0] && currentWeather.weather[0].main) {
    weatherCondition = currentWeather.weather[0].main;
  } else if (currentWeather.weather && currentWeather.weather[0] && currentWeather.weather[0].description) {
    weatherCondition = currentWeather.weather[0].description;
  }
  
  // Extract temperature with fallbacks for different API structures
  let temperature = 0;
  if (currentWeather.temp_c !== undefined) {
    temperature = Math.round(currentWeather.temp_c);
  } else if (currentWeather.temp !== undefined) {
    temperature = Math.round(currentWeather.temp);
  } else if (currentWeather.main && currentWeather.main.temp !== undefined) {
    temperature = Math.round(currentWeather.main.temp);
  }
  // Handle date with fallbacks
  let localTimeString = location.localtime;
  
  // If localtime is not available, try to get it from other properties
  if (!localTimeString) {
    if (location.dt) {
      // Convert UNIX timestamp to ISO string if available
      localTimeString = new Date(location.dt * 1000).toISOString();
    } else {
      // Use current date as last resort
      localTimeString = new Date().toISOString();
    }
  }
  
  const formattedDate = formatDate(localTimeString);
  
  // Generate mood suggestion based on weather condition
  const getMoodSuggestion = () => {
    const condition = weatherCondition.toLowerCase();
    
    if (condition.includes("sunny") || condition.includes("clear")) {
      return {
        emoji: "☀️🌿",
        title: "Sunny Vibes",
        message: "Perfect for outdoor activities and soaking up the sunshine!"
      };
    } else if (condition.includes("rain") || condition.includes("drizzle")) {
      return {
        emoji: "🌧️📚",
        title: "Rainy Day Mood",
        message: "Ideal for curling up with a good book and hot tea!"
      };
    } else if (condition.includes("cloud") || condition.includes("overcast")) {
      return {
        emoji: "🌤️📚",
        title: "Partly Cloudy Vibes",
        message: "Perfect for a peaceful walk in the park or enjoying a good book outdoors!"
      };
    } else if (condition.includes("snow") || condition.includes("blizzard")) {
      return {
        emoji: "❄️🧣",
        title: "Snow Day Feels",
        message: "Time to stay cozy indoors or build a snowman!"
      };
    } else if (condition.includes("fog") || condition.includes("mist")) {
      return {
        emoji: "🌫️🍵",
        title: "Misty Moments",
        message: "A great day for reflection and mindfulness!"
      };
    } else {
      return {
        emoji: "🌈✨",
        title: "Weather Adventure",
        message: "Embrace the day whatever the weather brings!"
      };
    }
  };
  
  const moodSuggestion = getMoodSuggestion();
  
  // Get background image based on weather condition and temperature
  const weatherPhoto = useMemo(() => {
    const condition = weatherCondition.toLowerCase();
    
    // Use the improved getWeatherPhoto function from seasonalPhotos.ts
    // This will randomize and select appropriate photos based on both condition and temperature
    return getWeatherPhoto(condition, temperature);
  }, [weatherCondition, temperature]);
  
  // Format the URL with optimization parameters
  const backgroundImage = `${weatherPhoto.url}?w=800&auto=format&fit=crop&q=80`;
  
  return (
    <div className="bg-white rounded-xl shadow-soft overflow-hidden">
      <div className="p-4 md:p-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h6 className="text-sm text-gray-500 mb-1">Current Location</h6>
            <h3 className="text-xl font-semibold text-navy flex items-center">
              {location.name || "Unknown"}{location.region ? `, ${location.region}` : ""}{location.country ? `, ${location.country}` : ""}
              <button className="ml-2 text-gray-400 hover:text-primary-dark">
                <MapPin className="h-4 w-4" />
              </button>
            </h3>
          </div>
        </div>
        
        <div className="relative">
          {/* Weather Background Image */}
          <div className="relative rounded-lg overflow-hidden h-64 md:h-80">
            <img 
              src={backgroundImage} 
              alt={`${location.name || 'Location'} ${weatherCondition} Weather`} 
              className="w-full h-full object-cover"
            />
            
            {/* Photo Credit */}
            {weatherPhoto.credit && (
              <div className="absolute top-2 right-2">
                <div className="bg-black/30 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-md">
                  Photo: {weatherPhoto.credit}
                </div>
              </div>
            )}
            
            {/* Weather Info Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/60 to-transparent text-white">
              <div className="flex items-start">
                <div className="mr-4">
                  <div className="text-6xl md:text-7xl font-semibold flex items-start">
                    {temperature}°
                    <span className="text-xl mt-2 ml-1">C</span>
                  </div>
                  <div className="flex items-center mt-1">
                    <span className="weather-icon text-2xl mr-2">
                      {getWeatherIcon(weatherCondition)}
                    </span>
                    <span>{weatherCondition}</span>
                  </div>
                </div>
                
                <div className="ml-auto text-right">
                  <div className="text-lg font-semibold">{formattedDate}</div>
                  <div className="flex items-center justify-end mt-1">
                    {getWeatherIcon(weatherCondition, "h-4 w-4 mr-1 text-weather-cloudy")}
                    <span>{weatherCondition}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Add City Button */}
          <button className="absolute top-4 right-4 bg-white/90 hover:bg-white p-3 rounded-full shadow-elevation transition-all">
            <Plus className="h-4 w-4 text-primary-dark" />
          </button>
        </div>
      </div>
      
      {/* Mood Suggestion Panel */}
      <div className="bg-gradient-to-r from-secondary-light to-secondary p-4 md:p-6">
        <div className="flex items-center">
          <div className="text-3xl mr-3">{moodSuggestion.emoji}</div>
          <div>
            <h4 className="font-heading font-semibold text-navy">{moodSuggestion.title}</h4>
            <p className="text-navy-light">{moodSuggestion.message}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrentWeather;
