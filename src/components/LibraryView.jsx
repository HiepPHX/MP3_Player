import React, { useState } from 'react'
import { usePlayer } from '../context/PlayerContext'
import TrackList from './TrackList'
import styles from './LibraryView.module.css'

export default function LibraryView() {
  const { library, playFromLibrary, currentTrack, playlists, addToPlaylist, addToLibrary } = usePlayer()
  const [showAdd, setShowAdd] = useState(false)
  const [newTrack, setNewTrack] = useState({ title: '', artist: '', url: '', duration: 0 })

  return (
    <div className={styles.wrap}>
      <header className={styles.header}>
        <h1 className={styles.title}>Library</h1>
        <div className={styles.actions}>
          <button type="button" className={styles.btn} onClick={() => setShowAdd(true)}>
            + Add track
          </button>
          {library.length > 0 && (
            <button
              type="button"
              className={styles.btnSecondary}
              onClick={() => {
                playFromLibrary(library[0])
                // shuffle is toggled in player bar
              }}
            >
              Play all
            </button>
          )}
        </div>
      </header>

      <TrackList
        tracks={library}
        currentTrackId={currentTrack?.id}
        onPlay={(track) => playFromLibrary(track)}
        showFavorite
        extraActions={(track) => (
          <div className={styles.rowActions}>
            <select
              className={styles.playlistSelect}
              value=""
              onChange={(e) => {
                const id = e.target.value
                if (id) addToPlaylist(id, track.id)
                e.target.value = ''
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <option value="">Add to playlist...</option>
              {playlists.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
        )}
      />

      {showAdd && (
        <div className={styles.modal} onClick={() => setShowAdd(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h2>Add track</h2>
            <form onSubmit={(e) => {
              e.preventDefault()
              if (!newTrack.title.trim() || !newTrack.url.trim()) return
              addToLibrary({ ...newTrack, duration: Number(newTrack.duration) || 0 })
              setNewTrack({ title: '', artist: '', url: '', duration: 0 })
              setShowAdd(false)
            }}>
              <label>
                Title *
                <input
                  value={newTrack.title}
                  onChange={(e) => setNewTrack((t) => ({ ...t, title: e.target.value }))}
                  placeholder="Track title"
                  required
                />
              </label>
              <label>
                Artist
                <input
                  value={newTrack.artist}
                  onChange={(e) => setNewTrack((t) => ({ ...t, artist: e.target.value }))}
                  placeholder="Artist name"
                />
              </label>
              <label>
                URL *
                <input
                  type="url"
                  value={newTrack.url}
                  onChange={(e) => setNewTrack((t) => ({ ...t, url: e.target.value }))}
                  placeholder="https://...mp3"
                  required
                />
              </label>
              <label>
                Duration (seconds)
                <input
                  type="number"
                  min={0}
                  value={newTrack.duration || ''}
                  onChange={(e) => setNewTrack((t) => ({ ...t, duration: e.target.value }))}
                  placeholder="0"
                />
              </label>
              <div className={styles.modalButtons}>
                <button type="button" className={styles.btnSecondary} onClick={() => setShowAdd(false)}>
                  Cancel
                </button>
                <button type="submit" className={styles.btn}>
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
