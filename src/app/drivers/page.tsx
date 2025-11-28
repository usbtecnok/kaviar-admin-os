import DashboardLayout from '@/components/layout/DashboardLayout';
import MotoristaListTable from '@/components/motoristas/MotoristaListTable';
import MotoristaCreationForm from '@/components/motoristas/MotoristaCreationForm';

export default function DriversPage() {
    return (
        <DashboardLayout>
            <h1 style={{ color: '#007bff', borderBottom: '2px solid #eee', paddingBottom: '10px' }}>
                🧑‍✈️ Gestão de Motoristas
            </h1>
            <p style={{ fontSize: '1.1em', color: '#555' }}>
                Crie e gerencie os motoristas e veículos que operam os Combos Turísticos.
            </p>
            
            <div style={{ marginTop: '30px', marginBottom: '40px' }}>
                <MotoristaCreationForm />
            </div>

            <MotoristaListTable />
        </DashboardLayout>
    );
}
