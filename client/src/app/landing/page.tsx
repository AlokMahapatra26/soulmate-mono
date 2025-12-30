'use client';

import { useRouter } from 'next/navigation';
import { Music, FileText, ListMusic, Download } from 'lucide-react';

export default function LandingPage() {
    const router = useRouter();

    return (
        <div className="landing-container">
            <div className="landing-content">
                {/* Logo/Brand */}
                <div className="landing-brand">
                    <h1 className="landing-logo">
                        SOUL<span className="logo-accent">MATE</span>
                    </h1>
                    <p className="landing-tagline">Your Premium Music Companion</p>
                </div>

                {/* Features */}
                <div className="landing-features">
                    <div className="feature-card">
                        <div className="feature-icon">
                            <Music size={48} strokeWidth={1.5} />
                        </div>
                        <h3>Stream Millions of Songs</h3>
                        <p>Access a vast library of music from around the world</p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon">
                            <FileText size={48} strokeWidth={1.5} />
                        </div>
                        <h3>Synced Lyrics</h3>
                        <p>Sing along with real-time synchronized lyrics</p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon">
                            <ListMusic size={48} strokeWidth={1.5} />
                        </div>
                        <h3>Create Playlists</h3>
                        <p>Organize your favorite tracks into custom playlists</p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon">
                            <Download size={48} strokeWidth={1.5} />
                        </div>
                        <h3>Portable Data</h3>
                        <p>Export and import your library to share with friends</p>
                    </div>
                </div>

                {/* CTA Buttons */}
                <div className="landing-cta">
                    <button
                        className="cta-button cta-primary"
                        onClick={() => router.push('/app')}
                    >
                        Start Listening
                    </button>
                </div>

                {/* Footer */}
                <div className="landing-footer">
                    <p>Premium minimal music player • No account needed</p>
                </div>
            </div>
        </div>
    );
}
