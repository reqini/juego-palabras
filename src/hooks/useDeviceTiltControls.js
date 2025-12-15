import { useEffect, useRef, useState, useCallback } from 'react';
export function useDeviceTiltControls(onTiltUp, onTiltDown, calibration, threshold = 25) {
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
    const handleDeviceOrientation = useCallback((event) => {
        if (!event.alpha || !event.beta || !event.gamma)
            return;
        const beta = event.beta || 0;
        const gamma = event.gamma || 0;
        const alpha = event.alpha || 0;
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
        // Calculate delta from calibration point
        const betaDelta = beta - baseBeta;
        // Use beta (front-back tilt) primarily
        const tiltAmount = betaDelta;
        const now = Date.now();
        const minInterval = 600; // Reduced from 900ms for faster response
        // Forward tilt (arriba/up) = negative beta delta
        if (tiltAmount < -threshold) {
            if (!lastActionRef.current || now - lastActionRef.current.timestamp >= minInterval) {
                lastActionRef.current = { type: 'tilt-up', timestamp: now };
                onTiltUp();
                throttleRef.current = setTimeout(() => {
                    throttleRef.current = null;
                }, 200);
            }
        }
        // Backward tilt (abajo/down) = positive beta delta
        else if (tiltAmount > threshold) {
            if (!lastActionRef.current || now - lastActionRef.current.timestamp >= minInterval) {
                lastActionRef.current = { type: 'tilt-down', timestamp: now };
                onTiltDown();
                throttleRef.current = setTimeout(() => {
                    throttleRef.current = null;
                }, 200);
            }
        }
    }, [onTiltUp, onTiltDown, threshold]);
    const requestPermissionAndStart = useCallback(async () => {
        // iOS 13+ requires explicit permission for motion events
        if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
            try {
                const permission = await DeviceOrientationEvent.requestPermission();
                if (permission === 'granted') {
                    window.addEventListener('deviceorientation', handleDeviceOrientation);
                    setTiltState(prev => ({ ...prev, sensorAvailable: true }));
                }
            }
            catch (err) {
                console.error('Permission denied for device orientation', err);
            }
        }
        else {
            // Android and non-Apple browsers
            window.addEventListener('deviceorientation', handleDeviceOrientation);
            setTiltState(prev => ({ ...prev, sensorAvailable: true }));
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
