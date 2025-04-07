// Collection of weather-related photos for different conditions and seasons
// These URLs point to high-quality, royalty-free images that change based on weather conditions

interface WeatherPhoto {
  url: string;
  alt: string;
  credit?: string;
  temperature?: number; // Temperature threshold in Celsius
  condition?: string;   // Weather condition
}

// Photos for sunny conditions
export const sunnyPhotos: WeatherPhoto[] = [
  {
    url: "https://images.unsplash.com/photo-1522536421511-14c9073df899",
    alt: "Sunny beach with palm trees",
    condition: "sunny",
  },
  {
    url: "https://images.unsplash.com/photo-1520454974749-611b7248ffdb",
    alt: "Sunny vineyard landscape",
    condition: "sunny",
  },
  {
    url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
    alt: "Sunny beach with clear blue water",
    condition: "sunny",
  },
  {
    url: "https://images.unsplash.com/photo-1476673160081-cf065607f449",
    alt: "Sunny mountain landscape",
    condition: "sunny",
  },
  {
    url: "https://images.unsplash.com/photo-1605833556294-ea5c7a74f57d",
    alt: "Sunny urban park scene",
    condition: "sunny",
  },
];

// Photos for rainy conditions
export const rainyPhotos: WeatherPhoto[] = [
  {
    url: "https://images.unsplash.com/photo-1534274988757-a28bf1a57c17",
    alt: "Rainy city street with reflections",
    condition: "rain",
  },
  {
    url: "https://images.unsplash.com/photo-1501999635878-71cb5379c2d8",
    alt: "Rain drops on window pane",
    condition: "rain",
  },
  {
    url: "https://images.unsplash.com/photo-1438449805896-28a666819a20",
    alt: "Person with umbrella in rain",
    condition: "rain",
  },
  {
    url: "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0",
    alt: "Wet road during rainfall",
    condition: "rain",
  },
  {
    url: "https://images.unsplash.com/photo-1523772721666-22ad3c3b6f90",
    alt: "Lightning storm over city",
    condition: "thunderstorm",
  },
];

// Photos for cloudy conditions
export const cloudyPhotos: WeatherPhoto[] = [
  {
    url: "https://images.unsplash.com/photo-1534088568595-a066f410bcda",
    alt: "Cloudy mountain landscape",
    condition: "cloudy",
  },
  {
    url: "https://images.unsplash.com/photo-1499956827185-0d63ee78a910",
    alt: "Dramatic cloudy sky over ocean",
    condition: "cloudy",
  },
  {
    url: "https://images.unsplash.com/photo-1594156596782-656c93e4d504",
    alt: "Cloudy urban skyline",
    condition: "cloudy",
  },
  {
    url: "https://images.unsplash.com/photo-1505533542167-8c89838bb019",
    alt: "Cloudy countryside landscape",
    condition: "cloudy",
  },
  {
    url: "https://images.unsplash.com/photo-1513002749550-c59d786b8e6c",
    alt: "Moody cloudy forest scene",
    condition: "cloudy",
  },
];

// Photos for snowy conditions
export const snowyPhotos: WeatherPhoto[] = [
  {
    url: "https://images.unsplash.com/photo-1511131341542-3c20b2fbcde2",
    alt: "Snow-covered forest",
    condition: "snow",
  },
  {
    url: "https://images.unsplash.com/photo-1491002052546-bf38f186af56",
    alt: "Snowy mountain peak",
    condition: "snow",
  },
  {
    url: "https://images.unsplash.com/photo-1548777123-e216912df7d8",
    alt: "Snowy city street",
    condition: "snow",
  },
  {
    url: "https://images.unsplash.com/photo-1454942901704-3c44c11b2ad1",
    alt: "Cabin in snowy landscape",
    condition: "snow",
  },
  {
    url: "https://images.unsplash.com/photo-1612748732446-5361d1a0583c",
    alt: "Person walking in snow",
    condition: "snow",
  },
];

// Photos for foggy conditions
export const foggyPhotos: WeatherPhoto[] = [
  {
    url: "https://images.unsplash.com/photo-1487621167305-5d248087c724",
    alt: "Foggy forest path",
    condition: "fog",
  },
  {
    url: "https://images.unsplash.com/photo-1502472584811-0a2f2feb8968",
    alt: "Bridge in fog",
    condition: "mist",
  },
  {
    url: "https://images.unsplash.com/photo-1493815793585-d94ccbc86df8",
    alt: "Foggy city skyline",
    condition: "fog",
  },
  {
    url: "https://images.unsplash.com/photo-1513147159441-85173d52ade8",
    alt: "Misty mountain landscape",
    condition: "mist",
  },
  {
    url: "https://images.unsplash.com/photo-1522163723043-478ef79a5bb4",
    alt: "Foggy countryside road",
    condition: "fog",
  },
];

