import '../../styles/components.css'

interface HomeScreenProps {
  onPlay: () => void
  onLeaderboard: () => void
  onConfig: () => void
}

export function HomeScreen({ onPlay, onLeaderboard, onConfig }: HomeScreenProps) {
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
