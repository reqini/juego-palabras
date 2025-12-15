import { useEffect, useRef, useState, useCallback } from 'react';
export function useDeviceTiltControls(onTiltUp, onTiltDown, calibration, threshold = 20 // Reduced threshold for more sensitivity
) {
    const [tiltState, setTiltState] = useState({
        beta: 0,
        gamma: 0,
        alpha: 0,
        isCalibrated: false,
        sensorAvailable: false
    });
    const lastActionRef = useRef(null);
    const calibrationRef = useRef(calibration || { baseBeta: 0, baseGamma: 0 });
    const throttleRef = useRef(null);
    const lastDirectionRef = useRef(null);
    const neutralZoneRef = useRef(false); // Track if we're back in neutral zone
    const handleDeviceOrientation = useCallback((event) => {
        if (event.alpha === null || event.beta === null || event.gamma === null)
            return;
        const beta = event.beta;
        const gamma = event.gamma;
        const alpha = event.alpha;
        setTiltState(prev => ({
            ...prev,
            beta,
            gamma,
            alpha,
            sensorAvailable: true
        }));
        // Throttle detection to prevent multiple triggers
        if (throttleRef.current)
            return;
        const baseBeta = calibrationRef.current.baseBeta;
        const betaDelta = beta - baseBeta;
        const now = Date.now();
        const minInterval = 400; // Faster cooldown for more responsive feel
        // Define zones with hysteresis to avoid flickering
        const upperThreshold = -threshold; // Forward tilt
        const lowerThreshold = threshold; // Backward tilt
        // Forward tilt (SKIP) = device tilted forward/up
        if (betaDelta < upperThreshold) {
            // Hysteresis: only trigger if we were neutral or in opposite direction
            if (lastDirectionRef.current !== 'up' || neutralZoneRef.current) {
                if (!lastActionRef.current || now - lastActionRef.current.timestamp >= minInterval) {
                    lastActionRef.current = { type: 'tilt-up', timestamp: now };
                    lastDirectionRef.current = 'up';
                    neutralZoneRef.current = false;
                    onTiltUp();
                    // Debounce further tilt events
                    throttleRef.current = setTimeout(() => {
                        throttleRef.current = null;
                    }, 150);
                }
            }
        }
        // Backward tilt (CORRECT) = device tilted backward/down
        else if (betaDelta > lowerThreshold) {
            // Hysteresis: only trigger if we were neutral or in opposite direction
            if (lastDirectionRef.current !== 'down' || neutralZoneRef.current) {
                if (!lastActionRef.current || now - lastActionRef.current.timestamp >= minInterval) {
                    lastActionRef.current = { type: 'tilt-down', timestamp: now };
                    lastDirectionRef.current = 'down';
                    neutralZoneRef.current = false;
                    onTiltDown();
                    // Debounce further tilt events
                    throttleRef.current = setTimeout(() => {
                        throttleRef.current = null;
                    }, 150);
                }
            }
        }
        // Neutral zone (between thresholds)
        else {
            neutralZoneRef.current = true;
        }
    }, [onTiltUp, onTiltDown, threshold]);
    const requestPermissionAndStart = useCallback(async () => {
        console.log('[TILT] Iniciando detección de sensores...');
        console.log('[TILT] DeviceOrientationEvent disponible:', typeof DeviceOrientationEvent !== 'undefined');
        // Check if running on mobile (not desktop)
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        console.log('[TILT] ¿Es mobile?', isMobile);
        // iOS 13+ requires explicit permission for motion events
        if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
            console.log('[TILT] Detectado iOS con requestPermission');
            try {
                const permission = await DeviceOrientationEvent.requestPermission();
                console.log('[TILT] Permiso de iOS:', permission);
                if (permission === 'granted') {
                    window.addEventListener('deviceorientation', handleDeviceOrientation, true);
                    setTiltState(prev => ({ ...prev, sensorAvailable: true }));
                    console.log('[TILT] ✓ Sensores activados (iOS)');
                }
                else {
                    console.warn('[TILT] ✗ Permiso denegado por usuario');
                }
            }
            catch (err) {
                console.error('[TILT] Error al solicitar permiso:', err);
            }
        }
        else {
            // Android and non-Apple browsers
            console.log('[TILT] Detectado Android/WebView - registrando listener sin permiso');
            window.addEventListener('deviceorientation', handleDeviceOrientation, true);
            // Don't immediately set sensorAvailable for Android - wait for first event
            // This prevents false negatives when the device hasn't moved yet
            console.log('[TILT] Esperando primer evento de deviceorientation...');
        }
    }, [handleDeviceOrientation]);
    const calibrate = useCallback((currentState) => {
        const calibPoint = currentState || {
            beta: tiltState.beta,
            gamma: tiltState.gamma
        };
        calibrationRef.current = {
            baseBeta: calibPoint.beta,
            baseGamma: calibPoint.gamma
        };
        setTiltState(prev => ({
            ...prev,
            isCalibrated: true
        }));
        return calibrationRef.current;
    }, [tiltState.beta, tiltState.gamma]);
    const stop = useCallback(() => {
        window.removeEventListener('deviceorientation', handleDeviceOrientation);
        if (throttleRef.current) {
            clearTimeout(throttleRef.current);
            throttleRef.current = null;
        }
    }, [handleDeviceOrientation]);
    useEffect(() => {
        return () => {
            stop();
        };
    }, [stop]);
    return {
        tiltState,
        calibration: calibrationRef.current,
        calibrate,
        requestPermissionAndStart,
        stop
    };
}
