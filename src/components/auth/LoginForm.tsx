'use client';

import React, { useState } from 'react';
import { loginAdmin } from '@/services/auth';
import { useRouter } from 'next/navigation'; // NOVO IMPORT: Para redirecionamento

// Componente simples para a tela de Login
const LoginForm: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter(); // Inicializa o hook de roteamento

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const data = await loginAdmin({ email, senha: password });
            
            console.log("Login bem-sucedido! Token JWT:", data.access_token);
            alert("Login bem-sucedido! O token foi salvo no LocalStorage.");
            
            // --- CORREÇÃO: REDIRECIONAMENTO ---
            router.push('/dashboard'); 
            // ----------------------------------
            
        } catch (err: any) {
            setError(err.message || 'Erro desconhecido durante o login.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', backgroundColor: 'white', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
            <h1 style={{ textAlign: 'center', color: '#007bff' }}>Kaviar OS Admin Login</h1>
            
            <form onSubmit={handleSubmit}>
                {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
                
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="email">E-mail Admin:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{ width: '100%', padding: '10px', marginTop: '5px', boxSizing: 'border-box' }}
                    />
                </div>
                
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="password">Senha:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{ width: '100%', padding: '10px', marginTop: '5px', boxSizing: 'border-box' }}
                    />
                </div>
                
                <button 
                    type="submit" 
                    disabled={loading}
                    style={{ 
                        width: '100%', 
                        padding: '10px', 
                        backgroundColor: loading ? '#0056b3' : '#007bff', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '4px', 
                        cursor: loading ? 'not-allowed' : 'pointer' 
                    }}
                >
                    {loading ? 'Entrando...' : 'Acessar Dashboard'}
                </button>
            </form>
        </div>
    );
};

export default LoginForm;
