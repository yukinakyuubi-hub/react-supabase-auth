
import './App.css';

import { Routes, Route, Link } from 'react-router';

import Registro from './pages/Registros';
import Cadastro from './pages/Cadastro';
import Login from './pages/Login';
import Perfil from './pages/Perfil';
import Dashboard from './pages/Dashboard';
import Detalhes from './pages/Detalhes';
import NovoRegistro from './pages/NovoRegistro';
import EditarProduto from './pages/EditarProduto';

import ProtectedRoute from './components/ProtectedRoute';
import Header from './components/Header';

function Home() {
  return (
    <main className="home">
      <section className="hero">
        <span className="hero-tag">
          BEM-VINDO AO GESTTA
        </span>

        <h1>
          Organize seus produtos
          <br />
          de forma simples.
        </h1>

        <p>
          Gerencie seus produtos, consulte informações
          e acompanhe seus registros em um só lugar.
          Tudo isso com praticidade e organização.
        </p>

        <Link to="/registros" className="btn-primary">
          Ver produtos cadastrados
        </Link>
      </section>

      <section className="features">
        <article className="feature-card">
          <div className="feature-icon">01</div>
          <h2>Produtos</h2>
          <p>
            Consulte e gerencie seus produtos
            de maneira simples e organizada.
          </p>
        </article>

        <article className="feature-card">
          <div className="feature-icon">02</div>
          <h2>Organização</h2>
          <p>
            Mantenha seus registros organizados
            e acessíveis sempre que precisar.
          </p>
        </article>

        <article className="feature-card">
          <div className="feature-icon">03</div>
          <h2>Segurança</h2>
          <p>
            Tenha acesso aos seus dados com
            autenticação de usuários.
          </p>
        </article>
      </section>
    </main>
  );
}

function NaoEncontrado() {
  return (
    <main className="page-container not-found">
      <h1>404</h1>
      <h2>Página não encontrada</h2>
      <p>
        Desculpe, a página que você procura não existe.
      </p>

      <Link to="/" className="btn-primary">
        Voltar para o início
      </Link>
    </main>
  );
}

function App() {
  return (
    <div className="app">
      <Header />

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

        <Route
          path="/registros/:id/editar"
          element={
            <ProtectedRoute>
              <EditarProduto />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NaoEncontrado />} />
      </Routes>
    </div>
  );
}

export default App;