// Photos based on seasonal temperatures
export const seasonalPhotos: WeatherPhoto[] = [
  // Hot summer (above 28°C)
  {
    url: "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a",
    alt: "Summer beach with people swimming",
    temperature: 28,
  },
  {
    url: "https://images.unsplash.com/photo-1437209484568-e63b90a34f8b",
    alt: "Summer park with people relaxing",
    temperature: 28,
  },
  {
    url: "https://images.unsplash.com/photo-1605000797499-95a51c5269ae",
    alt: "People at summer pool party",
    temperature: 30,
  },
  {
    url: "https://images.unsplash.com/photo-1541417904950-b855846fe074",
    alt: "Summer outdoor café scene",
    temperature: 28,
  },
  
  // Spring/Fall moderate (15-25°C)
  {
    url: "https://images.unsplash.com/photo-1490750967868-88aa4486c946",
    alt: "Spring flowers blooming",
    temperature: 15,
  },
  {
    url: "https://images.unsplash.com/photo-1552083375-1447ce886485",
    alt: "Cherry blossoms in park",
    temperature: 18,
  },
  {
    url: "https://images.unsplash.com/photo-1507783548227-544c84716bda",
    alt: "Fall leaves on trees",
    temperature: 15,
  },
  {
    url: "https://images.unsplash.com/photo-1504788363733-507549153474",
    alt: "Autumn forest with colored leaves",
    temperature: 12,
  },
  
  // Cold winter (below 5°C)
  {
    url: "https://images.unsplash.com/photo-1455156218388-5e61b526818b",
    alt: "Winter landscape with frozen lake",
    temperature: 0,
  },
  {
    url: "https://images.unsplash.com/photo-1581303435722-cb4a7090fb1f",
    alt: "Icy tree branches in winter",
    temperature: -5,
  },
  {
    url: "https://images.unsplash.com/photo-1483664852095-d6cc6870702d",
    alt: "Person bundled up in winter clothing",
    temperature: 2,
  },
  {
    url: "https://images.unsplash.com/photo-1491002052546-bf38f186af56",
    alt: "Snow-covered mountains",
    temperature: -10,
  },
];

// Get a weather photo based on current conditions
export function getWeatherPhoto(condition: string, temperature: number): WeatherPhoto {
  let photoCollection: WeatherPhoto[] = [];
  
  // First try to match by specific condition
  if (condition.includes('sun') || condition.includes('clear')) {
    photoCollection = sunnyPhotos;
  } else if (condition.includes('rain') || condition.includes('drizzle') || condition.includes('shower')) {
    photoCollection = rainyPhotos;
  } else if (condition.includes('cloud') || condition.includes('overcast')) {
    photoCollection = cloudyPhotos;
  } else if (condition.includes('snow') || condition.includes('sleet') || condition.includes('ice')) {
    photoCollection = snowyPhotos;
  } else if (condition.includes('fog') || condition.includes('mist') || condition.includes('haze')) {
    photoCollection = foggyPhotos;
  } else {
    // If no condition match, use temperature to determine season
    if (temperature >= 28) {
      photoCollection = seasonalPhotos.filter(photo => photo.temperature && photo.temperature >= 25);
    } else if (temperature <= 5) {
      photoCollection = seasonalPhotos.filter(photo => photo.temperature && photo.temperature <= 5);
    } else {
      photoCollection = seasonalPhotos.filter(photo => 
        photo.temperature && photo.temperature > 5 && photo.temperature < 25
      );
    }
    
    // If still no matches, use a mix of all photos
    if (photoCollection.length === 0) {
      photoCollection = [...sunnyPhotos, ...cloudyPhotos, ...rainyPhotos, ...snowyPhotos, ...foggyPhotos];
    }
  }
  
  // Get a random photo from the collection
  const randomIndex = Math.floor(Math.random() * photoCollection.length);
  return photoCollection[randomIndex];
}

// All photos combined (useful for location gallery)
export const allWeatherPhotos: WeatherPhoto[] = [
  ...sunnyPhotos,
  ...rainyPhotos,
  ...cloudyPhotos,
  ...snowyPhotos,
  ...foggyPhotos,
  ...seasonalPhotos,
];

// Get random selection of weather photos
export function getRandomWeatherPhotos(count: number = 5): WeatherPhoto[] {
  const shuffled = [...allWeatherPhotos].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}