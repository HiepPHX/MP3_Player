import React, { useState } from 'react'
import { PlayerProvider, usePlayer } from './context/PlayerContext'
import Sidebar from './components/Sidebar'
import PlayerBar from './components/PlayerBar'
import LibraryView from './components/LibraryView'
import FavoritesView from './components/FavoritesView'
import PlaylistView from './components/PlaylistView'
import styles from './App.module.css'

function AppContent() {
  const [view, setView] = useState('library')

  return (
    <div className={styles.app}>
      <Sidebar view={view} onViewChange={setView} />
      <main className={styles.main}>
        {view === 'library' && <LibraryView />}
        {view === 'favorites' && <FavoritesView />}
        {view === 'playlists' && <PlaylistView />}
      </main>
      <PlayerBar />
    </div>
  )
}

export default function App() {
  return (
    <PlayerProvider>
      <AppContent />
    </PlayerProvider>
  )
}
