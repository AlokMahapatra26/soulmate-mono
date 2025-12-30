'use client';

import { Github, Linkedin, Twitter, Instagram, Coffee, ExternalLink, Copy } from 'lucide-react';
import { useState } from 'react';

export default function DeveloperPage() {
    const [copied, setCopied] = useState(false);
    const upiId = '8849561649@upi';

    const copyUPI = () => {
        navigator.clipboard.writeText(upiId);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="developer-page">
            {/* Profile */}
            <section className="profile">
                <div className="avatar">
                    <img src="https://pbs.twimg.com/profile_images/1789694582051221504/EWt7z5dz_400x400.jpg" alt="Alok" />
                </div>
                <h1>Alok Mahapatra</h1>
                <p className="tagline">Developer of SoulMate</p>
            </section>

            {/* Social Links */}
            <section className="socials">
                <a href="https://github.com/AlokMahapatra26" target="_blank" rel="noopener noreferrer" title="GitHub">
                    <Github size={18} />
                </a>
                <a href="https://www.linkedin.com/in/alok-mahapatra/" target="_blank" rel="noopener noreferrer" title="LinkedIn">
                    <Linkedin size={18} />
                </a>
                <a href="https://x.com/aloktwts" target="_blank" rel="noopener noreferrer" title="Twitter">
                    <Twitter size={18} />
                </a>
                <a href="https://www.instagram.com/alok.torrent/" target="_blank" rel="noopener noreferrer" title="Instagram">
                    <Instagram size={18} />
                </a>
            </section>

            {/* Support */}
            <section className="support">
                <h2>Support</h2>
                <a href="https://buymeacoffee.com/alokmahapatra" target="_blank" rel="noopener noreferrer" className="bmc-btn">
                    <Coffee size={18} />
                    Buy me a coffee
                    <ExternalLink size={14} />
                </a>
                <div className="upi-section">
                    <p className="upi-label">Or pay via UPI</p>
                    <button className="upi-id" onClick={copyUPI}>
                        <span>{upiId}</span>
                        <Copy size={14} />
                        {copied && <span className="copied-toast">Copied!</span>}
                    </button>
                </div>
            </section>

            <style jsx>{`
                .developer-page {
                    height: 100%;
                    overflow-y: auto;
                    padding: 48px 24px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 32px;
                }

                .profile {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 12px;
                }

                .avatar {
                    width: 100px;
                    height: 100px;
                    border-radius: 50%;
                    overflow: hidden;
                    border: 3px solid var(--white-10);
                }

                .avatar img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }

                .profile h1 {
                    font-size: 24px;
                    font-weight: 600;
                    color: var(--white);
                    margin: 0;
                }

                .tagline {
                    font-size: 14px;
                    color: var(--white-50);
                    margin: 0;
                }

                .socials {
                    display: flex;
                    gap: 12px;
                }

                .socials a {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    background: var(--white-5);
                    border: 1px solid var(--white-10);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: var(--white-60);
                    transition: all 0.2s;
                }

                .socials a:hover {
                    background: var(--white-10);
                    color: var(--white);
                    transform: translateY(-2px);
                }

                .support {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 16px;
                    width: 100%;
                    max-width: 280px;
                }

                .support h2 {
                    font-size: 12px;
                    font-weight: 500;
                    color: var(--white-40);
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    margin: 0;
                }

                .bmc-btn {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    padding: 12px 20px;
                    background: #FFDD00;
                    color: #000;
                    border-radius: 10px;
                    font-size: 14px;
                    font-weight: 600;
                    text-decoration: none;
                    transition: all 0.2s;
                    width: 100%;
                    justify-content: center;
                }

                .bmc-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 24px rgba(255, 221, 0, 0.2);
                }

                .upi-section {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 8px;
                }

                .upi-label {
                    font-size: 12px;
                    color: var(--white-40);
                    margin: 0;
                }

                .upi-id {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 8px 14px;
                    background: var(--white-5);
                    border: 1px solid var(--white-10);
                    border-radius: 8px;
                    color: var(--white-70);
                    font-family: monospace;
                    font-size: 13px;
                    cursor: pointer;
                    transition: all 0.2s;
                    position: relative;
                }

                .upi-id:hover {
                    background: var(--white-10);
                    color: var(--white);
                }

                .copied-toast {
                    position: absolute;
                    top: -28px;
                    left: 50%;
                    transform: translateX(-50%);
                    background: #22c55e;
                    color: white;
                    padding: 4px 10px;
                    border-radius: 4px;
                    font-size: 11px;
                    font-family: var(--font);
                }
            `}</style>
        </div>
    );
}
