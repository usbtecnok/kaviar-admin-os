import LoginForm from '@/components/auth/LoginForm';

// A pagina principal (/) sera APENAS a tela de login
export default function Home() {
  return (
    <main style={{ padding: '20px', backgroundColor: '#f4f4f4', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <LoginForm />
    </main>
  );
}
