'use client';

// Types for local storage data
export interface LikedSong {
    id: string;
    trackId: string;
    title: string;
    artist: string;
    thumbnail: string | null;
    duration: string | null;
    likedAt: string;
}

export interface PlaylistTrack {
    id: string;
    trackId: string;
    title: string;
    artist: string;
    thumbnail: string | null;
    duration: string | null;
    addedAt: string;
}

export interface Playlist {
    id: string;
    name: string;
    description: string | null;
    isPublic: string;
    createdAt: string;
    updatedAt: string;
    tracks: PlaylistTrack[];
}

export interface HistoryItem {
    id: string;
    trackId: string;
    title: string;
    artist: string;
    thumbnail: string | null;
    duration: string | null;
    playCount: number;
    playedAt: string;
    lastPlayedAt: string;
}

export interface UserData {
    version: number;
    profile: {
        name: string;
        createdAt: string;
    };
    likedSongs: LikedSong[];
    playlists: Playlist[];
    history: HistoryItem[];
}

const STORAGE_KEY = 'soulmate-data';
const CURRENT_VERSION = 1;

// Generate a simple UUID
function generateId(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

// Initialize default data structure
function getDefaultData(): UserData {
    return {
        version: CURRENT_VERSION,
        profile: {
            name: 'My Music Library',
            createdAt: new Date().toISOString(),
        },
        likedSongs: [],
        playlists: [],
        history: [],
    };
}

// Load data from localStorage
export function loadUserData(): UserData {
    if (typeof window === 'undefined') {
        return getDefaultData();
    }

    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) {
            const defaultData = getDefaultData();
            saveUserData(defaultData);
            return defaultData;
        }
        return JSON.parse(stored) as UserData;
    } catch (error) {
        console.error('Failed to load user data:', error);
        return getDefaultData();
    }
}

// Save data to localStorage
export function saveUserData(data: UserData): void {
    if (typeof window === 'undefined') return;

    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
        console.error('Failed to save user data:', error);
    }
}

// Export data to JSON file
export function exportToFile(): void {
    const data = loadUserData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'soulmate-data.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Import data from JSON file
export function importFromFile(file: File): Promise<UserData> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importedData = JSON.parse(e.target?.result as string) as UserData;
                // Validate structure
                if (!importedData.version || !importedData.likedSongs || !importedData.playlists || !importedData.history) {
                    throw new Error('Invalid data structure');
                }
                saveUserData(importedData);
                resolve(importedData);
            } catch (error) {
                reject(new Error('Invalid JSON file'));
            }
        };
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsText(file);
    });
}

// Clear all data
export function clearAllData(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEY);
}

// ============ Liked Songs API ============

export function getLikedSongs(): LikedSong[] {
    const data = loadUserData();
    return data.likedSongs.sort((a, b) =>
        new Date(b.likedAt).getTime() - new Date(a.likedAt).getTime()
    );
}

export function likeSong(track: {
    trackId: string;
    title: string;
    artist: string;
    thumbnail?: string;
    duration?: string;
}): LikedSong {
    const data = loadUserData();

    // Check if already liked
    const existing = data.likedSongs.find(s => s.trackId === track.trackId);
    if (existing) {
        throw new Error('Song already liked');
    }

    const newLikedSong: LikedSong = {
        id: generateId(),
        trackId: track.trackId,
        title: track.title,
        artist: track.artist,
        thumbnail: track.thumbnail || null,
        duration: track.duration || null,
        likedAt: new Date().toISOString(),
    };

    data.likedSongs.push(newLikedSong);
    saveUserData(data);
    return newLikedSong;
}

export function unlikeSong(trackId: string): void {
    const data = loadUserData();
    data.likedSongs = data.likedSongs.filter(s => s.trackId !== trackId);
    saveUserData(data);
}

export function isLiked(trackId: string): boolean {
    const data = loadUserData();
    return data.likedSongs.some(s => s.trackId === trackId);
}

// ============ Playlists API ============

export function getPlaylists(): Playlist[] {
    const data = loadUserData();
    return data.playlists.sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
}

export function getPlaylist(id: string): Playlist | null {
    const data = loadUserData();
    return data.playlists.find(p => p.id === id) || null;
}

