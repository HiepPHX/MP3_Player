# MP3 Player

A React + JavaScript MP3 player with library, favorites, playlists, and full playback controls.

## Features

- **Library** – Add tracks (title, artist, URL), play from list, add to playlists
- **Favorites** – Heart tracks and play from favorites
- **Playlists** – Create playlists, add/remove tracks, play by playlist
- **Playback** – Play/pause, previous/next, seek bar, time display
- **Volume** – Slider 0–100%
- **Speed** – 0.5x, 0.75x, 1x, 1.25x, 1.5x, 1.75x, 2x
- **Shuffle** – Randomize next track
- **Repeat** – Off / repeat all / repeat one

Data is stored in `localStorage` (library, favorites, playlists).

## Run

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Add your own MP3s

Use **Library → + Add track** and enter a direct URL to an MP3 file. The app ships with sample SoundHelix tracks for testing.
