import { FC } from "react";
import { getWeatherIcon } from "@/lib/weatherIcons";
import { ArrowUp, ArrowDown } from "lucide-react";

interface MultiDayForecastProps {
  weather: any;
}

const MultiDayForecast: FC<MultiDayForecastProps> = ({ weather }) => {
  const forecastDays = weather.forecast.forecastday;
  
  // Get day name from date
  const getDayName = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'long' });
  };
  
  return (
    <div className="bg-white rounded-xl shadow-soft p-4 md:p-6 h-full">
      <h2 className="font-heading text-xl font-semibold text-navy mb-6">3 Days Forecast</h2>
      
      <div className="space-y-4">
        {forecastDays.map((day: any, index: number) => (
          <div 
            key={index} 
            className="flex items-center justify-between p-3 bg-secondary-light rounded-xl"
          >
            <div className="flex items-center space-x-4">
              <div className="weather-icon text-2xl">
                {getWeatherIcon(day.day.condition.text)}
              </div>
              <div>
                <h3 className="font-medium">{getDayName(day.date)}</h3>
                <p className="text-sm text-gray-600">{day.day.condition.text}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="flex items-center text-sm text-navy font-medium">
                <ArrowUp className="h-3 w-3 text-red-400 mr-1" />
                <span>{Math.round(day.day.maxtemp_c)}°</span>
              </div>
              
              <div className="flex items-center text-sm text-navy font-medium">
                <ArrowDown className="h-3 w-3 text-blue-400 mr-1" />
                <span>{Math.round(day.day.mintemp_c)}°</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MultiDayForecast;
