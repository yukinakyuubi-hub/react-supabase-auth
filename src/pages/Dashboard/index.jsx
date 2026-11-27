
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../../hooks/useAuth';
import './Dashboard.css';

function Dashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const nome = user?.user_metadata?.nome || 'Usuário';

  async function sair() {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      alert('Erro ao sair da conta: ' + error.message);
    }
  }

  return (
    <main className="dashboard-container">
      <section className="dashboard-welcome">
        <div>
          <span className="hero-tag">ÁREA DO USUÁRIO</span>
          <h1>Olá, {nome}!</h1>
          <p>
            Seja bem-vindo ao seu painel. Aqui você pode
            gerenciar seus produtos e sua conta.
          </p>
        </div>

        <div className="dashboard-avatar">
          {nome.charAt(0).toUpperCase()}
        </div>
      </section>

      <section className="dashboard-grid">
        <article className="dashboard-stat-card">
          <div className="dashboard-stat-icon">01</div>
          <h2>Produtos</h2>
          <p>Consulte e organize seus produtos cadastrados.</p>
          <Link to="/registros">Ver produtos →</Link>
        </article>

        <article className="dashboard-stat-card">
          <div className="dashboard-stat-icon">02</div>
          <h2>Novo registro</h2>
          <p>Adicione novos produtos ao seu sistema.</p>
          <Link to="/registros/novo">Cadastrar produto →</Link>
        </article>

        <article className="dashboard-stat-card">
          <div className="dashboard-stat-icon">03</div>
          <h2>Meu perfil</h2>
          <p>Visualize suas informações pessoais.</p>
          <Link to="/perfil">Acessar perfil →</Link>
        </article>
      </section>

      <section className="dashboard-account">
        <div className="dashboard-account-header">
          <div>
            <span className="hero-tag">INFORMAÇÕES</span>
            <h2>Dados da sua conta</h2>
          </div>

          <span className="dashboard-status">
            Conta autenticada
          </span>
        </div>

        <div className="dashboard-account-info">
          <div>
            <span>E-mail cadastrado</span>
            <strong>{user?.email || 'Não informado'}</strong>
          </div>
        </div>

        <div className="dashboard-account-footer">
          <p>
            Suas informações estão protegidas pelo sistema de autenticação.
          </p>

          <button className="dashboard-logout" onClick={sair}>
            Sair da conta
          </button>
        </div>
      </section>
    </main>
  );
}

export default Dashboard;
