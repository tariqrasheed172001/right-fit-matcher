'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MatchResult } from '@/lib/api';
import { Loader2 } from 'lucide-react';
import dynamic from 'next/dynamic';

const ResultsDisplay = dynamic(() => import('@/components/ResultsDisplay'), {
    loading: () => (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
            <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
        </div>
    ),
});

interface RequestData {
    gmat: number;
    gpa: number;
    work_exp: number;
    target_program: string;
}

export default function ResultsPage() {
    const [results, setResults] = useState<MatchResult[]>([]);
    const [requestData, setRequestData] = useState<RequestData | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const storedResults = localStorage.getItem('last_results');
        const storedRequest = localStorage.getItem('last_request');

        if (!storedResults || !storedRequest) {
            router.push('/');
            return;
        }

        try {
            setResults(JSON.parse(storedResults));
            setRequestData(JSON.parse(storedRequest));
        } catch (error) {
            console.error('Failed to parse results:', error);
            router.push('/');
        } finally {
            setLoading(false);
        }
    }, [router]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
                    <p className="text-gray-600">Loading your results...</p>
                </div>
            </div>
        );
    }

    return <ResultsDisplay results={results} requestData={requestData} />;
}

