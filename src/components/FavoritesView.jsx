import React from 'react'
import { usePlayer } from '../context/PlayerContext'
import TrackList from './TrackList'
import styles from './LibraryView.module.css'

export default function FavoritesView() {
  const { library, favorites, getTrackById, playQueue, currentTrack } = usePlayer()
  const tracks = favorites.map((id) => getTrackById(id)).filter(Boolean)

  return (
    <div className={styles.wrap}>
      <header className={styles.header}>
        <h1 className={styles.title}>Favorites</h1>
        {tracks.length > 0 && (
          <button
            type="button"
            className={styles.btnSecondary}
            onClick={() => playQueue(tracks, 0)}
          >
            Play all
          </button>
        )}
      </header>
      <TrackList
        tracks={tracks}
        currentTrackId={currentTrack?.id}
        onPlay={(track) => playQueue(tracks, tracks.findIndex((t) => t.id === track.id))}
        showFavorite
      />
    </div>
  )
}
