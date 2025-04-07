import { FC } from "react";
import { MoreHorizontal } from "lucide-react";

interface ChanceOfRainProps {
  weather: any;
}

interface RainTimeSlot {
  time: string;
  chance: number;
  intensity: "low" | "medium" | "high";
}

const ChanceOfRain: FC<ChanceOfRainProps> = ({ weather }) => {
  // Generate rain chance data from forecast
  const generateRainChanceData = (): RainTimeSlot[] => {
    const today = weather.forecast.forecastday[0];
    const hours = today.hour;
    
    // Get a subset of hours for display
    const timeSlots = [
      { label: "09 am", hour: 9 },
      { label: "12 pm", hour: 12 },
      { label: "03 pm", hour: 15 },
      { label: "06 pm", hour: 18 },
      { label: "09 pm", hour: 21 },
      { label: "12 am", hour: 0 },
      { label: "03 am", hour: 3 }
    ];
    
    return timeSlots.map(slot => {
      const hourData = hours.find((h: any) => {
        const date = new Date(h.time);
        return date.getHours() === slot.hour;
      });
      
      const chance = hourData ? hourData.chance_of_rain : 0;
      
      let intensity: "low" | "medium" | "high" = "low";
      if (chance > 60) intensity = "high";
      else if (chance > 30) intensity = "medium";
      
      return {
        time: slot.label,
        chance,
        intensity
      };
    });
  };
  
  const rainData = generateRainChanceData();
  
  // Helper function to get the CSS class for the progress bar
  const getProgressBarClass = (intensity: string) => {
    switch (intensity) {
      case "high":
        return "bg-primary-dark";
      case "medium":
        return "bg-secondary";
      default:
        return "bg-secondary-light";
    }
  };
  
  // Helper function to get width percentage for progress bar
  const getWidthPercentage = (chance: number) => {
    return `${Math.max(5, chance)}%`;
  };
  
  return (
    <div className="bg-white rounded-xl shadow-soft p-4 md:p-6 h-full">
      <h3 className="font-heading text-lg font-semibold text-navy mb-4 flex justify-between items-center">
        <span>Chance of Rain</span>
        <button className="text-sm text-gray-400 hover:text-primary-dark">
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </h3>
      
      <div className="space-y-4">
        {rainData.map((slot, index) => (
          <div key={index}>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">{slot.time}</span>
              <div className="h-6 w-6 flex items-center justify-center rounded-full bg-gray-100">
                <div className={`h-2 w-2 rounded-full ${
                  slot.intensity === "high" 
                    ? "bg-primary-dark" 
                    : slot.intensity === "medium" 
                    ? "bg-secondary" 
                    : "bg-secondary-light"
                }`}></div>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded progress-bar">
              <div 
                className={`${getProgressBarClass(slot.intensity)} h-full rounded progress-bar`}
                style={{ width: getWidthPercentage(slot.chance) }}
              ></div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex justify-between items-center mt-6 text-sm">
        <div className="text-center">
          <div className="text-gray-500">Sunny</div>
          <div className="h-2 w-2 bg-secondary-light rounded-full mx-auto mt-1"></div>
        </div>
        
        <div className="text-center">
          <div className="text-gray-500">Rainy</div>
          <div className="h-2 w-2 bg-secondary rounded-full mx-auto mt-1"></div>
        </div>
        
        <div className="text-center">
          <div className="text-gray-500">Heavy Rain</div>
          <div className="h-2 w-2 bg-primary-dark rounded-full mx-auto mt-1"></div>
        </div>
      </div>
    </div>
  );
};

export default ChanceOfRain;
