
import { useState } from 'react';
import { Link } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { cadastroSchema } from '../../schemas/authSchema';
import { supabase } from '../../services/supabase';
import './Cadastro.css';

function Cadastro() {
  const [sucesso, setSucesso] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmacao, setMostrarConfirmacao] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(cadastroSchema),
    defaultValues: {
      nome: '',
      email: '',
      senha: '',
      confirmarSenha: '',
    },
  });

  async function handleCadastro(dados) {
    setSucesso('');
    clearErrors();

    try {
      const { data, error } = await supabase.auth.signUp({
        email: dados.email.trim(),
        password: dados.senha,
        options: {
          data: {
            nome: dados.nome.trim(),
          },
        },
      });

      if (error) {
        const mensagem = error.message.toLowerCase();

        if (
          mensagem.includes('already registered') ||
          mensagem.includes('already been registered') ||
          mensagem.includes('already exists')
        ) {
          setError('email', {
            type: 'server',
            message: 'Este e-mail já está cadastrado.',
          });
          return;
        }

        setError('root.server', {
          type: 'server',
          message: 'Não foi possível realizar o cadastro. Tente novamente.',
        });
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
    } catch {
      setError('root.server', {
        type: 'server',
        message: 'Ocorreu um erro inesperado. Tente novamente.',
      });
    }
  }

  return (
    <main className="registro-container">
      <section className="registro-card">
        <div className="registro-icon">G</div>

        <span className="registro-tag">JUNTE-SE A NÓS</span>

        <h1>Criar minha conta</h1>

        <p className="registro-subtitulo">
          Preencha seus dados e comece sua experiência.
        </p>

        <form onSubmit={handleSubmit(handleCadastro)}>
          <div className="registro-campo">
            <label htmlFor="nome">Nome completo</label>
            <input
              id="nome"
              type="text"
              placeholder="Digite seu nome completo"
              autoComplete="name"
              {...register('nome')}
            />
            {errors.nome && (
              <p className="registro-erro" role="alert">
                {errors.nome.message}
              </p>
            )}
          </div>

          <div className="registro-campo">
            <label htmlFor="email">E-mail</label>
            <input
              id="email"
              type="email"
              placeholder="Digite seu e-mail"
              autoComplete="email"
              {...register('email')}
            />
            {errors.email && (
              <p className="registro-erro" role="alert">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="registro-campo">
            <label htmlFor="senha">Senha</label>
            <div className="registro-senha-wrapper">
              <input
                id="senha"
                type={mostrarSenha ? 'text' : 'password'}
                placeholder="Mínimo de 8 caracteres"
                autoComplete="new-password"
                {...register('senha')}
              />
              <button
                type="button"
                className="registro-senha-toggle"
                onClick={() => setMostrarSenha(!mostrarSenha)}
              >
                {mostrarSenha ? 'Ocultar' : 'Mostrar'}
              </button>
            </div>
            {errors.senha && (
              <p className="registro-erro" role="alert">
                {errors.senha.message}
              </p>
            )}
          </div>

          <div className="registro-campo">
            <label htmlFor="confirmarSenha">Confirmar senha</label>
            <div className="registro-senha-wrapper">
              <input
                id="confirmarSenha"
                type={mostrarConfirmacao ? 'text' : 'password'}
                placeholder="Digite a senha novamente"
                autoComplete="new-password"
                {...register('confirmarSenha')}
              />
              <button
                type="button"
                className="registro-senha-toggle"
                onClick={() => setMostrarConfirmacao(!mostrarConfirmacao)}
              >
                {mostrarConfirmacao ? 'Ocultar' : 'Mostrar'}
              </button>
            </div>
            {errors.confirmarSenha && (
              <p className="registro-erro" role="alert">
                {errors.confirmarSenha.message}
              </p>
            )}
          </div>

          {errors.root?.server && (
            <p className="registro-erro registro-feedback" role="alert">
              {errors.root.server.message}
            </p>
          )}

          {sucesso && (
            <p className="registro-sucesso" role="status">
              {sucesso}
            </p>
          )}

          <button
            type="submit"
            className="registro-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Cadastrando...' : 'Criar minha conta'}
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
