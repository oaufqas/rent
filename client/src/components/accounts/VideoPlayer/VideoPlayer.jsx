import { motion } from 'framer-motion'
import { Play, Pause } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import styles from './VideoPlayer.module.css'

const VideoPlayer = ({ src, poster, autoPlay = false }) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [showControls, setShowControls] = useState(false)
  const videoRef = useRef(null)

  // Автовоспроизведение
  useEffect(() => {
    if (autoPlay && src && videoRef.current) {
      const timer = setTimeout(() => {
        videoRef.current.muted = true
        videoRef.current.playsInline = true
        videoRef.current.play().catch(() => {
          console.log('Autoplay not allowed')
        })
      }, 1000)
      
      return () => clearTimeout(timer)
    }
  }, [autoPlay, src])

  // Обновление времени видео
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime)
      setDuration(videoRef.current.duration || 0)
    }
  }

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration)
    }
  }

  const handlePlayClick = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.muted = false
        videoRef.current.play().catch(console.error)
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleProgressClick = (e) => {
    if (videoRef.current && duration) {
      const rect = e.currentTarget.getBoundingClientRect()
      const percent = (e.clientX - rect.left) / rect.width
      videoRef.current.currentTime = percent * duration
    }
  }

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  if (!src) {
    return (
      <div className={styles.placeholder}>
        <span>🎮 Видео обзор</span>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={styles.videoPlayer}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
      onTouchStart={() => setShowControls(true)}
    >
      <video
        ref={videoRef}
        controls={false}
        muted
        playsInline
        loop
        preload="metadata"
        className={styles.video}
        poster={poster}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
      >
        <source src={src} type="video/mp4" />
      </video>

      {/* Кастомные контролы */}
      <div className={`${styles.controls} ${showControls || !isPlaying ? styles.controlsVisible : ''}`}>
        
        {/* Прогресс бар */}
        <div className={styles.progressContainer} onClick={handleProgressClick}>
          <div 
            className={styles.progressBar} 
            style={{ width: duration ? `${(currentTime / duration) * 100}%` : '0%' }}
          />
        </div>

        <div className={styles.controlsBottom}>
          {/* Кнопка play/pause */}
          <button 
            className={styles.playPauseButton} 
            onClick={handlePlayClick}
          >
            {isPlaying ? (
              <Pause size={20} fill="black" />
            ) : (
              <Play size={20} fill="black" />
            )}
          </button>

          {/* Время */}
          <div className={styles.time}>
            {formatTime(currentTime)} / {formatTime(duration)}
          </div>
        </div>
      </div>

      {/* Overlay для клика когда контролы скрыты */}
      {!showControls && isPlaying && (
        <div 
          className={styles.clickOverlay} 
          onClick={() => setShowControls(true)}
        />
      )}

      {/* Большая кнопка play поверх видео когда на паузе */}
      {!isPlaying && (
        <div className={styles.centerPlayButton} onClick={handlePlayClick}>
          <div className={styles.playButton}>
            <Play size={48} fill="white" />
          </div>
        </div>
      )}
    </motion.div>
  )
}

export default VideoPlayer