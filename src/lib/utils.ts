export function shuffle<T>(array: T[]): T[] {
  const arr = [...array]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`
}

export function playSound(type: 'correct' | 'skip' | 'tick'): void {
  if (!('audioContext' in window)) return

  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)

    switch (type) {
      case 'correct':
        oscillator.frequency.value = 800 // Higher pitch
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2)
        oscillator.start(audioContext.currentTime)
        oscillator.stop(audioContext.currentTime + 0.2)
        break

      case 'skip':
        oscillator.frequency.value = 500 // Lower pitch
        gainNode.gain.setValueAtTime(0.2, audioContext.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15)
        oscillator.start(audioContext.currentTime)
        oscillator.stop(audioContext.currentTime + 0.15)
        break

      case 'tick':
        oscillator.frequency.value = 1200 // Higher for tick
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.08)
        oscillator.start(audioContext.currentTime)
        oscillator.stop(audioContext.currentTime + 0.08)
        break
    }
  } catch (error) {
    console.error('Error playing sound:', error)
  }
}

export function triggerVibration(type: 'correct' | 'skip'): void {
  if (!('vibrate' in navigator)) return

  try {
    const pattern = type === 'correct' ? [50, 100, 50] : [30, 60]
    navigator.vibrate(pattern)
  } catch (error) {
    console.error('Error triggering vibration:', error)
  }
}

export function triggerFlash(type: 'correct' | 'skip'): void {
  const element = document.getElementById('flash-overlay')
  if (!element) return

  element.classList.remove('flash-correct', 'flash-skip')
  element.classList.add(type === 'correct' ? 'flash-correct' : 'flash-skip')

  // Force reflow to trigger animation
  void element.offsetWidth

  setTimeout(() => {
    element.classList.remove('flash-correct', 'flash-skip')
  }, 600)
}
