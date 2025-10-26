'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { matchingApi, MatchRequest } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, Sparkles, TrendingUp, GraduationCap, Info, User, UserCircle } from 'lucide-react';
import Link from 'next/link';

interface MatchFormData {
    gmat: number;
    gpa: number;
    work_exp: number;
    target_program: string;
}

export default function MatchForm() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showTips, setShowTips] = useState(false);
    const router = useRouter();
    const { isAuthenticated, user, logout } = useAuth();

    const { register, handleSubmit, formState: { errors }, watch } = useForm<MatchFormData>({
        defaultValues: {
            gmat: 700,
            gpa: 3.5,
            work_exp: 3,
            target_program: 'MBA',
        },
    });

    const onSubmit = async (data: MatchFormData) => {
        setLoading(true);
        setError(null);

        try {
            const request: MatchRequest = {
                gmat: Number(data.gmat),
                gpa: Number(data.gpa),
                work_exp: Number(data.work_exp),
                target_program: data.target_program,
                top_k: 20,
                user_id: isAuthenticated && user ? user.id : undefined,
            };

            const response = await matchingApi.findMatches(request);

            localStorage.setItem('last_results', JSON.stringify(response.data.matches));
            localStorage.setItem('last_request', JSON.stringify(data));

            router.push('/results');
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to find matches. Please try again.';
            setError(errorMessage);
            console.error('Match error:', err);
        } finally {
            setLoading(false);
        }
    };

    const gmat = watch('gmat');
    const gpa = watch('gpa');
    const work_exp = watch('work_exp');

    const getGMATLevel = (score: number) => {
        if (score >= 750) return { label: 'Excellent', color: 'text-green-600 bg-green-100' };
        if (score >= 700) return { label: 'Strong', color: 'text-blue-600 bg-blue-100' };
        if (score >= 650) return { label: 'Good', color: 'text-yellow-600 bg-yellow-100' };
        return { label: 'Fair', color: 'text-orange-600 bg-orange-100' };
    };

    const getGPALevel = (gpa: number) => {
        if (gpa >= 3.7) return { label: 'Excellent', color: 'text-green-600 bg-green-100' };
        if (gpa >= 3.3) return { label: 'Strong', color: 'text-blue-600 bg-blue-100' };
        if (gpa >= 2.8) return { label: 'Good', color: 'text-yellow-600 bg-yellow-100' };
        return { label: 'Fair', color: 'text-orange-600 bg-orange-100' };
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10 border border-gray-100">
                {/* Auth Status Bar */}
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
                    {isAuthenticated ? (
                        <div className="flex items-center gap-3">
                            <div className="bg-green-100 p-2 rounded-lg">
                                <User className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Signed in as</p>
                                <p className="font-semibold text-gray-900">{user?.name}</p>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Info className="w-4 h-4" />
                            <span>Sign up to save your searches</span>
                        </div>
                    )}
                    <div className="flex gap-2">
                        {isAuthenticated ? (
                            <>
                                <Link
                                    href="/profile"
                                    className="flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    <UserCircle className="w-4 h-4" />
                                    Profile
                                </Link>
                                <button
                                    onClick={logout}
                                    className="px-4 py-2 text-sm font-semibold text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    className="px-4 py-2 text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors"
                                >
                                    Sign In
                                </Link>
                                <Link
                                    href="/signup"
                                    className="px-4 py-2 text-sm font-semibold bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all"
                                >
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </div>
                </div>

                {/* Header */}
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-4">
                        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-2xl animate-pulse">
                            <Sparkles className="w-12 h-12 text-white" />
                        </div>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
                        Find Your Perfect University
                    </h1>
                    <p className="text-gray-600 text-lg">
                        Enter your profile to discover universities that match your background
                    </p>
                    <button
                        type="button"
                        onClick={() => setShowTips(!showTips)}
                        className="mt-4 inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 transition-colors"
                    >
                        <Info className="w-4 h-4" />
                        {showTips ? 'Hide Tips' : 'Show Tips'}
                    </button>
                </div>

                {/* Tips Section */}
                {showTips && (
                    <div className="mb-8 bg-blue-50 border border-blue-200 rounded-xl p-6 space-y-3">
                        <div className="flex items-start gap-3">
                            <GraduationCap className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                            <div>
                                <h3 className="font-semibold text-blue-900 mb-1">Profile Tips</h3>
                                <ul className="text-sm text-blue-800 space-y-1">
                                    <li>• GMAT scores above 700 are considered competitive</li>
                                    <li>• GPA above 3.5 is typically expected for top programs</li>
                                    <li>• 3+ years of work experience is preferred for MBA programs</li>
                                    <li>• The algorithm considers all factors for accurate matching</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* GMAT Score */}
                    <div className="space-y-2">
                        <label htmlFor="gmat" className="block text-sm font-semibold text-gray-700">
                            GMAT Score
                            <span className="text-gray-400 ml-2">(0-800)</span>
                        </label>
                        <input
                            id="gmat"
                            type="number"
                            min="0"
                            max="800"
                            {...register('gmat', {
                                required: 'GMAT score is required',
                                min: { value: 0, message: 'Must be at least 0' },
                                max: { value: 800, message: 'Must be at most 800' },
                            })}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-lg font-semibold"
                            placeholder="700"
                        />
                        {errors.gmat && (
                            <p className="text-red-500 text-sm">{errors.gmat.message}</p>
                        )}
                        {gmat && (
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-gray-500">Score Level</span>
                                    <span className={`text-xs px-2 py-1 rounded-full font-semibold ${getGMATLevel(gmat).color}`}>
                                        {getGMATLevel(gmat).label}
                                    </span>
                                </div>
                                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
                                        style={{ width: `${Math.min((gmat / 800) * 100, 100)}%` }}
                                    />
                                </div>
                                <p className="text-xs text-gray-500 mt-1">{gmat} / 800 points</p>
                            </div>
                        )}
                    </div>

                    {/* GPA */}
                    <div className="space-y-2">
                        <label htmlFor="gpa" className="block text-sm font-semibold text-gray-700">
                            GPA
                            <span className="text-gray-400 ml-2">(0.0-4.0)</span>
                        </label>
                        <input
                            id="gpa"
                            type="number"
                            step="0.1"
                            min="0"
                            max="4"
                            {...register('gpa', {
                                required: 'GPA is required',
                                min: { value: 0, message: 'Must be at least 0.0' },
                                max: { value: 4, message: 'Must be at most 4.0' },
                            })}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-lg font-semibold"
                            placeholder="3.5"
                        />
                        {errors.gpa && (
                            <p className="text-red-500 text-sm">{errors.gpa.message}</p>
                        )}
                        {gpa && (
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-gray-500">Academic Level</span>
                                    <span className={`text-xs px-2 py-1 rounded-full font-semibold ${getGPALevel(gpa).color}`}>
                                        {getGPALevel(gpa).label}
                                    </span>
                                </div>
                                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-500"
                                        style={{ width: `${Math.min((gpa / 4) * 100, 100)}%` }}
                                    />
                                </div>
                                <p className="text-xs text-gray-500 mt-1">{gpa} / 4.0 GPA</p>
                            </div>
                        )}
                    </div>

                    {/* Work Experience */}
                    <div className="space-y-2">
                        <label htmlFor="work_exp" className="block text-sm font-semibold text-gray-700">
                            Work Experience (years)
                        </label>
                        <input
                            id="work_exp"
                            type="number"
                            step="0.5"
                            min="0"
                            {...register('work_exp', {
                                required: 'Work experience is required',
                                min: { value: 0, message: 'Must be at least 0' },
                            })}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-lg font-semibold"
                            placeholder="3"
                        />
                        {errors.work_exp && (
                            <p className="text-red-500 text-sm">{errors.work_exp.message}</p>
                        )}
                        {work_exp && (
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-gray-500">Experience Level:</span>
                                    <div className="flex gap-1">
                                        {[...Array(Math.min(Math.max(Math.floor(work_exp * 2), 1), 10))].map((_, i) => (
                                            <div
                                                key={i}
                                                className="h-2 w-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-full animate-pulse"
                                                style={{ animationDelay: `${i * 50}ms` }}
                                            />
                                        ))}
                                    </div>
                                </div>
                                <p className="text-xs text-gray-500">{work_exp} years of experience</p>
                            </div>
                        )}
                    </div>

                    {/* Target Program */}
                    <div className="space-y-2">
                        <label htmlFor="target_program" className="block text-sm font-semibold text-gray-700">
                            Target Program
                        </label>
                        <select
                            id="target_program"
                            {...register('target_program', { required: 'Please select a program' })}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-all duration-200 text-lg font-semibold cursor-pointer"
                        >
                            <option value="MBA">MBA - Master of Business Administration</option>
                            <option value="MS">MS - Master of Science</option>
                            <option value="MSCS">MSCS - Computer Science</option>
                            <option value="MSDS">MSDS - Data Science</option>
                            <option value="PhD">PhD - Doctor of Philosophy</option>
                        </select>
                        {errors.target_program && (
                            <p className="text-red-500 text-sm">{errors.target_program.message}</p>
                        )}
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 animate-shake">
                            <p className="text-red-700 text-sm font-medium">{error}</p>
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-6 h-6 animate-spin" />
                                Finding Your Matches...
                            </>
                        ) : (
                            <>
                                <TrendingUp className="w-6 h-6" />
                                Find My Perfect University Matches
                            </>
                        )}
                    </button>
                </form>

                {/* Footer */}
                <div className="mt-8 text-center pt-6 border-t border-gray-200">
                    <p className="text-sm text-gray-500">
                        Powered by advanced matching algorithms
                    </p>
                </div>
            </div>
        </div>
    );
}
