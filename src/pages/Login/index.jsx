import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { supabase } from '../../services/supabase';
import './Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [reenviando, setReenviando] = useState(false);

  const navigate = useNavigate();

  async function entrar(e) {
    e.preventDefault();
    setErro('');
    setSucesso('');

    if (!email.trim() || !senha) {
      setErro('Preencha todos os campos.');
      return;
    }

    setCarregando(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: senha,
      });

      if (error) {
        setErro(error.message);
        return;
      }

      navigate('/dashboard');
    } catch (error) {
      setErro('Erro inesperado: ' + error.message);
    } finally {
      setCarregando(false);
    }
  }

  async function reenviarConfirmacao() {
    setErro('');
    setSucesso('');

    if (!email.trim()) {
      setErro('Digite seu e-mail primeiro.');
      return;
    }

    setReenviando(true);

    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email.trim(),
      });

      if (error) {
        setErro(error.message);
        return;
      }

      setSucesso(
        'Novo e-mail de confirmação enviado! Confira sua caixa de entrada e o Spam.'
      );
    } catch (error) {
      setErro('Erro ao reenviar: ' + error.message);
    } finally {
      setReenviando(false);
    }
  }

  return (
    <main className="login-container">
      <form className="login-card" onSubmit={entrar}>
        <h1>Bem-vindo de volta!</h1>
        <p>Entre na sua conta para continuar.</p>

        <label>E-mail</label>
        <input
          type="email"
          placeholder="Digite seu e-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label>Senha</label>
        <input
          type="password"
          placeholder="Digite sua senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
        />

        {erro && <p className="login-erro">{erro}</p>}

        {erro.toLowerCase().includes('email not confirmed') && (
          <button
            type="button"
            onClick={reenviarConfirmacao}
            disabled={reenviando}
          >
            {reenviando ? 'Enviando...' : 'Reenviar e-mail de confirmação'}
          </button>
        )}

        {sucesso && <p className="login-sucesso">{sucesso}</p>}

        <button type="submit" disabled={carregando || reenviando}>
          {carregando ? 'Entrando...' : 'Entrar'}
        </button>

        <p>
          Ainda não tem conta? <Link to="/registro">Cadastre-se</Link>
        </p>
      </form>
    </main>
  );
}

export default Login;
