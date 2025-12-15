import { useEffect, useRef, useState, useCallback } from 'react'

export interface TiltCalibration {
  baseBeta: number
  baseGamma: number
}

export interface TiltState {
  beta: number
  gamma: number
  alpha: number
  isCalibrated: boolean
  sensorAvailable: boolean
  lastDirection?: 'up' | 'down'
}

interface TiltAction {
  type: 'tilt-up' | 'tilt-down'
  timestamp: number
}

export function useDeviceTiltControls(
  onTiltUp: () => void,
  onTiltDown: () => void,
  calibration?: TiltCalibration,
  threshold: number = 20 // Reduced threshold for more sensitivity
) {
  const [tiltState, setTiltState] = useState<TiltState>({
    beta: 0,
    gamma: 0,
    alpha: 0,
    isCalibrated: false,
    sensorAvailable: false
  })

  const lastActionRef = useRef<TiltAction | null>(null)
  const calibrationRef = useRef<TiltCalibration>(calibration || { baseBeta: 0, baseGamma: 0 })
  const throttleRef = useRef<number | null>(null)
  const lastDirectionRef = useRef<'up' | 'down' | null>(null)
  const neutralZoneRef = useRef(false) // Track if we're back in neutral zone

  const handleDeviceOrientation = useCallback((event: DeviceOrientationEvent) => {
    if (event.alpha === null || event.beta === null || event.gamma === null) return

    const beta = event.beta
    const gamma = event.gamma
    const alpha = event.alpha

    setTiltState(prev => ({
      ...prev,
      beta,
      gamma,
      alpha,
      sensorAvailable: true
    }))

    // Throttle detection to prevent multiple triggers
    if (throttleRef.current) return

    const baseBeta = calibrationRef.current.baseBeta
    const betaDelta = beta - baseBeta

    const now = Date.now()
    const minInterval = 400 // Faster cooldown for more responsive feel

    // Define zones with hysteresis to avoid flickering
    const upperThreshold = -threshold // Forward tilt
    const lowerThreshold = threshold   // Backward tilt

    // Forward tilt (SKIP) = device tilted forward/up
    if (betaDelta < upperThreshold) {
      // Hysteresis: only trigger if we were neutral or in opposite direction
      if (lastDirectionRef.current !== 'up' || neutralZoneRef.current) {
        if (!lastActionRef.current || now - lastActionRef.current.timestamp >= minInterval) {
          lastActionRef.current = { type: 'tilt-up', timestamp: now }
          lastDirectionRef.current = 'up'
          neutralZoneRef.current = false
          onTiltUp()

          // Debounce further tilt events
          throttleRef.current = setTimeout(() => {
            throttleRef.current = null
          }, 150)
        }
      }
    }
    // Backward tilt (CORRECT) = device tilted backward/down
    else if (betaDelta > lowerThreshold) {
      // Hysteresis: only trigger if we were neutral or in opposite direction
      if (lastDirectionRef.current !== 'down' || neutralZoneRef.current) {
        if (!lastActionRef.current || now - lastActionRef.current.timestamp >= minInterval) {
          lastActionRef.current = { type: 'tilt-down', timestamp: now }
          lastDirectionRef.current = 'down'
          neutralZoneRef.current = false
          onTiltDown()

          // Debounce further tilt events
          throttleRef.current = setTimeout(() => {
            throttleRef.current = null
          }, 150)
        }
      }
    }
    // Neutral zone (between thresholds)
    else {
      neutralZoneRef.current = true
    }
  }, [onTiltUp, onTiltDown, threshold])

  const requestPermissionAndStart = useCallback(async () => {
    // iOS 13+ requires explicit permission for motion events
    if (typeof (DeviceOrientationEvent as any) !== 'undefined' && typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
      try {
        const permission = await (DeviceOrientationEvent as any).requestPermission()
        if (permission === 'granted') {
          window.addEventListener('deviceorientation', handleDeviceOrientation)
          setTiltState(prev => ({ ...prev, sensorAvailable: true }))
        }
      } catch (err) {
        console.error('Permission denied for device orientation', err)
      }
    } else {
      // Android and non-Apple browsers
      window.addEventListener('deviceorientation', handleDeviceOrientation)
      setTiltState(prev => ({ ...prev, sensorAvailable: true }))
    }
  }, [handleDeviceOrientation])

  const calibrate = useCallback((currentState?: { beta: number; gamma: number }) => {
    const calibPoint = currentState || {
      beta: tiltState.beta,
      gamma: tiltState.gamma
    }

    calibrationRef.current = {
      baseBeta: calibPoint.beta,
      baseGamma: calibPoint.gamma
    }

    setTiltState(prev => ({
      ...prev,
      isCalibrated: true
    }))

    return calibrationRef.current
  }, [tiltState.beta, tiltState.gamma])

  const stop = useCallback(() => {
    window.removeEventListener('deviceorientation', handleDeviceOrientation)
    if (throttleRef.current) {
      clearTimeout(throttleRef.current)
      throttleRef.current = null
    }
  }, [handleDeviceOrientation])

  useEffect(() => {
    return () => {
      stop()
    }
  }, [stop])

  return {
    tiltState,
    calibration: calibrationRef.current,
    calibrate,
    requestPermissionAndStart,
    stop
  }
}
