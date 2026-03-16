import React, { useState } from 'react'
import { usePlayer } from '../context/PlayerContext'
import styles from './PlayerBar.module.css'

function formatTime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00'
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

const SPEED_OPTIONS = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2]

export default function PlayerBar() {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    playbackRate,
    isShuffled,
    isRepeating,
    togglePlay,
    next,
    previous,
    seek,
    setVolume,
    setRate,
    setIsShuffled,
    setIsRepeating,
  } = usePlayer()

  const [showSpeed, setShowSpeed] = useState(false)
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0

  const cycleRepeat = () => {
    if (isRepeating === false) setIsRepeating('all')
    else if (isRepeating === 'all') setIsRepeating('one')
    else setIsRepeating(false)
  }

  if (!currentTrack) {
    return (
      <footer className={styles.bar}>
        <div className={styles.empty}>Select a track to play</div>
      </footer>
    )
  }

  return (
    <footer className={styles.bar}>
      <div className={styles.nowPlaying}>
        <div className={styles.artwork} />
        <div className={styles.trackInfo}>
          <span className={styles.title}>{currentTrack.title}</span>
          <span className={styles.artist}>{currentTrack.artist}</span>
        </div>
      </div>

      <div className={styles.controls}>
        <div className={styles.transport}>
          <button
            type="button"
            className={styles.iconBtn}
            onClick={() => setIsShuffled(!isShuffled)}
            title={isShuffled ? 'Shuffle on' : 'Shuffle off'}
            data-active={isShuffled}
          >
            <ShuffleIcon />
          </button>
          <button type="button" className={styles.iconBtn} onClick={previous} title="Previous">
            <PreviousIcon />
          </button>
          <button
            type="button"
            className={styles.playBtn}
            onClick={togglePlay}
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <PauseIcon /> : <PlayIcon />}
          </button>
          <button type="button" className={styles.iconBtn} onClick={next} title="Next">
            <NextIcon />
          </button>
          <button
            type="button"
            className={styles.iconBtn}
            onClick={cycleRepeat}
            title={
              isRepeating === 'one'
                ? 'Repeat one'
                : isRepeating === 'all'
                  ? 'Repeat all'
                  : 'Repeat off'
            }
            data-active={isRepeating !== false}
            data-one={isRepeating === 'one'}
          >
            <span className={styles.repeatWrap}>
              <RepeatIcon />
              {isRepeating === 'one' && <span className={styles.repeatOne}>1</span>}
            </span>
          </button>
        </div>

        <div className={styles.progressWrap}>
          <span className={styles.time}>{formatTime(currentTime)}</span>
          <input
            type="range"
            className={styles.progress}
            min={0}
            max={duration || 100}
            value={currentTime}
            onChange={(e) => seek(parseFloat(e.target.value))}
          />
          <span className={styles.time}>{formatTime(duration)}</span>
        </div>
      </div>

      <div className={styles.right}>
        <div className={styles.speedWrap}>
          <button
            type="button"
            className={styles.speedBtn}
            onClick={() => setShowSpeed(!showSpeed)}
            title="Playback speed"
          >
            {playbackRate}x
          </button>
          {showSpeed && (
            <div className={styles.speedDropdown}>
              {SPEED_OPTIONS.map((r) => (
                <button
                  key={r}
                  type="button"
                  className={styles.speedOption}
                  data-active={r === playbackRate}
                  onClick={() => {
                    setRate(r)
                    setShowSpeed(false)
                  }}
                >
                  {r}x
                </button>
              ))}
            </div>
          )}
        </div>
        <div className={styles.volumeWrap}>
          <VolumeIcon />
          <input
            type="range"
            className={styles.volume}
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
          />
        </div>
      </div>
    </footer>
  )
}

function PlayIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M8 5v14l11-7z" />
    </svg>
  )
}

function PauseIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
    </svg>
  )
}

function PreviousIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
    </svg>
  )
}

function NextIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
    </svg>
  )
}

function ShuffleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41l-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z" />
    </svg>
  )
}

function RepeatIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z" />
    </svg>
  )
}

function VolumeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
    </svg>
  )
}
