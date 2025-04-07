import { FC, useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Music, ExternalLink, Play, ListMusic } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface MusicVibesProps {
  weather: any;
}

export interface PlaylistTrack {
  title: string;
  artist: string;
  duration: string;
  spotifyUrl: string; // We'll keep the property name but use it for JioSaavn links
}

// Define Tamil playlists based on weather conditions with JioSaavn links
const TAMIL_WEATHER_PLAYLISTS: Record<string, {
  title: string;
  mood: string;
  spotifyId: string; // Kept for compatibility
  description: string;
  tracks: PlaylistTrack[];
}> = {
  'sunny': {
    title: 'Tamil Sunny Day Vibes',
    mood: 'Upbeat & Energetic',
    spotifyId: '37i9dQZF1DX3vqmcY7rbTP',
    description: 'Cheerful Tamil tracks perfect for a bright sunny day.',
    tracks: [
      { title: 'Mallipoo', artist: 'A.R. Rahman, Shweta Mohan', duration: '4:25', spotifyUrl: 'https://www.jiosaavn.com/song/mallipoo/RT8zfBh9eHw' },
      { title: 'Maruvaarthai', artist: 'Sid Sriram', duration: '4:47', spotifyUrl: 'https://www.jiosaavn.com/song/maruvaarthai/PV8GWBNpZmM' },
      { title: 'Kannaana Kanne', artist: 'D. Imman, Sid Sriram', duration: '5:35', spotifyUrl: 'https://www.jiosaavn.com/song/kannaana-kanne/Ow9pcCZIZGQ' }
    ]
  },
  'rain': {
    title: 'Tamil Rainy Day Melodies',
    mood: 'Mellow & Romantic',
    spotifyId: '37i9dQZF1DWYpC2SRwVMtZ',
    description: 'Soothing Tamil songs that pair perfectly with raindrops.',
    tracks: [
      { title: 'Mazhai Kuruvi', artist: 'A.R. Rahman, Shreya Ghoshal', duration: '5:42', spotifyUrl: 'https://www.jiosaavn.com/song/mazhai-kuruvi/Fi8zfz5TfVI' },
      { title: 'Nenjukkul Peidhidum', artist: 'Harris Jayaraj, Hariharan', duration: '5:02', spotifyUrl: 'https://www.jiosaavn.com/song/nenjukkul-peidhidum/KD8pfhJpfHo' },
      { title: 'Megamo Aval', artist: 'Govind Vasantha, Chinmayi', duration: '3:57', spotifyUrl: 'https://www.jiosaavn.com/song/megamo-aval/OCY-fERVdVE' }
    ]
  },
  'cloudy': {
    title: 'Tamil Cloudy Day Melodies',
    mood: 'Thoughtful & Calm',
    spotifyId: '37i9dQZF1DX4nA6pD5Wm1p',
    description: 'Soothing Tamil tracks for overcast, thoughtful days.',
    tracks: [
      { title: 'Uyire', artist: 'A.R. Rahman, Hariharan', duration: '5:15', spotifyUrl: 'https://www.jiosaavn.com/song/uyire/Kjs0dApDX3A' },
      { title: 'Unna Nenachu', artist: 'Govind Vasantha, Sid Sriram', duration: '3:48', spotifyUrl: 'https://www.jiosaavn.com/song/unna-nenachu/OCcLBQJ,fEk' },
      { title: 'Kaadhal En Kaviye', artist: 'Sid Sriram', duration: '4:05', spotifyUrl: 'https://www.jiosaavn.com/song/kaadhal-en-kaviye/LgQ5chN3bmw' }
    ]
  },
  'clear': {
    title: 'Tamil Clear Skies Music',
    mood: 'Fresh & Uplifting',
    spotifyId: '37i9dQZF1DXa2PjuCvZ7it',
    description: 'Uplifting Tamil tracks for days with crystal clear skies.',
    tracks: [
      { title: 'Rowdy Baby', artist: 'Dhanush, Dhee', duration: '3:42', spotifyUrl: 'https://www.jiosaavn.com/song/rowdy-baby/JV8Tf09Ud0U' },
      { title: 'Vaathi Coming', artist: 'Anirudh Ravichander', duration: '3:55', spotifyUrl: 'https://www.jiosaavn.com/song/vaathi-coming/KjQ6eQNoBHI' },
      { title: 'Aalaporan Thamizhan', artist: 'A.R. Rahman', duration: '5:01', spotifyUrl: 'https://www.jiosaavn.com/song/aalaporan-thamizhan/Bg8pcExHU0g' }
    ]
  },
  'thunderstorm': {
    title: 'Tamil Storm Intensity',
    mood: 'Dramatic & Powerful',
    spotifyId: '37i9dQZF1DX7T5WTGg8L5C',
    description: 'Powerful Tamil tracks that match the intensity of a storm.',
    tracks: [
      { title: 'Danga Danga', artist: 'Vijay, Anirudh Ravichander', duration: '3:32', spotifyUrl: 'https://www.jiosaavn.com/song/danga-danga/P1YGdERYVHA' },
      { title: 'Aaruyire', artist: 'Harris Jayaraj', duration: '5:46', spotifyUrl: 'https://www.jiosaavn.com/song/aaruyire/HQ8iR0NnUlQ' },
      { title: 'Adiye', artist: 'G.V. Prakash Kumar', duration: '4:19', spotifyUrl: 'https://www.jiosaavn.com/song/adiyae/OzsPeyRqVm4' }
    ]
  },
  'fog': {
    title: 'Tamil Misty Morning Tunes',
    mood: 'Mysterious & Ethereal',
    spotifyId: '37i9dQZF1DX5TLaQDnVaiH',
    description: 'Atmospheric Tamil music for foggy, misty days.',
    tracks: [
      { title: 'Nenjame', artist: 'Yuvan Shankar Raja', duration: '5:22', spotifyUrl: 'https://www.jiosaavn.com/song/nenjame/MT0wHix-fXw' },
      { title: 'Aagaya Vennilave', artist: 'Karthik', duration: '5:34', spotifyUrl: 'https://www.jiosaavn.com/song/aagaya-vennilavae/HSIfVRRoWnA' },
      { title: 'Thalli Pogathey', artist: 'A.R. Rahman, Sid Sriram', duration: '5:13', spotifyUrl: 'https://www.jiosaavn.com/song/thalli-pogathey/NCw9dkFaZ2Y' }
    ]
  },
  'hot': {
    title: 'Tamil Summer Heat Playlist',
    mood: 'Energetic & Vibrant',
    spotifyId: '37i9dQZF1DX6VdMW310pXC',
    description: 'High-energy Tamil tracks for hot summer days.',
    tracks: [
      { title: 'Udhungada Sangu', artist: 'Anirudh Ravichander', duration: '3:26', spotifyUrl: 'https://www.jiosaavn.com/song/udhungada-sangu/PRUcey5YW2g' },
      { title: 'Ethir Neechal', artist: 'Anirudh Ravichander, Hiphop Tamizha', duration: '3:42', spotifyUrl: 'https://www.jiosaavn.com/song/ethir-neechal/NCgiWwR6Z0c' },
      { title: 'Arabic Kuthu', artist: 'Anirudh Ravichander', duration: '4:14', spotifyUrl: 'https://www.jiosaavn.com/song/arabic-kuthu/OwN7fDl5dnY' }
    ]
  },
  'cold': {
    title: 'Tamil Cold Day Warmth',
    mood: 'Comforting & Warm',
    spotifyId: '37i9dQZF1DX7vqqgeLlrLh',
    description: 'Soothing Tamil melodies to warm you on a cold day.',
    tracks: [
      { title: 'Malargal Kaettaen', artist: 'A.R. Rahman', duration: '5:11', spotifyUrl: 'https://www.jiosaavn.com/song/malargal-kaettaen/NCoeXRh,azY' },
      { title: 'Un Paarvaiyil', artist: 'Yuvan Shankar Raja', duration: '5:43', spotifyUrl: 'https://www.jiosaavn.com/song/un-paarvaiyil/NBEfBkdaVmI' },
      { title: 'Achcham Enbadhu Madamaiyada', artist: 'A.R. Rahman', duration: '4:23', spotifyUrl: 'https://www.jiosaavn.com/song/achcham-enbadhu-madamaiyada/HAUAShsaAUA' }
    ]
  },
  'windy': {
    title: 'Tamil Windswept Melodies',
    mood: 'Free & Flowing',
    spotifyId: '37i9dQZF1DX2taNm2KsnLZ',
    description: 'Tamil songs that capture the feeling of the wind.',
    tracks: [
      { title: 'Venmegam', artist: 'Harris Jayaraj', duration: '5:32', spotifyUrl: 'https://www.jiosaavn.com/song/venmegam/NSEKVS5-RG4' },
      { title: 'Uyirin Uyire', artist: 'A.R. Rahman, Hariharan', duration: '5:55', spotifyUrl: 'https://www.jiosaavn.com/song/uyirin-uyire/RgQpcC1,fFg' },
      { title: 'Vaseegara', artist: 'Harris Jayaraj', duration: '6:23', spotifyUrl: 'https://www.jiosaavn.com/song/vaseegara/B10GcS99Z1c' }
    ]
  },
  'default': {
    title: 'Tamil Weather Mood Mix',
    mood: 'Balanced & Pleasant',
    spotifyId: '37i9dQZF1DX6XE7HRLM75P',
    description: 'A well-balanced mix of Tamil songs for any weather.',
    tracks: [
      { title: 'Munbe Vaa', artist: 'A.R. Rahman, Shreya Ghoshal', duration: '5:07', spotifyUrl: 'https://www.jiosaavn.com/song/munbe-vaa/N14iZS5CfXA' },
      { title: 'Nee Paartha Vizhigal', artist: 'Sid Sriram', duration: '4:48', spotifyUrl: 'https://www.jiosaavn.com/song/nee-paartha-vizhigal/PRw-fyZ,c3E' },
      { title: 'Kannana Kanne', artist: 'Sid Sriram', duration: '5:35', spotifyUrl: 'https://www.jiosaavn.com/song/kannaana-kanne/Ow9pcCZIZGQ' }
    ]
  }
};

