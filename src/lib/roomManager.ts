// Room management for multiplayer game sharing

export interface GameRoom {
  id: string
  code: string
  createdAt: number
  players: PlayerStats[]
  currentWord?: string
  gameStarted: boolean
  gameDuration: number
  category: string
}

export interface PlayerStats {
  id: string
  name: string
  score: number
  correctAnswers: number
  skippedAnswers: number
  joinedAt: number
}

const ROOM_STORAGE_KEY = 'adivina_rooms'
const PLAYER_ID_KEY = 'adivina_player_id'
const CURRENT_ROOM_KEY = 'adivina_current_room'

// Generate a unique player ID
export function getOrCreatePlayerId(): string {
  let playerId = localStorage.getItem(PLAYER_ID_KEY)
  if (!playerId) {
    playerId = `player_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    localStorage.setItem(PLAYER_ID_KEY, playerId)
  }
  return playerId
}

// Generate a unique 6-character room code
function generateRoomCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let code = ''
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

// Create a new game room
export function createRoom(playerName: string, category: string, duration: number): GameRoom {
  const playerId = getOrCreatePlayerId()
  const room: GameRoom = {
    id: `room_${Date.now()}`,
    code: generateRoomCode(),
    createdAt: Date.now(),
    players: [
      {
        id: playerId,
        name: playerName,
        score: 0,
        correctAnswers: 0,
        skippedAnswers: 0,
        joinedAt: Date.now()
      }
    ],
    gameStarted: false,
    gameDuration: duration,
    category: category
  }

  // Save room to localStorage
  const rooms = getAllRooms()
  rooms[room.code] = room
  localStorage.setItem(ROOM_STORAGE_KEY, JSON.stringify(rooms))

  // Save current room
  localStorage.setItem(CURRENT_ROOM_KEY, room.code)

  return room
}

// Join an existing room by code
export function joinRoom(code: string, playerName: string): GameRoom | null {
  const rooms = getAllRooms()
  const room = rooms[code]

  if (!room) {
    return null
  }

  const playerId = getOrCreatePlayerId()

  // Check if player already in room
  if (!room.players.find(p => p.id === playerId)) {
    room.players.push({
      id: playerId,
      name: playerName,
      score: 0,
      correctAnswers: 0,
      skippedAnswers: 0,
      joinedAt: Date.now()
    })
  }

  // Update room
  rooms[code] = room
  localStorage.setItem(ROOM_STORAGE_KEY, JSON.stringify(rooms))

  // Save current room
  localStorage.setItem(CURRENT_ROOM_KEY, code)

  return room
}

// Get all rooms
function getAllRooms(): Record<string, GameRoom> {
  const data = localStorage.getItem(ROOM_STORAGE_KEY)
  return data ? JSON.parse(data) : {}
}

// Get current room
export function getCurrentRoom(): GameRoom | null {
  const code = localStorage.getItem(CURRENT_ROOM_KEY)
  if (!code) return null

  const rooms = getAllRooms()
  return rooms[code] || null
}

// Get room by code
export function getRoomByCode(code: string): GameRoom | null {
  const rooms = getAllRooms()
  return rooms[code] || null
}

// Update player stats in room
export function updatePlayerStats(
  roomCode: string,
  playerId: string,
  correctAnswers: number,
  skippedAnswers: number,
  score: number
): void {
  const rooms = getAllRooms()
  const room = rooms[roomCode]

  if (room) {
    const player = room.players.find(p => p.id === playerId)
    if (player) {
      player.score = score
      player.correctAnswers = correctAnswers
      player.skippedAnswers = skippedAnswers
    }
    rooms[roomCode] = room
    localStorage.setItem(ROOM_STORAGE_KEY, JSON.stringify(rooms))
  }
}

// Leave room
export function leaveRoom(): void {
  localStorage.removeItem(CURRENT_ROOM_KEY)
}

// Delete expired rooms (older than 24 hours)
export function cleanupExpiredRooms(): void {
  const rooms = getAllRooms()
  const now = Date.now()
  const twentyFourHours = 24 * 60 * 60 * 1000

  for (const code in rooms) {
    if (now - rooms[code].createdAt > twentyFourHours) {
      delete rooms[code]
    }
  }

  localStorage.setItem(ROOM_STORAGE_KEY, JSON.stringify(rooms))
}

// Generate room join URL
export function generateRoomShareUrl(roomCode: string): string {
  const baseUrl = window.location.origin + window.location.pathname
  return `${baseUrl}?join=${roomCode}`
}

// Get room code from URL
export function getRoomCodeFromUrl(): string | null {
  const params = new URLSearchParams(window.location.search)
  return params.get('join')
}