export function createPlaylist(playlist: {
    name: string;
    description?: string;
    isPublic?: string;
}): Playlist {
    const data = loadUserData();

    const newPlaylist: Playlist = {
        id: generateId(),
        name: playlist.name,
        description: playlist.description || null,
        isPublic: playlist.isPublic || 'private',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        tracks: [],
    };

    data.playlists.push(newPlaylist);
    saveUserData(data);
    return newPlaylist;
}

export function updatePlaylist(id: string, updates: {
    name?: string;
    description?: string;
    isPublic?: string;
}): Playlist {
    const data = loadUserData();
    const index = data.playlists.findIndex(p => p.id === id);

    if (index === -1) {
        throw new Error('Playlist not found');
    }

    data.playlists[index] = {
        ...data.playlists[index],
        ...updates,
        updatedAt: new Date().toISOString(),
    };

    saveUserData(data);
    return data.playlists[index];
}

export function deletePlaylist(id: string): void {
    const data = loadUserData();
    data.playlists = data.playlists.filter(p => p.id !== id);
    saveUserData(data);
}

export function getPlaylistTracks(playlistId: string): PlaylistTrack[] {
    const playlist = getPlaylist(playlistId);
    if (!playlist) return [];
    return playlist.tracks.sort((a, b) =>
        new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime()
    );
}

export function addTrackToPlaylist(playlistId: string, track: {
    trackId: string;
    title: string;
    artist: string;
    thumbnail?: string;
    duration?: string;
}): PlaylistTrack {
    const data = loadUserData();
    const playlistIndex = data.playlists.findIndex(p => p.id === playlistId);

    if (playlistIndex === -1) {
        throw new Error('Playlist not found');
    }

    const newTrack: PlaylistTrack = {
        id: generateId(),
        trackId: track.trackId,
        title: track.title,
        artist: track.artist,
        thumbnail: track.thumbnail || null,
        duration: track.duration || null,
        addedAt: new Date().toISOString(),
    };

    data.playlists[playlistIndex].tracks.push(newTrack);
    data.playlists[playlistIndex].updatedAt = new Date().toISOString();
    saveUserData(data);
    return newTrack;
}

export function removeTrackFromPlaylist(playlistId: string, trackId: string): void {
    const data = loadUserData();
    const playlistIndex = data.playlists.findIndex(p => p.id === playlistId);

    if (playlistIndex === -1) {
        throw new Error('Playlist not found');
    }

    data.playlists[playlistIndex].tracks = data.playlists[playlistIndex].tracks.filter(
        t => t.trackId !== trackId
    );
    data.playlists[playlistIndex].updatedAt = new Date().toISOString();
    saveUserData(data);
}

// ============ History API ============

export function getHistory(limit: number = 50): HistoryItem[] {
    const data = loadUserData();
    return data.history
        .sort((a, b) => new Date(b.lastPlayedAt).getTime() - new Date(a.lastPlayedAt).getTime())
        .slice(0, limit);
}

export function addToHistory(track: {
    trackId: string;
    title: string;
    artist: string;
    thumbnail?: string;
    duration?: string;
}): HistoryItem {
    const data = loadUserData();

    // Check if track already exists in history
    const existingIndex = data.history.findIndex(h => h.trackId === track.trackId);

    if (existingIndex !== -1) {
        // Update existing entry
        data.history[existingIndex].playCount += 1;
        data.history[existingIndex].lastPlayedAt = new Date().toISOString();
        saveUserData(data);
        return data.history[existingIndex];
    }

    // Create new entry
    const newHistoryItem: HistoryItem = {
        id: generateId(),
        trackId: track.trackId,
        title: track.title,
        artist: track.artist,
        thumbnail: track.thumbnail || null,
        duration: track.duration || null,
        playCount: 1,
        playedAt: new Date().toISOString(),
        lastPlayedAt: new Date().toISOString(),
    };

    data.history.push(newHistoryItem);
    saveUserData(data);
    return newHistoryItem;
}

export function deleteHistoryItem(id: string): void {
    const data = loadUserData();
    data.history = data.history.filter(h => h.id !== id);
    saveUserData(data);
}

// ============ Profile API ============

export function getProfile(): { name: string; createdAt: string } {
    const data = loadUserData();
    return data.profile;
}

export function updateProfile(name: string): void {
    const data = loadUserData();
    data.profile.name = name;
    saveUserData(data);
}
