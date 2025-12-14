export interface LeaderboardEntry {
  id: string
  name: string
  score: number
  correctAnswers: number
  skips: number
  date: string
  duration: number
}

export interface GameStats {
  correctAnswers: string[]
  skippedAnswers: string[]
  score: number
}

const LEADERBOARD_KEY = 'game-leaderboard'

export function getLeaderboard(): LeaderboardEntry[] {
  try {
    const data = localStorage.getItem(LEADERBOARD_KEY)
    return data ? JSON.parse(data) : []
  } catch (error) {
    console.error('Error reading leaderboard:', error)
    return []
  }
}

export function saveToLeaderboard(entry: Omit<LeaderboardEntry, 'id'>): LeaderboardEntry {
  try {
    const leaderboard = getLeaderboard()
    const newEntry: LeaderboardEntry = {
      ...entry,
      id: Date.now().toString()
    }

    leaderboard.push(newEntry)
    // Keep only top 100 entries (by score, then by date)
    leaderboard.sort((a, b) => b.score - a.score || new Date(b.date).getTime() - new Date(a.date).getTime())
    const trimmed = leaderboard.slice(0, 100)

    localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(trimmed))
    return newEntry
  } catch (error) {
    console.error('Error saving to leaderboard:', error)
    throw error
  }
}

export function resetLeaderboard(): void {
  try {
    localStorage.removeItem(LEADERBOARD_KEY)
  } catch (error) {
    console.error('Error resetting leaderboard:', error)
  }
}

export function getTopLeaderboard(limit: number = 20): LeaderboardEntry[] {
  return getLeaderboard().slice(0, limit)
}
