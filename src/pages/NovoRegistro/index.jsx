import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { produtoSchema } from '../../schemas/produtoSchema';
import { supabase } from '../../services/supabase';
import { useAuth } from '../../hooks/useAuth';

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
    <main>
      <h1>Novo produto</h1>
      <p>Preencha os dados para cadastrar um produto.</p>

      <form onSubmit={handleSubmit(salvarProduto)}>
        <label htmlFor="nome">Nome do produto</label>
        <input
          id="nome"
          type="text"
          placeholder="Digite o nome do produto"
          {...register('nome')}
        />
        {errors.nome && <p role="alert">{errors.nome.message}</p>}

        <label htmlFor="descricao">Descrição</label>
        <textarea
          id="descricao"
          placeholder="Descreva o produto"
          {...register('descricao')}
        />
        {errors.descricao && (
          <p role="alert">{errors.descricao.message}</p>
        )}

        <label htmlFor="preco">Preço</label>
        <input
          id="preco"
          type="number"
          step="0.01"
          min="0.01"
          placeholder="Ex.: 29.90"
          {...register('preco')}
        />
        {errors.preco && <p role="alert">{errors.preco.message}</p>}

        <label htmlFor="categoria">Categoria</label>
        <input
          id="categoria"
          type="text"
          placeholder="Ex.: Eletrônicos"
          {...register('categoria')}
        />
        {errors.categoria && (
          <p role="alert">{errors.categoria.message}</p>
        )}

        <label htmlFor="estoque">Estoque</label>
        <input
          id="estoque"
          type="number"
          min="0"
          step="1"
          placeholder="Quantidade disponível"
          {...register('estoque')}
        />
        {errors.estoque && <p role="alert">{errors.estoque.message}</p>}

        {errors.root?.server && (
          <p role="alert">{errors.root.server.message}</p>
        )}

        {sucesso && <p role="status">{sucesso}</p>}

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Salvando...' : 'Cadastrar produto'}
        </button>
      </form>

      <p>
        <Link to="/registros">Voltar para os produtos</Link>
      </p>
    </main>
  );
}

export default NovoRegistro;
