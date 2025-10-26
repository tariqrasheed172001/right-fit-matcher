'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { authApi, User, getToken, saveToken, removeToken } from '@/lib/auth';
import api from '@/lib/api';

interface AuthContextType {
    user: User | null;
    token: string | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (data: RegisterData) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
}

interface RegisterData {
    name: string;
    email: string;
    password: string;
    gmat?: number;
    gpa?: number;
    work_exp?: number;
    target_program?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const initializeAuth = async () => {
            const storedToken = getToken();
            if (storedToken) {
                setToken(storedToken);
                api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
                try {
                    const response = await authApi.getProfile();
                    setUser(response.user);
                } catch {
                    removeToken();
                    setToken(null);
                }
            }
            setLoading(false);
        };

        initializeAuth();
    }, []);

    const login = async (email: string, password: string) => {
        try {
            const { data } = await authApi.login(email, password);
            setUser(data.user);
            setToken(data.token);
            saveToken(data.token);
            api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
        } catch (error: unknown) {
            if (error && typeof error === 'object' && 'response' in error) {
                const axiosError = error as { response?: { data?: { error?: string } } };
                const errorMessage = axiosError.response?.data?.error || 'Login failed';
                throw new Error(errorMessage);
            }
            throw new Error('Login failed. Please try again.');
        }
    };

    const register = async (registerData: RegisterData) => {
        try {
            const { data } = await authApi.register(registerData);
            setUser(data.user);
            setToken(data.token);
            saveToken(data.token);
            api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
        } catch (error: unknown) {
            if (error && typeof error === 'object' && 'response' in error) {
                const axiosError = error as { response?: { data?: { error?: string } } };
                const errorMessage = axiosError.response?.data?.error || 'Registration failed';
                throw new Error(errorMessage);
            }
            throw new Error('Registration failed. Please try again.');
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        removeToken();
        delete api.defaults.headers.common['Authorization'];
        router.push('/');
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                loading,
                login,
                register,
                logout,
                isAuthenticated: !!user && !!token,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

