 
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import { FaBell, FaHeart, FaComment } from "react-icons/fa6";
import { FiX } from "react-icons/fi";

import { carregarNotificacoes } from "../../api";

import "./modalNotificacoes.css";

function ModalNotificacoes({ onClose }) {
    const [notificacoes, setNotificacoes] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("");

    // Buscar notificações
    useEffect(() => {
        async function buscarNotificacoes() {
            try {
                setCarregando(true);
                setErro("");

                const resposta = await carregarNotificacoes();

                setNotificacoes(
                    Array.isArray(resposta.data) ? resposta.data : []
                );
            } catch (error) {
                console.error("Erro ao carregar notificações:", error);
                setErro("Não foi possível carregar as notificações.");
            } finally {
                setCarregando(false);
            }
        }

        buscarNotificacoes();
    }, []);

    // Fechar com ESC e bloquear rolagem da página
    useEffect(() => {
        function fecharComEsc(event) {
            if (event.key === "Escape") {
                onClose();
            }
        }

        const overflowAnterior = document.body.style.overflow;

        document.body.style.overflow = "hidden";

        document.addEventListener("keydown", fecharComEsc);

        return () => {
            document.removeEventListener("keydown", fecharComEsc);
            document.body.style.overflow = overflowAnterior;
        };
    }, [onClose]);

    // Formatar data
    function formatarData(data) {
        if (!data) return "";

        const dataNotificacao = new Date(data);

        if (isNaN(dataNotificacao.getTime())) {
            return "";
        }

        return dataNotificacao.toLocaleString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    }

    // Mensagem da notificação
    function mensagemNotificacao(notificacao) {
        if (notificacao.tipo === "curtida") {
            return "curtiu sua publicação.";
        }

        if (notificacao.tipo === "comentario") {
            return "comentou na sua publicação.";
        }

        return "interagiu com sua publicação.";
    }

    // Ícone da notificação
    function iconeNotificacao(notificacao) {
        if (notificacao.tipo === "curtida") {
            return <FaHeart />;
        }

        if (notificacao.tipo === "comentario") {
            return <FaComment />;
        }

        return <FaBell />;
    }

    // Conteúdo do modal
    const modal = (
        <div
            className="notificacoes-overlay"
            onClick={onClose}
        >
            <div
                className="modal-notificacoes"
                onClick={(event) => event.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-labelledby="titulo-notificacoes"
            >
                {/* CABEÇALHO */}
                <div className="notificacoes-cabecalho">
                    <div className="notificacoes-titulo">
                        <FaBell />

                        <h2 id="titulo-notificacoes">
                            Notificações
                        </h2>
                    </div>

                    <button
                        type="button"
                        className="fechar-notificacoes"
                        onClick={onClose}
                        aria-label="Fechar notificações"
                    >
                        <FiX />
                    </button>
                </div>

                {/* CONTEÚDO */}
                <div className="notificacoes-conteudo">
                    {carregando ? (
                        <div className="notificacoes-vazias">
                            <FaBell />

                            <p>Carregando notificações...</p>
                        </div>
                    ) : erro ? (
                        <div className="notificacoes-vazias">
                            <FaBell />

                            <h3>Ops!</h3>

                            <p>{erro}</p>
                        </div>
                    ) : notificacoes.length === 0 ? (
                        <div className="notificacoes-vazias">
                            <FaBell />

                            <h3>Nenhuma notificação</h3>

                            <p>
                                Quando alguém interagir com você,
                                as notificações aparecerão aqui.
                            </p>
                        </div>
                    ) : (
                        <div className="lista-notificacoes">
                            {notificacoes.map((notificacao) => (
                                <div
                                    className="item-notificacao"
                                    key={notificacao.id}
                                >
                                    {/* FOTO DO USUÁRIO */}
                                    <div className="notificacao-foto">
                                        {notificacao.foto_url ? (
                                            <img
                                                src={notificacao.foto_url}
                                                alt={
                                                    notificacao.nome_usuario ||
                                                    "Foto do usuário"
                                                }
                                            />
                                        ) : (
                                            <div className="foto-padrao">
                                                {notificacao.nome_usuario
                                                    ?.charAt(0)
                                                    ?.toUpperCase() || "U"}
                                            </div>
                                        )}
                                    </div>

                                    {/* TEXTO */}
                                    <div className="notificacao-texto">
                                        <p>
                                            <strong>
                                                {notificacao.nome_usuario ||
                                                    "Usuário"}
                                            </strong>{" "}

                                            {mensagemNotificacao(notificacao)}
                                        </p>

                                        {notificacao.legenda && (
                                            <span className="notificacao-legenda">
                                                {notificacao.legenda}
                                            </span>
                                        )}

                                        <small>
                                            {formatarData(
                                                notificacao.data_criacao
                                            )}
                                        </small>
                                    </div>

                                    {/* ÍCONE */}
                                    <div className="notificacao-icone">
                                        {iconeNotificacao(notificacao)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    // Renderiza diretamente no body para evitar problemas de posicionamento
    return createPortal(modal, document.body);
}

export default ModalNotificacoes;
