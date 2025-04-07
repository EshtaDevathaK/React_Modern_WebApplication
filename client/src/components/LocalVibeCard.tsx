import { FC } from "react";
import { Utensils, MapPin, CalendarDays } from "lucide-react";

interface LocalVibeCardProps {
  weather: any;
}

const LocalVibeCard: FC<LocalVibeCardProps> = ({ weather }) => {
  const location = weather.location;
  const condition = weather.current.condition.text;
  const temperature = Math.round(weather.current.temp_c);
  
  // Generate location-specific content based on the city
  const getCitySpecificContent = () => {
    const city = location.name;
    
    // Object mapping cities to their specific content
    const cityContent: Record<string, any> = {
      "Los Angeles": {
        emoji: "🌴",
        title: `${condition} in LA?`,
        description: "Perfect for a stroll down Santa Monica or grabbing coffee on Abbot Kinney!",
        recommendations: [
          { 
            icon: <Utensils className="text-primary-dark" />,
            title: "Local Recommendation",
            description: "Try outdoor dining at Grand Central Market today!"
          },
          { 
            icon: <MapPin className="text-primary-dark" />,
            title: "Popular Today",
            description: "Griffith Observatory - clear views expected this afternoon"
          },
          { 
            icon: <CalendarDays className="text-primary-dark" />,
            title: "Local Event",
            description: "Farmers Market at The Grove - open until 2pm"
          }
        ],
        image: "https://images.unsplash.com/photo-1556715371-bdb0d523c870?w=800&auto=format&fit=crop&q=80"
      },
      "New York": {
        emoji: "🗽",
        title: `${condition} in NYC?`,
        description: "Great day to explore Central Park or visit a museum!",
        recommendations: [
          { 
            icon: <Utensils className="text-primary-dark" />,
            title: "Local Recommendation",
            description: "Try the food vendors at Chelsea Market today!"
          },
          { 
            icon: <MapPin className="text-primary-dark" />,
            title: "Popular Today",
            description: "Top of the Rock - best time for photos is late afternoon"
          },
          { 
            icon: <CalendarDays className="text-primary-dark" />,
            title: "Local Event",
            description: "Art exhibition at MoMA - special hours until 8pm"
          }
        ],
        image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&auto=format&fit=crop&q=80"
      },
      "London": {
        emoji: "☂️",
        title: `${condition} in London?`,
        description: "Perfect weather to visit museums or enjoy a proper English tea!",
        recommendations: [
          { 
            icon: <Utensils className="text-primary-dark" />,
            title: "Local Recommendation",
            description: "Borough Market has excellent food stalls open today"
          },
          { 
            icon: <MapPin className="text-primary-dark" />,
            title: "Popular Today",
            description: "The British Museum - free entry and less crowded mornings"
          },
          { 
            icon: <CalendarDays className="text-primary-dark" />,
            title: "Local Event",
            description: "Live music at Covent Garden this afternoon"
          }
        ],
        image: "https://images.unsplash.com/photo-1533929736458-ca588d08c8be?w=800&auto=format&fit=crop&q=80"
      }
    };
    
    // Default content if city not found in our mapping
    const defaultContent = {
      emoji: "🌍",
      title: `${condition} in ${city}?`,
      description: `Enjoy the ${temperature < 15 ? "cool" : "warm"} weather with local activities!`,
      recommendations: [
        { 
          icon: <Utensils className="text-primary-dark" />,
          title: "Local Recommendation",
          description: "Try visiting a local café or restaurant today"
        },
        { 
          icon: <MapPin className="text-primary-dark" />,
          title: "Popular Today",
          description: "Explore downtown areas and local attractions"
        },
        { 
          icon: <CalendarDays className="text-primary-dark" />,
          title: "Local Tip",
          description: "Check local event listings for activities today"
        }
      ],
      image: "https://images.unsplash.com/photo-1548263594-a71ea65a8598?w=800&auto=format&fit=crop&q=80"
    };
    
    return cityContent[city] || defaultContent;
  };
  
  const cityContent = getCitySpecificContent();
  
  return (
    <div className="bg-white rounded-xl shadow-soft overflow-hidden h-full">
      <div className="h-48 relative">
        <img 
          src={cityContent.image} 
          alt={`${location.name} Cityscape`} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-6 text-white">
          <h2 className="font-heading text-2xl font-semibold mb-1">{location.name} Vibes</h2>
          <p className="text-gray-200">Local insights for your day</p>
        </div>
      </div>
      
      <div className="p-4 md:p-6">
        <div className="flex items-start mb-6">
          <div className="text-3xl mr-3">{cityContent.emoji}</div>
          <div>
            <h3 className="font-medium text-navy mb-1">{cityContent.title}</h3>
            <p className="text-gray-600">{cityContent.description}</p>
          </div>
        </div>
        
        <div className="space-y-4">
          {cityContent.recommendations.map((rec: any, index: number) => (
            <div key={index} className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-secondary-light flex items-center justify-center mr-3">
                {rec.icon}
              </div>
              <div>
                <h4 className="font-medium text-navy">{rec.title}</h4>
                <p className="text-sm text-gray-600">{rec.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LocalVibeCard;
