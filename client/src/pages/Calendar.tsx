import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { Card } from "@/components/ui/card";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { fetchWeatherData } from "@/lib/weatherService";
import { getWeatherIcon } from "@/lib/weatherIcons";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Calendar() {
  const [searchLocation, setSearchLocation] = useState("Los Angeles");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  const { data: weatherData, isLoading, error, refetch } = useQuery({
    queryKey: ['weatherData', searchLocation],
    queryFn: () => fetchWeatherData(searchLocation),
    enabled: !!searchLocation,
  });

  const handleSearch = (location: string) => {
    setSearchLocation(location);
    setTimeout(() => refetch(), 100);
  };

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)));
  };

  // Helper to format date
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-secondary-light">
        <div className="text-center">
          <div className="text-4xl mb-4">🌤️</div>
          <p className="text-navy font-medium">Loading weather data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-secondary-light">
        <div className="text-center">
          <div className="text-4xl mb-4">⚠️</div>
          <p className="text-navy font-medium">Failed to load weather data</p>
          <p className="text-gray-600 mt-2">Please try again later</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-secondary-light">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        {/* Header Section */}
        <Header onSearch={handleSearch} />

        <h1 className="text-2xl font-bold mb-6 font-heading">Weather Calendar for {weatherData?.location.name}</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Button variant="ghost" size="icon" onClick={handlePrevMonth}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <h2 className="text-xl font-semibold font-heading">
                  {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </h2>
                <Button variant="ghost" size="icon" onClick={handleNextMonth}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              
              <CalendarComponent
                mode="single"
                selected={date}
                onSelect={setDate}
                month={currentMonth}
                className="rounded-md border"
              />
              
              <p className="text-sm text-gray-500 mt-4">
                Note: Weather forecast data is typically available only for the next 3-5 days. 
                Historical data and extended forecasts may require premium API access.
              </p>
            </Card>
          </div>
          
          <div>
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4 font-heading">Weather Details</h2>
              
              {date && weatherData && (
                <div>
                  <p className="text-lg font-medium mb-4">{formatDate(date)}</p>
                  
                  {isDateInForecast(date, weatherData) ? (
                    <div>
                      <div className="flex items-center mb-4">
                        {getForecastForDate(date, weatherData) && (
                          <>
                            <div className="mr-4">
                              {getWeatherIcon(
                                getForecastForDate(date, weatherData)?.day.condition.text || "",
                                "w-16 h-16"
                              )}
                            </div>
                            <div>
                              <p className="text-xl font-bold">
                                {getForecastForDate(date, weatherData)?.day.condition.text}
                              </p>
                              <p className="text-gray-600">
                                High: {getForecastForDate(date, weatherData)?.day.maxtemp_c}°C / 
                                Low: {getForecastForDate(date, weatherData)?.day.mintemp_c}°C
                              </p>
                            </div>
                          </>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mt-6">
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-gray-500 text-sm">Sunrise</p>
                          <p className="font-medium">
                            {getForecastForDate(date, weatherData)?.astro.sunrise}
                          </p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-gray-500 text-sm">Sunset</p>
                          <p className="font-medium">
                            {getForecastForDate(date, weatherData)?.astro.sunset}
                          </p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-gray-500 text-sm">UV Index</p>
                          <p className="font-medium">
                            {getForecastForDate(date, weatherData)?.day.uv}
                          </p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-gray-500 text-sm">Moon Phase</p>
                          <p className="font-medium">
                            {getForecastForDate(date, weatherData)?.astro.moon_phase}
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500">
                        Weather forecast is only available for the next few days.
                      </p>
                    </div>
                  )}
                </div>
              )}
              
              {!date && (
                <p className="text-center py-8 text-gray-500">
                  Select a date to view weather details.
                </p>
              )}
            </Card>
            
            {date && weatherData && isDateInForecast(date, weatherData) && (
              <Card className="p-6 mt-6">
                <h2 className="text-xl font-semibold mb-4 font-heading">Outfit Suggestion</h2>
                <div className="flex flex-col items-center text-center">
                  <div className="text-5xl mb-4">
                    {getOutfitEmoji(getForecastForDate(date, weatherData)?.day.condition.text || "")}
                  </div>
                  <p className="text-gray-700">
                    {getOutfitSuggestion(
                      getForecastForDate(date, weatherData)?.day.condition.text || "",
                      getForecastForDate(date, weatherData)?.day.maxtemp_c || 0
                    )}
                  </p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

// Helper functions
function isDateInForecast(date: Date, weatherData: any): boolean {
  const dateStr = date.toISOString().split('T')[0];
  return weatherData.forecast.forecastday.some((day: any) => day.date === dateStr);
}

function getForecastForDate(date: Date, weatherData: any): any {
  const dateStr = date.toISOString().split('T')[0];
  return weatherData.forecast.forecastday.find((day: any) => day.date === dateStr);
}

function getOutfitEmoji(condition: string): string {
  const conditionLower = condition.toLowerCase();
  
  if (conditionLower.includes('rain') || conditionLower.includes('drizzle')) {
    return '🧥☂️';
  } else if (conditionLower.includes('snow')) {
    return '🧣🧤';
  } else if (conditionLower.includes('sun') || conditionLower.includes('clear')) {
    return '👕🕶️';
  } else if (conditionLower.includes('cloud')) {
    return '👚🧢';
  } else if (conditionLower.includes('fog') || conditionLower.includes('mist')) {
    return '🧥👖';
  } else if (conditionLower.includes('thunder') || conditionLower.includes('storm')) {
    return '🧥🌂';
  }
  
  return '👔👖';
}

function getOutfitSuggestion(condition: string, temp: number): string {
  const conditionLower = condition.toLowerCase();
  
  if (temp > 25) {
    return "It's hot today! Light clothing like t-shirts, shorts or skirts, and sunglasses are recommended. Don't forget sunscreen!";
  } else if (temp > 15) {
    return "Mild temperatures today. A light jacket or sweater might be useful, especially in the evening.";
  } else if (temp > 5) {
    return "Cool temperatures today. Dress in layers with a warm jacket or coat.";
  } else {
    return "It's cold! Bundle up with a heavy coat, scarf, gloves, and hat.";
  }
}