import React, { createContext, useContext, useRef, useState, useCallback, useEffect } from 'react';

const PlayerContext = createContext(null);

const STORAGE_KEYS = {
  library: 'mp3-player-library',
  favorites: 'mp3-player-favorites',
  playlists: 'mp3-player-playlists',
};

function loadFromStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function saveToStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (_) {}
}

// Demo library – replace with your own MP3 URLs or file paths
const DEFAULT_LIBRARY = [
  { id: '1', title: 'Sample Track 1', artist: 'Artist A', duration: 180, url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
  { id: '2', title: 'Sample Track 2', artist: 'Artist B', duration: 210, url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
  { id: '3', title: 'Sample Track 3', artist: 'Artist C', duration: 195, url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
  { id: '4', title: 'Sample Track 4', artist: 'Artist D', duration: 240, url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3' },
  { id: '5', title: 'Sample Track 5', artist: 'Artist E', duration: 165, url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3' },
];

export function PlayerProvider({ children }) {
  const audioRef = useRef(null);

  const [library, setLibrary] = useState(() => loadFromStorage(STORAGE_KEYS.library, DEFAULT_LIBRARY));
  const [favorites, setFavorites] = useState(() => loadFromStorage(STORAGE_KEYS.favorites, []));
  const [playlists, setPlaylists] = useState(() => loadFromStorage(STORAGE_KEYS.playlists, [
    { id: 'default', name: 'My Playlist', trackIds: ['1', '2', '3'] },
  ]));

  const [queue, setQueue] = useState([]);
  const [queueIndex, setQueueIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(1);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isShuffled, setIsShuffled] = useState(false);
  const [isRepeating, setIsRepeating] = useState(false); // false | 'one' | 'all'

  const queueOrderRef = useRef([]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.library, library);
  }, [library]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.favorites, favorites);
  }, [favorites]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.playlists, playlists);
  }, [playlists]);

  const currentTrack = queue.length && queueIndex >= 0 && queueIndex < queue.length
    ? queue[queueIndex]
    : null;

  const audio = audioRef.current;

  const play = useCallback(() => {
    if (audio) {
      audio.play().catch(() => {});
      setIsPlaying(true);
    }
  }, [audio]);

  const pause = useCallback(() => {
    if (audio) {
      audio.pause();
      setIsPlaying(false);
    }
  }, [audio]);

  const togglePlay = useCallback(() => {
    if (audio) {
      if (isPlaying) pause();
      else play();
    }
  }, [audio, isPlaying, play, pause]);

  const seek = useCallback((time) => {
    if (audio) {
      audio.currentTime = Math.max(0, Math.min(time, duration || 0));
      setCurrentTime(audio.currentTime);
    }
  }, [audio, duration]);

  const setVolume = useCallback((v) => {
    const val = Math.max(0, Math.min(1, v));
    setVolumeState(val);
    if (audio) audio.volume = val;
  }, [audio]);

  const setRate = useCallback((rate) => {
    const r = Math.max(0.5, Math.min(2, rate));
    setPlaybackRate(r);
    if (audio) audio.playbackRate = r;
  }, [audio]);

  const getTrackById = useCallback((id) => library.find((t) => t.id === id), [library]);

  const playTrack = useCallback((track, list = library, startIndex = 0) => {
    const listIds = Array.isArray(list) ? list.map((t) => (typeof t === 'string' ? t : t.id)) : list.map((t) => t.id);
    let idx = listIds.indexOf(track.id);
    if (idx < 0) idx = 0;
    const fullList = listIds.map((id) => getTrackById(id)).filter(Boolean);
    setQueue(fullList);
    setQueueIndex(idx);
    queueOrderRef.current = [...fullList];
  }, [library, getTrackById]);

  const playFromLibrary = useCallback((track) => {
    playTrack(track, library, library.findIndex((t) => t.id === track.id));
  }, [library, playTrack]);

  const playQueue = useCallback((tracks, startIndex = 0) => {
    const list = Array.isArray(tracks) ? tracks : [];
    if (list.length === 0) return;
    const idx = Math.max(0, Math.min(startIndex, list.length - 1));
    setQueue(list);
    setQueueIndex(idx);
    queueOrderRef.current = [...list];
  }, []);

  const next = useCallback(() => {
    if (queue.length === 0) return;
    let nextIdx = queueIndex + 1;
    if (isShuffled && queue.length > 1) {
      nextIdx = Math.floor(Math.random() * queue.length);
      if (nextIdx === queueIndex && queue.length > 1) nextIdx = (queueIndex + 1) % queue.length;
    }
    if (nextIdx >= queue.length) {
      if (isRepeating === 'all') nextIdx = 0;
      else {
        pause();
        setQueueIndex(-1);
        return;
      }
    }
    setQueueIndex(nextIdx);
  }, [queue, queueIndex, isShuffled, isRepeating, pause]);

  const previous = useCallback(() => {
    if (currentTime > 3) {
      seek(0);
      return;
    }
    if (queue.length === 0) return;
    let prevIdx = queueIndex - 1;
    if (prevIdx < 0) {
      if (isRepeating === 'all') prevIdx = queue.length - 1;
      else {
        seek(0);
        return;
      }
    }
    setQueueIndex(prevIdx);
  }, [queue, queueIndex, currentTime, isRepeating, seek]);

  useEffect(() => {
    if (!currentTrack?.url || !audioRef.current) return;
    const audio = audioRef.current;
    audio.src = currentTrack.url;
    audio.currentTime = 0;
    audio.playbackRate = playbackRate;
    audio.volume = volume;
    audio.play().catch(() => {});
    setIsPlaying(true);
  }, [currentTrack?.id, currentTrack?.url, playbackRate, volume]);

  const addToFavorites = useCallback((id) => {
    setFavorites((prev) => (prev.includes(id) ? prev : [...prev, id]));
  }, []);

  const removeFromFavorites = useCallback((id) => {
    setFavorites((prev) => prev.filter((f) => f !== id));
  }, []);

  const toggleFavorite = useCallback((id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  }, []);

  const isFavorite = useCallback((id) => favorites.includes(id), [favorites]);

  const addToPlaylist = useCallback((playlistId, trackId) => {
    setPlaylists((prev) =>
      prev.map((p) =>
        p.id === playlistId && !p.trackIds.includes(trackId)
          ? { ...p, trackIds: [...p.trackIds, trackId] }
          : p
      )
    );
  }, []);

  const removeFromPlaylist = useCallback((playlistId, trackId) => {
    setPlaylists((prev) =>
      prev.map((p) =>
        p.id === playlistId
          ? { ...p, trackIds: p.trackIds.filter((id) => id !== trackId) }
          : p
      )
    );
  }, []);

  const createPlaylist = useCallback((name) => {
    const id = 'pl-' + Date.now();
    setPlaylists((prev) => [...prev, { id, name, trackIds: [] }]);
    return id;
  }, []);

  const deletePlaylist = useCallback((playlistId) => {
    setPlaylists((prev) => prev.filter((p) => p.id !== playlistId));
  }, []);

  const addToLibrary = useCallback((track) => {
    const id = 'track-' + Date.now();
    setLibrary((prev) => [...prev, { ...track, id }]);
    return id;
  }, []);

  const removeFromLibrary = useCallback((id) => {
    setLibrary((prev) => prev.filter((t) => t.id !== id));
    setFavorites((prev) => prev.filter((f) => f !== id));
    setPlaylists((prev) =>
      prev.map((p) => ({ ...p, trackIds: p.trackIds.filter((tid) => tid !== id) }))
    );
  }, []);

  const shuffleQueue = useCallback(() => {
    if (queue.length <= 1) return;
    const arr = [...queue];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    const currentId = currentTrack?.id;
    const newIdx = arr.findIndex((t) => t.id === currentId);
    setQueue(arr);
    setQueueIndex(newIdx >= 0 ? newIdx : 0);
    queueOrderRef.current = arr;
  }, [queue, currentTrack?.id]);

  const value = {
    audioRef,
    library,
    setLibrary,
    favorites,
    playlists,
    queue,
    queueIndex,
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    playbackRate,
    isShuffled,
    isRepeating,
    setVolume,
    setRate,
    setCurrentTime,
    setDuration,
    setIsPlaying,
    play,
    pause,
    togglePlay,
    seek,
    next,
    previous,
    playTrack,
    playFromLibrary,
    playQueue,
    getTrackById,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    isFavorite,
    addToPlaylist,
    removeFromPlaylist,
    createPlaylist,
    deletePlaylist,
    addToLibrary,
    removeFromLibrary,
    setIsShuffled,
    setIsRepeating,
    shuffleQueue,
  };

  return (
    <PlayerContext.Provider value={value}>
      {children}
      <audio
        ref={audioRef}
        onTimeUpdate={() => audioRef.current && setCurrentTime(audioRef.current.currentTime)}
        onDurationChange={() => audioRef.current && setDuration(audioRef.current.duration)}
        onEnded={next}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error('usePlayer must be used within PlayerProvider');
  return ctx;
}
