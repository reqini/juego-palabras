import { useState } from 'react'
import { useSettings } from '../SettingsContext'
import { WORD_CATEGORIES_KEYS } from '../../data/words'
import { CalibrationScreen } from './CalibrationScreen'
import '../../styles/components.css'

interface ConfigScreenProps {
  onBack: () => void
}

export function ConfigScreen({ onBack }: ConfigScreenProps) {
  const { settings, updateSettings } = useSettings()
  const [showCalibration, setShowCalibration] = useState(false)

  if (showCalibration) {
    return <CalibrationScreen onComplete={() => setShowCalibration(false)} />
  }

  return (
    <div className="config-screen">
      <h1>Configuración</h1>

      <div className="config-section">
        <label htmlFor="duration">Duración de la ronda (segundos)</label>
        <div className="input-group">
          <input
            id="duration"
            type="range"
            min="30"
            max="180"
            step="10"
            value={settings.duration}
            onChange={e => updateSettings({ duration: parseInt(e.target.value) })}
          />
          <span className="value">{settings.duration}s</span>
        </div>
      </div>

      <div className="config-section">
        <label htmlFor="category">Categoría</label>
        <select
          id="category"
          value={settings.category}
          onChange={e => updateSettings({ category: e.target.value })}
        >
          {WORD_CATEGORIES_KEYS.map(cat => (
            <option key={cat} value={cat}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div className="config-section">
        <label htmlFor="threshold">Sensibilidad de inclinación</label>
        <div className="input-group">
          <input
            id="threshold"
            type="range"
            min="15"
            max="45"
            step="5"
            value={settings.tiltThreshold}
            onChange={e => updateSettings({ tiltThreshold: parseInt(e.target.value) })}
          />
          <span className="value">{settings.tiltThreshold}°</span>
        </div>
      </div>

      <div className="config-section">
        <label htmlFor="mixCategories">
          <input
            id="mixCategories"
            type="checkbox"
            checked={settings.mixCategories}
            onChange={e => updateSettings({ mixCategories: e.target.checked })}
          />
          Mezclar categorías
        </label>
      </div>

      <div className="config-section">
        <label htmlFor="soundEnabled">
          <input
            id="soundEnabled"
            type="checkbox"
            checked={settings.soundEnabled}
            onChange={e => updateSettings({ soundEnabled: e.target.checked })}
          />
          Sonidos activados
        </label>
      </div>

      <div className="config-section">
        <label htmlFor="vibrationEnabled">
          <input
            id="vibrationEnabled"
            type="checkbox"
            checked={settings.vibrationEnabled}
            onChange={e => updateSettings({ vibrationEnabled: e.target.checked })}
          />
          Vibración activada
        </label>
      </div>

      <button onClick={() => setShowCalibration(true)} className="btn btn-secondary">
        Calibrar Sensores
      </button>

      <button onClick={onBack} className="btn btn-primary">
        Volver
      </button>
    </div>
  )
}
