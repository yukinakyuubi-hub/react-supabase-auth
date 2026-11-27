
import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '../../schemas/authSchema';
import { supabase } from '../../services/supabase';
import './Login.css';

function Login() {
  const [sucesso, setSucesso] = useState('');
  const [reenviando, setReenviando] = useState(false);
  const [mostrarSenha, setMostrarSenha] = useState(false);

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    getValues,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      senha: '',
    },
  });

  async function entrar(dados) {
    setSucesso('');
    clearErrors('root');

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: dados.email.trim(),
        password: dados.senha,
      });

      if (error) {
        const mensagem = error.message.toLowerCase();

        if (mensagem.includes('email not confirmed')) {
          setError('root.emailNotConfirmed', {
            type: 'server',
            message:
              'Seu e-mail ainda não foi confirmado. Verifique sua caixa de entrada.',
          });
          return;
        }

        if (
          mensagem.includes('invalid login credentials') ||
          mensagem.includes('invalid credentials')
        ) {
          setError('root.server', {
            type: 'server',
            message:
              'E-mail ou senha incorretos. Verifique seus dados e tente novamente.',
          });
          return;
        }

        setError('root.server', {
          type: 'server',
          message: 'Não foi possível entrar na sua conta. Tente novamente.',
        });
        return;
      }

      navigate('/dashboard');
    } catch {
      setError('root.server', {
        type: 'server',
        message: 'Ocorreu um erro inesperado. Tente novamente.',
      });
    }
  }

  async function reenviarConfirmacao() {
    setSucesso('');
    clearErrors('root');

    const email = getValues('email').trim();

    if (!email) {
      setError('email', {
        type: 'manual',
        message: 'Digite seu e-mail primeiro.',
      });
      return;
    }

    setReenviando(true);

    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
      });

      if (error) {
        setError('root.server', {
          type: 'server',
          message: 'Não foi possível reenviar o e-mail. Tente novamente.',
        });
        return;
      }

      setSucesso(
        'Novo e-mail de confirmação enviado! Confira sua caixa de entrada e o Spam.'
      );
    } catch {
      setError('root.server', {
        type: 'server',
        message: 'Ocorreu um erro ao reenviar o e-mail. Tente novamente.',
      });
    } finally {
      setReenviando(false);
    }
  }

  return (
    <main className="login-container">
      <section className="login-card">

        <div className="login-icon">G</div>

        <span className="login-tag">BEM-VINDO DE VOLTA</span>

        <h1>Olá novamente!</h1>

        <p className="login-description">
          Entre na sua conta para continuar.
        </p>

        <form onSubmit={handleSubmit(entrar)}>

          <div className="login-field">
            <label htmlFor="email">E-mail</label>

            <input
              id="email"
              type="email"
              placeholder="seuemail@exemplo.com"
              autoComplete="email"
              {...register('email')}
            />

            {errors.email && (
              <p className="login-erro" role="alert">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="login-field">
            <label htmlFor="senha">Senha</label>

            <div className="senha-wrapper">
              <input
                id="senha"
                type={mostrarSenha ? 'text' : 'password'}
                placeholder="Digite sua senha"
                autoComplete="current-password"
                {...register('senha')}
              />

              <button
                type="button"
                className="senha-toggle"
                onClick={() => setMostrarSenha(!mostrarSenha)}
                aria-label={mostrarSenha ? 'Ocultar senha' : 'Mostrar senha'}
              >
                {mostrarSenha ? 'Ocultar' : 'Mostrar'}
              </button>
            </div>

            {errors.senha && (
              <p className="login-erro" role="alert">
                {errors.senha.message}
              </p>
            )}
          </div>

          {errors.root?.server && (
            <p className="login-erro login-feedback" role="alert">
              {errors.root.server.message}
            </p>
          )}

          {errors.root?.emailNotConfirmed && (
            <div className="login-feedback">
              <p className="login-erro" role="alert">
                {errors.root.emailNotConfirmed.message}
              </p>

              <button
                type="button"
                className="btn-reenviar"
                onClick={reenviarConfirmacao}
                disabled={reenviando || isSubmitting}
              >
                {reenviando
                  ? 'Enviando...'
                  : 'Reenviar e-mail de confirmação'}
              </button>
            </div>
          )}

          {sucesso && (
            <p className="login-sucesso" role="status">
              {sucesso}
            </p>
          )}

          <button
            type="submit"
            className="login-button"
            disabled={isSubmitting || reenviando}
          >
            {isSubmitting ? 'Entrando...' : 'Entrar na minha conta'}
          </button>

        </form>

        <div className="login-footer">
          <p>
            Ainda não tem uma conta?
            {' '}
            <Link to="/registro">Cadastre-se</Link>
          </p>
        </div>

      </section>
    </main>
  );
}

export default Login;
