'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/api';
import { History, LogOut, User, TrendingUp, Award } from 'lucide-react';
import Link from 'next/link';
import { SearchCardSkeleton, StatsSkeleton } from '@/components/SkeletonLoader';

interface Search {
    id: number;
    user_id: number;
    query: {
        gmat?: number;
        gpa?: number;
        work_exp?: number;
        target_program?: string;
    };
    results: Array<{
        university_id: number;
        name: string;
        country?: string;
        program_type?: string;
        probability: number;
        compatibility: number;
        details: {
            s_gmat: number;
            s_gpa: number;
            s_work: number;
        };
    }>;
    created_at: string;
}

export default function ProfilePage() {
    const { user, logout, isAuthenticated } = useAuth();
    const [searches, setSearches] = useState<Search[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        if (!isAuthenticated) {
            return;
        }

        const fetchSearches = async () => {
            try {
                const response = await api.get(`/api/users/${user?.id}/searches`);
                setSearches(response.data.searches || []);
            } catch (error) {
                console.error('Failed to fetch searches:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchSearches();
    }, [isAuthenticated, user, router]);

    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-xl">
                                <User className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">{user?.name}</h1>
                                <p className="text-gray-600">{user?.email}</p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <Link
                                href="/"
                                className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                New Search
                            </Link>
                            <button
                                onClick={logout}
                                className="px-6 py-3 bg-red-50 text-red-600 font-semibold rounded-lg hover:bg-red-100 transition-colors flex items-center gap-2"
                            >
                                <LogOut className="w-5 h-5" />
                                Logout
                            </button>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {loading ? (
                        <>
                            <StatsSkeleton />
                            <StatsSkeleton />
                            <StatsSkeleton />
                        </>
                    ) : (
                        <>
                            <div className="bg-white rounded-xl p-6 shadow-lg">
                                <div className="flex items-center gap-3 mb-2">
                                    <History className="w-6 h-6 text-blue-600" />
                                    <span className="text-sm text-gray-600">Total Searches</span>
                                </div>
                                <p className="text-4xl font-bold text-gray-900">{searches.length}</p>
                            </div>
                            <div className="bg-white rounded-xl p-6 shadow-lg">
                                <div className="flex items-center gap-3 mb-2">
                                    <TrendingUp className="w-6 h-6 text-green-600" />
                                    <span className="text-sm text-gray-600">Profile Completion</span>
                                </div>
                                <p className="text-4xl font-bold text-gray-900">100%</p>
                            </div>
                            <div className="bg-white rounded-xl p-6 shadow-lg">
                                <div className="flex items-center gap-3 mb-2">
                                    <Award className="w-6 h-6 text-purple-600" />
                                    <span className="text-sm text-gray-600">Member Since</span>
                                </div>
                                <p className="text-4xl font-bold text-gray-900">Now</p>
                            </div>
                        </>
                    )}
                </div>

                {/* Saved Searches */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Saved Searches</h2>

                    {loading ? (
                        <div className="space-y-4">
                            <SearchCardSkeleton />
                            <SearchCardSkeleton />
                            <SearchCardSkeleton />
                        </div>
                    ) : searches.length === 0 ? (
                        <div className="text-center py-12">
                            <History className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-600 text-lg mb-4">No saved searches yet</p>
                            <Link
                                href="/"
                                className="inline-block px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all"
                            >
                                Start Your First Search
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {searches.map((search) => (
                                <div
                                    key={search.id}
                                    className="border-2 border-gray-200 rounded-xl p-6 hover:border-blue-300 hover:shadow-lg transition-all cursor-pointer"
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900 mb-2">
                                                {search.query?.target_program || 'MBA'} Program Search
                                            </h3>
                                            <div className="flex flex-wrap gap-2">
                                                {search.query?.gmat && (
                                                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                                                        GMAT: {search.query.gmat}
                                                    </span>
                                                )}
                                                {search.query?.gpa && (
                                                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                                                        GPA: {search.query.gpa}
                                                    </span>
                                                )}
                                                {search.query?.work_exp && (
                                                    <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold">
                                                        Exp: {search.query.work_exp}yr
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm text-gray-500">
                                                {new Date(search.created_at).toLocaleDateString()}
                                            </p>
                                            <button
                                                onClick={() => {
                                                    localStorage.setItem('last_results', JSON.stringify(search.results));
                                                    localStorage.setItem('last_request', JSON.stringify(search.query));
                                                    router.push('/results');
                                                }}
                                                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold"
                                            >
                                                View Results
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

