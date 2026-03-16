import React, { useState } from 'react'
import { usePlayer } from '../context/PlayerContext'
import TrackList from './TrackList'

export default function LibraryView() {
  const { library, playFromLibrary, currentTrack, playlists, addToPlaylist, addToLibrary } = usePlayer()
  const [showAdd, setShowAdd] = useState(false)
  const [newTrack, setNewTrack] = useState({ title: '', artist: '', url: '', duration: 0 })

  return (
    <div className="flex flex-col min-h-0 overflow-hidden">
      <header className="flex items-center justify-between py-5 px-6 pb-4 border-b border-border shrink-0">
        <h1 className="text-2xl font-bold text-[#e8eaed]">Library</h1>
        <div className="flex gap-2.5">
          <button
            type="button"
            className="py-2.5 px-[18px] bg-accent text-bg-deep font-semibold text-[0.9rem] rounded-app-sm hover:bg-accent-hover transition-colors"
            onClick={() => setShowAdd(true)}
          >
            + Add track
          </button>
          {library.length > 0 && (
            <button
              type="button"
              className="py-2.5 px-[18px] bg-bg-elevated text-[#e8eaed] font-medium text-[0.9rem] rounded-app-sm border border-border hover:bg-bg-hover transition-colors"
              onClick={() => playFromLibrary(library[0])}
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
          <div className="flex items-center justify-center">
            <select
              className="py-1.5 px-2.5 text-[0.8rem] bg-bg-elevated border border-border rounded-app-sm text-[#e8eaed] cursor-pointer focus:outline-none focus:border-accent"
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
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-[200]"
          onClick={() => setShowAdd(false)}
        >
          <div
            className="bg-bg-panel border border-border rounded-app p-6 w-full max-w-[400px] shadow-panel"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="mb-5 text-xl">Add track</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                if (!newTrack.title.trim() || !newTrack.url.trim()) return
                addToLibrary({ ...newTrack, duration: Number(newTrack.duration) || 0 })
                setNewTrack({ title: '', artist: '', url: '', duration: 0 })
                setShowAdd(false)
              }}
            >
              <label className="block mb-3.5 text-[0.85rem] text-text-muted">
                Title *
                <input
                  className="block w-full mt-1.5 py-2.5 px-3 bg-bg-elevated border border-border rounded-app-sm text-[#e8eaed] text-[0.95rem] focus:outline-none focus:border-accent"
                  value={newTrack.title}
                  onChange={(e) => setNewTrack((t) => ({ ...t, title: e.target.value }))}
                  placeholder="Track title"
                  required
                />
              </label>
              <label className="block mb-3.5 text-[0.85rem] text-text-muted">
                Artist
                <input
                  className="block w-full mt-1.5 py-2.5 px-3 bg-bg-elevated border border-border rounded-app-sm text-[#e8eaed] text-[0.95rem] focus:outline-none focus:border-accent"
                  value={newTrack.artist}
                  onChange={(e) => setNewTrack((t) => ({ ...t, artist: e.target.value }))}
                  placeholder="Artist name"
                />
              </label>
              <label className="block mb-3.5 text-[0.85rem] text-text-muted">
                URL *
                <input
                  type="url"
                  className="block w-full mt-1.5 py-2.5 px-3 bg-bg-elevated border border-border rounded-app-sm text-[#e8eaed] text-[0.95rem] focus:outline-none focus:border-accent"
                  value={newTrack.url}
                  onChange={(e) => setNewTrack((t) => ({ ...t, url: e.target.value }))}
                  placeholder="https://...mp3"
                  required
                />
              </label>
              <label className="block mb-3.5 text-[0.85rem] text-text-muted">
                Duration (seconds)
                <input
                  type="number"
                  min={0}
                  className="block w-full mt-1.5 py-2.5 px-3 bg-bg-elevated border border-border rounded-app-sm text-[#e8eaed] text-[0.95rem] focus:outline-none focus:border-accent"
                  value={newTrack.duration || ''}
                  onChange={(e) => setNewTrack((t) => ({ ...t, duration: e.target.value }))}
                  placeholder="0"
                />
              </label>
              <div className="flex gap-2.5 justify-end mt-5">
                <button
                  type="button"
                  className="py-2.5 px-[18px] bg-bg-elevated text-[#e8eaed] font-medium rounded-app-sm border border-border hover:bg-bg-hover transition-colors"
                  onClick={() => setShowAdd(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2.5 px-[18px] bg-accent text-bg-deep font-semibold rounded-app-sm hover:bg-accent-hover transition-colors"
                >
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