// Define playlists based on weather conditions (backup/original)
const WEATHER_PLAYLISTS: Record<string, {
  title: string;
  mood: string;
  spotifyId: string;
  description: string;
  tracks: PlaylistTrack[];
}> = {
  'sunny': {
    title: 'Sunny Day Vibes',
    mood: 'Upbeat & Energetic',
    spotifyId: '37i9dQZF1DX6ALfRKlHn1t',
    description: 'Bright, cheerful tunes perfect for a sunny day outside.',
    tracks: [
      { title: 'Walking On Sunshine', artist: 'Katrina & The Waves', duration: '3:58', spotifyUrl: 'https://www.jiosaavn.com/song/walking-on-sunshine/A15jeUtHYVA' },
      { title: 'Good Vibrations', artist: 'The Beach Boys', duration: '3:39', spotifyUrl: 'https://www.jiosaavn.com/song/good-vibrations/KDwKSRhpGHo' },
      { title: 'Island In The Sun', artist: 'Weezer', duration: '3:20', spotifyUrl: 'https://www.jiosaavn.com/song/island-in-the-sun/Ow9pcE05YmA' },
      { title: 'Here Comes The Sun', artist: 'The Beatles', duration: '3:05', spotifyUrl: 'https://www.jiosaavn.com/song/here-comes-the-sun/JAYaRzFna3g' },
      { title: 'Good Day Sunshine', artist: 'The Beatles', duration: '2:10', spotifyUrl: 'https://www.jiosaavn.com/song/good-day-sunshine/FVoiYCh,VUE' }
    ]
  },
  'rain': {
    title: 'Rainy Day Playlist',
    mood: 'Mellow & Reflective',
    spotifyId: '37i9dQZF1DXbvABJXBIyiY',
    description: 'Calm, introspective songs that pair perfectly with raindrops.',
    tracks: [
      { title: 'Riders on the Storm', artist: 'The Doors', duration: '7:14', spotifyUrl: 'https://www.jiosaavn.com/song/riders-on-the-storm/HlUGfhV0dVk' },
      { title: 'Set Fire to the Rain', artist: 'Adele', duration: '4:01', spotifyUrl: 'https://www.jiosaavn.com/song/set-fire-to-the-rain/Kls9RxZVYWA' },
      { title: 'Rain', artist: 'The Beatles', duration: '3:02', spotifyUrl: 'https://www.jiosaavn.com/song/rain/IwszcSF5RHY' },
      { title: 'November Rain', artist: 'Guns N\' Roses', duration: '8:57', spotifyUrl: 'https://www.jiosaavn.com/song/november-rain/RT8zfCp-eks' },
      { title: 'Purple Rain', artist: 'Prince', duration: '8:41', spotifyUrl: 'https://www.jiosaavn.com/song/purple-rain/KDwKSUplcWo' }
    ]
  },
  // Keeping other conditions for fallback
  'default': {
    title: 'Weather Mood Mix',
    mood: 'Balanced & Pleasant',
    spotifyId: '37i9dQZF1DX6XE7HRLM75P',
    description: 'A well-balanced mix of songs for any weather.',
    tracks: [
      { title: 'Somewhere Over The Rainbow', artist: 'Israel Kamakawiwo\'ole', duration: '3:32', spotifyUrl: 'https://www.jiosaavn.com/song/somewhere-over-the-rainbow/My03ZzZiWHs' },
      { title: 'Sunny Afternoon', artist: 'The Kinks', duration: '3:36', spotifyUrl: 'https://www.jiosaavn.com/song/sunny-afternoon/FQ4HWTB2ank' },
      { title: 'Perfect Day', artist: 'Lou Reed', duration: '3:26', spotifyUrl: 'https://www.jiosaavn.com/song/perfect-day/GS8odUh9AGE' },
      { title: 'Feeling Good', artist: 'Nina Simone', duration: '2:54', spotifyUrl: 'https://www.jiosaavn.com/song/feeling-good/JggzVzZDY1o' },
      { title: 'Waterloo Sunset', artist: 'The Kinks', duration: '3:18', spotifyUrl: 'https://www.jiosaavn.com/song/waterloo-sunset/JQ4BXhJcAWo' }
    ]
  }
};

