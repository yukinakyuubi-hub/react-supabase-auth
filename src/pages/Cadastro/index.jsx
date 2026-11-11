import { useState } from 'react';
import { Link } from 'react-router';
import { supabase } from '../../services/supabase';
import './Cadastro.css';

function Cadastro() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');

  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');

  async function handleCadastro(event) {
    event.preventDefault();

    setErro('');
    setSucesso('');

    if (!nome.trim() || !email.trim() || !senha || !confirmarSenha) {
      setErro('Preencha todos os campos.');
      return;
    }

    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailValido.test(email)) {
      setErro('Digite um e-mail válido.');
      return;
    }

    if (senha.length < 8) {
      setErro('A senha precisa ter pelo menos 8 caracteres.');
      return;
    }

    if (senha !== confirmarSenha) {
      setErro('As senhas não correspondem.');
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password: senha,
        options: {
          data: {
            nome: nome.trim(),
          },
        },
      });

      if (error) {
        setErro(error.message);
        return;
      }

      if (data.session) {
        setSucesso(
          'Cadastro realizado com sucesso! Sua conta já está autenticada.'
        );
      } else {
        setSucesso(
          'Cadastro realizado! Verifique seu e-mail para confirmar sua conta antes de fazer login.'
        );
      }

      setNome('');
      setEmail('');
      setSenha('');
      setConfirmarSenha('');
    } catch (error) {
      setErro('Ocorreu um erro ao realizar o cadastro.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="registro-container">
      <section className="registro-card">
        <h1>Criar minha conta</h1>

        <p className="registro-subtitulo">
          Preencha os dados abaixo para se cadastrar.
        </p>

        <form onSubmit={handleCadastro}>
          <label htmlFor="nome">Nome completo</label>
          <input
            id="nome"
            type="text"
            placeholder="Digite seu nome completo"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />

          <label htmlFor="email">E-mail</label>
          <input
            id="email"
            type="email"
            placeholder="Digite seu e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label htmlFor="senha">Senha</label>
          <input
            id="senha"
            type="password"
            placeholder="Mínimo de 8 caracteres"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            minLength={8}
            required
          />

          <label htmlFor="confirmarSenha">Confirmar senha</label>
          <input
            id="confirmarSenha"
            type="password"
            placeholder="Digite a senha novamente"
            value={confirmarSenha}
            onChange={(e) => setConfirmarSenha(e.target.value)}
            required
          />

          {erro && (
            <p className="registro-erro" role="alert">
              {erro}
            </p>
          )}

          {sucesso && (
            <p className="registro-sucesso" role="status">
              {sucesso}
            </p>
          )}

          <button type="submit" disabled={loading}>
            {loading ? 'Cadastrando...' : 'Criar conta'}
          </button>
        </form>

        <p className="registro-login">
          Já possui uma conta? <Link to="/login">Fazer login</Link>
        </p>
      </section>
    </main>
  );
}

export default Cadastro;
