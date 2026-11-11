import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { supabase, supabaseConfigOk } from '../../services/supabase';

function Registros() {
  const [produtos, setProdutos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    async function buscarProdutos() {
      if (!supabaseConfigOk) {
        setCarregando(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('Produtos')
          .select('*')
          .order('id', { ascending: true });

        if (error) throw error;

        setProdutos(data || []);
      } catch (error) {
        setErro(error.message || 'Erro ao buscar produtos.');
      } finally {
        setCarregando(false);
      }
    }

    buscarProdutos();
  }, []);

  if (!supabaseConfigOk) {
    return <p>Erro: confira as variáveis do arquivo .env.</p>;
  }

  if (carregando) return <p>Carregando produtos...</p>;

  if (erro) return <p>Erro ao consultar produtos: {erro}</p>;

  return (
    <main>
      <h1>Produtos cadastrados</h1>

      {produtos.length === 0 ? (
        <p>Nenhum produto cadastrado.</p>
      ) : (
        produtos.map((produto) => (
          <article key={produto.id}>
            <h2>{produto.nome}</h2>
            <p>{produto.descricao}</p>
            <p>Preço: R$ {produto.preco}</p>
            <p>Categoria: {produto.categoria}</p>
            <p>Estoque: {produto.estoque}</p>

            <Link to={`/registros/${produto.id}`}>Ver detalhes</Link>

            <hr />
          </article>
        ))
      )}
    </main>
  );
}

export default Registros;
