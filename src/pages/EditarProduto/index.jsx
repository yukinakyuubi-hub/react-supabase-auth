
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { produtoSchema } from '../../schemas/produtoSchema';
import { supabase } from '../../services/supabase';
import { useAuth } from '../../hooks/useAuth';
import './EditarProduto.css';

function EditarProduto() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [carregando, setCarregando] = useState(true);
  const [sucesso, setSucesso] = useState('');

  const {
    register,
    handleSubmit,
    reset,
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

  useEffect(() => {
    async function buscarProduto() {
      try {
        const { data, error } = await supabase
          .from('Produtos')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;

        if (data.user_id !== user?.id) {
          throw new Error('Você não tem permissão para editar este produto.');
        }

        reset({
          nome: data.nome || '',
          descricao: data.descricao || '',
          preco: String(data.preco ?? ''),
          categoria: data.categoria || '',
          estoque: String(data.estoque ?? ''),
        });
      } catch (error) {
        setError('root.server', {
          type: 'server',
          message: error.message || 'Não foi possível carregar o produto.',
        });
      } finally {
        setCarregando(false);
      }
    }

    if (user) {
      buscarProduto();
    }
  }, [id, user, reset, setError]);

  async function atualizarProduto(dados) {
    setSucesso('');
    clearErrors('root');

    try {
      const { data, error } = await supabase
        .from('Produtos')
        .update({
          nome: dados.nome,
          descricao: dados.descricao,
          preco: dados.preco,
          categoria: dados.categoria,
          estoque: dados.estoque,
        })
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      if (!data) {
        throw new Error(
          'Nenhum produto foi atualizado. Verifique as permissões no Supabase.'
        );
      }

      setSucesso('Produto atualizado com sucesso!');

      setTimeout(() => {
        navigate(`/registros/${id}`);
      }, 1200);
    } catch (error) {
      setError('root.server', {
        type: 'server',
        message: error.message || 'Não foi possível atualizar o produto.',
      });
    }
  }

  if (carregando) {
    return (
      <main className="editar-container">
        <p>Carregando informações do produto...</p>
      </main>
    );
  }

  return (
    <main className="editar-container">
      <section className="editar-header">
        <div>
          <span className="hero-tag">GERENCIAMENTO</span>
          <h1>Editar produto</h1>
          <p>Atualize as informações do produto cadastrado.</p>
        </div>
      </section>

      <section className="editar-card">
        <div className="editar-card-header">
          <h2>Informações do produto</h2>
          <p>Altere os campos que deseja atualizar.</p>
        </div>

        <form
          className="editar-form"
          onSubmit={handleSubmit(atualizarProduto)}
        >
          <div className="editar-form-group">
            <label htmlFor="nome">Nome do produto *</label>
            <input
              id="nome"
              type="text"
              placeholder="Nome do produto"
              {...register('nome')}
            />
            {errors.nome && (
              <small>{errors.nome.message}</small>
            )}
          </div>

          <div className="editar-form-group">
            <label htmlFor="descricao">Descrição</label>
            <textarea
              id="descricao"
              rows="4"
              placeholder="Descrição do produto"
              {...register('descricao')}
            />
            {errors.descricao && (
              <small>{errors.descricao.message}</small>
            )}
          </div>

          <div className="editar-form-row">
            <div className="editar-form-group">
              <label htmlFor="preco">Preço (R$) *</label>
              <input
                id="preco"
                type="number"
                step="0.01"
                min="0.01"
                placeholder="Ex.: 29.90"
                {...register('preco')}
              />
              {errors.preco && (
                <small>{errors.preco.message}</small>
              )}
            </div>

            <div className="editar-form-group">
              <label htmlFor="estoque">Estoque *</label>
              <input
                id="estoque"
                type="number"
                min="0"
                step="1"
                placeholder="Quantidade"
                {...register('estoque')}
              />
              {errors.estoque && (
                <small>{errors.estoque.message}</small>
              )}
            </div>
          </div>

          <div className="editar-form-group">
            <label htmlFor="categoria">Categoria *</label>
            <input
              id="categoria"
              type="text"
              placeholder="Ex.: Eletrônicos"
              {...register('categoria')}
            />
            {errors.categoria && (
              <small>{errors.categoria.message}</small>
            )}
          </div>

          {errors.root?.server && (
            <div className="editar-alerta erro">
              {errors.root.server.message}
            </div>
          )}

          {sucesso && (
            <div className="editar-alerta sucesso">
              {sucesso}
            </div>
          )}

          <div className="editar-footer">
            <Link
              to={`/registros/${id}`}
              className="editar-cancelar"
            >
              Cancelar
            </Link>

            <button
              type="submit"
              className="editar-salvar"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Salvando...' : 'Salvar alterações'}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}

export default EditarProduto;
