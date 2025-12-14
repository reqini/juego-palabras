import { useState } from 'react'
import { saveToLeaderboard } from '../../lib/leaderboard'
import '../../styles/components.css'

interface EndGameScreenProps {
  stats: {
    correctAnswers: string[]
    skippedAnswers: string[]
    score: number
  }
  duration: number
  onComplete: () => void
}

export function EndGameScreen({ stats, duration, onComplete }: EndGameScreenProps) {
  const [playerName, setPlayerName] = useState('Jugador')
  const [saved, setSaved] = useState(false)

  const handleSaveScore = () => {
    saveToLeaderboard({
      name: playerName || 'Jugador',
      score: stats.score,
      correctAnswers: stats.correctAnswers.length,
      skips: stats.skippedAnswers.length,
      date: new Date().toISOString(),
      duration
    })
    setSaved(true)
  }

  return (
    <div className="end-game-screen">
      <h1>🎉 ¡Juego Finalizado!</h1>

      <div className="results">
        <div className="result-item">
          <div className="result-label">Puntuación Final</div>
          <div className="result-value">{stats.score}</div>
        </div>

        <div className="result-item">
          <div className="result-label">Respuestas Correctas</div>
          <div className="result-value">{stats.correctAnswers.length}</div>
        </div>

        <div className="result-item">
          <div className="result-label">Palabras Pasadas</div>
          <div className="result-value">{stats.skippedAnswers.length}</div>
        </div>
      </div>

      {stats.correctAnswers.length > 0 && (
        <div className="word-list">
          <h3>Palabras Acertadas:</h3>
          <div className="words">
            {stats.correctAnswers.map((word, i) => (
              <span key={i} className="word-tag correct">
                {word}
              </span>
            ))}
          </div>
        </div>
      )}

      {stats.skippedAnswers.length > 0 && (
        <div className="word-list">
          <h3>Palabras Pasadas:</h3>
          <div className="words">
            {stats.skippedAnswers.map((word, i) => (
              <span key={i} className="word-tag skipped">
                {word}
              </span>
            ))}
          </div>
        </div>
      )}

      {!saved ? (
        <div className="save-section">
          <label htmlFor="playerName">¿Cuál es tu nombre?</label>
          <input
            id="playerName"
            type="text"
            maxLength={20}
            value={playerName}
            onChange={e => setPlayerName(e.target.value)}
            placeholder="Tu nombre"
          />
          <button onClick={handleSaveScore} className="btn btn-success">
            Guardar en Tabla de Posiciones
          </button>
        </div>
      ) : (
        <div className="saved-message">
          ✓ Score guardado para {playerName}
        </div>
      )}

      <button onClick={onComplete} className="btn btn-primary">
        Volver al Inicio
      </button>
    </div>
  )
}
