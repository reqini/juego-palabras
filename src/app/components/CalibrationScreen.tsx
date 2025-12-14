import { useState } from 'react'
import { useSettings } from '../SettingsContext'
import { useDeviceTiltControls } from '../../hooks/useDeviceTiltControls'
import '../../styles/components.css'

interface CalibrationScreenProps {
  onComplete: () => void
}

export function CalibrationScreen({ onComplete }: CalibrationScreenProps) {
  const { settings, updateSettings } = useSettings()
  const [step, setStep] = useState<'intro' | 'calibrating' | 'done'>('intro')
  const { tiltState, calibrate, requestPermissionAndStart } = useDeviceTiltControls(
    () => {},
    () => {},
    settings.tiltCalibration
  )

  const handleStartCalibration = async () => {
    await requestPermissionAndStart()
    setStep('calibrating')
  }

  const handleCalibrate = () => {
    const calibration = calibrate(tiltState)
    updateSettings({ tiltCalibration: calibration })
    setStep('done')
  }

  return (
    <div className="calibration-screen">
      {step === 'intro' && (
        <div className="calibration-content">
          <h2>Calibración de Sensores</h2>
          <p>Para que el juego funcione correctamente, calibremos el sensor de inclinación.</p>
          <p className="hint">Pon el celular en posición neutral (frente a la cara).</p>
          <button onClick={handleStartCalibration} className="btn btn-primary">
            Iniciar Calibración
          </button>
        </div>
      )}

      {step === 'calibrating' && (
        <div className="calibration-content">
          <h2>Calibrando...</h2>
          <div className="sensor-info">
            <div className="sensor-value">
              <span className="label">Beta (ángulo frontal):</span>
              <span className="value">{Math.round(tiltState.beta)}°</span>
            </div>
            <div className="sensor-value">
              <span className="label">Gamma (ángulo lateral):</span>
              <span className="value">{Math.round(tiltState.gamma)}°</span>
            </div>
            <div className={`sensor-status ${tiltState.sensorAvailable ? 'available' : 'unavailable'}`}>
              {tiltState.sensorAvailable ? '✓ Sensores OK' : '✗ Sensores no disponibles'}
            </div>
          </div>
          <p className="hint">Sostén el celular en posición neutral y toca el botón abajo.</p>
          <button onClick={handleCalibrate} className="btn btn-success">
            Calibrar Posición Actual
          </button>
        </div>
      )}

      {step === 'done' && (
        <div className="calibration-content">
          <h2>✓ Calibración Completada</h2>
          <p>Los sensores están listos para jugar.</p>
          <button onClick={onComplete} className="btn btn-primary">
            Volver
          </button>
        </div>
      )}
    </div>
  )
}
