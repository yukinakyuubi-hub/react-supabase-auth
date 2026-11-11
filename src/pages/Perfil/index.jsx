import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router';

function Perfil() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  async function sair() {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      alert('Erro ao sair: ' + error.message);
    }
  }

  return (
    <main>
      <h1>Meu Perfil</h1>

      <p>
        <strong>Nome:</strong> {user?.user_metadata?.nome || 'Não informado'}
      </p>

      <p>
        <strong>E-mail:</strong> {user?.email}
      </p>

      <p>
        <strong>ID do usuário:</strong> {user?.id}
      </p>

      <button onClick={sair}>Sair da conta</button>
    </main>
  );
}

export default Perfil;
