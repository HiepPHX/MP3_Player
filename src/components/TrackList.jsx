import React from 'react'
import { usePlayer } from '../context/PlayerContext'
import styles from './TrackList.module.css'

function formatDuration(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00'
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

export default function TrackList({ tracks, currentTrackId, onPlay, showFavorite = true, extraActions }) {
  const { isFavorite, toggleFavorite, queue, queueIndex, playQueue } = usePlayer()

  const isCurrent = (id) => currentTrackId === id

  const handleRowClick = (track, index) => {
    if (onPlay) {
      onPlay(track, index)
    } else {
      playQueue(tracks, index)
    }
  }

  if (!tracks || tracks.length === 0) {
    return (
      <div className={styles.empty}>
        No tracks here. Add songs to your library or playlist.
      </div>
    )
  }

  return (
    <div className={styles.wrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.colIndex}>#</th>
            <th className={styles.colTitle}>Title</th>
            <th className={styles.colArtist}>Artist</th>
            <th className={styles.colDuration}>Duration</th>
            {showFavorite && <th className={styles.colAction} />}
            {extraActions && <th className={styles.colAction} />}
          </tr>
        </thead>
        <tbody>
          {tracks.map((track, index) => (
            <tr
              key={track.id}
              className={styles.row}
              data-current={isCurrent(track.id)}
              onClick={() => handleRowClick(track, index)}
            >
              <td className={styles.colIndex}>
                {isCurrent(track.id) ? (
                  <span className={styles.playingIcon}>♪</span>
                ) : (
                  <span className={styles.index}>{index + 1}</span>
                )}
              </td>
              <td className={styles.colTitle}>
                <span className={styles.title}>{track.title}</span>
              </td>
              <td className={styles.colArtist}>
                <span className={styles.artist}>{track.artist}</span>
              </td>
              <td className={styles.colDuration}>
                {formatDuration(track.duration)}
              </td>
              {showFavorite && (
                <td className={styles.colAction} onClick={(e) => e.stopPropagation()}>
                  <button
                    type="button"
                    className={styles.favBtn}
                    data-active={isFavorite(track.id)}
                    onClick={() => toggleFavorite(track.id)}
                    title={isFavorite(track.id) ? 'Remove from favorites' : 'Add to favorites'}
                  >
                    ♥
                  </button>
                </td>
              )}
              {extraActions && (
                <td className={styles.colAction} onClick={(e) => e.stopPropagation()}>
                  {extraActions(track)}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
