
import { Link } from 'react-router';
import './Header.css';

function Header() {
  return (
    <header className="topbar">
      <Link to="/" className="logo">
        <span className="logo-icon">G</span>
        <span className="logo-name">GESTTA</span>
      </Link>

      <nav className="navigation">
        <Link to="/">Início</Link>
        <Link to="/registros">Produtos</Link>
        <Link to="/registro">Criar conta</Link>
        <Link to="/login">Entrar</Link>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/perfil">Meu Perfil</Link>
      </nav>
    </header>
  );
}

export default Header;
