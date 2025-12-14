import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import '../../styles/components.css';
export function HomeScreen({ onPlay, onLeaderboard, onConfig }) {
    return (_jsxs("div", { className: "home-screen", children: [_jsxs("div", { className: "header", children: [_jsx("h1", { className: "title", children: "\uD83C\uDFAE Adivina la Palabra" }), _jsx("p", { className: "subtitle", children: "Juego tipo Heads Up" })] }), _jsxs("div", { className: "buttons", children: [_jsx("button", { onClick: onPlay, className: "btn btn-lg btn-primary", children: "\u25B6\uFE0F Jugar" }), _jsx("button", { onClick: onLeaderboard, className: "btn btn-lg btn-secondary", children: "\uD83C\uDFC6 Tabla de Posiciones" }), _jsx("button", { onClick: onConfig, className: "btn btn-lg btn-secondary", children: "\u2699\uFE0F Configuraci\u00F3n" })] }), _jsx("div", { className: "footer", children: _jsx("p", { className: "offline-badge", children: "\uD83D\uDCE1 Funciona sin conexi\u00F3n" }) })] }));
}
