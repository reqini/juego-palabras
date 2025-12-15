import { createContext, useContext, ReactNode, useCallback } from 'react'
import { usePersistentState } from '../hooks/usePersistentState'

export interface PlayerProfile {
  id: string
  name: string
  createdAt: number
}

export interface PlayerScore {
  playerId: string
  score: number
  correctAnswers: number
  skippedAnswers: number
  date: string
  duration: number
}

interface PlayersContextType {
  players: PlayerProfile[]
  currentPlayerId: string | null
  currentPlayer: PlayerProfile | null
  addPlayer: (name: string) => PlayerProfile
  removePlayer: (playerId: string) => void
  setCurrentPlayer: (playerId: string) => void
  getPlayerName: (playerId: string) => string
  savePlayerScore: (score: PlayerScore) => void
  getPlayerScores: (playerId: string) => PlayerScore[]
  getAllScores: () => PlayerScore[]
}

const PlayersContext = createContext<PlayersContextType | undefined>(undefined)

const DEFAULT_PLAYER: PlayerProfile = {
  id: 'default-player',
  name: 'Jugador',
  createdAt: Date.now()
}

export function PlayersProvider({ children }: { children: ReactNode }) {
  const [players, setPlayers] = usePersistentState<PlayerProfile[]>('players', [DEFAULT_PLAYER])
  const [currentPlayerId, setCurrentPlayerId] = usePersistentState<string>('current-player-id', DEFAULT_PLAYER.id)
  const [scores, setScores] = usePersistentState<PlayerScore[]>('player-scores', [])

  const currentPlayer = players.find(p => p.id === currentPlayerId) || null

  const addPlayer = useCallback((name: string): PlayerProfile => {
    const newPlayer: PlayerProfile = {
      id: `player_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: name.trim() || 'Jugador',
      createdAt: Date.now()
    }
    setPlayers(prev => [...prev, newPlayer])
    setCurrentPlayerId(newPlayer.id)
    return newPlayer
  }, [setPlayers, setCurrentPlayerId])

  const removePlayer = useCallback((playerId: string) => {
    // Don't remove the default player
    if (playerId === 'default-player') return
    
    setPlayers(prev => prev.filter(p => p.id !== playerId))
    
    // If removed player was current, switch to default
    if (playerId === currentPlayerId) {
      setCurrentPlayerId(DEFAULT_PLAYER.id)
    }
  }, [setPlayers, currentPlayerId, setCurrentPlayerId])

  const setCurrentPlayerFn = useCallback((playerId: string) => {
    if (players.find(p => p.id === playerId)) {
      setCurrentPlayerId(playerId)
    }
  }, [players, setCurrentPlayerId])

  const getPlayerName = useCallback((playerId: string): string => {
    return players.find(p => p.id === playerId)?.name || 'Desconocido'
  }, [players])

  const savePlayerScore = useCallback((score: PlayerScore) => {
    setScores(prev => [...prev, score])
  }, [setScores])

  const getPlayerScores = useCallback((playerId: string): PlayerScore[] => {
    return scores.filter(s => s.playerId === playerId)
  }, [scores])

  const getAllScores = useCallback((): PlayerScore[] => {
    return scores
  }, [scores])

  return (
    <PlayersContext.Provider
      value={{
        players,
        currentPlayerId,
        currentPlayer,
        addPlayer,
        removePlayer,
        setCurrentPlayer: setCurrentPlayerFn,
        getPlayerName,
        savePlayerScore,
        getPlayerScores,
        getAllScores
      }}
    >
      {children}
    </PlayersContext.Provider>
  )
}

export function usePlayers(): PlayersContextType {
  const context = useContext(PlayersContext)
  if (!context) {
    throw new Error('usePlayers must be used within PlayersProvider')
  }
  return context
}
