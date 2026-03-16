import React, { useState } from 'react'
import { usePlayer } from '../context/PlayerContext'
import TrackList from './TrackList'
import styles from './PlaylistView.module.css'

export default function PlaylistView() {
  const {
    playlists,
    getTrackById,
    playQueue,
    currentTrack,
    createPlaylist,
    deletePlaylist,
    removeFromPlaylist,
  } = usePlayer()
  const [selectedId, setSelectedId] = useState(playlists[0]?.id || null)
  const [newName, setNewName] = useState('')
  const [showCreate, setShowCreate] = useState(false)

  const selected = playlists.find((p) => p.id === selectedId)
  const tracks = selected
    ? selected.trackIds.map((id) => getTrackById(id)).filter(Boolean)
    : []

  const handleCreate = (e) => {
    e.preventDefault()
    if (!newName.trim()) return
    const id = createPlaylist(newName.trim())
    setSelectedId(id)
    setNewName('')
    setShowCreate(false)
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.side}>
        <header className={styles.sideHeader}>
          <h2 className={styles.sideTitle}>Playlists</h2>
          <button
            type="button"
            className={styles.addBtn}
            onClick={() => setShowCreate(true)}
            title="New playlist"
          >
            +
          </button>
        </header>
        <ul className={styles.list}>
          {playlists.map((p) => (
            <li key={p.id} className={styles.listItem}>
              <button
                type="button"
                className={styles.listBtn}
                data-active={selectedId === p.id}
                onClick={() => setSelectedId(p.id)}
              >
                <span className={styles.listName}>{p.name}</span>
                <span className={styles.listCount}>{p.trackIds.length}</span>
              </button>
              <button
                type="button"
                className={styles.deleteBtn}
                onClick={() => {
                  if (selectedId === p.id) setSelectedId(playlists.find((x) => x.id !== p.id)?.id || null)
                  deletePlaylist(p.id)
                }}
                title="Delete playlist"
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className={styles.main}>
        {selected ? (
          <>
            <header className={styles.header}>
              <h1 className={styles.title}>{selected.name}</h1>
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
              extraActions={(track) => (
                <button
                  type="button"
                  className={styles.removeBtn}
                  onClick={(e) => {
                    e.stopPropagation()
                    removeFromPlaylist(selected.id, track.id)
                  }}
                  title="Remove from playlist"
                >
                  Remove
                </button>
              )}
            />
          </>
        ) : (
          <div className={styles.empty}>
            {playlists.length === 0
              ? 'Create a playlist using the + button.'
              : 'Select a playlist.'}
          </div>
        )}
      </div>

      {showCreate && (
        <div className={styles.modal} onClick={() => setShowCreate(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h2>New playlist</h2>
            <form onSubmit={handleCreate}>
              <label>
                Name
                <input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Playlist name"
                  autoFocus
                />
              </label>
              <div className={styles.modalButtons}>
                <button type="button" className={styles.btnSecondary} onClick={() => setShowCreate(false)}>
                  Cancel
                </button>
                <button type="submit" className={styles.btn}>
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
