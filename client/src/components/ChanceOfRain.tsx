import { FC, useEffect, useState } from "react";
import { MoreHorizontal, CloudRain, Sun, CloudLightning, Droplets } from "lucide-react";

interface ChanceOfRainProps {
  weather: any;
}

interface RainTimeSlot {
  time: string;
  chance: number;
  intensity: "none" | "low" | "medium" | "high";
  precipitation: number;
  isRealtime: boolean;
}

const ChanceOfRain: FC<ChanceOfRainProps> = ({ weather }) => {
  const [rainData, setRainData] = useState<RainTimeSlot[]>([]);
  
  useEffect(() => {
    if (weather && weather.forecast && weather.forecast.forecastday) {
      setRainData(generateRainChanceData());
    }
  }, [weather]);
  
  // Generate rain chance data from forecast with better real-time data handling
  const generateRainChanceData = (): RainTimeSlot[] => {
    try {
      const today = weather.forecast.forecastday[0];
      const hours = today.hour;
      const currentHour = new Date().getHours();
      
      // Get a subset of hours for display - prioritize upcoming hours
      const timeSlots = [
        { label: "09 am", hour: 9 },
        { label: "12 pm", hour: 12 },
        { label: "03 pm", hour: 15 },
        { label: "06 pm", hour: 18 },
        { label: "09 pm", hour: 21 },
        { label: "12 am", hour: 0 },
        { label: "03 am", hour: 3 }
      ];

      // Sort the slots to prioritize upcoming hours
      const sortedTimeSlots = [...timeSlots].sort((a, b) => {
        const hourDiffA = (a.hour - currentHour + 24) % 24;
        const hourDiffB = (b.hour - currentHour + 24) % 24;
        return hourDiffA - hourDiffB;
      });
      
      return sortedTimeSlots.map(slot => {
        // Find the forecast hour data
        const hourData = hours.find((h: any) => {
          const date = new Date(h.time);
          return date.getHours() === slot.hour;
        });
        
        // Different APIs use different property names - handle both formats
        let chance = 0;
        let precip = 0;
        
        if (hourData) {
          // Handle WeatherAPI.com format
          if (hourData.chance_of_rain !== undefined) {
            chance = hourData.chance_of_rain;
          } 
          // Handle OpenWeatherMap format 
          else if (hourData.pop !== undefined) {
            chance = Math.round(hourData.pop * 100);
          }
          
          // Get precipitation amount (in mm)
          if (hourData.precip_mm !== undefined) {
            precip = hourData.precip_mm;
          } else if (hourData.rain !== undefined && typeof hourData.rain === 'number') {
            precip = hourData.rain;
          } else if (hourData.rain && hourData.rain['3h'] !== undefined) {
            precip = hourData.rain['3h'];
          }
        }
        
        // If chance is very low but precipitation exists, adjust chance
        if (chance < 10 && precip > 0.2) {
          chance = Math.max(chance, 15);
        }
        
        // Determine intensity based on combination of chance and precipitation
        let intensity: "none" | "low" | "medium" | "high" = "none";
        
        if (chance > 0) {
          if (chance <= 20) {
            intensity = "none";
          } else if (chance <= 40) {
            intensity = "low";
          } else if (chance <= 70) {
            intensity = "medium";
          } else {
            intensity = "high";
          }
          
          // Adjust further based on precipitation amount
          if (precip > 5 && intensity !== "high") {
            intensity = "high";
          } else if (precip > 2 && intensity === "low") {
            intensity = "medium";
          }
        }
        
        // Is this the current hour? (or within 1 hour)
        const isRealtime = Math.abs((slot.hour - currentHour + 24) % 24) <= 1;
        
        return {
          time: slot.label,
          chance,
          intensity,
          precipitation: precip,
          isRealtime
        };
      });
    } catch (error) {
      console.error("Error generating rain chance data:", error);
      return [];
    }
  };
  
  // Get the correct CSS class and styles for the progress bar
  const getProgressBarStyles = (slot: RainTimeSlot) => {
    // Base styles
    let styles = {
      className: "",
      bgColor: "",
      width: `${Math.max(3, slot.chance)}%`,
      additionalClasses: slot.isRealtime ? "border-2 border-primary animate-pulse" : "",
      iconComponent: null as React.ReactNode
    };
    
    // Set intensity-based colors
    switch (slot.intensity) {
      case "high":
        styles.className = "bg-blue-600";
        styles.bgColor = "rgba(37, 99, 235, 0.9)";
        styles.iconComponent = <CloudLightning className="h-3 w-3 absolute right-1 top-1/2 transform -translate-y-1/2 text-white" />;
        break;
      case "medium":
        styles.className = "bg-blue-400";
        styles.bgColor = "rgba(96, 165, 250, 0.8)";
        styles.iconComponent = <CloudRain className="h-3 w-3 absolute right-1 top-1/2 transform -translate-y-1/2 text-white" />;
        break;
      case "low":
        styles.className = "bg-blue-300";
        styles.bgColor = "rgba(147, 197, 253, 0.7)";
        styles.iconComponent = <Droplets className="h-3 w-3 absolute right-1 top-1/2 transform -translate-y-1/2 text-blue-600" />;
        break;
      default:
        styles.className = "bg-yellow-100";
        styles.bgColor = "rgba(254, 240, 138, 0.5)";
        styles.iconComponent = <Sun className="h-3 w-3 absolute right-1 top-1/2 transform -translate-y-1/2 text-amber-500" />;
    }
    
    return styles;
  };
  
  return (
    <div className="bg-white rounded-xl shadow-soft p-4 md:p-6 h-full">
      <h3 className="font-heading text-lg font-semibold text-navy mb-4 flex justify-between items-center">
        <span>Chance of Rain</span>
        <div className="text-xs text-gray-500 font-normal">Real-time forecast</div>
      </h3>
      
      <div className="space-y-5">
        {rainData.map((slot, index) => {
          const styles = getProgressBarStyles(slot);
          
          return (
            <div key={index} className="relative">
              <div className="flex justify-between text-sm mb-1">
                <span className={`font-medium ${slot.isRealtime ? 'text-primary' : 'text-gray-600'}`}>
                  {slot.time}
                  {slot.isRealtime && <span className="ml-1 text-xs text-primary-dark font-medium">(Now)</span>}
                </span>
                <span className={`font-medium ${slot.chance > 0 ? 'text-blue-600' : 'text-amber-500'}`}>
                  {slot.chance}%
                </span>
              </div>
              
              <div className="w-full bg-gray-100 rounded-full h-6 relative overflow-hidden">
                <div 
                  className={`${styles.className} ${styles.additionalClasses} h-full rounded-full relative`}
                  style={{ 
                    width: styles.width,
                    transition: 'width 0.5s ease-out',
                    background: slot.chance > 40 ? 
                      `linear-gradient(90deg, ${styles.bgColor} 0%, ${styles.bgColor} 100%)` : 
                      styles.bgColor
                  }}
                >
                  {styles.iconComponent}
                </div>
                
                {/* Precipitation amount for medium/high rain */}
                {slot.precipitation > 0.2 && (slot.intensity === "medium" || slot.intensity === "high") && (
                  <div className="absolute bottom-0 right-2 text-xs font-medium text-white">
                    {slot.precipitation.toFixed(1)}mm
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="flex justify-between items-center mt-6 text-sm">
        <div className="text-center flex flex-col items-center">
          <div className="text-gray-500 mb-1">Sunny</div>
          <Sun className="h-4 w-4 text-amber-400" />
        </div>
        
        <div className="text-center flex flex-col items-center">
          <div className="text-gray-500 mb-1">Light Rain</div>
          <Droplets className="h-4 w-4 text-blue-400" />
        </div>
        
        <div className="text-center flex flex-col items-center">
          <div className="text-gray-500 mb-1">Heavy Rain</div>
          <CloudRain className="h-4 w-4 text-blue-600" />
        </div>
      </div>
    </div>
  );
};

export default ChanceOfRain;
