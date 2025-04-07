import { FC } from "react";
import { X } from "lucide-react";
import { getWeatherIcon } from "@/lib/weatherIcons";

interface MoodModalProps {
  isOpen: boolean;
  onClose: () => void;
  weather: any;
}

const MoodModal: FC<MoodModalProps> = ({ isOpen, onClose, weather }) => {
  if (!isOpen || !weather) return null;

  const condition = weather.current.condition.text;
  const temperature = Math.round(weather.current.temp_c);
  
  // Generate suggestions based on weather condition
  const getMoodSuggestions = () => {
    const conditionLower = condition.toLowerCase();
    
    if (conditionLower.includes("sunny") || conditionLower.includes("clear")) {
      return [
        { emoji: "🚲", activity: "Bike riding in the park" },
        { emoji: "🧺", activity: "Picnic with friends" },
        { emoji: "🏖️", activity: "Beach day if possible!" },
        { emoji: "🌱", activity: "Gardening or plant care" }
      ];
    } else if (conditionLower.includes("rain") || conditionLower.includes("drizzle")) {
      return [
        { emoji: "📚", activity: "Reading a good book" },
        { emoji: "🍵", activity: "Enjoying tea by the window" },
        { emoji: "🎬", activity: "Movie marathon" },
        { emoji: "🧩", activity: "Indoor puzzles or board games" }
      ];
    } else if (conditionLower.includes("cloud") || conditionLower.includes("overcast")) {
      return [
        { emoji: "📚", activity: "Reading in a cozy café" },
        { emoji: "🚶", activity: "A peaceful walk in the park" },
        { emoji: "🎨", activity: "Indoor crafts or creative projects" },
        { emoji: "☕", activity: "Catching up with friends over coffee" }
      ];
    } else if (conditionLower.includes("snow") || conditionLower.includes("blizzard")) {
      return [
        { emoji: "⛄", activity: "Building a snowman" },
        { emoji: "🧣", activity: "Cozy indoor activities" },
        { emoji: "🍵", activity: "Hot chocolate by the fireplace" },
        { emoji: "🧤", activity: "Winter photography" }
      ];
    } else {
      return [
        { emoji: "🎯", activity: "Indoor activities at a local venue" },
        { emoji: "🏛️", activity: "Visit a museum or gallery" },
        { emoji: "🛍️", activity: "Shopping or window shopping" },
        { emoji: "🎮", activity: "Game night with friends" }
      ];
    }
  };
  
  const activities = getMoodSuggestions();
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 transition-opacity duration-300">
      <div className="bg-white rounded-xl shadow-elevation p-6 max-w-md mx-auto animate-in zoom-in-95 duration-300">
        <div className="flex justify-between items-start mb-4">
          <h3 className="font-heading text-xl font-semibold text-navy">Today's Mood Suggestion</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="mb-6">
          <div className="bg-secondary-light rounded-lg p-4 mb-4 flex items-center">
            <div className="text-4xl mr-4">
              {getWeatherIcon(condition)}
            </div>
            <div>
              <h4 className="font-medium text-navy mb-1">{condition} • {temperature}°C</h4>
              <p className="text-gray-600">
                {temperature < 10 
                  ? "Bundle up for the cold temperature" 
                  : temperature < 20 
                  ? "Mild temperature with comfortable conditions" 
                  : "Warm weather perfect for outdoor activities"}
              </p>
            </div>
          </div>
          
          <h4 className="font-medium text-navy mb-2">Perfect Activities Today:</h4>
          <ul className="space-y-2 mb-4">
            {activities.map((activity, index) => (
              <li key={index} className="flex items-center">
                <span className="text-lg mr-2">{activity.emoji}</span>
                <span>{activity.activity}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="flex justify-end">
          <button 
            onClick={onClose} 
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            Got it!
          </button>
        </div>
      </div>
    </div>
  );
};

export default MoodModal;
