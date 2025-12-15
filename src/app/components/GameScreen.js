import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { formatTime, playSound, triggerVibration, triggerFlash } from '../../lib/utils';
import { useSettings } from '../SettingsContext';
import { useDeviceTiltControls } from '../../hooks/useDeviceTiltControls';
import { useSwipeControls } from '../../hooks/useSwipeControls';
import { getRandomWord, WORD_CATEGORIES } from '../../data/words';
import { updatePlayerStats, getOrCreatePlayerId } from '../../lib/roomManager';
import '../../styles/components.css';
export function GameScreen({ onGameEnd, roomCode }) {
    const { settings } = useSettings();
    const [timeLeft, setTimeLeft] = useState(settings.duration);
    const [preCountdown, setPreCountdown] = useState(3);
    const [currentWord, setCurrentWord] = useState('');
    const [score, setScore] = useState(0);
    const [correctAnswers, setCorrectAnswers] = useState([]);
    const [skippedAnswers, setSkippedAnswers] = useState([]);
    const [usedWords, setUsedWords] = useState(new Set());
    const [gameStarted, setGameStarted] = useState(false);
    const [sensorStatus, setSensorStatus] = useState('Desliza para jugar');
    const [isMultiplayer] = useState(!!roomCode);
    const [controlMode, setControlMode] = useState('swipe');
    const handleCorrect = () => {
        if (!gameStarted)
            return;
        setCorrectAnswers(prev => [...prev, currentWord]);
        setScore(prev => prev + 1);
        if (settings.soundEnabled)
            playSound('correct');
        if (settings.vibrationEnabled)
            triggerVibration('correct');
        triggerFlash('correct');
        nextWord();
    };
    const handleSkip = () => {
        if (!gameStarted)
            return;
        setSkippedAnswers(prev => [...prev, currentWord]);
        if (settings.soundEnabled)
            playSound('skip');
        if (settings.vibrationEnabled)
            triggerVibration('skip');
        triggerFlash('skip');
        nextWord();
    };
    const { tiltState, calibrate, requestPermissionAndStart } = useDeviceTiltControls(handleSkip, handleCorrect, settings.tiltCalibration, settings.tiltThreshold);
    useSwipeControls(handleSkip, handleCorrect, 50);
    const nextWord = () => {
        const categoriesToUse = settings.mixCategories
            ? Object.keys(WORD_CATEGORIES)
            : [settings.category];
        let word = '';
        let category = categoriesToUse[Math.floor(Math.random() * categoriesToUse.length)];
        for (let attempts = 0; attempts < 10; attempts++) {
            const candidate = getRandomWord(category, usedWords);
            if (!usedWords.has(candidate)) {
                word = candidate;
                break;
            }
            category = categoriesToUse[Math.floor(Math.random() * categoriesToUse.length)];
        }
        if (word) {
            setUsedWords(prev => new Set([...prev, word]));
            setCurrentWord(word);
        }
    };
    // Force landscape orientation
    useEffect(() => {
        const forceHorizontal = async () => {
            try {
                const screenOrientation = screen.orientation;
                if (screenOrientation && screenOrientation.lock) {
                    // Try to lock to landscape
                    await screenOrientation.lock('landscape-primary').catch(() => {
                        // Fallback: try just landscape
                        screenOrientation.lock('landscape');
                    });
                }
            }
            catch (error) {
                // Orientation lock not supported or failed
                console.warn('Cannot lock screen orientation:', error);
            }
        };
        forceHorizontal();
        return () => {
            // Unlock orientation when leaving game
            const screenOrientation = screen.orientation;
            if (screenOrientation && screenOrientation.unlock) {
                screenOrientation.unlock();
            }
        };
    }, []);
    // Startup sequence
    useEffect(() => {
        let timeoutId;
        const startup = async () => {
            setSensorStatus('Desliza para jugar');
            setControlMode('swipe');
            // Try to detect tilt sensors
            await requestPermissionAndStart();
            // Wait a bit for sensors to be detected
            timeoutId = window.setTimeout(() => {
                if (tiltState.sensorAvailable) {
                    console.log('[GameScreen] Sensores detectados');
                    setSensorStatus('✓ Inclinación habilitada');
                    setControlMode('tilt');
                }
                else {
                    console.warn('[GameScreen] Sensores no detectados - usando gestos');
                    setSensorStatus('👆 Desliza arriba/abajo para jugar');
                    setControlMode('swipe');
                }
            }, 800);
        };
        startup();
        return () => {
            if (timeoutId)
                clearTimeout(timeoutId);
        };
    }, [requestPermissionAndStart, calibrate, tiltState.sensorAvailable]);
    // Pre-game countdown (3..2..1) separate from game timer
    useEffect(() => {
        if (gameStarted)
            return;
        setPreCountdown(3);
        const countdownInterval = setInterval(() => {
            setPreCountdown(prev => {
                if (prev === 1) {
                    clearInterval(countdownInterval);
                    // initialize first word and start game timer
                    nextWord();
                    setTimeLeft(settings.duration);
                    setGameStarted(true);
                    return 0;
                }
                if (settings.soundEnabled)
                    playSound('tick');
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(countdownInterval);
    }, [gameStarted, settings]);
    // Game timer
    useEffect(() => {
        if (!gameStarted)
            return;
        const gameInterval = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(gameInterval);
                    // Save multiplayer stats if in room
                    if (isMultiplayer && roomCode) {
                        const playerId = getOrCreatePlayerId();
                        updatePlayerStats(roomCode, playerId, correctAnswers.length, skippedAnswers.length, score);
                    }
                    onGameEnd({
                        correctAnswers,
                        skippedAnswers,
                        score
                    });
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(gameInterval);
    }, [gameStarted, correctAnswers, skippedAnswers, score, onGameEnd, isMultiplayer, roomCode]);
    if (!gameStarted) {
        return (_jsxs("div", { className: "pre-game-screen", children: [_jsx("h1", { children: "\u00A1Listo?" }), _jsx("div", { className: "countdown-display", children: preCountdown > 0 ? preCountdown : '¡YA!' }), _jsxs("p", { className: "sensor-status-text", children: [controlMode === 'tilt' ? '🎮' : '👆', " ", sensorStatus] }), controlMode === 'swipe' && (_jsxs("p", { className: "fallback-info", children: ["\uD83D\uDC46 Desliza arriba para SKIP", _jsx("br", {}), "\uD83D\uDC47 Desliza abajo para CORRECTO"] })), controlMode === 'tilt' && (_jsxs("p", { className: "fallback-info", children: ["\uD83C\uDFAE Inclina para controlar", _jsx("br", {}), "Adelante=SKIP | Atr\u00E1s=CORRECTO"] }))] }));
    }
    return (_jsxs("div", { className: "game-screen", children: [_jsxs("div", { className: "game-header", children: [_jsx("div", { className: "timer", children: formatTime(timeLeft) }), _jsxs("div", { className: "score", children: ["Puntos: ", score] })] }), _jsx("div", { className: "game-center", children: _jsx("div", { className: "word-display", children: currentWord.toUpperCase() }) }), _jsxs("div", { className: "game-footer", children: [tiltState.sensorAvailable && (_jsxs("div", { className: "tilt-indicator", children: [_jsxs("div", { className: "tilt-zones", children: [_jsx("div", { className: "zone-label", children: "\u2B06\uFE0F SKIP" }), _jsxs("div", { className: "tilt-bar-advanced", children: [_jsx("div", { className: "neutral-zone" }), _jsx("div", { className: `tilt-needle advanced ${tiltState.beta < -20 ? 'active-up' : tiltState.beta > 20 ? 'active-down' : ''}`, style: {
                                                    transform: `translateX(${Math.max(-100, Math.min(100, tiltState.beta))}px)`,
                                                    transition: 'none'
                                                } })] }), _jsx("div", { className: "zone-label", children: "\u2B07\uFE0F CORRECT" })] }), _jsxs("div", { className: "tilt-value", children: ["Beta: ", Math.round(tiltState.beta), "\u00B0", tiltState.beta < -20 && ' 🔼 SKIP!', tiltState.beta > 20 && ' 🔽 CORRECT!'] })] })), (controlMode === 'swipe' || !tiltState.sensorAvailable) && (_jsxs("div", { className: "button-controls", children: [_jsx("button", { onClick: handleSkip, className: "btn btn-skip", children: "\u2B06\uFE0F SKIP" }), _jsx("button", { onClick: handleCorrect, className: "btn btn-correct", children: "\u2B07\uFE0F CORRECTA" })] })), _jsxs("div", { className: "stats", children: [_jsxs("div", { children: ["\u2713 ", correctAnswers.length] }), _jsxs("div", { children: ["\u2298 ", skippedAnswers.length] })] })] }), _jsx("div", { id: "flash-overlay", className: "flash-overlay" })] }));
}
