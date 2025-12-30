'use client';

import { useState, useRef, useEffect } from 'react';
import { dataAPI, likesAPI, playlistsAPI, historyAPI } from '@/lib/apiClient';
import { Download, Upload, Trash2, Heart, ListMusic, History, Database, HardDrive } from 'lucide-react';

export default function ProfilePage() {
    const [stats, setStats] = useState({ likedSongs: 0, playlists: 0, history: 0 });
    const [importing, setImporting] = useState(false);
    const [showClearConfirm, setShowClearConfirm] = useState(false);
    const [showSuccess, setShowSuccess] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        loadProfileData();
    }, []);

    const loadProfileData = async () => {
        try {
            const likedResponse = await likesAPI.getLikedSongs();
            const playlistsResponse = await playlistsAPI.getPlaylists();
            const historyResponse = await historyAPI.getHistory();

            setStats({
                likedSongs: likedResponse.data.length,
                playlists: playlistsResponse.data.length,
                history: historyResponse.data.length,
            });
        } catch (error) {
            console.error('Failed to load profile data:', error);
        }
    };

    const handleExport = () => {
        dataAPI.exportData();
        showSuccessMessage('Data exported!');
    };

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setImporting(true);
        try {
            await dataAPI.importData(file);
            await loadProfileData();
            showSuccessMessage('Data imported successfully!');
        } catch (error) {
            showSuccessMessage('Failed to import data');
        } finally {
            setImporting(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleClearData = () => {
        dataAPI.clearData();
        setShowClearConfirm(false);
        loadProfileData();
        showSuccessMessage('All data cleared');
    };

    const showSuccessMessage = (msg: string) => {
        setShowSuccess(msg);
        setTimeout(() => setShowSuccess(null), 2500);
    };

    return (
        <div className="data-page">
            {/* Success Toast */}
            {showSuccess && (
                <div className="success-toast">
                    {showSuccess}
                </div>
            )}

            {/* Header */}
            <div className="data-header">
                <Database size={20} />
                <h1>My Data</h1>
            </div>

            {/* Stats Row */}
            <div className="stats-row">
                <div className="stat-pill">
                    <Heart size={14} />
                    <span className="stat-num">{stats.likedSongs}</span>
                    <span className="stat-label">Liked</span>
                </div>
                <div className="stat-pill">
                    <ListMusic size={14} />
                    <span className="stat-num">{stats.playlists}</span>
                    <span className="stat-label">Playlists</span>
                </div>
                <div className="stat-pill">
                    <History size={14} />
                    <span className="stat-num">{stats.history}</span>
                    <span className="stat-label">History</span>
                </div>
            </div>

            {/* Storage Info */}
            <div className="info-card">
                <HardDrive size={16} />
                <div className="info-text">
                    <span className="info-title">Local Storage</span>
                    <span className="info-desc">Your data is stored in this browser only</span>
                </div>
            </div>

            {/* Actions */}
            <div className="actions-group">
                <button className="action-btn export" onClick={handleExport}>
                    <Download size={18} />
                    <span>Export</span>
                </button>

                <button
                    className="action-btn import"
                    onClick={handleImportClick}
                    disabled={importing}
                >
                    <Upload size={18} />
                    <span>{importing ? 'Importing...' : 'Import'}</span>
                </button>

                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept=".json"
                    style={{ display: 'none' }}
                />
            </div>

            {/* Clear Data */}
            <div className="clear-section">
                {!showClearConfirm ? (
                    <button
                        className="clear-btn"
                        onClick={() => setShowClearConfirm(true)}
                    >
                        <Trash2 size={16} />
                        <span>Clear All Data</span>
                    </button>
                ) : (
                    <div className="confirm-box">
                        <p>Delete everything?</p>
                        <div className="confirm-btns">
                            <button className="confirm-yes" onClick={handleClearData}>
                                Yes, Delete
                            </button>
                            <button className="confirm-no" onClick={() => setShowClearConfirm(false)}>
                                Cancel
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <style jsx>{`
                .data-page {
                    padding: 32px;
                    max-width: 400px;
                    margin: 0 auto;
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                }

                .success-toast {
                    position: fixed;
                    top: 80px;
                    left: 50%;
                    transform: translateX(-50%);
                    background: rgba(34, 197, 94, 0.95);
                    color: white;
                    padding: 10px 20px;
                    border-radius: 20px;
                    font-size: 13px;
                    font-weight: 500;
                    z-index: 100;
                    animation: toast-in 0.3s ease-out;
                    backdrop-filter: blur(10px);
                }

                @keyframes toast-in {
                    from { opacity: 0; transform: translateX(-50%) translateY(-10px); }
                    to { opacity: 1; transform: translateX(-50%) translateY(0); }
                }

                .data-header {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    color: var(--white);
                }

                .data-header h1 {
                    font-size: 22px;
                    font-weight: 600;
                    margin: 0;
                }

                .data-header svg {
                    color: var(--red);
                }

                .stats-row {
                    display: flex;
                    gap: 10px;
                }

                .stat-pill {
                    flex: 1;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 12px 14px;
                    background: var(--white-5);
                    border: 1px solid var(--white-10);
                    border-radius: 14px;
                    transition: all 0.2s;
                }

                .stat-pill:hover {
                    background: var(--white-10);
                    transform: translateY(-1px);
                }

                .stat-pill svg {
                    color: var(--red);
                    flex-shrink: 0;
                }

                .stat-num {
                    font-size: 16px;
                    font-weight: 600;
                    color: var(--white);
                }

                .stat-label {
                    font-size: 11px;
                    color: var(--white-50);
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }

                .info-card {
                    display: flex;
                    align-items: flex-start;
                    gap: 12px;
                    padding: 14px 16px;
                    background: linear-gradient(135deg, var(--white-5), transparent);
                    border: 1px solid var(--white-10);
                    border-radius: 14px;
                }

                .info-card svg {
                    color: var(--white-40);
                    flex-shrink: 0;
                    margin-top: 2px;
                }

                .info-text {
                    display: flex;
                    flex-direction: column;
                    gap: 2px;
                }

                .info-title {
                    font-size: 13px;
                    font-weight: 500;
                    color: var(--white);
                }

                .info-desc {
                    font-size: 12px;
                    color: var(--white-50);
                }

                .actions-group {
                    display: flex;
                    gap: 10px;
                }

                .action-btn {
                    flex: 1;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    padding: 14px;
                    border: none;
                    border-radius: 14px;
                    font-size: 14px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .action-btn.export {
                    background: var(--red);
                    color: white;
                }

                .action-btn.export:hover {
                    filter: brightness(1.1);
                    transform: translateY(-1px);
                }

                .action-btn.import {
                    background: var(--white-10);
                    color: var(--white);
                    border: 1px solid var(--white-10);
                }

                .action-btn.import:hover {
                    background: var(--white-20);
                    transform: translateY(-1px);
                }

                .action-btn:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                    transform: none;
                }

                .clear-section {
                    margin-top: 20px;
                    padding-top: 20px;
                    border-top: 1px solid var(--white-10);
                }

                .clear-btn {
                    width: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    padding: 12px;
                    background: transparent;
                    border: 1px solid rgba(239, 68, 68, 0.3);
                    border-radius: 12px;
                    color: var(--red);
                    font-size: 13px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .clear-btn:hover {
                    background: rgba(239, 68, 68, 0.1);
                }

                .confirm-box {
                    text-align: center;
                    padding: 16px;
                    background: rgba(239, 68, 68, 0.05);
                    border: 1px solid rgba(239, 68, 68, 0.2);
                    border-radius: 14px;
                }

                .confirm-box p {
                    margin: 0 0 12px 0;
                    color: var(--white);
                    font-size: 14px;
                    font-weight: 500;
                }

                .confirm-btns {
                    display: flex;
                    gap: 10px;
                }

                .confirm-yes {
                    flex: 1;
                    padding: 10px;
                    background: var(--red);
                    border: none;
                    border-radius: 10px;
                    color: white;
                    font-size: 13px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .confirm-yes:hover {
                    filter: brightness(1.1);
                }

                .confirm-no {
                    flex: 1;
                    padding: 10px;
                    background: var(--white-10);
                    border: 1px solid var(--white-10);
                    border-radius: 10px;
                    color: var(--white);
                    font-size: 13px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .confirm-no:hover {
                    background: var(--white-20);
                }
            `}</style>
        </div>
    );
}
