import { useState, useEffect } from 'react'
import { createRoom, joinRoom, generateRoomShareUrl, getRoomCodeFromUrl } from '../../lib/roomManager'

interface MultiplayerSetupScreenProps {
  onGameStart: (mode: 'single' | 'multiplayer', roomCode?: string) => void
  onBack: () => void
}

export function MultiplayerSetupScreen({ onGameStart, onBack }: MultiplayerSetupScreenProps) {
  const [mode, setMode] = useState<'create' | 'join' | null>(null)
  const [playerName, setPlayerName] = useState('')
  const [category, setCategory] = useState<string>('general')
  const [duration, setDuration] = useState(60)
  const [roomCode, setRoomCode] = useState('')
  const [shareCode, setShareCode] = useState<string | null>(null)
  const [copyFeedback, setCopyFeedback] = useState(false)
  const [joinError, setJoinError] = useState<string | null>(null)

  // Check if there's a room code in the URL
  useEffect(() => {
    const urlRoomCode = getRoomCodeFromUrl()
    if (urlRoomCode) {
      setMode('join')
      setRoomCode(urlRoomCode.toUpperCase())
    }
  }, [])

  const handleCreateRoom = (e: React.FormEvent) => {
    e.preventDefault()
    if (!playerName.trim()) return

    const room = createRoom(playerName, category, duration)
    setShareCode(room.code)
  }

  const handleCopyCode = async () => {
    if (shareCode) {
      const shareUrl = generateRoomShareUrl(shareCode)
      await navigator.clipboard.writeText(shareUrl)
      setCopyFeedback(true)
      setTimeout(() => setCopyFeedback(false), 2000)
    }
  }

  const handleStartCreatedGame = () => {
    if (shareCode) {
      onGameStart('multiplayer', shareCode)
    }
  }

  const handleJoinRoom = (e: React.FormEvent) => {
    e.preventDefault()
    setJoinError(null)

    if (!playerName.trim() || !roomCode.trim()) return

    const room = joinRoom(roomCode.toUpperCase(), playerName)
    if (room) {
      onGameStart('multiplayer', room.code)
    } else {
      setJoinError('Código de sala inválido o expirado')
    }
  }

  return (
    <div className="multiplayer-setup">
      <h2>Modo Multiplayer</h2>

      {!mode && (
        <div className="mode-selection">
          <button
            className="btn btn-large"
            onClick={() => setMode('create')}
          >
            Crear Partida
          </button>
          <button
            className="btn btn-large"
            onClick={() => setMode('join')}
          >
            Unirse a Partida
          </button>
          <button
            className="btn btn-secondary"
            onClick={onBack}
          >
            Volver
          </button>
        </div>
      )}

      {mode === 'create' && !shareCode && (
        <form onSubmit={handleCreateRoom} className="setup-form">
          <div className="form-group">
            <label>Tu Nombre</label>
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Ingresa tu nombre"
              maxLength={20}
              required
            />
          </div>

          <div className="form-group">
            <label>Categoría</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="general">General</option>
              <option value="deportes">Deportes</option>
              <option value="animales">Animales</option>
              <option value="tecnologia">Tecnología</option>
              <option value="paises">Países</option>
              <option value="musica">Música</option>
              <option value="peliculas">Películas</option>
              <option value="comida">Comida</option>
            </select>
          </div>

          <div className="form-group">
            <label>Duración (segundos): {duration}s</label>
            <input
              type="range"
              min="30"
              max="180"
              step="10"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
            />
          </div>

          <button type="submit" className="btn btn-primary">
            Crear Sala
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setMode(null)}
          >
            Atrás
          </button>
        </form>
      )}

      {mode === 'create' && shareCode && (
        <div className="room-created">
          <h3>¡Sala Creada!</h3>
          <div className="room-code-display">
            <p className="room-code">{shareCode}</p>
            <p className="room-code-label">Código de la Sala</p>
          </div>

          <button
            className="btn btn-primary btn-large"
            onClick={handleCopyCode}
          >
            {copyFeedback ? '✓ Copiado' : 'Copiar Enlace'}
          </button>

          <p className="share-info">
            Comparte este código o el enlace con otros jugadores para que se unan a tu partida.
          </p>

          <button
            className="btn btn-success btn-large"
            onClick={handleStartCreatedGame}
          >
            Comenzar Juego
          </button>
        </div>
      )}

      {mode === 'join' && (
        <form onSubmit={handleJoinRoom} className="setup-form">
          <div className="form-group">
            <label>Tu Nombre</label>
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Ingresa tu nombre"
              maxLength={20}
              required
            />
          </div>

          <div className="form-group">
            <label>Código de Sala</label>
            <input
              type="text"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
              placeholder="Ej: ABC123"
              maxLength={6}
              required
            />
          </div>

          {joinError && <p className="error-message">{joinError}</p>}

          <button type="submit" className="btn btn-primary">
            Unirse a Sala
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => {
              setMode(null)
              setRoomCode('')
              setJoinError(null)
            }}
          >
            Atrás
          </button>
        </form>
      )}
    </div>
  )
}
