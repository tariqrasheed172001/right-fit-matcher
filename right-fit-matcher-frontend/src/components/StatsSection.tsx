'use client';

import { useEffect, useState } from 'react';
import { universitiesApi } from '@/lib/api';
import { GraduationCap, Globe, Award, TrendingUp } from 'lucide-react';

interface Stats {
    total: number;
    program_types: number;
    countries: number;
    avg_gmat_score: number;
    avg_gpa_score: number;
    avg_work_exp_years: number;
    avg_admit_rate: number;
}

export default function StatsSection() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await universitiesApi.getStats();
                setStats(response.data.statistics as Stats);
            } catch (error) {
                console.error('Failed to fetch stats:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="mt-12 animate-pulse">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="bg-white rounded-xl p-6 shadow-md h-32"></div>
                    ))}
                </div>
            </div>
        );
    }

    if (!stats) {
        return null;
    }

    const statsData = [
        {
            icon: GraduationCap,
            label: 'Total Universities',
            value: stats.total || 0,
            color: 'from-blue-500 to-cyan-500',
            bgColor: 'bg-blue-50',
            borderColor: 'border-blue-200',
        },
        {
            icon: Award,
            label: 'Program Types',
            value: stats.program_types || 0,
            color: 'from-purple-500 to-pink-500',
            bgColor: 'bg-purple-50',
            borderColor: 'border-purple-200',
        },
        {
            icon: Globe,
            label: 'Countries',
            value: stats.countries || 0,
            color: 'from-green-500 to-emerald-500',
            bgColor: 'bg-green-50',
            borderColor: 'border-green-200',
        },
        {
            icon: TrendingUp,
            label: 'Avg GMAT Score',
            value: stats.avg_gmat_score ? Math.round(stats.avg_gmat_score) : 0,
            color: 'from-orange-500 to-red-500',
            bgColor: 'bg-orange-50',
            borderColor: 'border-orange-200',
        },
    ];

    return (
        <div className="mt-16 animate-fade-in-up">
            <div className="text-center mb-10">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                    📊 Database Overview
                </h2>
                <p className="text-gray-600 text-lg">
                    Access to prestigious universities worldwide
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statsData.map((stat, index) => (
                    <div
                        key={index}
                        className="bg-white rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-gray-100 hover:border-gray-200 group"
                    >
                        <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${stat.color} mb-4 group-hover:scale-110 transition-transform duration-300 shadow-md`}>
                            <stat.icon className="w-7 h-7 text-white" />
                        </div>
                        <div className="text-4xl font-black text-gray-900 mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300">
                            {stat.value}
                        </div>
                        <div className="text-gray-600 font-semibold text-sm uppercase tracking-wide">
                            {stat.label}
                        </div>
                    </div>
                ))}
            </div>

            {/* Additional Stats */}
            <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 md:p-8 border-2 border-blue-100">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                    <div>
                        <p className="text-sm text-gray-600 mb-1">Average GPA</p>
                        <p className="text-2xl font-bold text-gray-900">
                            {stats.avg_gpa_score ? Number(stats.avg_gpa_score).toFixed(2) : '0.00'}
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-600 mb-1">Avg Work Experience</p>
                        <p className="text-2xl font-bold text-gray-900">
                            {stats.avg_work_exp_years ? Number(stats.avg_work_exp_years).toFixed(1) : '0'} years
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-600 mb-1">Average Admit Rate</p>
                        <p className="text-2xl font-bold text-gray-900">
                            {stats.avg_admit_rate ? (Number(stats.avg_admit_rate) * 100).toFixed(1) : '0'}%
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
