import { useState, useEffect } from 'react'
import { formatTime, playSound, triggerVibration, triggerFlash } from '../../lib/utils'
import { useSettings } from '../SettingsContext'
import { useDeviceTiltControls } from '../../hooks/useDeviceTiltControls'
import { getRandomWord, WORD_CATEGORIES } from '../../data/words'
import { updatePlayerStats, getOrCreatePlayerId } from '../../lib/roomManager'
import '../../styles/components.css'

interface GameScreenProps {
  onGameEnd: (stats: { correctAnswers: string[]; skippedAnswers: string[]; score: number }) => void
  roomCode?: string
}

export function GameScreen({ onGameEnd, roomCode }: GameScreenProps) {
  const { settings } = useSettings()
  const [timeLeft, setTimeLeft] = useState(settings.duration)
  const [preCountdown, setPreCountdown] = useState(3)
  const [currentWord, setCurrentWord] = useState('')
  const [score, setScore] = useState(0)
  const [correctAnswers, setCorrectAnswers] = useState<string[]>([])
  const [skippedAnswers, setSkippedAnswers] = useState<string[]>([])
  const [usedWords, setUsedWords] = useState<Set<string>>(new Set())
  const [gameStarted, setGameStarted] = useState(false)
  const [sensorStatus, setSensorStatus] = useState('Iniciando...')
  const [isMultiplayer] = useState(!!roomCode)

  const handleCorrect = () => {
    if (!gameStarted) return

    setCorrectAnswers(prev => [...prev, currentWord])
    setScore(prev => prev + 1)

    if (settings.soundEnabled) playSound('correct')
    if (settings.vibrationEnabled) triggerVibration('correct')
    triggerFlash('correct')

    nextWord()
  }

  const handleSkip = () => {
    if (!gameStarted) return

    setSkippedAnswers(prev => [...prev, currentWord])

    if (settings.soundEnabled) playSound('skip')
    if (settings.vibrationEnabled) triggerVibration('skip')
    triggerFlash('skip')

    nextWord()
  }

  const { tiltState, calibrate, requestPermissionAndStart } = useDeviceTiltControls(
    handleSkip,
    handleCorrect,
    settings.tiltCalibration,
    settings.tiltThreshold
  )

  const nextWord = () => {
    const categoriesToUse = settings.mixCategories
      ? Object.keys(WORD_CATEGORIES)
      : [settings.category]

    let word = ''
    let category = categoriesToUse[Math.floor(Math.random() * categoriesToUse.length)]

    for (let attempts = 0; attempts < 10; attempts++) {
      const candidate = getRandomWord(category as keyof typeof WORD_CATEGORIES, usedWords)
      if (!usedWords.has(candidate)) {
        word = candidate
        break
      }
      category = categoriesToUse[Math.floor(Math.random() * categoriesToUse.length)]
    }

    if (word) {
      setUsedWords(prev => new Set([...prev, word]))
      setCurrentWord(word)
    }
  }

  // Force landscape orientation
  useEffect(() => {
    const forceHorizontal = async () => {
      try {
        const screenOrientation = screen.orientation as any
        if (screenOrientation && screenOrientation.lock) {
          // Try to lock to landscape
          await screenOrientation.lock('landscape-primary').catch(() => {
            // Fallback: try just landscape
            screenOrientation.lock('landscape')
          })
        }
      } catch (error) {
        // Orientation lock not supported or failed
        console.warn('Cannot lock screen orientation:', error)
      }
    }

    forceHorizontal()

    return () => {
      // Unlock orientation when leaving game
      const screenOrientation = screen.orientation as any
      if (screenOrientation && screenOrientation.unlock) {
        screenOrientation.unlock()
      }
    }
  }, [])

  // Startup sequence
  useEffect(() => {
    const startup = async () => {
      setSensorStatus('Solicitando permiso de sensores...')
      await requestPermissionAndStart()

      if (tiltState.sensorAvailable) {
        setSensorStatus('Calibrando...')
        calibrate()
        setSensorStatus('Sensores OK')
      } else {
        setSensorStatus('Usando botones (sensores no disponibles)')
      }
    }

    startup()
  }, [])

  // Pre-game countdown (3..2..1) separate from game timer
  useEffect(() => {
    if (gameStarted) return

    setPreCountdown(3)
    const countdownInterval = setInterval(() => {
      setPreCountdown(prev => {
        if (prev === 1) {
          clearInterval(countdownInterval)
          // initialize first word and start game timer
          nextWord()
          setTimeLeft(settings.duration)
          setGameStarted(true)
          return 0
        }
        if (settings.soundEnabled) playSound('tick')
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(countdownInterval)
  }, [gameStarted, settings])

  // Game timer
  useEffect(() => {
    if (!gameStarted) return

    const gameInterval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(gameInterval)
          
          // Save multiplayer stats if in room
          if (isMultiplayer && roomCode) {
            const playerId = getOrCreatePlayerId()
            updatePlayerStats(roomCode, playerId, correctAnswers.length, skippedAnswers.length, score)
          }

          onGameEnd({
            correctAnswers,
            skippedAnswers,
            score
          })
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(gameInterval)
  }, [gameStarted, correctAnswers, skippedAnswers, score, onGameEnd, isMultiplayer, roomCode])

  if (!gameStarted) {
    return (
      <div className="pre-game-screen">
        <h1>¡Listo?</h1>
        <div className="countdown-display">{preCountdown > 0 ? preCountdown : '¡YA!'}</div>
        <p className="sensor-status-text">
          {sensorStatus === 'Sensores OK' ? '✓' : '⚠️'} {sensorStatus}
        </p>
        {!tiltState.sensorAvailable && (
          <p className="fallback-info">Usa los botones para jugar</p>
        )}
      </div>
    )
  }

  return (
    <div className="game-screen">
      <div className="game-header">
        <div className="timer">{formatTime(timeLeft)}</div>
        <div className="score">Puntos: {score}</div>
      </div>

      <div className="game-center">
        <div className="word-display">{currentWord.toUpperCase()}</div>
      </div>

      <div className="game-footer">
        {tiltState.sensorAvailable && (
          <div className="tilt-indicator">
            <div className="tilt-zones">
              <div className="zone-label">⬆️ SKIP</div>
              <div className="tilt-bar-advanced">
                {/* Center neutral zone */}
                <div className="neutral-zone" />
                
                {/* Dynamic tilt indicator */}
                <div
                  className={`tilt-needle advanced ${tiltState.beta < -20 ? 'active-up' : tiltState.beta > 20 ? 'active-down' : ''}`}
                  style={{
                    transform: `translateX(${Math.max(-100, Math.min(100, tiltState.beta))}px)`,
                    transition: 'none'
                  }}
                />
              </div>
              <div className="zone-label">⬇️ CORRECT</div>
            </div>
            <div className="tilt-value">
              Beta: {Math.round(tiltState.beta)}° 
              {tiltState.beta < -20 && ' 🔼 SKIP!'}
              {tiltState.beta > 20 && ' 🔽 CORRECT!'}
            </div>
          </div>
        )}

        {!tiltState.sensorAvailable && (
          <div className="button-controls">
            <button onClick={handleSkip} className="btn btn-skip">
              ⬆️ SKIP
            </button>
            <button onClick={handleCorrect} className="btn btn-correct">
              ⬇️ CORRECTA
            </button>
          </div>
        )}

        <div className="stats">
          <div>✓ {correctAnswers.length}</div>
          <div>⊘ {skippedAnswers.length}</div>
        </div>
      </div>

      <div id="flash-overlay" className="flash-overlay" />
    </div>
  )
}
