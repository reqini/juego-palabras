const LEADERBOARD_KEY = 'game-leaderboard';
export function getLeaderboard() {
    try {
        const data = localStorage.getItem(LEADERBOARD_KEY);
        return data ? JSON.parse(data) : [];
    }
    catch (error) {
        console.error('Error reading leaderboard:', error);
        return [];
    }
}
export function saveToLeaderboard(entry) {
    try {
        const leaderboard = getLeaderboard();
        const newEntry = {
            ...entry,
            id: Date.now().toString()
        };
        leaderboard.push(newEntry);
        // Keep only top 100 entries (by score, then by date)
        leaderboard.sort((a, b) => b.score - a.score || new Date(b.date).getTime() - new Date(a.date).getTime());
        const trimmed = leaderboard.slice(0, 100);
        localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(trimmed));
        return newEntry;
    }
    catch (error) {
        console.error('Error saving to leaderboard:', error);
        throw error;
    }
}
export function resetLeaderboard() {
    try {
        localStorage.removeItem(LEADERBOARD_KEY);
    }
    catch (error) {
        console.error('Error resetting leaderboard:', error);
    }
}
export function getTopLeaderboard(limit = 20) {
    return getLeaderboard().slice(0, limit);
}
