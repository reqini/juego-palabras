import { createContext, useContext, ReactNode, useCallback } from 'react'
import { usePersistentState } from '../hooks/usePersistentState'
import { TiltCalibration } from '../hooks/useDeviceTiltControls'

export interface GameSettings {
  duration: number // seconds
  category: string
  tiltThreshold: number // degrees
  soundEnabled: boolean
  vibrationEnabled: boolean
  tiltCalibration?: TiltCalibration
  mixCategories: boolean
}

export const DEFAULT_SETTINGS: GameSettings = {
  duration: 60,
  category: 'general',
  tiltThreshold: 25,
  soundEnabled: true,
  vibrationEnabled: true,
  mixCategories: false
}

interface SettingsContextType {
  settings: GameSettings
  updateSettings: (newSettings: Partial<GameSettings>) => void
  resetSettings: () => void
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = usePersistentState<GameSettings>('game-settings', DEFAULT_SETTINGS)

  const updateSettings = useCallback((newSettings: Partial<GameSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }))
  }, [setSettings])

  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_SETTINGS)
  }, [setSettings])

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, resetSettings }}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings(): SettingsContextType {
  const context = useContext(SettingsContext)
  if (!context) {
    throw new Error('useSettings must be used within SettingsProvider')
  }
  return context
}
