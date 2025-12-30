'use client';

import Link from 'next/link';
import { Infinity, Play, Github, Database, ArrowDownUp, Download, Video } from 'lucide-react';

export default function HomePage() {
    return (
        <>
            <div className="page">
                {/* Nav */}
                <nav className="nav">
                    <Link href="/" className="logo">
                        <Infinity className="icon" />
                        <span className="name">Soulmate</span>
                    </Link>
                </nav>

                <div className="separator"></div>

                {/* Hero */}
                <main className="hero">
                    <div className="hero-content">
                        <p className="tag">Open source music player</p>
                        <h1>Listen freely.<br />Stay private.</h1>
                        <p className="desc">
                            No accounts. No tracking. Just music.
                        </p>
                        <div className="buttons">
                            <Link href="/app" className="btn primary">
                                <Play className="btn-icon" />
                                <span>Open App</span>
                            </Link>
                            <a href="https://github.com/AlokMahapatra26/Soulmate-mono" target="_blank" rel="noopener noreferrer" className="btn secondary">
                                <Github className="btn-icon" />
                                <span>Source</span>
                            </a>
                        </div>
                    </div>

                    <div className="hero-image-container">
                        <img src="/music_listening.png" alt="Music Listening" className="hero-image" />
                        <div className="glow"></div>
                    </div>
                </main>

                <div className="separator faded"></div>

                {/* Features Grid - 3 Cards */}
                <section className="features-section">
                    <div className="features-grid">
                        {/* Card 1: Data */}
                        <div className="feature-card">
                            <div className="card-header">
                                <div className="icon-box">
                                    <Database size={18} />
                                </div>
                                <h3>Your Data, Your File</h3>
                            </div>
                            <p>
                                Everything is stored in a single <span className="highlight">.json</span> file on your device.
                            </p>
                            <div className="card-footer">
                                <ArrowDownUp size={14} className="footer-icon" />
                                <span>Easy Import / Export</span>
                            </div>
                        </div>

                        {/* Card 2: Download */}
                        <div className="feature-card">
                            <div className="card-header">
                                <div className="icon-box">
                                    <Download size={18} />
                                </div>
                                <h3>Download Music</h3>
                            </div>
                            <p>
                                Save your favorite tracks locally for <span className="highlight">offline listening</span> anytime.
                            </p>
                            <div className="card-footer">
                                <Download size={14} className="footer-icon" />
                                <span>High Quality Audio</span>
                            </div>
                        </div>

                        {/* Card 3: Video */}
                        <div className="feature-card">
                            <div className="card-header">
                                <div className="icon-box">
                                    <Video size={18} />
                                </div>
                                <h3>Watch Videos</h3>
                            </div>
                            <p>
                                Switch to <span className="highlight">Video Mode</span> instantly to watch music videos or podcasts.
                            </p>
                            <div className="card-footer">
                                <Video size={14} className="footer-icon" />
                                <span>Seamless Playback</span>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="separator"></div>

                {/* Footer */}
                <footer className="footer">
                    <span>© 2025 Soulmate</span>
                </footer>
            </div>

            <style jsx global>{`
                /* Global Reset */
                html, body {
                    margin: 0;
                    padding: 0;
                    background: #000;
                    color: #fff;
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                }

                .page {
                    min-height: 100vh;
                    display: flex;
                    flex-direction: column;
                }

                .separator {
                    height: 1px;
                    background: linear-gradient(
                        90deg,
                        transparent 0%,
                        rgba(255, 255, 255, 0.08) 20%,
                        rgba(255, 255, 255, 0.08) 80%,
                        transparent 100%
                    );
                    width: 100%;
                    max-width: 1200px;
                    margin: 0 auto;
                }

                .separator.faded {
                    background: linear-gradient(
                        90deg,
                        transparent 0%,
                        rgba(255, 255, 255, 0.04) 30%,
                        rgba(255, 255, 255, 0.04) 70%,
                        transparent 100%
                    );
                }

                .nav {
                    padding: 24px 32px;
                    display: flex;
                    justify-content: center;
                }

                .logo {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    text-decoration: none;
                }

                .logo .icon {
                    width: 26px;
                    height: 26px;
                    color: #ef4444;
                }

                .logo .name {
                    font-size: 18px;
                    font-weight: 600;
                    color: #fff;
                    letter-spacing: -0.02em;
                }

                .hero {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    text-align: center;
                    padding: 60px 24px;
                    width: 100%;
                    max-width: 1000px;
                    margin: 0 auto;
                    gap: 60px;
                }

                @media (min-width: 768px) {
                    .hero {
                        flex-direction: row;
                        text-align: left;
                        justify-content: space-between;
                        padding: 80px 40px;
                    }
                    
                    .hero-content {
                        max-width: 400px;
                        align-items: flex-start;
                    }

                    .hero-image-container {
                        max-width: 450px;
                    }
                }

                .hero-content {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    z-index: 2;
                }

                @media (min-width: 768px) {
                    .hero-content {
                        align-items: flex-start;
                    }
                }

                .tag {
                    font-size: 12px;
                    color: rgba(255,255,255,0.4);
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    margin: 0 0 20px;
                }

                .hero h1 {
                    font-size: 48px;
                    font-weight: 700;
                    line-height: 1.1;
                    letter-spacing: -0.03em;
                    margin: 0 0 20px;
                }

                .desc {
                    font-size: 16px;
                    color: rgba(255,255,255,0.5);
                    line-height: 1.6;
                    margin: 0 0 32px;
                }

                .hero-image-container {
                    position: relative;
                    width: 100%;
                    max-width: 320px;
                    display: flex;
                    justify-content: center;
                }

                .hero-image {
                    width: 100%;
                    height: auto;
                    object-fit: contain;
                    position: relative;
                    z-index: 2;
                    filter: drop-shadow(0 20px 40px rgba(0,0,0,0.5));
                    animation: float 6s ease-in-out infinite;
                }

                .glow {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    width: 120%;
                    height: 120%;
                    background: radial-gradient(circle, rgba(239, 68, 68, 0.15) 0%, rgba(0,0,0,0) 70%);
                    z-index: 1;
                    filter: blur(40px);
                }

                @keyframes float {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-15px); }
                }

                .buttons {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }

                .btn {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 12px 24px;
                    border-radius: 12px;
                    font-size: 14px;
                    font-weight: 500;
                    text-decoration: none;
                    transition: all 0.2s;
                }

                .btn:hover {
                    transform: translateY(-2px);
                }

                .btn:hover .btn-icon {
                    animation: wiggle 0.35s ease;
                }

                .btn.primary {
                    background: #ef4444;
                    color: #fff;
                    box-shadow: 0 8px 20px -4px rgba(239, 68, 68, 0.3);
                }

                .btn.primary:hover {
                    box-shadow: 0 12px 24px -4px rgba(239, 68, 68, 0.4);
                }

                .btn.secondary {
                    background: rgba(255,255,255,0.08);
                    color: #fff;
                    border: 1px solid rgba(255,255,255,0.05);
                }

                .btn.secondary:hover {
                    background: rgba(255,255,255,0.12);
                }

                .btn-icon {
                    width: 16px;
                    height: 16px;
                }

                .btn.primary .btn-icon {
                    fill: currentColor;
                }

                @keyframes wiggle {
                    0%, 100% { transform: rotate(0); }
                    25% { transform: rotate(-10deg); }
                    75% { transform: rotate(10deg); }
                }

                /* Features Grid Section */
                .features-section {
                    padding: 60px 24px;
                    display: flex;
                    justify-content: center;
                }

                .features-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                    gap: 24px;
                    width: 100%;
                    max-width: 1000px;
                }

                .feature-card {
                    /* Aesthetic Gradient Background */
                    background: linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%);
                    padding: 24px;
                    border-radius: 20px;
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                    transition: all 0.3s ease;
                    position: relative;
                    overflow: hidden;
                    border: none; /* Explicitly removed border */
                }

                /* Subtle top highlight instead of border */
                .feature-card::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 1px;
                    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
                    opacity: 0.5;
                }

                .feature-card:hover {
                    transform: translateY(-4px);
                    background: linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%);
                    box-shadow: 0 10px 40px -10px rgba(0,0,0,0.5);
                }

                .card-header {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }

                .icon-box {
                    width: 36px;
                    height: 36px;
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: rgba(239, 68, 68, 0.1);
                    color: #ef4444;
                }

                .feature-card h3 {
                    font-size: 16px;
                    font-weight: 600;
                    margin: 0;
                }

                .feature-card p {
                    font-size: 14px;
                    color: rgba(255,255,255,0.5);
                    line-height: 1.6;
                    margin: 0;
                    flex: 1;
                }

                .highlight {
                    font-family: monospace;
                    padding: 2px 6px;
                    border-radius: 4px;
                    font-size: 13px;
                    color: #ef4444;
                    background: rgba(239, 68, 68, 0.1);
                }

                .card-footer {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-size: 12px;
                    color: rgba(255,255,255,0.4);
                    padding-top: 16px;
                    border-top: 1px solid rgba(255,255,255,0.05);
                }

                .footer-icon {
                    color: #ef4444;
                }

                .footer {
                    padding: 32px;
                    text-align: center;
                    font-size: 12px;
                    color: rgba(255,255,255,0.2);
                    margin-top: auto;
                }

                @media (max-width: 480px) {
                    .hero h1 {
                        font-size: 36px;
                    }

                    .buttons {
                        flex-direction: column;
                        width: 100%;
                    }

                    .btn {
                        width: 100%;
                        justify-content: center;
                    }
                }
            `}</style>
        </>
    );
}
