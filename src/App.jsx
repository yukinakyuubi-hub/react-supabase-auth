import { Routes, Route, Link, useNavigate } from 'react-router';

import Registro from './pages/Registros';
import Cadastro from './pages/Cadastro';
import Login from './pages/Login';
import Perfil from './pages/Perfil';
import Detalhes from './pages/Detalhes';
import NovoRegistro from './pages/NovoRegistro';

import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './hooks/useAuth';

function Home() {
  return (
    <main>
      <h1>Bem-vindo ao nosso sistema!</h1>
      <p>Consulte os produtos cadastrados no banco de dados.</p>
      <Link to="/registros">Ver produtos cadastrados</Link>
    </main>
  );
}

function Dashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  async function sair() {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      alert('Erro ao sair da conta: ' + error.message);
    }
  }

  return (
    <main>
      <h1>Dashboard</h1>
      <p>Você está autenticado!</p>

      <h2>Dados da sua conta</h2>
      <p>E-mail: {user?.email}</p>
      <p>ID do usuário: {user?.id}</p>

      <button onClick={sair}>Sair da conta</button>
    </main>
  );
}

function NaoEncontrado() {
  return (
    <main>
      <h1>404 - Página não encontrada</h1>
      <p>Desculpe, a página que você procura não existe.</p>
      <Link to="/">Voltar para o início</Link>
    </main>
  );
}

function App() {
  return (
    <>
      <nav>
        <Link to="/">Início</Link>
        {' | '}
        <Link to="/registros">Produtos</Link>
        {' | '}
        <Link to="/registro">Criar conta</Link>
        {' | '}
        <Link to="/login">Entrar</Link>
        {' | '}
        <Link to="/dashboard">Dashboard</Link>
        {' | '}
        <Link to="/perfil">Meu Perfil</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/registro" element={<Cadastro />} />

        <Route path="/login" element={<Login />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/perfil"
          element={
            <ProtectedRoute>
              <Perfil />
            </ProtectedRoute>
          }
        />

        <Route
          path="/registros"
          element={
            <ProtectedRoute>
              <Registro />
            </ProtectedRoute>
          }
        />

        <Route
          path="/registros/novo"
          element={
            <ProtectedRoute>
              <NovoRegistro />
            </ProtectedRoute>
          }
        />

        <Route
          path="/registros/:id"
          element={
            <ProtectedRoute>
              <Detalhes />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NaoEncontrado />} />
      </Routes>
    </>
  );
}

export default App;
