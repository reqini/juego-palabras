import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { saveToLeaderboard } from '../../lib/leaderboard';
import '../../styles/components.css';
export function EndGameScreen({ stats, duration, onComplete }) {
    const [playerName, setPlayerName] = useState('Jugador');
    const [saved, setSaved] = useState(false);
    const handleSaveScore = () => {
        saveToLeaderboard({
            name: playerName || 'Jugador',
            score: stats.score,
            correctAnswers: stats.correctAnswers.length,
            skips: stats.skippedAnswers.length,
            date: new Date().toISOString(),
            duration
        });
        setSaved(true);
    };
    return (_jsxs("div", { className: "end-game-screen", children: [_jsx("h1", { children: "\uD83C\uDF89 \u00A1Juego Finalizado!" }), _jsxs("div", { className: "results", children: [_jsxs("div", { className: "result-item", children: [_jsx("div", { className: "result-label", children: "Puntuaci\u00F3n Final" }), _jsx("div", { className: "result-value", children: stats.score })] }), _jsxs("div", { className: "result-item", children: [_jsx("div", { className: "result-label", children: "Respuestas Correctas" }), _jsx("div", { className: "result-value", children: stats.correctAnswers.length })] }), _jsxs("div", { className: "result-item", children: [_jsx("div", { className: "result-label", children: "Palabras Pasadas" }), _jsx("div", { className: "result-value", children: stats.skippedAnswers.length })] })] }), stats.correctAnswers.length > 0 && (_jsxs("div", { className: "word-list", children: [_jsx("h3", { children: "Palabras Acertadas:" }), _jsx("div", { className: "words", children: stats.correctAnswers.map((word, i) => (_jsx("span", { className: "word-tag correct", children: word }, i))) })] })), stats.skippedAnswers.length > 0 && (_jsxs("div", { className: "word-list", children: [_jsx("h3", { children: "Palabras Pasadas:" }), _jsx("div", { className: "words", children: stats.skippedAnswers.map((word, i) => (_jsx("span", { className: "word-tag skipped", children: word }, i))) })] })), !saved ? (_jsxs("div", { className: "save-section", children: [_jsx("label", { htmlFor: "playerName", children: "\u00BFCu\u00E1l es tu nombre?" }), _jsx("input", { id: "playerName", type: "text", maxLength: 20, value: playerName, onChange: e => setPlayerName(e.target.value), placeholder: "Tu nombre" }), _jsx("button", { onClick: handleSaveScore, className: "btn btn-success", children: "Guardar en Tabla de Posiciones" })] })) : (_jsxs("div", { className: "saved-message", children: ["\u2713 Score guardado para ", playerName] })), _jsx("button", { onClick: onComplete, className: "btn btn-primary", children: "Volver al Inicio" })] }));
}
