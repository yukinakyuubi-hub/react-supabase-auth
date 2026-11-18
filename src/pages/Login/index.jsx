
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
            message: 'Seu e-mail ainda não foi confirmado. Verifique sua caixa de entrada.',
          });
          return;
        }

        if (
          mensagem.includes('invalid login credentials') ||
          mensagem.includes('invalid credentials')
        ) {
          setError('root.server', {
            type: 'server',
            message: 'E-mail ou senha incorretos. Verifique seus dados e tente novamente.',
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
      <form className="login-card" onSubmit={handleSubmit(entrar)}>
        <h1>Bem-vindo de volta!</h1>
        <p>Entre na sua conta para continuar.</p>

        <label htmlFor="email">E-mail</label>
        <input
          id="email"
          type="email"
          placeholder="Digite seu e-mail"
          {...register('email')}
        />
        {errors.email && (
          <p className="login-erro" role="alert">
            {errors.email.message}
          </p>
        )}

        <label htmlFor="senha">Senha</label>
        <input
          id="senha"
          type="password"
          placeholder="Digite sua senha"
          {...register('senha')}
        />
        {errors.senha && (
          <p className="login-erro" role="alert">
            {errors.senha.message}
          </p>
        )}

        {errors.root?.server && (
          <p className="login-erro" role="alert">
            {errors.root.server.message}
          </p>
        )}

        {errors.root?.emailNotConfirmed && (
          <>
            <p className="login-erro" role="alert">
              {errors.root.emailNotConfirmed.message}
            </p>

            <button
              type="button"
              onClick={reenviarConfirmacao}
              disabled={reenviando || isSubmitting}
            >
              {reenviando
                ? 'Enviando...'
                : 'Reenviar e-mail de confirmação'}
            </button>
          </>
        )}

        {sucesso && (
          <p className="login-sucesso" role="status">
            {sucesso}
          </p>
        )}

        <button type="submit" disabled={isSubmitting || reenviando}>
          {isSubmitting ? 'Entrando...' : 'Entrar'}
        </button>

        <p>
          Ainda não tem conta? <Link to="/registro">Cadastre-se</Link>
        </p>
      </form>
    </main>
  );
}

export default Login;
