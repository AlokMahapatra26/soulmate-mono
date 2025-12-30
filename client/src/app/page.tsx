'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RootPage() {
    const router = useRouter();

    useEffect(() => {
        // No auth needed - redirect directly to the app
        router.replace('/app');
    }, [router]);

    return (
        <div className="loading-container">
            <div className="loading-spinner" />
        </div>
    );
}
