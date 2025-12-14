import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { createRoom, joinRoom, generateRoomShareUrl, getRoomCodeFromUrl } from '../../lib/roomManager';
export function MultiplayerSetupScreen({ onGameStart, onBack }) {
    const [mode, setMode] = useState(null);
    const [playerName, setPlayerName] = useState('');
    const [category, setCategory] = useState('general');
    const [duration, setDuration] = useState(60);
    const [roomCode, setRoomCode] = useState('');
    const [shareCode, setShareCode] = useState(null);
    const [copyFeedback, setCopyFeedback] = useState(false);
    const [joinError, setJoinError] = useState(null);
    // Check if there's a room code in the URL
    useEffect(() => {
        const urlRoomCode = getRoomCodeFromUrl();
        if (urlRoomCode) {
            setMode('join');
            setRoomCode(urlRoomCode.toUpperCase());
        }
    }, []);
    const handleCreateRoom = (e) => {
        e.preventDefault();
        if (!playerName.trim())
            return;
        const room = createRoom(playerName, category, duration);
        setShareCode(room.code);
    };
    const handleCopyCode = async () => {
        if (shareCode) {
            const shareUrl = generateRoomShareUrl(shareCode);
            await navigator.clipboard.writeText(shareUrl);
            setCopyFeedback(true);
            setTimeout(() => setCopyFeedback(false), 2000);
        }
    };
    const handleStartCreatedGame = () => {
        if (shareCode) {
            onGameStart('multiplayer', shareCode);
        }
    };
    const handleJoinRoom = (e) => {
        e.preventDefault();
        setJoinError(null);
        if (!playerName.trim() || !roomCode.trim())
            return;
        const room = joinRoom(roomCode.toUpperCase(), playerName);
        if (room) {
            onGameStart('multiplayer', room.code);
        }
        else {
            setJoinError('Código de sala inválido o expirado');
        }
    };
    return (_jsxs("div", { className: "multiplayer-setup", children: [_jsx("h2", { children: "Modo Multiplayer" }), !mode && (_jsxs("div", { className: "mode-selection", children: [_jsx("button", { className: "btn btn-large", onClick: () => setMode('create'), children: "Crear Partida" }), _jsx("button", { className: "btn btn-large", onClick: () => setMode('join'), children: "Unirse a Partida" }), _jsx("button", { className: "btn btn-secondary", onClick: onBack, children: "Volver" })] })), mode === 'create' && !shareCode && (_jsxs("form", { onSubmit: handleCreateRoom, className: "setup-form", children: [_jsxs("div", { className: "form-group", children: [_jsx("label", { children: "Tu Nombre" }), _jsx("input", { type: "text", value: playerName, onChange: (e) => setPlayerName(e.target.value), placeholder: "Ingresa tu nombre", maxLength: 20, required: true })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { children: "Categor\u00EDa" }), _jsxs("select", { value: category, onChange: (e) => setCategory(e.target.value), children: [_jsx("option", { value: "general", children: "General" }), _jsx("option", { value: "deportes", children: "Deportes" }), _jsx("option", { value: "animales", children: "Animales" }), _jsx("option", { value: "tecnologia", children: "Tecnolog\u00EDa" }), _jsx("option", { value: "paises", children: "Pa\u00EDses" }), _jsx("option", { value: "musica", children: "M\u00FAsica" }), _jsx("option", { value: "peliculas", children: "Pel\u00EDculas" }), _jsx("option", { value: "comida", children: "Comida" })] })] }), _jsxs("div", { className: "form-group", children: [_jsxs("label", { children: ["Duraci\u00F3n (segundos): ", duration, "s"] }), _jsx("input", { type: "range", min: "30", max: "180", step: "10", value: duration, onChange: (e) => setDuration(Number(e.target.value)) })] }), _jsx("button", { type: "submit", className: "btn btn-primary", children: "Crear Sala" }), _jsx("button", { type: "button", className: "btn btn-secondary", onClick: () => setMode(null), children: "Atr\u00E1s" })] })), mode === 'create' && shareCode && (_jsxs("div", { className: "room-created", children: [_jsx("h3", { children: "\u00A1Sala Creada!" }), _jsxs("div", { className: "room-code-display", children: [_jsx("p", { className: "room-code", children: shareCode }), _jsx("p", { className: "room-code-label", children: "C\u00F3digo de la Sala" })] }), _jsx("button", { className: "btn btn-primary btn-large", onClick: handleCopyCode, children: copyFeedback ? '✓ Copiado' : 'Copiar Enlace' }), _jsx("p", { className: "share-info", children: "Comparte este c\u00F3digo o el enlace con otros jugadores para que se unan a tu partida." }), _jsx("button", { className: "btn btn-success btn-large", onClick: handleStartCreatedGame, children: "Comenzar Juego" })] })), mode === 'join' && (_jsxs("form", { onSubmit: handleJoinRoom, className: "setup-form", children: [_jsxs("div", { className: "form-group", children: [_jsx("label", { children: "Tu Nombre" }), _jsx("input", { type: "text", value: playerName, onChange: (e) => setPlayerName(e.target.value), placeholder: "Ingresa tu nombre", maxLength: 20, required: true })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { children: "C\u00F3digo de Sala" }), _jsx("input", { type: "text", value: roomCode, onChange: (e) => setRoomCode(e.target.value.toUpperCase()), placeholder: "Ej: ABC123", maxLength: 6, required: true })] }), joinError && _jsx("p", { className: "error-message", children: joinError }), _jsx("button", { type: "submit", className: "btn btn-primary", children: "Unirse a Sala" }), _jsx("button", { type: "button", className: "btn btn-secondary", onClick: () => {
                            setMode(null);
                            setRoomCode('');
                            setJoinError(null);
                        }, children: "Atr\u00E1s" })] }))] }));
}
