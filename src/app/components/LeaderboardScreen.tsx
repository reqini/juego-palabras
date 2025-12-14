import { useState } from 'react'
import { getTopLeaderboard, resetLeaderboard } from '../../lib/leaderboard'
import { formatDate } from '../../lib/utils'
import '../../styles/components.css'

interface LeaderboardScreenProps {
  onBack: () => void
}

export function LeaderboardScreen({ onBack }: LeaderboardScreenProps) {
  const [showConfirm, setShowConfirm] = useState(false)
  const leaderboard = getTopLeaderboard(20)

  const handleReset = () => {
    resetLeaderboard()
    setShowConfirm(false)
    window.location.reload()
  }

  return (
    <div className="leaderboard-screen">
      <h1>🏆 Tabla de Posiciones</h1>

      {leaderboard.length === 0 ? (
        <div className="empty-state">
          <p>No hay registros aún. ¡Juega para aparecer en la tabla!</p>
        </div>
      ) : (
        <div className="leaderboard-table">
          <div className="table-header">
            <div className="col col-rank">#</div>
            <div className="col col-name">Nombre</div>
            <div className="col col-score">Puntos</div>
            <div className="col col-stats">Aciertos/Pasos</div>
            <div className="col col-date">Fecha</div>
          </div>

          {leaderboard.map((entry, index) => (
            <div key={entry.id} className="table-row">
              <div className="col col-rank">{index + 1}</div>
              <div className="col col-name">{entry.name}</div>
              <div className="col col-score">{entry.score}</div>
              <div className="col col-stats">{entry.correctAnswers}/{entry.skips}</div>
              <div className="col col-date">{formatDate(new Date(entry.date))}</div>
            </div>
          ))}
        </div>
      )}

      <div className="button-group">
        {leaderboard.length > 0 && (
          <>
            {!showConfirm && (
              <button onClick={() => setShowConfirm(true)} className="btn btn-danger">
                Limpiar Tabla
              </button>
            )}
            {showConfirm && (
              <div className="confirmation">
                <p>¿Estás seguro? No se puede deshacer.</p>
                <button onClick={handleReset} className="btn btn-danger">
                  Sí, limpiar
                </button>
                <button onClick={() => setShowConfirm(false)} className="btn btn-secondary">
                  Cancelar
                </button>
              </div>
            )}
          </>
        )}
        <button onClick={onBack} className="btn btn-primary">
          Volver
        </button>
      </div>
    </div>
  )
}
