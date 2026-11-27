import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router';
import './Perfil.css';

function Perfil() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const nome = user?.user_metadata?.nome || 'Não informado';
  const email = user?.email || 'Não informado';
  const inicial = nome !== 'Não informado'
    ? nome.charAt(0).toUpperCase()
    : '?';

  async function sair() {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      alert('Erro ao sair: ' + error.message);
    }
  }

  return (
    <main className="perfil-container">
      <section className="perfil-card">
        <div className="perfil-cabecalho">
          <span className="perfil-tag">MINHA CONTA</span>
          <h1>Meu Perfil</h1>
          <p>Gerencie suas informações pessoais.</p>
        </div>

        <div className="perfil-avatar">
          {inicial}
        </div>

        <h2 className="perfil-nome">{nome}</h2>
        <p className="perfil-email">{email}</p>

        <div className="perfil-divider"></div>

        <div className="perfil-informacoes">
          <div className="perfil-informacao">
            <span className="perfil-icone">👤</span>
            <div>
              <span className="perfil-label">Nome completo</span>
              <strong>{nome}</strong>
            </div>
          </div>

          <div className="perfil-informacao">
            <span className="perfil-icone">@</span>
            <div>
              <span className="perfil-label">Endereço de e-mail</span>
              <strong>{email}</strong>
            </div>
          </div>

          <div className="perfil-informacao">
            <span className="perfil-icone">#</span>
            <div>
              <span className="perfil-label">Identificação da conta</span>
              <strong className="perfil-id">{user?.id || 'Não disponível'}</strong>
            </div>
          </div>
        </div>

        <button className="perfil-sair" onClick={sair}>
          Sair da conta
        </button>

        <p className="perfil-rodape">
          Suas informações estão protegidas.
        </p>
      </section>
    </main>
  );
}

export default Perfil;
