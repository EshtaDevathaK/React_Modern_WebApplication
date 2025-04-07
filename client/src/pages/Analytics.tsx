import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { fetchWeatherData } from "@/lib/weatherService";
import { BarChart2, Thermometer, Droplets, Wind, Sun, CloudRain } from "lucide-react";

export default function Analytics() {
  const [searchLocation, setSearchLocation] = useState("Los Angeles");
  const [timeRange, setTimeRange] = useState("week");
  
  const { data: weatherData, isLoading, error } = useQuery({
    queryKey: ['weatherData', searchLocation],
    queryFn: () => fetchWeatherData(searchLocation),
    enabled: !!searchLocation,
  });

  const handleSearch = (location: string) => {
    setSearchLocation(location);
  };

  // Generate temperature data from forecast
  const getTemperatureData = () => {
    if (!weatherData) return [];

    return weatherData.forecast.forecastday.flatMap((day: any) => 
      day.hour.map((hour: any) => ({
        time: new Date(hour.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        date: new Date(hour.time).toLocaleDateString([], { month: 'short', day: 'numeric' }),
        temperature: hour.temp_c,
        feelsLike: hour.feelslike_c,
      }))
    );
  };

  // Generate precipitation data
  const getPrecipitationData = () => {
    if (!weatherData) return [];

    return weatherData.forecast.forecastday.map((day: any) => ({
      date: new Date(day.date).toLocaleDateString([], { weekday: 'short' }),
      rain: day.day.totalprecip_mm,
      chance: day.day.daily_chance_of_rain,
    }));
  };

  // Generate humidity data
  const getHumidityData = () => {
    if (!weatherData) return [];

    return weatherData.forecast.forecastday.flatMap((day: any) => 
      day.hour.filter((_: any, index: number) => index % 3 === 0).map((hour: any) => ({
        time: new Date(hour.time).toLocaleTimeString([], { hour: '2-digit' }),
        date: new Date(hour.time).toLocaleDateString([], { month: 'short', day: 'numeric' }),
        humidity: hour.humidity,
      }))
    );
  };

  // Generate wind data
  const getWindData = () => {
    if (!weatherData) return [];

    return weatherData.forecast.forecastday.map((day: any) => {
      // Find the first hour that has wind_dir data
      const midDayHour = day.hour.find((hour: any) => hour && hour.wind_dir) || {};
      
      return {
        date: new Date(day.date).toLocaleDateString([], { weekday: 'short' }),
        speed: day.day.maxwind_kph,
        direction: midDayHour.wind_dir || 'N/A', // Use available data or default to N/A
      };
    });
  };

  // Generate UV data
  const getUVData = () => {
    if (!weatherData) return [];

    return weatherData.forecast.forecastday.map((day: any) => ({
      date: new Date(day.date).toLocaleDateString([], { weekday: 'short' }),
      uv: day.day.uv,
    }));
  };

  // Generate condition distribution data
  const getConditionData = () => {
    if (!weatherData) return [];

    // Count occurrences of each condition type
    const conditions: Record<string, number> = {};
    
    weatherData.forecast.forecastday.forEach((day: any) => {
      day.hour.forEach((hour: any) => {
        const condition = hour.condition.text;
        conditions[condition] = (conditions[condition] || 0) + 1;
      });
    });

    // Convert to array for the pie chart
    return Object.entries(conditions).map(([name, value]) => ({ name, value }));
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  // Loading state
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

  // Error state
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

        <h1 className="text-2xl font-bold mb-2 font-heading flex items-center">
          <BarChart2 className="mr-2 h-6 w-6" />
          Weather Analytics
        </h1>
        
        {weatherData && (
          <p className="text-gray-600 mb-6">
            Analyzing weather data for {weatherData.location.name}, {weatherData.location.country}
          </p>
        )}

        {/* Time Range Selector */}
        <div className="mb-6">
          <div className="flex items-center space-x-4">
            <span className="text-gray-600">Time Range:</span>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">24 Hours</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Analytics Tabs */}
        <Tabs defaultValue="temperature">
          <TabsList className="mb-6">
            <TabsTrigger value="temperature" className="flex items-center">
              <Thermometer className="h-4 w-4 mr-2" />
              Temperature
            </TabsTrigger>
            <TabsTrigger value="precipitation" className="flex items-center">
              <CloudRain className="h-4 w-4 mr-2" />
              Precipitation
            </TabsTrigger>
            <TabsTrigger value="humidity" className="flex items-center">
              <Droplets className="h-4 w-4 mr-2" />
              Humidity
            </TabsTrigger>
            <TabsTrigger value="wind" className="flex items-center">
              <Wind className="h-4 w-4 mr-2" />
              Wind
            </TabsTrigger>
            <TabsTrigger value="other" className="flex items-center">
              <Sun className="h-4 w-4 mr-2" />
              Other
            </TabsTrigger>
          </TabsList>
          
          {/* Temperature Tab */}
          <TabsContent value="temperature">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="p-6 lg:col-span-2">
                <h3 className="text-lg font-semibold mb-4 font-heading">Temperature Trends</h3>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={getTemperatureData()}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="time" 
                        tick={{ fontSize: 12 }}
                        interval={6}
                      />
                      <YAxis 
                        label={{ value: 'Temperature (°C)', angle: -90, position: 'insideLeft' }}
                        tick={{ fontSize: 12 }}
                      />
                      <Tooltip />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="temperature" 
                        stroke="#8884d8" 
                        name="Actual Temp"
                        activeDot={{ r: 8 }} 
                      />
                      <Line 
                        type="monotone" 
                        dataKey="feelsLike" 
                        stroke="#82ca9d" 
                        name="Feels Like"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Card>
              
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4 font-heading">Temperature Stats</h3>
                
                {weatherData && (
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-sm text-gray-500 mb-1">Current Temperature</h4>
                      <div className="flex items-baseline">
                        <span className="text-3xl font-bold text-primary">
                          {weatherData.current.temp_c}°C
                        </span>
                        <span className="ml-2 text-gray-600">
                          Feels like {weatherData.current.feelslike_c}°C
                        </span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="text-sm text-gray-500 mb-1">Min Temp (Today)</h4>
                        <p className="text-xl font-semibold text-blue-500">
                          {weatherData.forecast.forecastday[0].day.mintemp_c}°C
                        </p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="text-sm text-gray-500 mb-1">Max Temp (Today)</h4>
                        <p className="text-xl font-semibold text-red-500">
                          {weatherData.forecast.forecastday[0].day.maxtemp_c}°C
                        </p>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm text-gray-500 mb-1">Temperature Variation</h4>
                      <p className="font-medium">
                        {(weatherData.forecast.forecastday[0].day.maxtemp_c - weatherData.forecast.forecastday[0].day.mintemp_c).toFixed(1)}°C difference today
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm text-gray-500 mb-1">3-Day Average</h4>
                      <p className="font-medium">
                        {(weatherData.forecast.forecastday.reduce((sum: number, day: any) => 
                          sum + day.day.avgtemp_c, 0) / weatherData.forecast.forecastday.length).toFixed(1)}°C
                      </p>
                    </div>
                  </div>
                )}
              </Card>
            </div>
          </TabsContent>
          
          {/* Precipitation Tab */}
          <TabsContent value="precipitation">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="p-6 lg:col-span-2">
                <h3 className="text-lg font-semibold mb-4 font-heading">Precipitation & Chance of Rain</h3>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={getPrecipitationData()}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis yAxisId="left" orientation="left" label={{ value: 'Precipitation (mm)', angle: -90, position: 'insideLeft' }} />
                      <YAxis yAxisId="right" orientation="right" label={{ value: 'Chance of Rain (%)', angle: 90, position: 'insideRight' }} />
                      <Tooltip />
                      <Legend />
                      <Bar yAxisId="left" dataKey="rain" fill="#8884d8" name="Precipitation (mm)" />
                      <Bar yAxisId="right" dataKey="chance" fill="#82ca9d" name="Chance of Rain (%)" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
              
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4 font-heading">Precipitation Stats</h3>
                
                {weatherData && (
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-sm text-gray-500 mb-1">Today's Precipitation</h4>
                      <div className="flex items-baseline">
                        <span className="text-3xl font-bold text-blue-500">
                          {weatherData.forecast.forecastday[0].day.totalprecip_mm} mm
                        </span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="text-sm text-gray-500 mb-1">Chance of Rain</h4>
                        <p className="text-xl font-semibold">
                          {weatherData.forecast.forecastday[0].day.daily_chance_of_rain}%
                        </p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="text-sm text-gray-500 mb-1">Humidity</h4>
                        <p className="text-xl font-semibold">
                          {weatherData.current.humidity}%
                        </p>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm text-gray-500 mb-1">3-Day Total</h4>
                      <p className="font-medium">
                        {weatherData.forecast.forecastday.reduce((sum: number, day: any) => 
                          sum + day.day.totalprecip_mm, 0).toFixed(1)} mm
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm text-gray-500 mb-1">Current Condition</h4>
                      <p className="font-medium">
                        {weatherData.current.condition.text}
                      </p>
                    </div>
                  </div>
                )}
              </Card>
            </div>
          </TabsContent>
          
          {/* Humidity Tab */}
          <TabsContent value="humidity">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="p-6 lg:col-span-2">
                <h3 className="text-lg font-semibold mb-4 font-heading">Humidity Trends</h3>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={getHumidityData()}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="time" 
                        tick={{ fontSize: 12 }}
                      />
                      <YAxis 
                        domain={[0, 100]}
                        label={{ value: 'Humidity (%)', angle: -90, position: 'insideLeft' }}
                        tick={{ fontSize: 12 }}
                      />
                      <Tooltip />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="humidity" 
                        stroke="#82ca9d" 
                        activeDot={{ r: 8 }} 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Card>
              
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4 font-heading">Humidity Stats</h3>
                
                {weatherData && (
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-sm text-gray-500 mb-1">Current Humidity</h4>
                      <div className="flex items-baseline">
                        <span className="text-3xl font-bold text-blue-500">
                          {weatherData.current.humidity}%
                        </span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="text-sm text-gray-500 mb-1">Dew Point</h4>
                        <p className="text-xl font-semibold">
                          {weatherData.forecast.forecastday[0].hour[new Date().getHours()].dewpoint_c}°C
                        </p>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm text-gray-500 mb-1">Feels Like</h4>
                      <p className="font-medium">
                        {weatherData.current.feelslike_c}°C
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        High humidity can make it feel warmer, while low humidity can make it feel cooler.
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm text-gray-500 mb-1">Comfort Level</h4>
                      <p className="font-medium">
                        {weatherData.current.humidity < 30 
                          ? 'Dry - may cause skin irritation'
                          : weatherData.current.humidity > 70
                            ? 'Humid - may feel sticky'
                            : 'Comfortable'
                        }
                      </p>
                    </div>
                  </div>
                )}
              </Card>
            </div>
          </TabsContent>
          
          {/* Wind Tab */}
          <TabsContent value="wind">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="p-6 lg:col-span-2">
                <h3 className="text-lg font-semibold mb-4 font-heading">Wind Speed by Day</h3>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={getWindData()}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis label={{ value: 'Wind Speed (km/h)', angle: -90, position: 'insideLeft' }} />
                      <Tooltip 
                        formatter={(value) => {
                          return [`${value} km/h`, 'Max Wind Speed'];
                        }}
                        labelFormatter={(label, payload) => `${label} - ${payload && payload.length > 0 ? payload[0].payload.direction : ''}`}
                      />
                      <Legend />
                      <Bar dataKey="speed" fill="#82ca9d" name="Wind Speed (km/h)" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
              
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4 font-heading">Wind Stats</h3>
                
                {weatherData && (
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-sm text-gray-500 mb-1">Current Wind</h4>
                      <div className="flex items-baseline">
                        <span className="text-3xl font-bold text-green-500">
                          {weatherData.current.wind_kph} km/h
                        </span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="text-sm text-gray-500 mb-1">Direction</h4>
                        <p className="text-xl font-semibold">
                          {(weatherData.current as any).wind_dir || 'N/A'}
                        </p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="text-sm text-gray-500 mb-1">Gusts</h4>
                        <p className="text-xl font-semibold">
                          {(weatherData.current as any).gust_kph || 'N/A'} km/h
                        </p>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm text-gray-500 mb-1">Wind Chill</h4>
                      <p className="font-medium">
                        {weatherData.current.feelslike_c < weatherData.current.temp_c
                          ? `${(weatherData.current.temp_c - weatherData.current.feelslike_c).toFixed(1)}°C colder due to wind`
                          : 'No significant wind chill'
                        }
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm text-gray-500 mb-1">Wind Category</h4>
                      <p className="font-medium">
                        {weatherData.current.wind_kph < 20 
                          ? 'Light breeze'
                          : weatherData.current.wind_kph < 40
                            ? 'Moderate wind'
                            : weatherData.current.wind_kph < 60
                              ? 'Strong wind'
                              : 'Severe wind'
                        }
                      </p>
                    </div>
                  </div>
                )}
              </Card>
            </div>
          </TabsContent>
          
          {/* Other Tab */}
          <TabsContent value="other">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4 font-heading">UV Index</h3>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={getUVData()}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis label={{ value: 'UV Index', angle: -90, position: 'insideLeft' }} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="uv" fill="#FFBB28" name="UV Index" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
              
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4 font-heading">Weather Conditions</h3>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={getConditionData()}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {getConditionData().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </Card>
              
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4 font-heading">Other Metrics</h3>
                
                {weatherData && (
                  <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="text-sm text-gray-500 mb-1">Pressure</h4>
                      <p className="text-xl font-semibold">
                        {(weatherData.current as any).pressure_mb || 'N/A'} mb
                      </p>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="text-sm text-gray-500 mb-1">Visibility</h4>
                      <p className="text-xl font-semibold">
                        {(weatherData.current as any).vis_km || 'N/A'} km
                      </p>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="text-sm text-gray-500 mb-1">Cloud Cover</h4>
                      <p className="text-xl font-semibold">
                        {weatherData.current.cloud}%
                      </p>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="text-sm text-gray-500 mb-1">UV Index</h4>
                      <p className="text-xl font-semibold">
                        {weatherData.current.uv} 
                        <span className="text-sm text-gray-500 ml-2">
                          ({weatherData.current.uv < 3 
                            ? 'Low' 
                            : weatherData.current.uv < 6 
                              ? 'Moderate' 
                              : weatherData.current.uv < 8 
                                ? 'High' 
                                : weatherData.current.uv < 11 
                                  ? 'Very High' 
                                  : 'Extreme'})
                        </span>
                      </p>
                    </div>
                  </div>
                )}
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}