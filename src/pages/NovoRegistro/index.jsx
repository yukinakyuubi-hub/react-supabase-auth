
import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { produtoSchema } from '../../schemas/produtoSchema';
import { supabase } from '../../services/supabase';
import { useAuth } from '../../hooks/useAuth';
import './NovoRegistro.css';

function NovoRegistro() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [sucesso, setSucesso] = useState('');

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(produtoSchema),
    defaultValues: {
      nome: '',
      descricao: '',
      preco: '',
      categoria: '',
      estoque: '',
    },
  });

  async function salvarProduto(dados) {
    setSucesso('');
    clearErrors('root');

    if (!user) {
      setError('root.server', {
        type: 'server',
        message: 'Você precisa estar autenticado para cadastrar um produto.',
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('Produtos')
        .insert({
          nome: dados.nome,
          descricao: dados.descricao,
          preco: dados.preco,
          categoria: dados.categoria,
          estoque: dados.estoque,
          user_id: user.id,
        });

      if (error) {
        console.error('Erro ao cadastrar produto:', error);

        setError('root.server', {
          type: 'server',
          message: 'Não foi possível cadastrar o produto. Tente novamente.',
        });
        return;
      }

      setSucesso('Produto cadastrado com sucesso!');

      setTimeout(() => {
        navigate('/registros');
      }, 1200);
    } catch {
      setError('root.server', {
        type: 'server',
        message: 'Ocorreu um erro inesperado. Tente novamente.',
      });
    }
  }

  return (
    <main className="novo-produto-container">
      <section className="novo-produto-header">
        <div>
          <span className="hero-tag">GERENCIAMENTO</span>
          <h1>Cadastrar novo produto</h1>
          <p>
            Preencha as informações abaixo para adicionar
            um produto ao seu catálogo.
          </p>
        </div>

        <div className="novo-produto-icon">+</div>
      </section>

      <section className="novo-produto-card">
        <div className="novo-produto-card-header">
          <div>
            <h2>Informações do produto</h2>
            <p>Informe os dados necessários para o cadastro.</p>
          </div>

          <span className="novo-produto-required">
            * Campos obrigatórios
          </span>
        </div>

        <form
          className="novo-produto-form"
          onSubmit={handleSubmit(salvarProduto)}
        >
          <div className="novo-form-group">
            <label htmlFor="nome">
              Nome do produto <span>*</span>
            </label>

            <input
              id="nome"
              type="text"
              placeholder="Digite o nome do produto"
              className={errors.nome ? 'campo-erro' : ''}
              {...register('nome')}
            />

            {errors.nome && (
              <small className="novo-error">
                {errors.nome.message}
              </small>
            )}
          </div>

          <div className="novo-form-group">
            <label htmlFor="descricao">Descrição</label>

            <textarea
              id="descricao"
              rows="4"
              placeholder="Descreva as características do produto..."
              className={errors.descricao ? 'campo-erro' : ''}
              {...register('descricao')}
            />

            {errors.descricao && (
              <small className="novo-error">
                {errors.descricao.message}
              </small>
            )}
          </div>

          <div className="novo-form-row">
            <div className="novo-form-group">
              <label htmlFor="preco">
                Preço (R$) <span>*</span>
              </label>

              <input
                id="preco"
                type="number"
                step="0.01"
                min="0.01"
                placeholder="Ex.: 29.90"
                className={errors.preco ? 'campo-erro' : ''}
                {...register('preco')}
              />

              {errors.preco && (
                <small className="novo-error">
                  {errors.preco.message}
                </small>
              )}
            </div>

            <div className="novo-form-group">
              <label htmlFor="estoque">
                Quantidade em estoque <span>*</span>
              </label>

              <input
                id="estoque"
                type="number"
                min="0"
                step="1"
                placeholder="Ex.: 20"
                className={errors.estoque ? 'campo-erro' : ''}
                {...register('estoque')}
              />

              {errors.estoque && (
                <small className="novo-error">
                  {errors.estoque.message}
                </small>
              )}
            </div>
          </div>

          <div className="novo-form-group">
            <label htmlFor="categoria">
              Categoria <span>*</span>
            </label>

            <input
              id="categoria"
              type="text"
              placeholder="Ex.: Eletrônicos"
              className={errors.categoria ? 'campo-erro' : ''}
              {...register('categoria')}
            />

            {errors.categoria && (
              <small className="novo-error">
                {errors.categoria.message}
              </small>
            )}
          </div>

          {errors.root?.server && (
            <div className="novo-alerta erro">
              {errors.root.server.message}
            </div>
          )}

          {sucesso && (
            <div className="novo-alerta sucesso" role="status">
              {sucesso}
            </div>
          )}

          <div className="novo-form-footer">
            <Link to="/registros" className="novo-cancelar">
              Cancelar
            </Link>

            <button
              type="submit"
              className="novo-salvar"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Salvando...' : 'Cadastrar produto'}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}

export default NovoRegistro;
