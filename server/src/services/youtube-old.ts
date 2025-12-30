import { Innertube } from 'youtubei.js';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

let innertube: Innertube | null = null;

export async function getInnerTube(): Promise<Innertube> {
    if (!innertube) {
        innertube = await Innertube.create({
            lang: 'en',
            location: 'US',
            retrieve_player: false,
        });
    }
    return innertube;
}

export interface TrackResult {
    id: string;
    title: string;
    artist: string;
    duration: string;
    thumbnail: string;
    thumbnailHD: string;
}

export async function searchMusic(query: string): Promise<TrackResult[]> {
    const yt = await getInnerTube();
    const results = await yt.music.search(query, { type: 'song' });

    const tracks: TrackResult[] = [];

    if (results.contents) {
        for (const section of results.contents) {
            if ('contents' in section && Array.isArray(section.contents)) {
                for (const item of section.contents) {
                    if (item.type === 'MusicResponsiveListItem') {
                        const track = item as any;

                        const videoId = track.id || track.overlay?.content?.video_id;
                        if (!videoId) continue;

                        const title = track.title ||
                            track.flex_columns?.[0]?.title?.text ||
                            'Unknown Title';

                        let artist = 'Unknown Artist';
                        if (track.artists && track.artists.length > 0) {
                            artist = track.artists.map((a: any) => a.name).join(', ');
                        } else if (track.flex_columns?.[1]?.title?.text) {
                            artist = track.flex_columns[1].title.text;
                        }

                        const duration = track.duration?.text ||
                            track.fixed_columns?.[0]?.title?.text ||
                            '0:00';

                        let thumbnail = '';
                        if (track.thumbnail?.contents?.[0]?.url) {
                            thumbnail = track.thumbnail.contents[0].url;
                        } else if (track.thumbnails?.[0]?.url) {
                            thumbnail = track.thumbnails[0].url;
                        }

                        // Generate HD thumbnail URL from YouTube
                        const thumbnailHD = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;

                        tracks.push({
                            id: videoId,
                            title: String(title),
                            artist: String(artist),
                            duration: String(duration),
                            thumbnail,
                            thumbnailHD,
                        });
                    }
                }
            }
        }
    }

    return tracks.slice(0, 20);
}

// Search YouTube videos (for podcasts, videos, etc.) - uses yt-dlp to search regular YouTube
export async function searchVideos(query: string): Promise<TrackResult[]> {
    try {
        // Use yt-dlp to search regular YouTube (not YouTube Music)
        // ytsearch20: searches for 20 results from regular YouTube
        const searchQuery = `ytsearch20:${query}`;
        const command = `yt-dlp --flat-playlist --dump-json "${searchQuery}" 2>/dev/null`;

        const { stdout } = await execAsync(command, { timeout: 30000 });

        const tracks: TrackResult[] = [];

        // Each line is a JSON object
        const lines = stdout.trim().split('\n').filter(line => line.trim());

        for (const line of lines) {
            try {
                const video = JSON.parse(line);

                if (!video.id) continue;

                // Format duration from seconds to mm:ss
                let duration = '0:00';
                if (video.duration) {
                    const mins = Math.floor(video.duration / 60);
                    const secs = video.duration % 60;
                    duration = `${mins}:${secs.toString().padStart(2, '0')}`;
                }

                const thumbnailHD = `https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`;

                tracks.push({
                    id: video.id,
                    title: video.title || 'Unknown Title',
                    artist: video.uploader || video.channel || 'Unknown Channel',
                    duration,
                    thumbnail: video.thumbnail || thumbnailHD,
                    thumbnailHD,
                });
            } catch (parseError) {
                // Skip invalid JSON lines
                continue;
            }
        }

        return tracks.slice(0, 20);
    } catch (error) {
        console.error('yt-dlp search error:', error);
        return [];
    }
}

// Get detailed video information
export interface VideoDetails {
    id: string;
    title: string;
    channelName: string;
    channelId: string;
    subscriberCount?: string;
    viewCount?: string;
    likeCount?: string;
    uploadDate?: string;
    description?: string;
    thumbnail: string;
    thumbnailHD: string;
    duration?: string;
}

