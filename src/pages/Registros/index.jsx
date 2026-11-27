
import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { supabase, supabaseConfigOk } from '../../services/supabase';
import './Registros.css';

function Registros() {
  const [produtos, setProdutos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [pesquisa, setPesquisa] = useState('');

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

  const produtosFiltrados = produtos.filter((produto) =>
    (produto.nome || '')
      .toLowerCase()
      .includes(pesquisa.toLowerCase())
  );

  function formatarPreco(preco) {
    const valor = Number(preco);

    if (Number.isNaN(valor)) return 'Não informado';

    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  }

  if (!supabaseConfigOk) {
    return (
      <main className="registros-container">
        <div className="registros-message">
          <h2>Configuração necessária</h2>
          <p>Confira as variáveis do arquivo .env.</p>
        </div>
      </main>
    );
  }

  if (carregando) {
    return (
      <main className="registros-container">
        <div className="registros-message">
          <div className="loading-circle"></div>
          <p>Carregando produtos...</p>
        </div>
      </main>
    );
  }

  if (erro) {
    return (
      <main className="registros-container">
        <div className="registros-message registros-error">
          <h2>Não foi possível carregar os produtos</h2>
          <p>{erro}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="registros-container">
      <section className="registros-header">
        <div>
          <span className="hero-tag">GERENCIAMENTO</span>
          <h1>Produtos cadastrados</h1>
          <p>
            Consulte e organize todos os produtos registrados no sistema.
          </p>
        </div>

        <Link to="/registros/novo" className="registros-new-button">
          + Novo produto
        </Link>
      </section>

      <section className="registros-summary">
        <div className="registros-summary-icon">P</div>
        <div>
          <span>Total de produtos</span>
          <strong>{produtos.length}</strong>
        </div>
      </section>

      <section className="registros-list">
        <div className="registros-list-header">
          <div>
            <h2>Lista de produtos</h2>
            <p>Encontre rapidamente o produto que procura.</p>
          </div>

          <div className="registros-search">
            <span>⌕</span>
            <input
              type="text"
              placeholder="Pesquisar produto..."
              value={pesquisa}
              onChange={(e) => setPesquisa(e.target.value)}
            />
          </div>
        </div>

        {produtosFiltrados.length === 0 ? (
          <div className="registros-empty">
            <div className="registros-empty-icon">P</div>

            <h3>
              {produtos.length === 0
                ? 'Nenhum produto cadastrado'
                : 'Nenhum resultado encontrado'}
            </h3>

            <p>
              {produtos.length === 0
                ? 'Comece adicionando seu primeiro produto.'
                : 'Tente pesquisar usando outro nome.'}
            </p>

            {produtos.length === 0 && (
              <Link to="/registros/novo" className="registros-new-button">
                Cadastrar primeiro produto
              </Link>
            )}
          </div>
        ) : (
          <div className="registros-grid">
            {produtosFiltrados.map((produto) => (
              <article className="produto-card" key={produto.id}>
                <div className="produto-card-top">
                  <div className="produto-icon">P</div>

                  <span className="produto-category">
                    {produto.categoria || 'Sem categoria'}
                  </span>
                </div>

                <h3>{produto.nome}</h3>

                <p className="produto-description">
                  {produto.descricao || 'Nenhuma descrição informada.'}
                </p>

                <div className="produto-details">
                  <div className="produto-price">
                    <span>PREÇO DO PRODUTO</span>
                    <strong>{formatarPreco(produto.preco)}</strong>
                  </div>

                  <div className="produto-stock">
                    <span>ESTOQUE DISPONÍVEL</span>
                    <strong>
                      {produto.estoque ?? 'Não informado'}
                      {produto.estoque !== null &&
                        produto.estoque !== undefined &&
                        ' unidades'}
                    </strong>
                  </div>
                </div>

                <Link
                  to={`/registros/${produto.id}`}
                  className="produto-details-button"
                >
                  Ver detalhes <span>→</span>
                </Link>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default Registros;
