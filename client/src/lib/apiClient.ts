import axios from 'axios';
import * as localStorageService from './localStorage';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Wrapper to make local storage API match axios response format
function wrapResponse<T>(data: T) {
    return { data };
}

// Playlists API (local storage)
export const playlistsAPI = {
    getPlaylists: () =>
        Promise.resolve(wrapResponse(localStorageService.getPlaylists())),

    getPlaylist: (id: string) => {
        const playlist = localStorageService.getPlaylist(id);
        if (!playlist) {
            return Promise.reject(new Error('Playlist not found'));
        }
        return Promise.resolve(wrapResponse(playlist));
    },

    createPlaylist: (data: { name: string; description?: string; isPublic?: string }) =>
        Promise.resolve(wrapResponse(localStorageService.createPlaylist(data))),

    updatePlaylist: (id: string, data: { name?: string; description?: string; isPublic?: string }) =>
        Promise.resolve(wrapResponse(localStorageService.updatePlaylist(id, data))),

    deletePlaylist: (id: string) => {
        localStorageService.deletePlaylist(id);
        return Promise.resolve(wrapResponse({ message: 'Playlist deleted' }));
    },

    getTracks: (playlistId: string) =>
        Promise.resolve(wrapResponse(localStorageService.getPlaylistTracks(playlistId))),

    addTrack: (playlistId: string, track: { trackId: string; title: string; artist: string; thumbnail?: string; duration?: string }) =>
        Promise.resolve(wrapResponse(localStorageService.addTrackToPlaylist(playlistId, track))),

    removeTrack: (playlistId: string, trackId: string) => {
        localStorageService.removeTrackFromPlaylist(playlistId, trackId);
        return Promise.resolve(wrapResponse({ message: 'Track removed from playlist' }));
    },
};

// Likes API (local storage)
export const likesAPI = {
    getLikedSongs: () =>
        Promise.resolve(wrapResponse(localStorageService.getLikedSongs())),

    likeSong: (track: { trackId: string; title: string; artist: string; thumbnail?: string; duration?: string }) => {
        try {
            const result = localStorageService.likeSong(track);
            return Promise.resolve(wrapResponse(result));
        } catch (error) {
            return Promise.reject(error);
        }
    },

    unlikeSong: (trackId: string) => {
        localStorageService.unlikeSong(trackId);
        return Promise.resolve(wrapResponse({ message: 'Song unliked' }));
    },

    checkLiked: (trackId: string) =>
        Promise.resolve(wrapResponse({ isLiked: localStorageService.isLiked(trackId) })),
};

// History API (local storage)
export const historyAPI = {
    getHistory: (limit?: number) =>
        Promise.resolve(wrapResponse(localStorageService.getHistory(limit))),

    addToHistory: (track: { trackId: string; title: string; artist: string; thumbnail?: string; duration?: string }) =>
        Promise.resolve(wrapResponse(localStorageService.addToHistory(track))),

    deleteHistoryItem: (id: string) => {
        localStorageService.deleteHistoryItem(id);
        return Promise.resolve(wrapResponse({ message: 'History item deleted' }));
    },
};

// Data Management API (for export/import)
export const dataAPI = {
    exportData: () => {
        localStorageService.exportToFile();
    },

    importData: (file: File) =>
        localStorageService.importFromFile(file),

    clearData: () => {
        localStorageService.clearAllData();
    },

    getProfile: () =>
        Promise.resolve(wrapResponse(localStorageService.getProfile())),

    updateProfile: (name: string) => {
        localStorageService.updateProfile(name);
        return Promise.resolve(wrapResponse({ message: 'Profile updated' }));
    },
};