export async function getVideoDetails(videoId: string): Promise<VideoDetails | null> {
    try {
        const yt = await getInnerTube();
        const info = await yt.getInfo(videoId);

        const videoInfo = info.basic_info as any;
        const channelInfo = videoInfo.channel as any;

        return {
            id: videoId,
            title: videoInfo.title || 'Unknown Title',
            channelName: channelInfo?.name || 'Unknown Channel',
            channelId: channelInfo?.id || '',
            subscriberCount: channelInfo?.subscriber_count?.toString() || undefined,
            viewCount: videoInfo.view_count?.toString() || undefined,
            likeCount: videoInfo.like_count?.toString() || undefined,
            uploadDate: videoInfo.publish_date || undefined,
            description: videoInfo.short_description || undefined,
            thumbnail: videoInfo.thumbnail?.[0]?.url || '',
            thumbnailHD: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
            duration: videoInfo.duration?.toString() || undefined,
        };
    } catch (error) {
        console.error('Error getting video details:', error);
        return null;
    }
}

// New function to find the actual music video for a song
export async function getMusicVideoId(title: string, artist: string): Promise<string | null> {
    try {
        const yt = await getInnerTube();

        // Search regular YouTube for the music video
        const searchQuery = `${artist} ${title} official video`;
        const results = await yt.search(searchQuery, { type: 'video' });

        if (results.videos && results.videos.length > 0) {
            const video = results.videos[0] as any;
            const videoId = video.id;

            if (videoId) {
                console.log(`Found music video for ${artist} - ${title}: ${videoId}`);
                return videoId;
            }
        }

        return null;
    } catch (error) {
        console.error('Error finding music video:', error);
        return null;
    }
}

export interface StreamInfo {
    url: string;
    mimeType: string;
    bitrate: number;
}

export async function getStreamUrl(videoId: string): Promise<StreamInfo | null> {
    try {
        const youtubeUrl = `https://www.youtube.com/watch?v=${videoId}`;

        console.log(`Getting stream URL via yt-dlp for: ${videoId}`);

        // Use yt-dlp to extract the audio stream URL
        // -f bestaudio[ext=m4a]/bestaudio: prefer m4a for browser compatibility
        // -g: print URL only
        // --no-warnings: suppress warnings
        const command = `yt-dlp -f "bestaudio[ext=m4a]/bestaudio[ext=webm]/bestaudio" -g --no-warnings "${youtubeUrl}"`;

        const { stdout, stderr } = await execAsync(command, { timeout: 60000 });

        if (stderr) {
            console.error('yt-dlp stderr:', stderr);
        }

        const url = stdout.trim();

        if (!url || !url.startsWith('http')) {
            console.error('Invalid URL from yt-dlp:', url);
            return null;
        }

        console.log('Successfully got stream URL via yt-dlp');

        // Detect mime type from URL
        let mimeType = 'audio/mp4';
        if (url.includes('mime=audio%2Fwebm') || url.includes('mime=audio/webm')) {
            mimeType = 'audio/webm';
        } else if (url.includes('mime=audio%2Fmp4') || url.includes('mime=audio/mp4')) {
            mimeType = 'audio/mp4';
        }

        return {
            url,
            mimeType,
            bitrate: 128000,
        };
    } catch (error: any) {
        console.error('yt-dlp error:', error.message);

        // Try fallback with any format
        try {
            const youtubeUrl = `https://www.youtube.com/watch?v=${videoId}`;
            const command = `yt-dlp -f best -g --no-warnings "${youtubeUrl}"`;

            const { stdout } = await execAsync(command, { timeout: 30000 });
            const url = stdout.trim();

            if (url && url.startsWith('http')) {
                console.log('Got stream URL via yt-dlp fallback');
                return {
                    url,
                    mimeType: 'video/mp4',
                    bitrate: 128000,
                };
            }
        } catch (fallbackError) {
            console.error('yt-dlp fallback also failed');
        }

        return null;
    }
}
