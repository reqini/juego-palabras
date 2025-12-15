import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useCallback } from 'react';
import { usePersistentState } from '../hooks/usePersistentState';
const PlayersContext = createContext(undefined);
const DEFAULT_PLAYER = {
    id: 'default-player',
    name: 'Jugador',
    createdAt: Date.now()
};
export function PlayersProvider({ children }) {
    const [players, setPlayers] = usePersistentState('players', [DEFAULT_PLAYER]);
    const [currentPlayerId, setCurrentPlayerId] = usePersistentState('current-player-id', DEFAULT_PLAYER.id);
    const [scores, setScores] = usePersistentState('player-scores', []);
    const currentPlayer = players.find(p => p.id === currentPlayerId) || null;
    const addPlayer = useCallback((name) => {
        const newPlayer = {
            id: `player_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            name: name.trim() || 'Jugador',
            createdAt: Date.now()
        };
        setPlayers(prev => [...prev, newPlayer]);
        setCurrentPlayerId(newPlayer.id);
        return newPlayer;
    }, [setPlayers, setCurrentPlayerId]);
    const removePlayer = useCallback((playerId) => {
        // Don't remove the default player
        if (playerId === 'default-player')
            return;
        setPlayers(prev => prev.filter(p => p.id !== playerId));
        // If removed player was current, switch to default
        if (playerId === currentPlayerId) {
            setCurrentPlayerId(DEFAULT_PLAYER.id);
        }
    }, [setPlayers, currentPlayerId, setCurrentPlayerId]);
    const setCurrentPlayerFn = useCallback((playerId) => {
        if (players.find(p => p.id === playerId)) {
            setCurrentPlayerId(playerId);
        }
    }, [players, setCurrentPlayerId]);
    const getPlayerName = useCallback((playerId) => {
        return players.find(p => p.id === playerId)?.name || 'Desconocido';
    }, [players]);
    const savePlayerScore = useCallback((score) => {
        setScores(prev => [...prev, score]);
    }, [setScores]);
    const getPlayerScores = useCallback((playerId) => {
        return scores.filter(s => s.playerId === playerId);
    }, [scores]);
    const getAllScores = useCallback(() => {
        return scores;
    }, [scores]);
    return (_jsx(PlayersContext.Provider, { value: {
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
        }, children: children }));
}
export function usePlayers() {
    const context = useContext(PlayersContext);
    if (!context) {
        throw new Error('usePlayers must be used within PlayersProvider');
    }
    return context;
}
