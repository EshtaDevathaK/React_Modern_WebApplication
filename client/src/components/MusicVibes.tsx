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
  spotifyUrl: string;
}

// Define Tamil playlists based on weather conditions
const TAMIL_WEATHER_PLAYLISTS: Record<string, {
  title: string;
  mood: string;
  spotifyId: string;
  description: string;
  tracks: PlaylistTrack[];
}> = {
  'sunny': {
    title: 'Tamil Sunny Day Vibes',
    mood: 'Upbeat & Energetic',
    spotifyId: '37i9dQZF1DX3vqmcY7rbTP',
    description: 'Cheerful Tamil tracks perfect for a bright sunny day.',
    tracks: [
      { title: 'Mallipoo', artist: 'A.R. Rahman, Shweta Mohan', duration: '4:25', spotifyUrl: 'https://open.spotify.com/track/2vf4clQtiqtVdR6bbvofaH' },
      { title: 'Maruvaarthai', artist: 'Sid Sriram', duration: '4:47', spotifyUrl: 'https://open.spotify.com/track/7x7RIq556HqP2JBvJlKPQN' },
      { title: 'Kannaana Kanne', artist: 'D. Imman, Sid Sriram', duration: '5:35', spotifyUrl: 'https://open.spotify.com/track/5gOKNHRw7nQeNmXAQiXPm3' }
    ]
  },
  'rain': {
    title: 'Tamil Rainy Day Melodies',
    mood: 'Mellow & Romantic',
    spotifyId: '37i9dQZF1DWYpC2SRwVMtZ',
    description: 'Soothing Tamil songs that pair perfectly with raindrops.',
    tracks: [
      { title: 'Mazhai Kuruvi', artist: 'A.R. Rahman, Shreya Ghoshal', duration: '5:42', spotifyUrl: 'https://open.spotify.com/track/2Q509oBkEBDe7QC1xGNGyx' },
      { title: 'Nenjukkul Peidhidum', artist: 'Harris Jayaraj, Hariharan', duration: '5:02', spotifyUrl: 'https://open.spotify.com/track/5V1fkHxLzriKFYmeEJYzYI' },
      { title: 'Megamo Aval', artist: 'Govind Vasantha, Chinmayi', duration: '3:57', spotifyUrl: 'https://open.spotify.com/track/31BTsTxZYn5nv2OXG4YMDq' }
    ]
  },
  'cloudy': {
    title: 'Tamil Cloudy Day Melodies',
    mood: 'Thoughtful & Calm',
    spotifyId: '37i9dQZF1DX4nA6pD5Wm1p',
    description: 'Soothing Tamil tracks for overcast, thoughtful days.',
    tracks: [
      { title: 'Uyire', artist: 'A.R. Rahman, Hariharan', duration: '5:15', spotifyUrl: 'https://open.spotify.com/track/57kvK0hq6Xzpwt2VqN6yPD' },
      { title: 'Unna Nenachu', artist: 'Govind Vasantha, Sid Sriram', duration: '3:48', spotifyUrl: 'https://open.spotify.com/track/6TuTFa8v32LzhP5h4Qr1NJ' },
      { title: 'Kaadhal En Kaviye', artist: 'Sid Sriram', duration: '4:05', spotifyUrl: 'https://open.spotify.com/track/242dRxtP0hUhyhGQMX0IYH' }
    ]
  },
  'clear': {
    title: 'Tamil Clear Skies Music',
    mood: 'Fresh & Uplifting',
    spotifyId: '37i9dQZF1DXa2PjuCvZ7it',
    description: 'Uplifting Tamil tracks for days with crystal clear skies.',
    tracks: [
      { title: 'Rowdy Baby', artist: 'Dhanush, Dhee', duration: '3:42', spotifyUrl: 'https://open.spotify.com/track/0NAkxNc5C9dosJ9xbQDV7m' },
      { title: 'Vaathi Coming', artist: 'Anirudh Ravichander', duration: '3:55', spotifyUrl: 'https://open.spotify.com/track/6XUJkoPVKjsKm37UvdhaRu' },
      { title: 'Aalaporan Thamizhan', artist: 'A.R. Rahman', duration: '5:01', spotifyUrl: 'https://open.spotify.com/track/7aFk8z1XCcKj29pLQ1GbLh' }
    ]
  },
  'thunderstorm': {
    title: 'Tamil Storm Intensity',
    mood: 'Dramatic & Powerful',
    spotifyId: '37i9dQZF1DX7T5WTGg8L5C',
    description: 'Powerful Tamil tracks that match the intensity of a storm.',
    tracks: [
      { title: 'Danga Danga', artist: 'Vijay, Anirudh Ravichander', duration: '3:32', spotifyUrl: 'https://open.spotify.com/track/2BJu0AaWjFCvzh5M06tQ3g' },
      { title: 'Aaruyire', artist: 'Harris Jayaraj', duration: '5:46', spotifyUrl: 'https://open.spotify.com/track/0l0eFecK9aCG0XGTTi2TzY' },
      { title: 'Adiye', artist: 'G.V. Prakash Kumar', duration: '4:19', spotifyUrl: 'https://open.spotify.com/track/4Xjm77OyCwEYmXDqS0Ivpa' }
    ]
  },
  'fog': {
    title: 'Tamil Misty Morning Tunes',
    mood: 'Mysterious & Ethereal',
    spotifyId: '37i9dQZF1DX5TLaQDnVaiH',
    description: 'Atmospheric Tamil music for foggy, misty days.',
    tracks: [
      { title: 'Nenjame', artist: 'Yuvan Shankar Raja', duration: '5:22', spotifyUrl: 'https://open.spotify.com/track/1aMz9zml3JdHssXQ3IZEBg' },
      { title: 'Aagaya Vennilavae', artist: 'Karthik', duration: '5:34', spotifyUrl: 'https://open.spotify.com/track/61ixqD6uXt6kyIHLqWWN4T' },
      { title: 'Thalli Pogathey', artist: 'A.R. Rahman, Sid Sriram', duration: '5:13', spotifyUrl: 'https://open.spotify.com/track/5JmYsY9BnHizMbUwYjTD7j' }
    ]
  },
  'hot': {
    title: 'Tamil Summer Heat Playlist',
    mood: 'Energetic & Vibrant',
    spotifyId: '37i9dQZF1DX6VdMW310pXC',
    description: 'High-energy Tamil tracks for hot summer days.',
    tracks: [
      { title: 'Udhungada Sangu', artist: 'Anirudh Ravichander', duration: '3:26', spotifyUrl: 'https://open.spotify.com/track/0PD5GpeBzLbIaHKBDjdmG2' },
      { title: 'Ethir Neechal', artist: 'Anirudh Ravichander, Hiphop Tamizha', duration: '3:42', spotifyUrl: 'https://open.spotify.com/track/4zJYn4EHggKiKB9eoEgVnE' },
      { title: 'Arabic Kuthu', artist: 'Anirudh Ravichander', duration: '4:14', spotifyUrl: 'https://open.spotify.com/track/0XWpKIGLJGQUUHQzDPG9Mo' }
    ]
  },
  'cold': {
    title: 'Tamil Cold Day Warmth',
    mood: 'Comforting & Warm',
    spotifyId: '37i9dQZF1DX7vqqgeLlrLh',
    description: 'Soothing Tamil melodies to warm you on a cold day.',
    tracks: [
      { title: 'Malargal Kaettaen', artist: 'A.R. Rahman', duration: '5:11', spotifyUrl: 'https://open.spotify.com/track/44NbcLQysno0oKdwb910pi' },
      { title: 'Un Paarvaiyil', artist: 'Yuvan Shankar Raja', duration: '5:43', spotifyUrl: 'https://open.spotify.com/track/3FRpYxm54Pz9xHPCyKiSzh' },
      { title: 'Achcham Enbadhu Madamaiyada', artist: 'A.R. Rahman', duration: '4:23', spotifyUrl: 'https://open.spotify.com/track/0m9CsQIlJyNfKyQaUfHOTK' }
    ]
  },
  'windy': {
    title: 'Tamil Windswept Melodies',
    mood: 'Free & Flowing',
    spotifyId: '37i9dQZF1DX2taNm2KsnLZ',
    description: 'Tamil songs that capture the feeling of the wind.',
    tracks: [
      { title: 'Venmegam', artist: 'Harris Jayaraj', duration: '5:32', spotifyUrl: 'https://open.spotify.com/track/1iKJaLDkTi93syTGUGRtpt' },
      { title: 'Uyirin Uyire', artist: 'A.R. Rahman, Hariharan', duration: '5:55', spotifyUrl: 'https://open.spotify.com/track/76BKzMlqkf1PROVxaZiCnO' },
      { title: 'Vaseegara', artist: 'Harris Jayaraj', duration: '6:23', spotifyUrl: 'https://open.spotify.com/track/5YO5LUrRUMZkLz0P73sfxV' }
    ]
  },
  'default': {
    title: 'Tamil Weather Mood Mix',
    mood: 'Balanced & Pleasant',
    spotifyId: '37i9dQZF1DX6XE7HRLM75P',
    description: 'A well-balanced mix of Tamil songs for any weather.',
    tracks: [
      { title: 'Munbe Vaa', artist: 'A.R. Rahman, Shreya Ghoshal', duration: '5:07', spotifyUrl: 'https://open.spotify.com/track/0OQ8y7UO0AutKiTQpx3uHI' },
      { title: 'Nee Paartha Vizhigal', artist: 'Sid Sriram', duration: '4:48', spotifyUrl: 'https://open.spotify.com/track/1SV9HkEpxGrDts292uxQgQ' },
      { title: 'Kannana Kanne', artist: 'Sid Sriram', duration: '5:35', spotifyUrl: 'https://open.spotify.com/track/5gOKNHRw7nQeNmXAQiXPm3' }
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
      { title: 'Walking On Sunshine', artist: 'Katrina & The Waves', duration: '3:58', spotifyUrl: 'https://open.spotify.com/track/05wIrZSwuaVWhcv5FfqeH0' },
      { title: 'Good Vibrations', artist: 'The Beach Boys', duration: '3:39', spotifyUrl: 'https://open.spotify.com/track/7tf64mcmU9B7HN9n8SH4IC' },
      { title: 'Island In The Sun', artist: 'Weezer', duration: '3:20', spotifyUrl: 'https://open.spotify.com/track/2MLHyLy5z5l5YRp7momlgw' },
      { title: 'Here Comes The Sun', artist: 'The Beatles', duration: '3:05', spotifyUrl: 'https://open.spotify.com/track/6dGnYIeXmHdcikdzNNDMm2' },
      { title: 'Good Day Sunshine', artist: 'The Beatles', duration: '2:10', spotifyUrl: 'https://open.spotify.com/track/754kgU5rWscRTfvlsuEwFp' }
    ]
  },
  'rain': {
    title: 'Rainy Day Playlist',
    mood: 'Mellow & Reflective',
    spotifyId: '37i9dQZF1DXbvABJXBIyiY',
    description: 'Calm, introspective songs that pair perfectly with raindrops.',
    tracks: [
      { title: 'Riders on the Storm', artist: 'The Doors', duration: '7:14', spotifyUrl: 'https://open.spotify.com/track/14XWXWv5FoCbFzLksawpEe' },
      { title: 'Set Fire to the Rain', artist: 'Adele', duration: '4:01', spotifyUrl: 'https://open.spotify.com/track/73nJjNtdZDU0tMKXcSqaQD' },
      { title: 'Rain', artist: 'The Beatles', duration: '3:02', spotifyUrl: 'https://open.spotify.com/track/42cv3XIW0q4cjFHI65S29g' },
      { title: 'November Rain', artist: 'Guns N\' Roses', duration: '8:57', spotifyUrl: 'https://open.spotify.com/track/0jeq4JJ2cPHvCie3lax4gV' },
      { title: 'Purple Rain', artist: 'Prince', duration: '8:41', spotifyUrl: 'https://open.spotify.com/track/54X78diSLoUDI3joC2bjMz' }
    ]
  },
  'cloudy': {
    title: 'Cloudy Day Chill',
    mood: 'Thoughtful & Calm',
    spotifyId: '37i9dQZF1DX6GwdWRQMQpq',
    description: 'Laid-back tunes for those overcast, contemplative days.',
    tracks: [
      { title: 'Both Sides Now', artist: 'Joni Mitchell', duration: '4:33', spotifyUrl: 'https://open.spotify.com/track/2jvuMDqBK04WvCYYz5qjvG' },
      { title: 'Cloudbusting', artist: 'Kate Bush', duration: '5:10', spotifyUrl: 'https://open.spotify.com/track/7nvaKuQv0Kh3QkrCYZocCM' },
      { title: 'Dreams', artist: 'Fleetwood Mac', duration: '4:14', spotifyUrl: 'https://open.spotify.com/track/0ofHAoxe9vBkTCp2UQIavz' },
      { title: 'The Clouds', artist: 'The Paper Kites', duration: '3:44', spotifyUrl: 'https://open.spotify.com/track/3PVygWh2PtcLxKkQZpBOxO' },
      { title: 'Head in the Clouds', artist: 'Jamiroquai', duration: '3:57', spotifyUrl: 'https://open.spotify.com/track/3SJBMFPkFHPnVZYEVnhqmn' }
    ]
  },
  'snow': {
    title: 'Winter Wonderland',
    mood: 'Cozy & Peaceful',
    spotifyId: '37i9dQZF1DX4H7FFUM2osB',
    description: 'Cozy tracks to enjoy while watching the snowfall outside.',
    tracks: [
      { title: 'Let It Snow! Let It Snow! Let It Snow!', artist: 'Dean Martin', duration: '1:57', spotifyUrl: 'https://open.spotify.com/track/2uFaJJtFnADsWAHFXVrd5t' },
      { title: 'Winter', artist: 'Antonio Vivaldi', duration: '8:37', spotifyUrl: 'https://open.spotify.com/track/0WBLQ650dbrk3Vti9UAHZ8' },
      { title: 'Snowflake', artist: 'Kate Bush', duration: '3:31', spotifyUrl: 'https://open.spotify.com/track/6H6x9Gqs7vc8eZrTRuAgd7' },
      { title: 'Cold', artist: 'Chris Stapleton', duration: '4:27', spotifyUrl: 'https://open.spotify.com/track/3QmolSZqjjLksTUvZJ6pPS' },
      { title: 'Winterbreak', artist: 'MUNA', duration: '3:42', spotifyUrl: 'https://open.spotify.com/track/37R0bQOQj5a7DOqh1TGnQK' }
    ]
  },
  'clear': {
    title: 'Clear Skies Beats',
    mood: 'Fresh & Uplifting',
    spotifyId: '37i9dQZF1DX1BzILRveYHb',
    description: 'Fresh, uplifting tracks for days with crystal clear skies.',
    tracks: [
      { title: 'Blue Skies', artist: 'Ella Fitzgerald', duration: '3:40', spotifyUrl: 'https://open.spotify.com/track/7dBKLM26S0oeECb0mzXPQt' },
      { title: 'Mr. Blue Sky', artist: 'Electric Light Orchestra', duration: '5:04', spotifyUrl: 'https://open.spotify.com/track/2RlgNHKcydI9sayD2Df2xp' },
      { title: 'Blue Clear Sky', artist: 'George Strait', duration: '2:54', spotifyUrl: 'https://open.spotify.com/track/3R2bC0VF0ZwgKbdQRFVDjT' },
      { title: 'Sky Blue', artist: 'Peter Gabriel', duration: '6:37', spotifyUrl: 'https://open.spotify.com/track/7ewTC4WPCVJNDVXYnzPP2Z' },
      { title: 'Clear Blue Water', artist: 'Good People', duration: '3:54', spotifyUrl: 'https://open.spotify.com/track/7IYCWMqfn9bXV0iAyLYctg' }
    ]
  },
  'thunderstorm': {
    title: 'Thunderstorm Intensity',
    mood: 'Dramatic & Powerful',
    spotifyId: '37i9dQZF1DX2pSTOxoPbx9',
    description: 'Powerful tracks that match the intensity of a thunderstorm.',
    tracks: [
      { title: 'Thunderstruck', artist: 'AC/DC', duration: '4:52', spotifyUrl: 'https://open.spotify.com/track/57bgtoPSgt236HzfBOd8kj' },
      { title: 'Riders on the Storm', artist: 'The Doors', duration: '7:14', spotifyUrl: 'https://open.spotify.com/track/14XWXWv5FoCbFzLksawpEe' },
      { title: 'Thunder', artist: 'Imagine Dragons', duration: '3:07', spotifyUrl: 'https://open.spotify.com/track/57FiWCjpu47STk8QLixV3g' },
      { title: 'Thunderclouds', artist: 'LSD, Sia, Diplo, Labrinth', duration: '3:59', spotifyUrl: 'https://open.spotify.com/track/6v4XVlLAQZ1efYb1mCJPHF' },
      { title: 'The Thunder Rolls', artist: 'Garth Brooks', duration: '3:42', spotifyUrl: 'https://open.spotify.com/track/5xSoGGIYmeMw0mzOTnHil2' }
    ]
  },
  'fog': {
    title: 'Misty Morning Tunes',
    mood: 'Mysterious & Ethereal',
    spotifyId: '37i9dQZF1DX5VfG3CPQd8n',
    description: 'Atmospheric music that enhances the mystical quality of fog.',
    tracks: [
      { title: 'The Foggy Dew', artist: 'Sinéad O\'Connor & The Chieftains', duration: '5:21', spotifyUrl: 'https://open.spotify.com/track/4q7z0Vw9bvG8yTOVR1PoNe' },
      { title: 'Fog', artist: 'Radiohead', duration: '2:18', spotifyUrl: 'https://open.spotify.com/track/2mNT0e6F8skKRvtJs6A3kp' },
      { title: 'A Foggy Day', artist: 'Frank Sinatra', duration: '2:37', spotifyUrl: 'https://open.spotify.com/track/6J8gFveYoYJVfAwmQJGBwT' },
      { title: 'Pyramid Song', artist: 'Radiohead', duration: '5:01', spotifyUrl: 'https://open.spotify.com/track/51oxGKLZDucWz8y12UNvzz' },
      { title: 'In The Mist', artist: 'Bill Evans', duration: '4:34', spotifyUrl: 'https://open.spotify.com/track/78NjhDEXoXamVrknJcdWsz' }
    ]
  },
  'mist': {
    title: 'Misty Morning Tunes',
    mood: 'Mysterious & Ethereal',
    spotifyId: '37i9dQZF1DX5VfG3CPQd8n',
    description: 'Atmospheric music that enhances the mystical quality of fog.',
    tracks: [
      { title: 'The Foggy Dew', artist: 'Sinéad O\'Connor & The Chieftains', duration: '5:21', spotifyUrl: 'https://open.spotify.com/track/4q7z0Vw9bvG8yTOVR1PoNe' },
      { title: 'Fog', artist: 'Radiohead', duration: '2:18', spotifyUrl: 'https://open.spotify.com/track/2mNT0e6F8skKRvtJs6A3kp' },
      { title: 'A Foggy Day', artist: 'Frank Sinatra', duration: '2:37', spotifyUrl: 'https://open.spotify.com/track/6J8gFveYoYJVfAwmQJGBwT' },
      { title: 'Pyramid Song', artist: 'Radiohead', duration: '5:01', spotifyUrl: 'https://open.spotify.com/track/51oxGKLZDucWz8y12UNvzz' },
      { title: 'In The Mist', artist: 'Bill Evans', duration: '4:34', spotifyUrl: 'https://open.spotify.com/track/78NjhDEXoXamVrknJcdWsz' }
    ]
  },
  'hot': {
    title: 'Summer Heat Playlist',
    mood: 'Energetic & Vibrant',
    spotifyId: '37i9dQZF1DX0AMssoUKNXN',
    description: 'High-energy tracks to keep your spirits up on a hot day.',
    tracks: [
      { title: 'Hot Stuff', artist: 'Donna Summer', duration: '3:49', spotifyUrl: 'https://open.spotify.com/track/5mqdXKBZGpMxgdsGGYKLRk' },
      { title: 'Cruel Summer', artist: 'Bananarama', duration: '3:35', spotifyUrl: 'https://open.spotify.com/track/2cvOfKHOHgwQlLiuLKP2xR' },
      { title: 'Summer of \'69', artist: 'Bryan Adams', duration: '3:36', spotifyUrl: 'https://open.spotify.com/track/0GONea6G2XdnHWjNZd6zt3' },
      { title: 'Heat Wave', artist: 'Martha & The Vandellas', duration: '2:47', spotifyUrl: 'https://open.spotify.com/track/3pABGbdCF2dJXbRX4BypKt' },
      { title: 'California Girls', artist: 'The Beach Boys', duration: '2:46', spotifyUrl: 'https://open.spotify.com/track/38tIXzrb6G2tXcVPQTMXRy' }
    ]
  },
  'cold': {
    title: 'Cold Day Warmth',
    mood: 'Comforting & Warm',
    spotifyId: '37i9dQZF1DWX4jbIx6RmR0',
    description: 'Soothing, warming tracks to help you through a cold day.',
    tracks: [
      { title: 'Cold Little Heart', artist: 'Michael Kiwanuka', duration: '9:58', spotifyUrl: 'https://open.spotify.com/track/51pQ7vY7WXzxskwloaeqyj' },
      { title: 'Winter', artist: 'Tori Amos', duration: '5:43', spotifyUrl: 'https://open.spotify.com/track/5Vj5IWGm63j1DcVP0jE5CH' },
      { title: 'Song for a Winter\'s Night', artist: 'Gordon Lightfoot', duration: '3:02', spotifyUrl: 'https://open.spotify.com/track/50RGkfupmdScuaYFXrUcEP' },
      { title: 'Cold', artist: 'Stormzy', duration: '3:10', spotifyUrl: 'https://open.spotify.com/track/1xkC6iU5kgEwN2wf5ATV82' },
      { title: 'A Case of You', artist: 'Joni Mitchell', duration: '4:22', spotifyUrl: 'https://open.spotify.com/track/6JOyAzTdcJz9G8jvAk9tQU' }
    ]
  },
  'windy': {
    title: 'Windswept Melodies',
    mood: 'Free & Flowing',
    spotifyId: '37i9dQZF1DXa2PvUpywmrr',
    description: 'Songs that capture the feeling of the wind in your hair.',
    tracks: [
      { title: 'Blowin\' in the Wind', artist: 'Bob Dylan', duration: '2:48', spotifyUrl: 'https://open.spotify.com/track/18GiV1BaXzPVYpp9rmOg0E' },
      { title: 'The Wind', artist: 'Cat Stevens', duration: '1:42', spotifyUrl: 'https://open.spotify.com/track/4fDfkT7qe3bfNDzgAFFgEr' },
      { title: 'Winds of Change', artist: 'Scorpions', duration: '5:10', spotifyUrl: 'https://open.spotify.com/track/3ovjw5HZZv43SxTwApooCM' },
      { title: 'Wild Is The Wind', artist: 'David Bowie', duration: '6:01', spotifyUrl: 'https://open.spotify.com/track/1wcQ8eBfKTdLrRzBKQJQJu' },
      { title: 'Summer Wind', artist: 'Frank Sinatra', duration: '2:53', spotifyUrl: 'https://open.spotify.com/track/4wwePFYgQswjNdKEuWJUOI' }
    ]
  },
  'default': {
    title: 'Weather Mood Mix',
    mood: 'Balanced & Pleasant',
    spotifyId: '37i9dQZF1DXaXB8fQg7xif',
    description: 'A well-balanced mix for any weather condition.',
    tracks: [
      { title: 'Everybody Talks About the Weather', artist: 'Keb\' Mo\'', duration: '3:35', spotifyUrl: 'https://open.spotify.com/track/6sMxTsvVZc2KFzMuXiHdF6' },
      { title: 'Here Comes the Sun', artist: 'The Beatles', duration: '3:05', spotifyUrl: 'https://open.spotify.com/track/6dGnYIeXmHdcikdzNNDMm2' },
      { title: 'Riders on the Storm', artist: 'The Doors', duration: '7:14', spotifyUrl: 'https://open.spotify.com/track/14XWXWv5FoCbFzLksawpEe' },
      { title: 'Sunny', artist: 'Bobby Hebb', duration: '2:43', spotifyUrl: 'https://open.spotify.com/track/2Hf7NVGq4MKK8Jxl5Lxnp2' },
      { title: 'Umbrella', artist: 'Rihanna, JAY-Z', duration: '4:36', spotifyUrl: 'https://open.spotify.com/track/49FYlytm3dAAraYgpoJZux' }
    ]
  }
};

