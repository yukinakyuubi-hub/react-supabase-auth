import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';
import { supabase } from '../../services/supabase';
import './Detalhes.css';

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

  function formatarPreco(preco) {
    const valor = Number(preco);

    if (Number.isNaN(valor)) return 'Não informado';

    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  }

  if (carregando) {
    return (
      <main className="detalhes-container">
        <div className="detalhes-message">
          <div className="detalhes-loading"></div>
          <p>Carregando detalhes do produto...</p>
        </div>
      </main>
    );
  }

  if (erro) {
    return (
      <main className="detalhes-container">
        <div className="detalhes-message detalhes-error">
          <h1>Erro ao carregar produto</h1>
          <p>{erro}</p>
          <Link to="/registros" className="detalhes-back-button">
            Voltar aos produtos
          </Link>
        </div>
      </main>
    );
  }

  if (!produto) {
    return (
      <main className="detalhes-container">
        <div className="detalhes-message">
          <h1>Produto não encontrado</h1>
          <p>Não encontramos o produto solicitado.</p>
          <Link to="/registros" className="detalhes-back-button">
            Voltar aos produtos
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="detalhes-container">
      <section className="detalhes-header">
        <div>
          <span className="hero-tag">GERENCIAMENTO</span>
          <h1>Detalhes do produto</h1>
          <p>Confira todas as informações deste produto.</p>
        </div>

        <div className="detalhes-acoes">
          <Link
            to={`/registros/${id}/editar`}
            className="detalhes-edit-button"
          >
            Editar produto
          </Link>

          <Link to="/registros" className="detalhes-back-button">
            ← Voltar aos produtos
          </Link>
        </div>
      </section>

      <section className="detalhes-card">
        <div className="detalhes-card-top">
          <div className="detalhes-product-icon">P</div>

          <div className="detalhes-product-heading">
            <span className="detalhes-label">PRODUTO CADASTRADO</span>
            <h2>{produto.nome}</h2>
            <span className="detalhes-category">
              {produto.categoria || 'Sem categoria'}
            </span>
          </div>
        </div>

        <div className="detalhes-price">
          <span>PREÇO DO PRODUTO</span>
          <strong>{formatarPreco(produto.preco)}</strong>
        </div>

        <div className="detalhes-information">
          <h3>Informações gerais</h3>

          <div className="detalhes-information-grid">
            <div className="detalhes-info-item">
              <span>Identificação</span>
              <strong>#{produto.id}</strong>
            </div>

            <div className="detalhes-info-item">
              <span>Categoria</span>
              <strong>{produto.categoria || 'Não informada'}</strong>
            </div>

            <div className="detalhes-info-item">
              <span>Estoque disponível</span>
              <strong>
                {produto.estoque ?? 'Não informado'}
                {produto.estoque !== null &&
                  produto.estoque !== undefined &&
                  ' unidades'}
              </strong>
            </div>
          </div>
        </div>

        <div className="detalhes-description">
          <h3>Descrição do produto</h3>
          <p>
            {produto.descricao || 'Nenhuma descrição foi informada para este produto.'}
          </p>
        </div>

        <div className="detalhes-footer">
          <span>Informações cadastradas no sistema.</span>

          <Link to="/registros" className="detalhes-footer-button">
            Voltar para a lista
          </Link>
        </div>
      </section>
    </main>
  );
}

export default Detalhes;
