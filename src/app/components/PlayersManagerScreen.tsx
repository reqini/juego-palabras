import { useState } from 'react'
import { usePlayers } from '../PlayersContext'
import '../../styles/components.css'

interface PlayersManagerScreenProps {
  onClose: () => void
  onPlayerSelected?: (playerId: string) => void
}

export function PlayersManagerScreen({ onClose, onPlayerSelected }: PlayersManagerScreenProps) {
  const { players, currentPlayerId, addPlayer, removePlayer, setCurrentPlayer } = usePlayers()
  const [newPlayerName, setNewPlayerName] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)

  const handleAddPlayer = () => {
    if (newPlayerName.trim()) {
      addPlayer(newPlayerName)
      setNewPlayerName('')
      setShowAddForm(false)
    }
  }

  const handleSelectPlayer = (playerId: string) => {
    setCurrentPlayer(playerId)
    if (onPlayerSelected) {
      onPlayerSelected(playerId)
    }
  }

  const handleRemovePlayer = (playerId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (playerId !== 'default-player') {
      removePlayer(playerId)
    }
  }

  return (
    <div className="players-manager-screen">
      <div className="players-manager-content">
        <h1>👥 Jugadores</h1>
        
        <div className="players-list">
          {players.map(player => (
            <div
              key={player.id}
              className={`player-item ${currentPlayerId === player.id ? 'active' : ''}`}
              onClick={() => handleSelectPlayer(player.id)}
            >
              <div className="player-info">
                <span className="player-name">{player.name}</span>
                <span className="player-id">#{player.id.substring(7, 13)}</span>
              </div>
              {player.id !== 'default-player' && (
                <button
                  className="btn-remove"
                  onClick={(e) => handleRemovePlayer(player.id, e)}
                  title="Eliminar jugador"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>

        {showAddForm ? (
          <div className="add-player-form">
            <input
              type="text"
              maxLength={20}
              value={newPlayerName}
              onChange={e => setNewPlayerName(e.target.value)}
              placeholder="Nombre del jugador"
              autoFocus
              onKeyPress={e => e.key === 'Enter' && handleAddPlayer()}
            />
            <div className="form-buttons">
              <button onClick={handleAddPlayer} className="btn btn-success">
                ✓ Agregar
              </button>
              <button onClick={() => setShowAddForm(false)} className="btn btn-secondary">
                ✕ Cancelar
              </button>
            </div>
          </div>
        ) : (
          <button onClick={() => setShowAddForm(true)} className="btn btn-primary">
            ➕ Nuevo Jugador
          </button>
        )}

        <button onClick={onClose} className="btn btn-primary">
          Volver
        </button>
      </div>
    </div>
  )
}
