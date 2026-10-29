import { useEffect, useState } from "react";
import {
    buscarComunidadeUsuario
} from "../../api";

import AtualizarComunidadeModal from "./atualizarComunidadeModal";
import CriarComunidadeModal from "./criarComunidadeModal";
import DeletarComunidadeModal from "./deletarComunidadeModal";

import "./minhasComunidadesModal.css";

function MinhasComunidadesModal({ isOpen, onClose }) {
    const [comunidades, setComunidades] = useState([]);
    const [carregando, setCarregando] = useState(false);
    const [erro, setErro] = useState("");

    const [comunidadeSelecionada, setComunidadeSelecionada] = useState(null);
    const [modalCriarAberto, setModalCriarAberto] = useState(false);
    const [modalEditarAberto, setModalEditarAberto] = useState(false);
    const [modalExcluirAberto, setModalExcluirAberto] = useState(false);

    async function carregarMinhasComunidades() {
        setCarregando(true);
        setErro("");

        try {
            const resposta = await buscarComunidadeUsuario();

            const dados = resposta.data;

            const lista = Array.isArray(dados)
                ? dados
                : Array.isArray(dados.comunidades)
                    ? dados.comunidades
                    : [];

            setComunidades(lista);
        } catch (erro) {
            console.error(
                "Erro ao carregar minhas comunidades:",
                erro.response?.data || erro.message
            );

            setErro(
                erro.response?.data?.erro ||
                "Não foi possível carregar suas comunidades."
            );
        } finally {
            setCarregando(false);
        }
    }

    useEffect(() => {
        if (isOpen) {
            carregarMinhasComunidades();
        }
    }, [isOpen]);

    function abrirEdicao(comunidade) {
        setComunidadeSelecionada(comunidade);
        setModalEditarAberto(true);
    }

    function abrirExclusao(comunidade) {
        setComunidadeSelecionada(comunidade);
        setModalExcluirAberto(true);
    }

    function finalizarEdicao() {
        setModalEditarAberto(false);
        setComunidadeSelecionada(null);
        carregarMinhasComunidades();
    }

    function finalizarCriacao() {
        setModalCriarAberto(false);
        carregarMinhasComunidades();
    }

    function finalizarExclusao() {
        setModalExcluirAberto(false);
        setComunidadeSelecionada(null);
        carregarMinhasComunidades();
    }

    if (!isOpen) {
        return null;
    }

    return (
        <>
            <div
                className="minhas-comunidades-fundo"
                onClick={onClose}
            >
                <section
                    className="minhas-comunidades-modal"
                    onClick={(e) => e.stopPropagation()}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="titulo-minhas-comunidades"
                >
                    <header className="minhas-comunidades-cabecalho">
                        <div>
                            <h2 id="titulo-minhas-comunidades">
                                Minhas comunidades
                            </h2>

                            <p>
                                Gerencie as comunidades que você criou.
                            </p>
                        </div>

                        <button
                            type="button"
                            className="minhas-comunidades-fechar"
                            onClick={onClose}
                            aria-label="Fechar"
                        >
                            ×
                        </button>
                    </header>

                    <div className="minhas-comunidades-acoes">
                        <span>
                            {comunidades.length}{" "}
                            {comunidades.length === 1
                                ? "comunidade"
                                : "comunidades"}
                        </span>

                        <button
                            type="button"
                            className="botao-criar-comunidade"
                            onClick={() => setModalCriarAberto(true)}
                        >
                            + Criar comunidade
                        </button>
                    </div>

                    <div className="minhas-comunidades-lista">
                        {carregando ? (
                            <p className="minhas-comunidades-mensagem">
                                Carregando comunidades...
                            </p>
                        ) : erro ? (
                            <div className="minhas-comunidades-mensagem">
                                <p>{erro}</p>

                                <button
                                    type="button"
                                    onClick={carregarMinhasComunidades}
                                >
                                    Tentar novamente
                                </button>
                            </div>
                        ) : comunidades.length === 0 ? (
                            <div className="minhas-comunidades-vazio">
                                <span>🎵</span>
                                <h3>Você ainda não criou comunidades</h3>
                                <p>
                                    Crie a primeira e reúna pessoas que
                                    compartilham seus gostos musicais.
                                </p>

                                <button
                                    type="button"
                                    className="botao-criar-comunidade"
                                    onClick={() => setModalCriarAberto(true)}
                                >
                                    Criar minha comunidade
                                </button>
                            </div>
                        ) : (
                            comunidades.map((comunidade) => (
                                <article
                                    className="minha-comunidade-card"
                                    key={comunidade.id ?? comunidade.comunidade_id}
                                >
                                    <img
                                        src={
                                            comunidade.imagem_url ||
                                            "/avatar-padrao.png"
                                        }
                                        alt=""
                                        className="minha-comunidade-imagem"
                                    />

                                    <div className="minha-comunidade-dados">
                                        <h3>{comunidade.nome}</h3>

                                        {comunidade.genero && (
                                            <span>
                                                {comunidade.genero}
                                            </span>
                                        )}

                                        <p>
                                            {comunidade.descricao ||
                                                "Sem descrição."}
                                        </p>
                                    </div>

                                    <div className="minha-comunidade-acoes">
                                        <button
                                            type="button"
                                            className="botao-editar-comunidade"
                                            onClick={() =>
                                                abrirEdicao(comunidade)
                                            }
                                        >
                                            Editar
                                        </button>

                                        <button
                                            type="button"
                                            className="botao-excluir-comunidade"
                                            onClick={() =>
                                                abrirExclusao(comunidade)
                                            }
                                        >
                                            Excluir
                                        </button>
                                    </div>
                                </article>
                            ))
                        )}
                    </div>
                </section>
            </div>

            <CriarComunidadeModal
                isOpen={modalCriarAberto}
                onClose={finalizarCriacao}
            />

            <AtualizarComunidadeModal
                isOpen={modalEditarAberto}
                onClose={finalizarEdicao}
                comunidade_id={
                    comunidadeSelecionada?.id ??
                    comunidadeSelecionada?.comunidade_id
                }
                comunidade={comunidadeSelecionada}
            />

            <DeletarComunidadeModal
                isOpen={modalExcluirAberto}
                onClose={finalizarExclusao}
                comunidade_id={
                    comunidadeSelecionada?.id ??
                    comunidadeSelecionada?.comunidade_id
                }
            />
        </>
    );
}

export default MinhasComunidadesModal;