// Weather mood popup text
const MOOD_POPUP = {
  "Sunny": "Bring your cool shades 😎 — it's a sunglasses kinda day!",
  "Rain": "Sweater weather 🧣 — and maybe a warm cup of chai?",
  "Thunderstorm": "Stay in, curl up with a book 📚 — it's stormy out there.",
  "Clear": "Perfect time for a walk 🌿 — don't forget your playlist!",
  "Clouds": "A good day to relax 🧘🏽‍♀️ — maybe with some coffee and music?",
  "Snow": "Bundle up warm ❄️ — it's a winter wonderland outside!",
  "Mist": "Drive carefully 🚗 — visibility might be reduced.",
  "Fog": "Take it slow today 🐌 — the fog creates a mystical atmosphere.",
  "Haze": "Indoor activities might be best 🏠 — air quality isn't great.",
  "Dust": "Keep windows closed 🪟 — and maybe wear a mask outside.",
  "Smoke": "Stay indoors if possible 🏠 — air quality is poor.",
  "Hot": "Stay hydrated 💧 — it's a scorcher out there!",
  "Cold": "Layer up! 🧥 — it's chilly outside.",
  "Windy": "Hold onto your hat! 🌪️ — it's breezy out there.",
  "Tornado": "Seek shelter immediately! 🚨 — dangerous conditions outside.",
  "Drizzle": "Light rain jacket recommended ☔ — might get a little damp."
};

