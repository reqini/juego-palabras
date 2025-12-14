import { useState, useEffect } from 'react'
import { HomeScreen } from './components/HomeScreen'
import { GameScreen } from './components/GameScreen'
import { LeaderboardScreen } from './components/LeaderboardScreen'
import { ConfigScreen } from './components/ConfigScreen'
import { EndGameScreen } from './components/EndGameScreen'
import { SettingsProvider, useSettings } from './SettingsContext'
import '../styles/app.css'

type Screen = 'home' | 'game' | 'leaderboard' | 'config' | 'endgame'

interface GameStats {
  correctAnswers: string[]
  skippedAnswers: string[]
  score: number
}

function AppContent() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home')
  const [gameStats, setGameStats] = useState<GameStats | null>(null)
  const [isLandscape, setIsLandscape] = useState(window.innerWidth > window.innerHeight)
  const { settings } = useSettings()

  useEffect(() => {
    const handleResize = () => {
      const landscape = window.innerWidth > window.innerHeight
      setIsLandscape(landscape)
    }

    window.addEventListener('orientationchange', handleResize)
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('orientationchange', handleResize)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const handleGameEnd = (stats: GameStats) => {
    setGameStats(stats)
    setCurrentScreen('endgame')
  }

  return (
    <div className={`app ${isLandscape ? 'landscape' : 'portrait'}`}>
      {!isLandscape && (
        <div className="rotation-overlay">
          <div className="rotation-message">
            📱 Rotá el celular a horizontal
          </div>
        </div>
      )}

      {currentScreen === 'home' && (
        <HomeScreen
          onPlay={() => setCurrentScreen('game')}
          onLeaderboard={() => setCurrentScreen('leaderboard')}
          onConfig={() => setCurrentScreen('config')}
        />
      )}

      {currentScreen === 'game' && (
        <GameScreen onGameEnd={handleGameEnd} />
      )}

      {currentScreen === 'leaderboard' && (
        <LeaderboardScreen onBack={() => setCurrentScreen('home')} />
      )}

      {currentScreen === 'config' && (
        <ConfigScreen onBack={() => setCurrentScreen('home')} />
      )}

      {currentScreen === 'endgame' && gameStats && (
        <EndGameScreen
          stats={gameStats}
          duration={settings.duration}
          onComplete={() => setCurrentScreen('home')}
        />
      )}
    </div>
  )
}

export function App() {
  return (
    <SettingsProvider>
      <AppContent />
    </SettingsProvider>
  )
}
