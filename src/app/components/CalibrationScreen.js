import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useSettings } from '../SettingsContext';
import { useDeviceTiltControls } from '../../hooks/useDeviceTiltControls';
import '../../styles/components.css';
export function CalibrationScreen({ onComplete }) {
    const { settings, updateSettings } = useSettings();
    const [step, setStep] = useState('intro');
    const { tiltState, calibrate, requestPermissionAndStart } = useDeviceTiltControls(() => { }, () => { }, settings.tiltCalibration);
    const handleStartCalibration = async () => {
        await requestPermissionAndStart();
        setStep('calibrating');
    };
    const handleCalibrate = () => {
        const calibration = calibrate(tiltState);
        updateSettings({ tiltCalibration: calibration });
        setStep('done');
    };
    return (_jsxs("div", { className: "calibration-screen", children: [step === 'intro' && (_jsxs("div", { className: "calibration-content", children: [_jsx("h2", { children: "Calibraci\u00F3n de Sensores" }), _jsx("p", { children: "Para que el juego funcione correctamente, calibremos el sensor de inclinaci\u00F3n." }), _jsx("p", { className: "hint", children: "Pon el celular en posici\u00F3n neutral (frente a la cara)." }), _jsx("button", { onClick: handleStartCalibration, className: "btn btn-primary", children: "Iniciar Calibraci\u00F3n" })] })), step === 'calibrating' && (_jsxs("div", { className: "calibration-content", children: [_jsx("h2", { children: "Calibrando..." }), _jsxs("div", { className: "sensor-info", children: [_jsxs("div", { className: "sensor-value", children: [_jsx("span", { className: "label", children: "Beta (\u00E1ngulo frontal):" }), _jsxs("span", { className: "value", children: [Math.round(tiltState.beta), "\u00B0"] })] }), _jsxs("div", { className: "sensor-value", children: [_jsx("span", { className: "label", children: "Gamma (\u00E1ngulo lateral):" }), _jsxs("span", { className: "value", children: [Math.round(tiltState.gamma), "\u00B0"] })] }), _jsx("div", { className: `sensor-status ${tiltState.sensorAvailable ? 'available' : 'unavailable'}`, children: tiltState.sensorAvailable ? '✓ Sensores OK' : '✗ Sensores no disponibles' })] }), _jsx("p", { className: "hint", children: "Sost\u00E9n el celular en posici\u00F3n neutral y toca el bot\u00F3n abajo." }), _jsx("button", { onClick: handleCalibrate, className: "btn btn-success", children: "Calibrar Posici\u00F3n Actual" })] })), step === 'done' && (_jsxs("div", { className: "calibration-content", children: [_jsx("h2", { children: "\u2713 Calibraci\u00F3n Completada" }), _jsx("p", { children: "Los sensores est\u00E1n listos para jugar." }), _jsx("button", { onClick: onComplete, className: "btn btn-primary", children: "Volver" })] }))] }));
}