// Get weather condition in a normalized form
function normalizeWeatherCondition(weather: any): string {
  if (!weather || !weather.current || !weather.current.condition) {
    return 'default';
  }
  
  const condition = weather.current.condition.text.toLowerCase();
  const temp = weather.current.temp_c;
  
  // Map various weather conditions to our playlist keys
  if (condition.includes('sun') || condition.includes('clear') && temp > 25) return 'sunny';
  if (condition.includes('rain') || condition.includes('drizzle')) return 'rain';
  if (condition.includes('cloud')) return 'cloudy';
  if (condition.includes('clear')) return 'clear';
  if (condition.includes('thunder') || condition.includes('storm')) return 'thunderstorm';
  if (condition.includes('fog') || condition.includes('mist')) return 'fog';
  if (temp > 30) return 'hot';
  if (temp < 10) return 'cold';
  if (condition.includes('wind')) return 'windy';
  
  // Default fallback
  return 'default';
}

// Get playlist based on weather condition
function getWeatherPlaylist(weather: any) {
  const condition = normalizeWeatherCondition(weather);
  
  // Always prefer the Tamil playlists
  if (TAMIL_WEATHER_PLAYLISTS[condition]) {
    return TAMIL_WEATHER_PLAYLISTS[condition];
  }
  
  // Fallback to general playlists if no Tamil one is available
  return WEATHER_PLAYLISTS[condition] || WEATHER_PLAYLISTS['default'];
}

// Shuffle an array (Fisher-Yates algorithm)
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Get random tracks from multiple playlists
function getRandomTracks(count: number = 5): PlaylistTrack[] {
  // Collect all tracks from all Tamil playlists
  const allTracks: PlaylistTrack[] = Object.values(TAMIL_WEATHER_PLAYLISTS).reduce((acc, playlist) => {
    return [...acc, ...playlist.tracks];
  }, [] as PlaylistTrack[]);
  
  // Shuffle and return requested number of tracks
  const shuffled = shuffleArray(allTracks);
  return shuffled.slice(0, count);
}

