// LRCLIB - Free synced lyrics API
const LRCLIB_API = 'https://lrclib.net/api';

export interface LyricLine {
    time: number; // Time in seconds
    text: string;
}

export interface LyricsResult {
    id: number;
    trackName: string;
    artistName: string;
    albumName: string;
    duration: number;
    instrumental: boolean;
    plainLyrics: string | null;
    syncedLyrics: LyricLine[] | null;
}

// Parse LRC format to array of timed lyrics
function parseLRC(lrc: string): LyricLine[] {
    const lines: LyricLine[] = [];
    const lrcLines = lrc.split('\n');

    for (const line of lrcLines) {
        // Match [mm:ss.xx] or [mm:ss] format
        const match = line.match(/\[(\d{2}):(\d{2})(?:\.(\d{2,3}))?\](.*)/);
        if (match) {
            const minutes = parseInt(match[1], 10);
            const seconds = parseInt(match[2], 10);
            const milliseconds = match[3] ? parseInt(match[3].padEnd(3, '0'), 10) : 0;
            const text = match[4].trim();

            if (text) {
                const time = minutes * 60 + seconds + milliseconds / 1000;
                lines.push({ time, text });
            }
        }
    }

    // Sort by time
    lines.sort((a, b) => a.time - b.time);
    return lines;
}

export async function getLyrics(
    trackName: string,
    artistName: string,
    duration?: number
): Promise<LyricsResult | null> {
    try {
        // Build search URL
        const params = new URLSearchParams({
            track_name: trackName,
            artist_name: artistName,
        });

        if (duration) {
            params.append('duration', duration.toString());
        }

        console.log(`Fetching lyrics for: ${trackName} by ${artistName}`);

        const response = await fetch(`${LRCLIB_API}/get?${params}`, {
            headers: {
                'User-Agent': 'Soulmate Music Player/1.0',
            },
        });

        if (!response.ok) {
            if (response.status === 404) {
                console.log('Lyrics not found, trying search...');
                return await searchLyrics(trackName, artistName);
            }
            console.error(`LRCLIB returned status ${response.status}`);
            return null;
        }

        const data = await response.json();

        return {
            id: data.id,
            trackName: data.trackName,
            artistName: data.artistName,
            albumName: data.albumName || '',
            duration: data.duration,
            instrumental: data.instrumental || false,
            plainLyrics: data.plainLyrics || null,
            syncedLyrics: data.syncedLyrics ? parseLRC(data.syncedLyrics) : null,
        };
    } catch (error) {
        console.error('Error fetching lyrics:', error);
        return null;
    }
}

async function searchLyrics(
    trackName: string,
    artistName: string
): Promise<LyricsResult | null> {
    try {
        const params = new URLSearchParams({
            q: `${trackName} ${artistName}`,
        });

        const response = await fetch(`${LRCLIB_API}/search?${params}`, {
            headers: {
                'User-Agent': 'Soulmate Music Player/1.0',
            },
        });

        if (!response.ok) {
            return null;
        }

        const results = await response.json();

        if (!results || results.length === 0) {
            console.log('No lyrics found in search');
            return null;
        }

        // Get the first result
        const first = results[0];

        return {
            id: first.id,
            trackName: first.trackName,
            artistName: first.artistName,
            albumName: first.albumName || '',
            duration: first.duration,
            instrumental: first.instrumental || false,
            plainLyrics: first.plainLyrics || null,
            syncedLyrics: first.syncedLyrics ? parseLRC(first.syncedLyrics) : null,
        };
    } catch (error) {
        console.error('Error searching lyrics:', error);
        return null;
    }
}
