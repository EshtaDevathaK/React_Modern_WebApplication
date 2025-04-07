import { FC } from "react";
import { Droplets, Waves, Wind, Sun, Moon } from "lucide-react";

interface TodaysHighlightsProps {
  weather: any;
}

const TodaysHighlights: FC<TodaysHighlightsProps> = ({ weather }) => {
  const current = weather.current;
  const forecast = weather.forecast.forecastday[0].astro;
  
  // Convert precipitation from mm to percentage (simplistic approach)
  const getPrecipitationPercentage = (precip_mm: number) => {
    // Consider anything over 5mm as 100%
    return Math.min(Math.round((precip_mm / 5) * 100), 100) || 2; // Minimum 2% for UI
  };
  
  // Get precipitation intensity description
  const getPrecipitationIntensity = (precip_mm: number) => {
    if (precip_mm < 0.5) return "Very Low";
    if (precip_mm < 2) return "Low";
    if (precip_mm < 4) return "Moderate";
    return "High";
  };
  
  // Get humidity description
  const getHumidityDescription = (humidity: number) => {
    if (humidity < 30) return "Low";
    if (humidity < 60) return "Moderate";
    return "High";
  };
  
  // Get wind description
  const getWindDescription = (wind_kph: number) => {
    if (wind_kph < 1) return "Calm";
    if (wind_kph < 20) return "Light";
    if (wind_kph < 40) return "Moderate";
    return "Strong";
  };
  
  const precipitation = getPrecipitationPercentage(current.precip_mm);
  
  return (
    <section className="mb-8">
      <h2 className="font-heading text-xl font-semibold text-navy mb-4">Today's Highlights</h2>
      
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-soft p-4 text-center transition-transform hover:translate-y-[-5px] hover:shadow-card duration-300">
          <h3 className="text-sm text-gray-500 font-medium mb-3">Precipitation</h3>
          <div className="text-2xl font-semibold text-navy mb-1">{precipitation}%</div>
          <div className="inline-flex items-center text-xs text-gray-500">
            <Droplets className="h-3 w-3 mr-1 text-blue-400" />
            <span>{getPrecipitationIntensity(current.precip_mm)}</span>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-soft p-4 text-center transition-transform hover:translate-y-[-5px] hover:shadow-card duration-300">
          <h3 className="text-sm text-gray-500 font-medium mb-3">Humidity</h3>
          <div className="text-2xl font-semibold text-navy mb-1">{current.humidity}%</div>
          <div className="inline-flex items-center text-xs text-gray-500">
            <Waves className="h-3 w-3 mr-1 text-blue-500" />
            <span>{getHumidityDescription(current.humidity)}</span>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-soft p-4 text-center transition-transform hover:translate-y-[-5px] hover:shadow-card duration-300">
          <h3 className="text-sm text-gray-500 font-medium mb-3">Wind</h3>
          <div className="text-2xl font-semibold text-navy mb-1">{Math.round(current.wind_kph)} km/h</div>
          <div className="inline-flex items-center text-xs text-gray-500">
            <Wind className="h-3 w-3 mr-1 text-gray-400" />
            <span>{getWindDescription(current.wind_kph)}</span>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-soft p-4 text-center transition-transform hover:translate-y-[-5px] hover:shadow-card duration-300">
          <h3 className="text-sm text-gray-500 font-medium mb-3">Sunrise & Sunset</h3>
          <div className="flex justify-around">
            <div>
              <div className="rounded-full bg-secondary-light h-6 w-6 flex items-center justify-center mx-auto mb-1">
                <Sun className="h-3 w-3 text-yellow-500" />
              </div>
              <div className="text-sm font-semibold text-navy">{forecast.sunrise}</div>
            </div>
            
            <div>
              <div className="rounded-full bg-secondary-light h-6 w-6 flex items-center justify-center mx-auto mb-1">
                <Moon className="h-3 w-3 text-gray-600" />
              </div>
              <div className="text-sm font-semibold text-navy">{forecast.sunset}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TodaysHighlights;
