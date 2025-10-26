'use client';

import { MatchResult } from '@/lib/api';
import { useRouter } from 'next/navigation';
import {
    Trophy,
    TrendingUp,
    Target,
    ArrowLeft,
    School,
    Globe,
    CheckCircle2,
    Download,
    RefreshCw,
} from 'lucide-react';
import { useState } from 'react';

interface ResultsDisplayProps {
    results: MatchResult[];
    requestData: {
        gmat: number;
        gpa: number;
        work_exp: number;
        target_program: string;
    } | null;
}

export default function ResultsDisplay({ results, requestData }: ResultsDisplayProps) {
    const router = useRouter();
    const [selectedCard, setSelectedCard] = useState<number | null>(null);

    const exportToCSV = () => {
        const timestamp = new Date().toISOString();
        const profileInfo = [];

        if (requestData) {
            profileInfo.push('Profile Information');
            profileInfo.push(`GMAT Score,${requestData.gmat}`);
            profileInfo.push(`GPA,${requestData.gpa}`);
            profileInfo.push(`Work Experience (years),${requestData.work_exp}`);
            profileInfo.push(`Target Program,${requestData.target_program}`);
            profileInfo.push(`Generated Date,${timestamp}`);
            profileInfo.push('');
        }

        const headers = ['Rank', 'University Name', 'Admission Probability (%)', 'Compatibility (%)', 'GMAT Match (%)', 'GPA Match (%)', 'Work Experience Match (%)'];
        const csvRows = [...profileInfo, headers.join(',')];

        results.forEach((match, index) => {
            const row = [
                index + 1,
                `"${match.name}"`,
                (match.probability * 100).toFixed(2),
                (match.compatibility * 100).toFixed(2),
                (match.details.s_gmat * 100).toFixed(2),
                (match.details.s_gpa * 100).toFixed(2),
                (match.details.s_work * 100).toFixed(2),
            ];
            csvRows.push(row.join(','));
        });

        const csvContent = csvRows.join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);

        link.setAttribute('href', url);
        link.setAttribute('download', `university-matches-${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const getProbabilityColor = (probability: number) => {
        if (probability >= 0.8) return 'text-green-600 bg-green-100 border-green-300';
        if (probability >= 0.6) return 'text-blue-600 bg-blue-100 border-blue-300';
        if (probability >= 0.4) return 'text-yellow-600 bg-yellow-100 border-yellow-300';
        return 'text-orange-600 bg-orange-100 border-orange-300';
    };

    const getProbabilityLabel = (probability: number) => {
        if (probability >= 0.8) return 'Excellent Match';
        if (probability >= 0.6) return 'Good Match';
        if (probability >= 0.4) return 'Fair Match';
        return 'Reach Match';
    };

    const getPriorityBadge = (index: number) => {
        if (index === 0) return { label: 'TOP MATCH', color: 'from-yellow-400 to-orange-500' };
        if (index === 1) return { label: 'GREAT FIT', color: 'from-green-400 to-emerald-500' };
        if (index === 2) return { label: 'STRONG', color: 'from-blue-400 to-cyan-500' };
        return null;
    };

    const topMatch = results[0];

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 md:py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors group"
                    >
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        <span className="font-medium">Back to Search</span>
                    </button>

                    <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-gray-100">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                                    🎓 Your University Matches
                                </h1>
                                <p className="text-gray-600 text-lg">
                                    Found <span className="font-bold text-blue-600">{results.length}</span> universities matching your profile
                                </p>
                            </div>
                            {requestData && (
                                <div className="flex flex-wrap gap-2">
                                    <span className="px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-semibold border border-blue-200">
                                        GMAT: {requestData.gmat}
                                    </span>
                                    <span className="px-4 py-2 bg-green-50 text-green-700 rounded-full text-sm font-semibold border border-green-200">
                                        GPA: {requestData.gpa}
                                    </span>
                                    <span className="px-4 py-2 bg-purple-50 text-purple-700 rounded-full text-sm font-semibold border border-purple-200">
                                        Exp: {requestData.work_exp}yr
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {topMatch && (
                    <div className="mb-8 animate-fade-in">
                        <div className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-2xl shadow-2xl p-6 md:p-8 border-4 border-white transform hover:scale-105 transition-transform duration-300">
                            <div className="flex flex-col md:flex-row md:items-start gap-4">
                                <div className="bg-white p-4 rounded-xl shadow-lg flex-shrink-0">
                                    <Trophy className="w-12 h-12 text-yellow-600" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="px-4 py-1 bg-white/90 text-orange-600 rounded-full text-sm font-black uppercase tracking-wide">
                                            🏆 Top Match
                                        </span>
                                    </div>
                                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
                                        {topMatch.name}
                                    </h2>
                                    <div className="flex flex-wrap items-center gap-4 text-white/90">
                                        <div className="flex items-center gap-2">
                                            <Target className="w-5 h-5" />
                                            <span className="font-bold text-lg">
                                                {(topMatch.probability * 100).toFixed(1)}%
                                            </span>
                                            <span className="text-sm">Admission Probability</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <TrendingUp className="w-5 h-5" />
                                            <span className="font-bold text-lg">
                                                {(topMatch.compatibility * 100).toFixed(1)}%
                                            </span>
                                            <span className="text-sm">Compatibility</span>
                                        </div>
                                    </div>
                                    <div className="mt-4 flex flex-wrap gap-2">
                                        <div className="bg-white/20 backdrop-blur px-3 py-1 rounded-full text-white text-xs font-semibold">
                                            GMAT: {(topMatch.details.s_gmat * 100).toFixed(1)}%
                                        </div>
                                        <div className="bg-white/20 backdrop-blur px-3 py-1 rounded-full text-white text-xs font-semibold">
                                            GPA: {(topMatch.details.s_gpa * 100).toFixed(1)}%
                                        </div>
                                        <div className="bg-white/20 backdrop-blur px-3 py-1 rounded-full text-white text-xs font-semibold">
                                            Experience: {(topMatch.details.s_work * 100).toFixed(1)}%
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    {results.map((match, index) => {
                        const badge = getPriorityBadge(index);
                        return (
                            <div
                                key={match.university_id}
                                className={`bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 ${selectedCard === match.university_id
                                    ? 'border-blue-500 ring-4 ring-blue-200'
                                    : 'border-gray-100'
                                    } overflow-hidden cursor-pointer`}
                                onClick={() => setSelectedCard(selectedCard === match.university_id ? null : match.university_id)}
                            >
                                <div className="p-6 border-b border-gray-100 bg-gradient-to-br from-gray-50 to-white">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-lg ${getProbabilityColor(match.probability)}`}>
                                                <School className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                                                    Rank #{index + 1}
                                                </p>
                                            </div>
                                        </div>
                                        {badge && (
                                            <div className={`bg-gradient-to-r ${badge.color} text-white px-3 py-1 rounded-full shadow-md`}>
                                                <span className="text-xs font-black">{badge.label}</span>
                                            </div>
                                        )}
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-2">
                                        {match.name}
                                    </h3>
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <Globe className="w-4 h-4" />
                                        <span className="text-sm">International Program</span>
                                    </div>
                                </div>

                                <div className="p-6 space-y-4">
                                    {/* Admission Probability */}
                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm font-semibold text-gray-700">Admission Probability</span>
                                            <span className={`text-lg font-bold ${match.probability >= 0.7 ? 'text-green-600' :
                                                match.probability >= 0.5 ? 'text-blue-600' : 'text-orange-600'
                                                }`}>
                                                {(match.probability * 100).toFixed(1)}%
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                                            <div
                                                className={`h-full rounded-full transition-all duration-500 ${match.probability >= 0.7
                                                    ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                                                    : match.probability >= 0.5
                                                        ? 'bg-gradient-to-r from-blue-500 to-cyan-500'
                                                        : 'bg-gradient-to-r from-orange-500 to-red-500'
                                                    }`}
                                                style={{ width: `${match.probability * 100}%` }}
                                            />
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1 font-medium">
                                            {getProbabilityLabel(match.probability)}
                                        </p>
                                    </div>

                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm font-semibold text-gray-700">Compatibility</span>
                                            <span className="text-lg font-bold text-purple-600">
                                                {(match.compatibility * 100).toFixed(1)}%
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500"
                                                style={{ width: `${match.compatibility * 100}%` }}
                                            />
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-gray-100 space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-gray-600 flex items-center gap-1.5 font-medium">
                                                <TrendingUp className="w-3.5 h-3.5 text-blue-500" />
                                                GMAT Match
                                            </span>
                                            <span className="text-xs font-bold text-blue-600">
                                                {(match.details.s_gmat * 100).toFixed(1)}%
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-gray-600 flex items-center gap-1.5 font-medium">
                                                <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                                                GPA Match
                                            </span>
                                            <span className="text-xs font-bold text-green-600">
                                                {(match.details.s_gpa * 100).toFixed(1)}%
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-gray-600 flex items-center gap-1.5 font-medium">
                                                <Target className="w-3.5 h-3.5 text-orange-500" />
                                                Experience Match
                                            </span>
                                            <span className="text-xs font-bold text-orange-600">
                                                {(match.details.s_work * 100).toFixed(1)}%
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="mt-12 text-center">
                    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
                        <button
                            onClick={() => router.push('/')}
                            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-gray-700 font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 border-2 border-gray-300 hover:border-gray-400"
                        >
                            <RefreshCw className="w-5 h-5" />
                            Search Again
                        </button>
                        <button
                            onClick={exportToCSV}
                            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                        >
                            <Download className="w-5 h-5" />
                            Export to CSV
                        </button>
                    </div>
                    <p className="text-sm text-gray-500">
                        Your results are saved. Click &ldquo;Search Again&rdquo; to find more matches!
                    </p>
                </div>
            </div>
        </div>
    );
}
