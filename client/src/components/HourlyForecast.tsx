import { FC } from "react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface HourlyForecastProps {
  weather: any;
}

const HourlyForecast: FC<HourlyForecastProps> = ({ weather }) => {
  const [activeTab, setActiveTab] = useState<"today" | "week">("today");
  
  // Extract hourly forecast data
  const getHourlyData = () => {
    const today = weather.forecast.forecastday[0];
    const hourlyData = today.hour;
    
    // Get a subset of hours for display
    const hours = [6, 9, 12, 15, 18, 21, 0, 3];
    
    return hours.map(hour => {
      const hourData = hourlyData.find((h: any) => {
        const date = new Date(h.time);
        return date.getHours() === hour;
      });
      
      return {
        time: hour === 0 ? "12 am" : hour === 12 ? "12 pm" : hour < 12 ? `${hour} am` : `${hour - 12} pm`,
        temp: Math.round(hourData?.temp_c || 0)
      };
    });
  };
  
  const hourlyData = getHourlyData();
  
  // Calculate the min and max temperature for scaling
  const tempValues = hourlyData.map(h => h.temp);
  const minTemp = Math.min(...tempValues);
  const maxTemp = Math.max(...tempValues);
  const tempRange = maxTemp - minTemp;
  
  // Calculate y-position based on temperature
  const getYPosition = (temp: number) => {
    // Scale to 120px height (considering 30px as padding from top)
    // Reversed since SVG coordinates have y=0 at the top
    const heightScale = 90; // Max height in pixels
    const normalizedValue = tempRange > 0 ? (temp - minTemp) / tempRange : 0.5;
    return 120 - (normalizedValue * heightScale + 30);
  };
  
  // Generate SVG path for temperature curve
  const generatePath = () => {
    return hourlyData.map((hour, index) => {
      const x = 50 + index * 100; // 100px spacing between points
      const y = getYPosition(hour.temp);
      return `${index === 0 ? "M" : "L"} ${x},${y}`;
    }).join(" ");
  };
  
  return (
    <section className="bg-white rounded-xl shadow-soft p-4 md:p-6 mb-8">
      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-4">
          <Button
            variant={activeTab === "today" ? "default" : "outline"}
            className={`px-4 py-1 rounded-full text-sm ${
              activeTab === "today" 
                ? "bg-primary text-white" 
                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
            }`}
            onClick={() => setActiveTab("today")}
          >
            Today
          </Button>
          <Button
            variant={activeTab === "week" ? "default" : "outline"}
            className={`px-4 py-1 rounded-full text-sm ${
              activeTab === "week" 
                ? "bg-primary text-white" 
                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
            }`}
            onClick={() => setActiveTab("week")}
          >
            Week
          </Button>
        </div>
      </div>
      
      <div className="relative h-48">
        {/* Hourly Temperature Chart */}
        <svg className="w-full h-full" viewBox="0 0 800 150" preserveAspectRatio="none">
          {/* Grid Lines */}
          <line x1="0" y1="120" x2="800" y2="120" stroke="#e5e7eb" strokeWidth="1"></line>
          <line x1="0" y1="90" x2="800" y2="90" stroke="#e5e7eb" strokeWidth="1"></line>
          <line x1="0" y1="60" x2="800" y2="60" stroke="#e5e7eb" strokeWidth="1"></line>
          <line x1="0" y1="30" x2="800" y2="30" stroke="#e5e7eb" strokeWidth="1"></line>
          
          {/* Temperature Curve - Path */}
          <path 
            d={generatePath()}
            fill="none" 
            stroke="#a78bfa" 
            strokeWidth="3" 
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>
          
          {/* Temperature Points and Values */}
          {hourlyData.map((hour, index) => {
            const x = 50 + index * 100;
            const y = getYPosition(hour.temp);
            return (
              <g key={index}>
                <circle cx={x} cy={y} r="4" fill="#a78bfa"></circle>
                <text x={x} y={y} textAnchor="middle" fill="#6b7280" fontSize="12" dy="-10">
                  {hour.temp}°
                </text>
              </g>
            );
          })}
        </svg>
      </div>
      
      {/* Time Labels */}
      <div className="grid grid-cols-7 gap-0 text-center text-sm text-gray-500 mt-4">
        {hourlyData.map((hour, index) => (
          <div key={index}>{hour.time}</div>
        ))}
      </div>
    </section>
  );
};

export default HourlyForecast;
