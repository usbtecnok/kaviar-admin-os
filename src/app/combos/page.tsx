import DashboardLayout from '@/components/layout/DashboardLayout';
import ComboCreationForm from '@/components/combos/ComboCreationForm'; 
import ComboListTable from '@/components/combos/ComboListTable'; 

// A pagina de Combos deve renderizar o formulario E a tabela de listagem
export default function CombosPage() {
    return (
        <DashboardLayout>
            <h1 style={{ color: '#007bff', borderBottom: '2px solid #eee', paddingBottom: '10px' }}>
                🗺️ Gestão de Combos Turísticos
            </h1>
            <p style={{ fontSize: '1.1em', color: '#555' }}>
                Gerencie os pacotes de passeios e viagens otimizados pela IA (os "Combos").
            </p>
            
            <div style={{ marginTop: '30px', marginBottom: '40px' }}>
                <ComboCreationForm /> {/* FORMULÁRIO */}
            </div>

            <ComboListTable /> {/* LISTAGEM DE COMBOS */}
            
        </DashboardLayout>
    );
}
