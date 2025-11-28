'use client';

import React, { useEffect, useState } from 'react';
import { getToken, logout } from '@/services/auth';
import { useRouter } from 'next/navigation';

const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isMounted, setIsMounted] = useState(false); 

    useEffect(() => {
        setIsMounted(true); 
        const token = getToken();
        if (!token) {
            router.push('/');
        } else {
            setIsAuthenticated(true);
        }
    }, [router]);

    const handleLogout = () => {
        logout();
        router.push('/');
    };

    if (!isMounted || !isAuthenticated) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: '24px' }}>
                Verificando acesso...
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
            <div style={{ width: '250px', backgroundColor: '#343a40', color: 'white', padding: '20px', display: 'flex', flexDirection: 'column' }}>
                <h2 style={{ borderBottom: '1px solid #495057', paddingBottom: '10px', marginBottom: '20px', color: '#66ccff' }}>
                    Kaviar OS
                </h2>
                <nav style={{ flexGrow: 1 }}>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        <li style={{ marginBottom: '10px' }}>
                            <a href="/dashboard" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>
                                🏠 Visão Geral
                            </a>
                        </li>
                        <li style={{ marginBottom: '10px' }}>
                            <a href="/combos" style={{ color: 'white', textDecoration: 'none' }}>
                                🗺️ Gestão de Combos
                            </a>
                        </li>
                        <li style={{ marginBottom: '10px' }}>
                            {/* LINK CORRIGIDO PARA /drivers */}
                            <a href="/drivers" style={{ color: 'white', textDecoration: 'none' }}>
                                🧑‍✈️ Motoristas
                            </a>
                        </li>
                    </ul>
                </nav>
                
                <button onClick={handleLogout} style={{ padding: '10px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginTop: '20px' }}>
                    Sair
                </button>
            </div>
            <div style={{ flexGrow: 1, padding: '30px' }}>
                {children}
            </div>
        </div>
    );
};

export default DashboardLayout;
