
import { useEffect, useState } from "react";
import axios from "axios";
import "./ModalArtistasEmAlta.css";
import { HiMusicNote } from "react-icons/hi";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function formatarNumero(numero) {
  return new Intl.NumberFormat("pt-BR", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(numero || 0);
}

export default function ModalArtistasEmAlta({ onFechar }) {
  const [artistas, setArtistas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    let ativo = true;

    async function carregarArtistas() {
      try {
        const resposta = await axios.get(
          `${API_URL}/artistas-em-alta`
        );

        if (ativo) {
          setArtistas(resposta.data.artistas || []);
        }
      } catch (erro) {
        if (ativo) {
          setErro("Não foi possível carregar os artistas.");
        }
      } finally {
        if (ativo) {
          setCarregando(false);
        }
      }
    }

    carregarArtistas();

    return () => {
      ativo = false;
    };
  }, []);

  useEffect(() => {
    function fecharComEsc(evento) {
      if (evento.key === "Escape") {
        onFechar();
      }
    }

    document.addEventListener("keydown", fecharComEsc);

    return () => {
      document.removeEventListener("keydown", fecharComEsc);
    };
  }, [onFechar]);

  return (
    <div
      className="artistas-overlay"
      onClick={onFechar}
    >
      <section
        className="modal-artistas"
        role="dialog"
        aria-modal="true"
        aria-labelledby="titulo-artistas"
        onClick={(evento) => evento.stopPropagation()}
      >
        <header className="artistas-header">
          <div className="artistas-titulo">
            <span className="artistas-icone">
              <i className="bi bi-graph-up-arrow" />
              <HiMusicNote />
            </span>
            

            <div>
              <h2 id="titulo-artistas">O que está bombando?</h2>
              <p>Artistas populares no Brasil</p>
            </div>
          </div>

          <button
            type="button"
            className="artistas-fechar"
            onClick={onFechar}
            aria-label="Fechar modal"
          >
            &times;
          </button>
        </header>

        <div className="artistas-lista">
          {carregando && (
            <p className="artistas-mensagem">
              Carregando artistas...
            </p>
          )}

          {!carregando && erro && (
            <p className="artistas-mensagem artistas-erro">
              {erro}
            </p>
          )}

          {!carregando && !erro && artistas.length === 0 && (
            <p className="artistas-mensagem">
              Nenhum artista encontrado.
            </p>
          )}

          {!carregando &&
            !erro &&
            artistas.map((artista) => (
              <div
                className="artista-item"
                key={`${artista.posicao}-${artista.nome}`}
              >
                <span
                  className={`artista-posicao ${
                    artista.posicao <= 3 ? "artista-top3" : ""
                  }`}
                >
                  {String(artista.posicao).padStart(2, "0")}
                </span>

                <img
                  className="artista-foto"
                  src={artista.foto || ""}
                  alt=""
                  onError={(evento) => {
                    evento.currentTarget.style.display = "none";
                  }}
                />

                <div className="artista-info">
                  <span className="artista-nome">
                    {artista.nome}
                  </span>
                </div>

                {artista.posicao === 1 && (
                  <i className="bi bi-trophy-fill artista-trofeu" />
                )}

                {artista.url && (
                  <a
                    className="artista-link"
                    href={artista.url}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`Ver ${artista.nome} na Last.fm`}
                    onClick={(evento) => evento.stopPropagation()}
                  >
                    <i className="bi bi-box-arrow-up-right" />
                  </a>
                )}
              </div>
            ))}
        </div>

        <footer className="artistas-footer">
          <span>Top 10 Brasil</span>
          <span>Dados da Deezer</span>
        </footer>
      </section>
    </div>
  );
}
