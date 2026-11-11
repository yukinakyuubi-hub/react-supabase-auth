import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';
import { supabase } from '../../services/supabase';

function Detalhes() {
  const { id } = useParams();

  const [produto, setProduto] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    async function buscarProduto() {
      try {
        const { data, error } = await supabase
          .from('Produtos')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;

        setProduto(data);
      } catch (error) {
        setErro(error.message || 'Erro ao buscar produto.');
      } finally {
        setCarregando(false);
      }
    }

    buscarProduto();
  }, [id]);

  if (carregando) {
    return <p>Carregando detalhes do produto...</p>;
  }

  if (erro) {
    return (
      <main>
        <h1>Erro ao carregar produto</h1>
        <p>{erro}</p>
        <Link to="/registros">Voltar aos produtos</Link>
      </main>
    );
  }

  if (!produto) {
    return <p>Produto não encontrado.</p>;
  }

  return (
    <main>
      <h1>Detalhes do produto</h1>

      <h2>{produto.nome}</h2>

      <p>
        <strong>ID:</strong> {produto.id}
      </p>
      <p>
        <strong>Descrição:</strong> {produto.descricao}
      </p>
      <p>
        <strong>Preço:</strong> R$ {produto.preco}
      </p>
      <p>
        <strong>Categoria:</strong> {produto.categoria}
      </p>
      <p>
        <strong>Estoque:</strong> {produto.estoque}
      </p>

      <Link to="/registros">Voltar aos produtos</Link>
    </main>
  );
}

export default Detalhes;
