import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { HomeScreen } from './components/HomeScreen';
import { GameScreen } from './components/GameScreen';
import { LeaderboardScreen } from './components/LeaderboardScreen';
import { ConfigScreen } from './components/ConfigScreen';
import { EndGameScreen } from './components/EndGameScreen';
import { SettingsProvider, useSettings } from './SettingsContext';
import '../styles/app.css';
function AppContent() {
    const [currentScreen, setCurrentScreen] = useState('home');
    const [gameStats, setGameStats] = useState(null);
    const [isLandscape, setIsLandscape] = useState(window.innerWidth > window.innerHeight);
    const { settings } = useSettings();
    useEffect(() => {
        const handleResize = () => {
            const landscape = window.innerWidth > window.innerHeight;
            setIsLandscape(landscape);
        };
        window.addEventListener('orientationchange', handleResize);
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('orientationchange', handleResize);
            window.removeEventListener('resize', handleResize);
        };
    }, []);
    const handleGameEnd = (stats) => {
        setGameStats(stats);
        setCurrentScreen('endgame');
    };
    return (_jsxs("div", { className: `app ${isLandscape ? 'landscape' : 'portrait'}`, children: [!isLandscape && (_jsx("div", { className: "rotation-overlay", children: _jsx("div", { className: "rotation-message", children: "\uD83D\uDCF1 Rot\u00E1 el celular a horizontal" }) })), currentScreen === 'home' && (_jsx(HomeScreen, { onPlay: () => setCurrentScreen('game'), onLeaderboard: () => setCurrentScreen('leaderboard'), onConfig: () => setCurrentScreen('config') })), currentScreen === 'game' && (_jsx(GameScreen, { onGameEnd: handleGameEnd })), currentScreen === 'leaderboard' && (_jsx(LeaderboardScreen, { onBack: () => setCurrentScreen('home') })), currentScreen === 'config' && (_jsx(ConfigScreen, { onBack: () => setCurrentScreen('home') })), currentScreen === 'endgame' && gameStats && (_jsx(EndGameScreen, { stats: gameStats, duration: settings.duration, onComplete: () => setCurrentScreen('home') }))] }));
}
export function App() {
    return (_jsx(SettingsProvider, { children: _jsx(AppContent, {}) }));
}
