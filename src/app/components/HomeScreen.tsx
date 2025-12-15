import { useState, useEffect } from 'react'
import '../../styles/components.css'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

interface HomeScreenProps {
  onPlay: () => void
  onMultiplayer: () => void
  onLeaderboard: () => void
  onConfig: () => void
}

export function HomeScreen({ onPlay, onMultiplayer, onLeaderboard, onConfig }: HomeScreenProps) {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showInstallButton, setShowInstallButton] = useState(false)

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      setShowInstallButton(true)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      if (outcome === 'accepted') {
        setDeferredPrompt(null)
        setShowInstallButton(false)
      }
    }
  }
  return (
    <div className="home-screen">
      <div className="header">
        <h1 className="title">🎮 Adivina la Palabra</h1>
        <p className="subtitle">Juego tipo Heads Up</p>
      </div>

      <div className="buttons">
        <button onClick={onPlay} className="btn btn-lg btn-primary">
          ▶️ Jugar
        </button>
        <button onClick={onMultiplayer} className="btn btn-lg btn-primary">
          👥 Multiplayer
        </button>
        {showInstallButton && (
          <button onClick={handleInstall} className="btn btn-lg btn-secondary">
            📥 Descargar App
          </button>
        )}
        <button onClick={onLeaderboard} className="btn btn-lg btn-secondary">
          🏆 Tabla de Posiciones
        </button>
        <button onClick={onConfig} className="btn btn-lg btn-secondary">
          ⚙️ Configuración
        </button>
      </div>

      <div className="footer">
        <p className="offline-badge">📡 Funciona sin conexión</p>
      </div>
    </div>
  )
}
