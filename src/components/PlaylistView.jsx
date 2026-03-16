import React, { useState } from 'react'
import { usePlayer } from '../context/PlayerContext'
import TrackList from './TrackList'

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
    <div className="flex min-h-0 overflow-hidden">
      <div className="w-60 shrink-0 border-r border-border flex flex-col bg-bg-panel">
        <header className="flex items-center justify-between py-4 px-4 pb-3">
          <h2 className="text-[0.85rem] font-semibold text-text-muted uppercase tracking-wider">
            Playlists
          </h2>
          <button
            type="button"
            className="w-7 h-7 flex items-center justify-center text-lg text-text-muted rounded-app-sm hover:bg-bg-hover hover:text-accent transition-colors"
            onClick={() => setShowCreate(true)}
            title="New playlist"
          >
            +
          </button>
        </header>
        <ul className="overflow-auto px-2 pb-4 list-none">
          {playlists.map((p) => (
            <li key={p.id} className="flex items-center gap-1 mb-0.5 group">
              <button
                type="button"
                className={`flex-1 flex items-center justify-between py-2.5 px-3 text-left rounded-app-sm text-[0.95rem] transition-colors ${
                  selectedId === p.id
                    ? 'bg-accent-dim text-accent font-semibold'
                    : 'text-text-muted hover:bg-bg-hover hover:text-[#e8eaed]'
                }`}
                onClick={() => setSelectedId(p.id)}
              >
                <span className="truncate">{p.name}</span>
                <span className="text-[0.8rem] opacity-80 ml-2">{p.trackIds.length}</span>
              </button>
              <button
                type="button"
                className="w-7 h-7 flex items-center justify-center text-lg text-text-muted rounded-app-sm opacity-0 group-hover:opacity-100 hover:bg-danger-dim hover:text-danger transition-all"
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

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {selected ? (
          <>
            <header className="flex items-center justify-between py-5 px-6 pb-4 border-b border-border shrink-0">
              <h1 className="text-2xl font-bold text-[#e8eaed]">{selected.name}</h1>
              {tracks.length > 0 && (
                <button
                  type="button"
                  className="py-2.5 px-[18px] bg-bg-elevated text-[#e8eaed] font-medium text-[0.9rem] rounded-app-sm border border-border hover:bg-bg-hover transition-colors"
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
                  className="py-1 px-2.5 text-[0.8rem] text-text-muted rounded-app-sm hover:text-danger hover:bg-danger-dim transition-colors"
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
          <div className="flex-1 flex items-center justify-center text-text-muted text-[0.95rem]">
            {playlists.length === 0
              ? 'Create a playlist using the + button.'
              : 'Select a playlist.'}
          </div>
        )}
      </div>

      {showCreate && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-[200]"
          onClick={() => setShowCreate(false)}
        >
          <div
            className="bg-bg-panel border border-border rounded-app p-6 w-full max-w-[360px] shadow-panel"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="mb-5 text-xl">New playlist</h2>
            <form onSubmit={handleCreate}>
              <label className="block mb-3.5 text-[0.85rem] text-text-muted">
                Name
                <input
                  className="block w-full mt-1.5 py-2.5 px-3 bg-bg-elevated border border-border rounded-app-sm text-[#e8eaed] text-[0.95rem] focus:outline-none focus:border-accent"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Playlist name"
                  autoFocus
                />
              </label>
              <div className="flex gap-2.5 justify-end mt-5">
                <button
                  type="button"
                  className="py-2.5 px-[18px] bg-bg-elevated text-[#e8eaed] font-medium rounded-app-sm border border-border hover:bg-bg-hover transition-colors"
                  onClick={() => setShowCreate(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2.5 px-[18px] bg-accent text-bg-deep font-semibold rounded-app-sm hover:bg-accent-hover transition-colors"
                >
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