const MusicVibes: FC<MusicVibesProps> = ({ weather }) => {
  const [showMoodToast, setShowMoodToast] = useState(false);
  const [showAllTracks, setShowAllTracks] = useState(false);
  const [selectedPlaylist, setSelectedPlaylist] = useState<{
    title: string;
    mood: string;
    tracks: PlaylistTrack[];
    description: string;
  } | null>(null);
  
  // Display mood toast briefly when component mounts
  useEffect(() => {
    setShowMoodToast(true);
    const timer = setTimeout(() => {
      setShowMoodToast(false);
    }, 5000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Update selected playlist when weather changes
  useEffect(() => {
    if (weather && weather.current) {
      setSelectedPlaylist(getWeatherPlaylist(weather));
    }
  }, [weather]);
  
  // Get mood message based on weather
  const getMoodMessage = () => {
    if (!weather || !weather.current || !weather.current.condition) return '';
    
    const condition = weather.current.condition.text.split(' ')[0];
    // Safely access the mood popup with type checking, defaulting to Clear if not found
    return MOOD_POPUP[condition as keyof typeof MOOD_POPUP] || MOOD_POPUP['Clear'];
  };
  
  // Open JioSaavn for a track
  const openJioSaavn = (trackUrl: string) => {
    // Make sure the URL is properly formed
    const formattedUrl = trackUrl.startsWith('http') ? trackUrl : `https://www.jiosaavn.com/song/${trackUrl}`;
    window.open(formattedUrl, '_blank', 'noopener,noreferrer');
    // Log for debugging
    console.log('Opening JioSaavn URL:', formattedUrl);
  };
  
  // Render nothing if no weather data
  if (!weather || !selectedPlaylist) {
    return null;
  }

  return (
    <Card className="bg-white shadow-soft rounded-xl overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center text-lg font-heading">
            <Music className="h-5 w-5 mr-2" />
            Music Vibes
          </CardTitle>
          <Badge variant="outline" className="font-medium">
            {selectedPlaylist.mood}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pb-4">
        {/* Mood toast */}
        {showMoodToast && (
          <div className="bg-primary/10 text-primary rounded-md p-3 mb-4 flex items-start">
            <div className="text-xl mr-2">🎵</div>
            <p className="text-sm">
              {getMoodMessage()}
              <br />
              <span className="text-xs text-muted-foreground">
                Weather-matched {selectedPlaylist.title} ready for you!
              </span>
            </p>
          </div>
        )}
        
        <p className="text-sm text-muted-foreground mb-4">
          {selectedPlaylist.description}
        </p>
        
        {/* Track list */}
        <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
          {selectedPlaylist.tracks.map((track, index) => (
            <div 
              key={index}
              className="flex items-center justify-between p-2 rounded-md hover:bg-muted transition-colors"
            >
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{track.title}</p>
                <p className="text-xs text-muted-foreground truncate">{track.artist}</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {track.duration}
                </span>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-7 w-7" 
                  onClick={(e) => {
                    e.stopPropagation();
                    openJioSaavn(track.spotifyUrl);
                  }}
                >
                  <ExternalLink className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 flex justify-between">
          <Button 
            variant="outline" 
            size="sm" 
            className="text-xs"
            onClick={() => setShowAllTracks(!showAllTracks)}
          >
            <ListMusic className="h-3 w-3 mr-1" />
            {showAllTracks ? "Show Fewer" : "More Tamil Songs"}
          </Button>
          
          <a 
            href="https://www.jiosaavn.com/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-xs text-muted-foreground hover:text-primary flex items-center"
          >
            Powered by JioSaavn
            <ExternalLink className="h-3 w-3 ml-1" />
          </a>
        </div>
        
        {/* Additional tracks panel */}
        {showAllTracks && (
          <div className="mt-4 pt-4 border-t">
            <h4 className="text-sm font-medium mb-3">More Tamil Songs For You</h4>
            <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
              {getRandomTracks(5).map((track, index) => (
                <div 
                  key={`extra-${index}`}
                  className="flex items-center justify-between p-2 rounded-md hover:bg-muted transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{track.title}</p>
                    <p className="text-xs text-muted-foreground truncate">{track.artist}</p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-7 w-7" 
                    onClick={() => openJioSaavn(track.spotifyUrl)}
                  >
                    <Play className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MusicVibes;