import { useEffect, useState } from "react";
import axios from "axios";
import { HiMusicNote } from "react-icons/hi";

import "./ModalArtistasEmAlta.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function ModalArtistasEmAlta({ onFechar }) {
    const [artistas, setArtistas] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("");

    // Buscar artistas na API
    useEffect(() => {
        async function carregarArtistas() {
            try {
                const resposta = await axios.get(
                    `${API_URL}/artistas-em-alta`
                );

                setArtistas(resposta.data.artistas || []);
            } catch (erro) {
                console.error("Erro ao carregar artistas:", erro);
                setErro("Não foi possível carregar os artistas.");
            } finally {
                setCarregando(false);
            }
        }

        carregarArtistas();
    }, []);

    return (
        <div className="artistas-overlay" onClick={onFechar}>
            <section
                className="modal-artistas"
                role="dialog"
                aria-modal="true"
                aria-labelledby="titulo-artistas"
                onClick={(evento) => evento.stopPropagation()}
            >
                {/* CABEÇALHO */}
                <header className="artistas-header">
                    <div className="artistas-titulo">
                        <span className="artistas-icone">
                            <HiMusicNote />
                        </span>

                        <div>
                            <h2 id="titulo-artistas">
                                Artistas em alta
                            </h2>

                            <p>Os artistas mais populares</p>
                        </div>
                    </div>

                    <button
                        type="button"
                        className="artistas-fechar"
                        onClick={onFechar}
                        aria-label="Fechar modal"
                    >
                        ×
                    </button>
                </header>

                {/* LISTA DE ARTISTAS */}
                <div className="artistas-lista">
                    {carregando && (
                        <p className="artistas-mensagem">
                            Carregando artistas...
                        </p>
                    )}

                    {erro && (
                        <p className="artistas-mensagem artistas-erro">
                            {erro}
                        </p>
                    )}

                    {!carregando && !erro && artistas.length === 0 && (
                        <p className="artistas-mensagem">
                            Nenhum artista encontrado.
                        </p>
                    )}

                    {!carregando && !erro &&
                        artistas.map((artista) => (
                            <a
                                className="artista-item"
                                key={artista.posicao}
                                href={artista.url || undefined}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={`Abrir perfil de ${artista.nome} na Deezer`}
                                onClick={(evento) => {
                                    if (!artista.url) {
                                        evento.preventDefault();
                                    }
                                }}
                            >
                                <span className="artista-posicao">
                                    {String(artista.posicao).padStart(2, "0")}
                                </span>

                                <img
                                    className="artista-foto"
                                    src={artista.foto || ""}
                                    alt={artista.nome}
                                    onError={(evento) => {
                                        evento.currentTarget.style.display = "none";
                                    }}
                                />

                                <div className="artista-info">
                                    <span className="artista-nome">
                                        {artista.nome}
                                    </span>
                                </div>
                            </a>
                        ))}
                </div>

                {/* RODAPÉ */}
                <footer className="artistas-footer">
                    <span>Dados da Deezer</span>
                </footer>
            </section>
        </div>
    );
}
