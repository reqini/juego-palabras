import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { getTopLeaderboard, resetLeaderboard } from '../../lib/leaderboard';
import { formatDate } from '../../lib/utils';
import '../../styles/components.css';
export function LeaderboardScreen({ onBack }) {
    const [showConfirm, setShowConfirm] = useState(false);
    const leaderboard = getTopLeaderboard(20);
    const handleReset = () => {
        resetLeaderboard();
        setShowConfirm(false);
        window.location.reload();
    };
    return (_jsxs("div", { className: "leaderboard-screen", children: [_jsx("h1", { children: "\uD83C\uDFC6 Tabla de Posiciones" }), leaderboard.length === 0 ? (_jsx("div", { className: "empty-state", children: _jsx("p", { children: "No hay registros a\u00FAn. \u00A1Juega para aparecer en la tabla!" }) })) : (_jsxs("div", { className: "leaderboard-table", children: [_jsxs("div", { className: "table-header", children: [_jsx("div", { className: "col col-rank", children: "#" }), _jsx("div", { className: "col col-name", children: "Nombre" }), _jsx("div", { className: "col col-score", children: "Puntos" }), _jsx("div", { className: "col col-stats", children: "Aciertos/Pasos" }), _jsx("div", { className: "col col-date", children: "Fecha" })] }), leaderboard.map((entry, index) => (_jsxs("div", { className: "table-row", children: [_jsx("div", { className: "col col-rank", children: index + 1 }), _jsx("div", { className: "col col-name", children: entry.name }), _jsx("div", { className: "col col-score", children: entry.score }), _jsxs("div", { className: "col col-stats", children: [entry.correctAnswers, "/", entry.skips] }), _jsx("div", { className: "col col-date", children: formatDate(new Date(entry.date)) })] }, entry.id)))] })), _jsxs("div", { className: "button-group", children: [leaderboard.length > 0 && (_jsxs(_Fragment, { children: [!showConfirm && (_jsx("button", { onClick: () => setShowConfirm(true), className: "btn btn-danger", children: "Limpiar Tabla" })), showConfirm && (_jsxs("div", { className: "confirmation", children: [_jsx("p", { children: "\u00BFEst\u00E1s seguro? No se puede deshacer." }), _jsx("button", { onClick: handleReset, className: "btn btn-danger", children: "S\u00ED, limpiar" }), _jsx("button", { onClick: () => setShowConfirm(false), className: "btn btn-secondary", children: "Cancelar" })] }))] })), _jsx("button", { onClick: onBack, className: "btn btn-primary", children: "Volver" })] })] }));
}
