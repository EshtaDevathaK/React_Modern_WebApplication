import { FC } from "react";
import { Music, Play, ExternalLink } from "lucide-react";

interface MusicVibesProps {
  weather: any;
}

interface PlaylistTrack {
  title: string;
  artist: string;
  duration: string;
}

const MusicVibes: FC<MusicVibesProps> = ({ weather }) => {
  const condition = weather.current.condition.text.toLowerCase();
  
  // Generate playlist based on weather condition
  const getPlaylist = () => {
    if (condition.includes("rain") || condition.includes("drizzle") || condition.includes("shower")) {
      return {
        name: "Rainy Day Playlist",
        description: "Cozy beats for rainy weather",
        coverImage: "https://images.unsplash.com/photo-1501999635878-71cb5379c2d8?w=300&auto=format&fit=crop&q=80",
        tracks: [
          { title: "Rain Sounds", artist: "Nature Recordings", duration: "3:45" },
          { title: "Rainy Jazz", artist: "Café Lounge", duration: "4:30" },
          { title: "Storm Watching", artist: "Ambient Moods", duration: "5:15" },
          { title: "Cozy Evenings", artist: "Piano Collection", duration: "3:20" }
        ]
      };
    } else if (condition.includes("cloud") || condition.includes("overcast")) {
      return {
        name: "Partly Cloudy Playlist",
        description: "Mellow tunes for your laid-back day",
        coverImage: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=300&auto=format&fit=crop&q=80",
        tracks: [
          { title: "Autumn Leaves", artist: "Jazz Collection", duration: "3:42" },
          { title: "Coffee & Rain", artist: "Lo-Fi Beats", duration: "4:15" },
          { title: "Gentle Breeze", artist: "Acoustic Playlist", duration: "3:28" },
          { title: "Golden Hour", artist: "Indie Favorites", duration: "3:55" }
        ]
      };
    } else if (condition.includes("sunny") || condition.includes("clear")) {
      return {
        name: "Sunny Day Vibes",
        description: "Upbeat tunes for a perfect day",
        coverImage: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&auto=format&fit=crop&q=80",
        tracks: [
          { title: "Summer Breeze", artist: "Beach Party", duration: "3:15" },
          { title: "Morning Light", artist: "Pop Essentials", duration: "2:55" },
          { title: "Happy Days", artist: "Feel Good Hits", duration: "3:40" },
          { title: "Sunshine Rhythm", artist: "Dance Collection", duration: "4:10" }
        ]
      };
    } else if (condition.includes("snow") || condition.includes("blizzard")) {
      return {
        name: "Winter Wonderland",
        description: "Peaceful melodies for snow days",
        coverImage: "https://images.unsplash.com/photo-1482597869166-609e91429f40?w=300&auto=format&fit=crop&q=80",
        tracks: [
          { title: "Snowfall", artist: "Piano Dreams", duration: "4:30" },
          { title: "Winter Magic", artist: "Classical Collection", duration: "3:55" },
          { title: "Fireplace Melodies", artist: "Acoustic Guitars", duration: "5:20" },
          { title: "Cozy Night In", artist: "Holiday Favorites", duration: "3:45" }
        ]
      };
    } else {
      return {
        name: "Weather Moods",
        description: "Eclectic mix for changing weather",
        coverImage: "https://images.unsplash.com/photo-1470115636492-6d2b56f9146d?w=300&auto=format&fit=crop&q=80",
        tracks: [
          { title: "Changing Skies", artist: "Ambient Collection", duration: "4:25" },
          { title: "Wind & Waves", artist: "Nature Sounds", duration: "3:40" },
          { title: "Seasonal Shifts", artist: "Meditation Music", duration: "5:10" },
          { title: "Weather Patterns", artist: "Electronic Ambient", duration: "3:35" }
        ]
      };
    }
  };
  
  const playlist = getPlaylist();
  
  return (
    <div className="bg-white rounded-xl shadow-soft p-4 md:p-6">
      <h2 className="font-heading text-xl font-semibold text-navy mb-4 flex items-center">
        <Music className="h-5 w-5 text-primary-light mr-2" />
        <span>Music Vibes</span>
      </h2>
      
      <div className="rounded-lg bg-navy p-4 flex items-center mb-4">
        <div className="h-16 w-16 rounded-md overflow-hidden mr-4">
          <img src={playlist.coverImage} alt="Playlist Cover" className="h-full w-full object-cover" />
        </div>
        
        <div className="flex-grow">
          <h3 className="text-white font-medium mb-1">{playlist.name}</h3>
          <p className="text-gray-300 text-sm">{playlist.description}</p>
        </div>
        
        <div>
          <button className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-primary text-white hover:bg-primary-dark transition-colors">
            <Play className="h-5 w-5" />
          </button>
        </div>
      </div>
      
      <div className="space-y-3">
        {playlist.tracks.map((track, index) => (
          <div key={index} className="flex items-center p-2 hover:bg-gray-50 rounded-lg transition-colors">
            <div className="w-8 text-center text-gray-500">{index + 1}</div>
            <div className="ml-2 flex-grow">
              <div className="font-medium">{track.title}</div>
              <div className="text-sm text-gray-500">{track.artist}</div>
            </div>
            <div className="text-sm text-gray-500">{track.duration}</div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 text-center">
        <a 
          href="#" 
          className="inline-flex items-center text-primary-dark hover:text-primary transition-colors text-sm font-medium"
        >
          <span>Open in Spotify</span>
          <ExternalLink className="h-3 w-3 ml-1" />
        </a>
      </div>
    </div>
  );
};

export default MusicVibes;