// Weather mood popup text
const MOOD_POPUP = {
  "Sunny": "Bring your cool shades 😎 — it's a sunglasses kinda day!",
  "Rain": "Sweater weather 🧣 — and maybe a warm cup of chai?",
  "Thunderstorm": "Stay in, curl up with a book 📚 — it's stormy out there.",
  "Clear": "Perfect time for a walk 🌿 — don't forget your playlist!",
  "Clouds": "Grey skies, golden vibes ✨ — make your own sunshine!",
  "Snow": "Snowy vibes ❄️ — gloves on, heart warm.",
};

const MusicVibes: FC<MusicVibesProps> = ({ weather }) => {
  const [selectedTrack, setSelectedTrack] = useState<number | null>(null);
  const [playlist, setPlaylist] = useState<typeof WEATHER_PLAYLISTS['default']>(WEATHER_PLAYLISTS['default']);
  const [moodText, setMoodText] = useState<string>('');
  
  // Random shuffle function to pick different songs each time
  const getRandomItems = (array: any[], count: number = 3) => {
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };
  
  useEffect(() => {
    if (weather) {
      const condition = weather.current.condition.text.toLowerCase();
      let playlistKey: string = 'default';
      let moodKey: string = 'Clear';
      
      // Determine which playlist to use
      if (condition.includes('sun') || condition.includes('clear')) {
        playlistKey = 'sunny';
        moodKey = 'Sunny';
      } else if (condition.includes('rain') || condition.includes('drizzle')) {
        playlistKey = 'rain';
        moodKey = 'Rain';
      } else if (condition.includes('cloud')) {
        playlistKey = 'cloudy';
        moodKey = 'Clouds';
      } else if (condition.includes('snow')) {
        playlistKey = 'snow';
        moodKey = 'Snow';
      } else if (condition.includes('thunder') || condition.includes('storm')) {
        playlistKey = 'thunderstorm';
        moodKey = 'Thunderstorm';
      } else if (condition.includes('fog') || condition.includes('mist')) {
        playlistKey = 'fog';
        moodKey = 'Clear';
      } else if (weather.current.temp_c > 28) {
        playlistKey = 'hot';
        moodKey = 'Sunny';
      } else if (weather.current.temp_c < 5) {
        playlistKey = 'cold';
        moodKey = 'Snow';
      } else if (weather.current.wind_kph > 30) {
        playlistKey = 'windy';
        moodKey = 'Clear';
      }
      
      // Always use Tamil music playlists with direct Spotify links
      const tamilPlaylist = TAMIL_WEATHER_PLAYLISTS[playlistKey] || TAMIL_WEATHER_PLAYLISTS['default'];
      
      // Tamil songs for this weather condition (exactly 3 tracks)
      const selectedPlaylist = {
        ...tamilPlaylist,
        tracks: tamilPlaylist.tracks.slice(0, 3) // Always use the first 3 tracks for consistency
      };
      
      setPlaylist(selectedPlaylist);
      setMoodText(MOOD_POPUP[moodKey as keyof typeof MOOD_POPUP] || '');
    }
  }, [weather]);

  const openSpotify = (trackUrl: string) => {
    window.open(trackUrl, '_blank');
  };

  const openPlaylist = () => {
    window.open(`https://open.spotify.com/playlist/${playlist.spotifyId}`, '_blank');
  };

  return (
    <Card className="w-full overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg flex items-center">
            <Music className="mr-2 h-5 w-5 text-primary" />
            Tamil Weather Beats
          </CardTitle>
          <Badge variant="secondary" className="font-normal">
            {playlist.mood}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pt-4">
        <div className="mb-4">
          <h3 className="text-xl font-semibold mb-1">{playlist.title}</h3>
          <p className="text-gray-600 text-sm">{playlist.description}</p>
          
          {moodText && (
            <div className="bg-muted/40 p-3 rounded-lg mt-3 text-sm italic">
              {moodText}
            </div>
          )}
        </div>
        
        <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
          {playlist.tracks.map((track, index) => (
            <div 
              key={index}
              className={`p-2 rounded-lg flex justify-between items-center transition-colors cursor-pointer ${
                selectedTrack === index ? 'bg-primary/10' : 'hover:bg-muted'
              }`}
              onClick={() => setSelectedTrack(index)}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  selectedTrack === index ? 'bg-primary text-primary-foreground' : 'bg-muted'
                }`}>
                  {selectedTrack === index ? 
                    <Play className="h-4 w-4" /> : 
                    <span className="text-sm font-medium">{index + 1}</span>
                  }
                </div>
                <div>
                  <p className="font-medium line-clamp-1">{track.title}</p>
                  <p className="text-xs text-muted-foreground">{track.artist}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-xs text-muted-foreground">{track.duration}</span>
                <Button 
                  size="icon" 
                  variant="outline" 
                  className="h-7 w-7"
                  onClick={(e) => {
                    e.stopPropagation();
                    openSpotify(track.spotifyUrl);
                  }}
                >
                  <ExternalLink className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 flex justify-between">
          <p className="text-xs text-muted-foreground">
            Tamil songs selected based on current weather conditions
          </p>
          <Button 
            variant="default" 
            size="sm" 
            className="gap-2" 
            onClick={openPlaylist}
          >
            <ListMusic className="h-4 w-4" />
            <span>Open in Spotify</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MusicVibes;