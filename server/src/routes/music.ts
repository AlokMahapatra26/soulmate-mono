import { Router, Request, Response } from 'express';
import { Readable } from 'stream';
import { searchMusic, searchVideos, getStreamUrl, getMusicVideoId, getVideoDetails } from '../services/youtube.js';
import { getLyrics } from '../services/lyrics.js';

const router = Router();

// Search for music
router.get('/search', async (req: Request, res: Response) => {
    try {
        const query = req.query.q as string;

        if (!query) {
            res.status(400).json({ error: 'Query parameter "q" is required' });
            return;
        }

        const results = await searchMusic(query);
        res.json(results);
    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({ error: 'Failed to search music' });
    }
});

// Search for videos/podcasts
router.get('/search/videos', async (req: Request, res: Response) => {
    try {
        const query = req.query.q as string;

        if (!query) {
            res.status(400).json({ error: 'Query parameter "q" is required' });
            return;
        }

        const results = await searchVideos(query);
        res.json(results);
    } catch (error) {
        console.error('Video search error:', error);
        res.status(500).json({ error: 'Failed to search videos' });
    }
});

// Proxy stream to bypass IP blocking
router.get('/proxy/:videoId', async (req: Request, res: Response) => {
    try {
        const { videoId } = req.params;
        const streamInfo = await getStreamUrl(videoId);

        if (!streamInfo) {
            res.status(404).json({ error: 'Stream not found' });
            return;
        }

        const headers: HeadersInit = {};
        if (req.headers.range) {
            headers['Range'] = req.headers.range;
        }

        const response = await fetch(streamInfo.url, { headers });

        if (!response.ok) {
            res.status(response.status).end();
            return;
        }

        // Forward headers
        response.headers.forEach((val, key) => {
            if (key.toLowerCase() !== 'content-encoding') {
                res.setHeader(key, val);
            }
        });

        // Pipe body
        if (response.body) {
            // @ts-ignore
            Readable.fromWeb(response.body).pipe(res);
        } else {
            res.end();
        }
    } catch (error) {
        console.error('Proxy error:', error);
        res.status(500).end();
    }
});

// Get stream URL for a video
router.get('/stream/:videoId', async (req: Request, res: Response) => {
    try {
        const { videoId } = req.params;

        if (!videoId) {
            res.status(400).json({ error: 'Video ID is required' });
            return;
        }

        const protocol = req.headers['x-forwarded-proto'] || req.protocol;
        const host = req.get('host');
        const proxyUrl = `${protocol}://${host}/api/music/proxy/${videoId}`;

        res.json({
            url: proxyUrl,
            mimeType: 'audio/webm',
            bitrate: 128000
        });
    } catch (error) {
        console.error('Stream error:', error);
        res.status(500).json({ error: 'Failed to get stream' });
    }
});

// Get detailed video information
router.get('/details/:videoId', async (req: Request, res: Response) => {
    try {
        const { videoId } = req.params;

        if (!videoId) {
            res.status(400).json({ error: 'Video ID is required' });
            return;
        }

        const details = await getVideoDetails(videoId);

        if (!details) {
            res.status(404).json({ error: 'Video details not found' });
            return;
        }

        res.json(details);
    } catch (error) {
        console.error('Video details error:', error);
        res.status(500).json({ error: 'Failed to get video details' });
    }
});

// Get music video ID for a song
router.get('/video-id', async (req: Request, res: Response) => {
    try {
        const title = req.query.title as string;
        const artist = req.query.artist as string;

        if (!title || !artist) {
            res.status(400).json({ error: 'Title and artist parameters are required' });
            return;
        }

        const videoId = await getMusicVideoId(title, artist);

        if (!videoId) {
            res.status(404).json({ error: 'Music video not found' });
            return;
        }

        res.json({ videoId });
    } catch (error) {
        console.error('Video ID error:', error);
        res.status(500).json({ error: 'Failed to get video ID' });
    }
});

// Get lyrics for a track
router.get('/lyrics', async (req: Request, res: Response) => {
    try {
        const track = req.query.track as string;
        const artist = req.query.artist as string;
        const duration = req.query.duration ? parseInt(req.query.duration as string) : undefined;

        if (!track || !artist) {
            res.status(400).json({ error: 'Track and artist parameters are required' });
            return;
        }

        const lyrics = await getLyrics(track, artist, duration);

        if (!lyrics) {
            res.status(404).json({ error: 'Lyrics not found' });
            return;
        }

        res.json(lyrics);
    } catch (error) {
        console.error('Lyrics error:', error);
        res.status(500).json({ error: 'Failed to get lyrics' });
    }
});

// Download a track (proxied to avoid CORS)
router.get('/download/:videoId', async (req: Request, res: Response) => {
    try {
        const { videoId } = req.params;
        const title = req.query.title as string || 'track';
        const artist = req.query.artist as string || 'unknown';

        const streamInfo = await getStreamUrl(videoId);

        if (!streamInfo) {
            res.status(404).json({ error: 'Stream not found' });
            return;
        }

        const response = await fetch(streamInfo.url);

        if (!response.ok) {
            res.status(500).json({ error: 'Failed to fetch stream' });
            return;
        }

        const filename = `${title} - ${artist}.mp3`.replace(/[<>:"/\\|?*]/g, '');

        res.setHeader('Content-Type', streamInfo.mimeType);
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

        if (response.body) {
            // @ts-ignore - response.body is a ReadableStream
            const reader = response.body.getReader();

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                res.write(value);
            }
        }

        res.end();
    } catch (error) {
        console.error('Download error:', error);
        res.status(500).json({ error: 'Failed to download track' });
    }
});

export default router;


