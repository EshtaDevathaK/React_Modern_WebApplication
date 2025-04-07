import { FC } from "react";
import { X, Sun, Cloud, CloudRain, CloudSnow } from "lucide-react";

interface MoodToastProps {
  show: boolean;
  onClose: () => void;
  weather: any;
}

const MoodToast: FC<MoodToastProps> = ({ show, onClose, weather }) => {
  if (!show || !weather) return null;
  
  const condition = weather.current.condition.text.toLowerCase();
  
  // Generate toast message based on weather condition
  const getToastContent = () => {
    if (condition.includes("sunny") || condition.includes("clear")) {
      return {
        icon: <Sun className="h-6 w-6 text-yellow-400" />,
        title: "Sunny Day Ahead!",
        message: "Perfect day for a beach trip! Don't forget your sunscreen!"
      };
    } else if (condition.includes("rain") || condition.includes("drizzle")) {
      return {
        icon: <CloudRain className="h-6 w-6 text-blue-400" />,
        title: "Rainy Day Mood",
        message: "Great day to stay in with a book or visit a museum!"
      };
    } else if (condition.includes("cloud") || condition.includes("overcast")) {
      return {
        icon: <Cloud className="h-6 w-6 text-gray-400" />,
        title: "Cloudy Skies Today",
        message: "A good day for a café visit or a walk with light layers."
      };
    } else if (condition.includes("snow") || condition.includes("blizzard")) {
      return {
        icon: <CloudSnow className="h-6 w-6 text-blue-200" />,
        title: "Snow Day Magic!",
        message: "Bundle up and enjoy the winter wonderland or cozy up indoors."
      };
    } else {
      return {
        icon: <Sun className="h-6 w-6 text-yellow-400" />,
        title: "Today's Weather Mood",
        message: "Check the forecast and plan your day accordingly!"
      };
    }
  };
  
  const toastContent = getToastContent();
  
  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 ease-in-out">
      <div className="bg-white rounded-lg shadow-elevation px-6 py-4 flex items-center space-x-3 max-w-md">
        <div className="text-2xl">
          {toastContent.icon}
        </div>
        <div>
          <h4 className="font-heading font-semibold text-navy">{toastContent.title}</h4>
          <p className="text-gray-600 text-sm">{toastContent.message}</p>
        </div>
        <button className="text-gray-400 hover:text-gray-600 ml-auto" onClick={onClose}>
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default MoodToast;
