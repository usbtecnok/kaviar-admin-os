import DashboardLayout from '@/components/layout/DashboardLayout';

// Pagina protegida de Visao Geral
export default function Dashboard() {
    return (
        <DashboardLayout>
            <h1 style={{ color: '#007bff' }}>Visão Geral (Dashboard)</h1>
            <p>Bem-vindo(a) ao Kaviar OS, Super Admin.</p>
            <div style={{ marginTop: '20px', padding: '15px', border: '1px solid #ccc', backgroundColor: '#fff' }}>
                <h3>Estatísticas Rápidas</h3>
                <p>Corridas Ativas: 0</p>
                <p>Motoristas Online: 1</p>
            </div>
        </DashboardLayout>
    );
}
