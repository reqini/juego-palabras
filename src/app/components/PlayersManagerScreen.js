import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { usePlayers } from '../PlayersContext';
import '../../styles/components.css';
export function PlayersManagerScreen({ onClose, onPlayerSelected }) {
    const { players, currentPlayerId, addPlayer, removePlayer, setCurrentPlayer } = usePlayers();
    const [newPlayerName, setNewPlayerName] = useState('');
    const [showAddForm, setShowAddForm] = useState(false);
    const handleAddPlayer = () => {
        if (newPlayerName.trim()) {
            addPlayer(newPlayerName);
            setNewPlayerName('');
            setShowAddForm(false);
        }
    };
    const handleSelectPlayer = (playerId) => {
        setCurrentPlayer(playerId);
        if (onPlayerSelected) {
            onPlayerSelected(playerId);
        }
    };
    const handleRemovePlayer = (playerId, e) => {
        e.stopPropagation();
        if (playerId !== 'default-player') {
            removePlayer(playerId);
        }
    };
    return (_jsx("div", { className: "players-manager-screen", children: _jsxs("div", { className: "players-manager-content", children: [_jsx("h1", { children: "\uD83D\uDC65 Jugadores" }), _jsx("div", { className: "players-list", children: players.map(player => (_jsxs("div", { className: `player-item ${currentPlayerId === player.id ? 'active' : ''}`, onClick: () => handleSelectPlayer(player.id), children: [_jsxs("div", { className: "player-info", children: [_jsx("span", { className: "player-name", children: player.name }), _jsxs("span", { className: "player-id", children: ["#", player.id.substring(7, 13)] })] }), player.id !== 'default-player' && (_jsx("button", { className: "btn-remove", onClick: (e) => handleRemovePlayer(player.id, e), title: "Eliminar jugador", children: "\u2715" }))] }, player.id))) }), showAddForm ? (_jsxs("div", { className: "add-player-form", children: [_jsx("input", { type: "text", maxLength: 20, value: newPlayerName, onChange: e => setNewPlayerName(e.target.value), placeholder: "Nombre del jugador", autoFocus: true, onKeyPress: e => e.key === 'Enter' && handleAddPlayer() }), _jsxs("div", { className: "form-buttons", children: [_jsx("button", { onClick: handleAddPlayer, className: "btn btn-success", children: "\u2713 Agregar" }), _jsx("button", { onClick: () => setShowAddForm(false), className: "btn btn-secondary", children: "\u2715 Cancelar" })] })] })) : (_jsx("button", { onClick: () => setShowAddForm(true), className: "btn btn-primary", children: "\u2795 Nuevo Jugador" })), _jsx("button", { onClick: onClose, className: "btn btn-primary", children: "Volver" })] }) }));
}
