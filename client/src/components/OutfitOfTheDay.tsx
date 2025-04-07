import { FC } from "react";
import { Info } from "lucide-react";

interface OutfitOfTheDayProps {
  weather: any;
}

const OutfitOfTheDay: FC<OutfitOfTheDayProps> = ({ weather }) => {
  const current = weather.current;
  const condition = current.condition.text;
  const temperature = Math.round(current.temp_c);
  
  // Get outfit recommendations based on temperature and conditions
  const getOutfitRecommendations = () => {
    const isRainy = condition.toLowerCase().includes("rain") || 
                   condition.toLowerCase().includes("drizzle") || 
                   condition.toLowerCase().includes("shower");
    
    const isSnowy = condition.toLowerCase().includes("snow") || 
                   condition.toLowerCase().includes("sleet") || 
                   condition.toLowerCase().includes("blizzard");
                   
    const isWindy = current.wind_kph > 30;
    
    // Temperature based recommendations
    if (temperature < 0) {
      return {
        top: "Heavy winter coat, thermal layer",
        bottom: "Thick wool or insulated pants",
        outer: "Insulated jacket, scarf, gloves, hat",
        footwear: "Insulated winter boots",
        extras: isSnowy ? "Don't forget ice grips for your boots!" : "Consider a thermos with a hot drink"
      };
    } else if (temperature < 10) {
      return {
        top: "Sweater, long-sleeve shirt",
        bottom: "Jeans or warm pants",
        outer: "Winter coat or heavy jacket",
        footwear: isRainy ? "Waterproof boots" : "Warm closed shoes",
        extras: isRainy ? "Don't forget your umbrella!" : "A scarf will keep you cozy"
      };
    } else if (temperature < 15) {
      return {
        top: "Light sweater or long-sleeve shirt",
        bottom: "Jeans or casual pants",
        outer: "Light jacket (for evening)",
        footwear: "Casual sneakers",
        extras: isWindy ? "A windbreaker might be useful today" : "Don't forget sunglasses for the sunny moments!"
      };
    } else if (temperature < 20) {
      return {
        top: "T-shirt with light cardigan or shirt",
        bottom: "Light pants or jeans",
        outer: isWindy ? "Light jacket" : "Optional light sweater",
        footwear: "Comfortable shoes or sneakers",
        extras: isRainy ? "Compact umbrella recommended" : "Sunglasses may come in handy"
      };
    } else if (temperature < 25) {
      return {
        top: "T-shirt or short-sleeve shirt",
        bottom: "Light pants, skirt, or shorts",
        outer: "None needed during day",
        footwear: "Light shoes, sneakers, or sandals",
        extras: "Sunglasses and sunscreen recommended"
      };
    } else {
      return {
        top: "Light t-shirt or sleeveless top",
        bottom: "Shorts, light skirt",
        outer: "None",
        footwear: "Sandals or breathable shoes",
        extras: "Sunscreen, hat, and water bottle essential!"
      };
    }
  };
  
  const outfitRecs = getOutfitRecommendations();
  
  return (
    <div className="bg-white rounded-xl shadow-soft p-4 md:p-6 h-full">
      <h2 className="font-heading text-xl font-semibold text-navy mb-4">Outfit of the Day</h2>
      
      <div className="flex flex-col h-full">
        <div className="mb-4">
          <div className="text-lg font-medium">{condition} • {temperature}°C</div>
          <p className="text-gray-600 text-sm">
            {temperature < 10 
              ? "Bundle up today" 
              : temperature < 20 
              ? "Light layers recommended" 
              : "Light clothing ideal"}
          </p>
        </div>
        
        <div className="bg-secondary-light rounded-lg p-4 flex-grow">
          <div className="flex flex-col h-full">
            <div className="space-y-2 mb-4">
              <div className="flex items-center">
                <span className="text-lg mr-2">👕</span>
                <span>{outfitRecs.top}</span>
              </div>
              
              <div className="flex items-center">
                <span className="text-lg mr-2">👖</span>
                <span>{outfitRecs.bottom}</span>
              </div>
              
              {outfitRecs.outer && (
                <div className="flex items-center">
                  <span className="text-lg mr-2">🧥</span>
                  <span>{outfitRecs.outer}</span>
                </div>
              )}
              
              <div className="flex items-center">
                <span className="text-lg mr-2">👟</span>
                <span>{outfitRecs.footwear}</span>
              </div>
            </div>
            
            <div className="text-sm text-gray-600 mt-auto">
              <div className="flex items-center">
                <Info className="h-4 w-4 text-primary-dark mr-2" />
                <span>{outfitRecs.extras}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OutfitOfTheDay;
