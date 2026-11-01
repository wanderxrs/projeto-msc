
import { useEffect, useState } from "react";
import { FaBell, FaHeart, FaComment } from "react-icons/fa6";
import { FiX } from "react-icons/fi";

import { carregarNotificacoes } from "../../api";

import "./modalNotificacoes.css";

function ModalNotificacoes({ onClose }) {

    const [notificacoes, setNotificacoes] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("");

    useEffect(() => {
        async function buscarNotificacoes() {
            try {
                setCarregando(true);
                setErro("");

                const resposta = await carregarNotificacoes();

                setNotificacoes(resposta.data);

            } catch (error) {
                console.error("Erro ao carregar notificações:", error);
                setErro("Não foi possível carregar as notificações.");
            } finally {
                setCarregando(false);
            }
        }

        buscarNotificacoes();
    }, []);

    useEffect(() => {
        function fecharComEsc(e) {
            if (e.key === "Escape") {
                onClose();
            }
        }

        document.addEventListener("keydown", fecharComEsc);

        return () => {
            document.removeEventListener("keydown", fecharComEsc);
        };
    }, [onClose]);

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

    function mensagemNotificacao(notificacao) {
        if (notificacao.tipo === "curtida") {
            return "curtiu sua publicação.";
        }

        if (notificacao.tipo === "comentario") {
            return "comentou na sua publicação.";
        }

        return "interagiu com sua publicação.";
    }

    function iconeNotificacao(notificacao) {
        if (notificacao.tipo === "curtida") {
            return <FaHeart />;
        }

        if (notificacao.tipo === "comentario") {
            return <FaComment />;
        }

        return <FaBell />;
    }

    return (
        <div
            className="notificacoes-overlay"
            onClick={onClose}
        >

            <div
                className="modal-notificacoes"
                onClick={(e) => e.stopPropagation()}
            >

                <div className="notificacoes-cabecalho">

                    <div className="notificacoes-titulo">
                        <FaBell />
                        <h2>Notificações</h2>
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

                <div className="notificacoes-conteudo">

                    {carregando ? (

                        <div className="notificacoes-vazias">
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

                                    <div className="notificacao-foto">
                                        {notificacao.foto_url ? (
                                            <img
                                                src={notificacao.foto_url}
                                                alt={notificacao.nome_usuario}
                                            />
                                        ) : (
                                            <div className="foto-padrao">
                                                {notificacao.nome_usuario?.charAt(0)?.toUpperCase() || "U"}
                                            </div>
                                        )}
                                    </div>

                                    <div className="notificacao-texto">

                                        <p>
                                            <strong>
                                                {notificacao.nome_usuario}
                                            </strong>{" "}

                                            {mensagemNotificacao(notificacao)}
                                        </p>

                                        {notificacao.legenda && (
                                            <span className="notificacao-legenda">
                                                {notificacao.legenda}
                                            </span>
                                        )}

                                        <small>
                                            {formatarData(notificacao.data_criacao)}
                                        </small>

                                    </div>

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
}

export default ModalNotificacoes;
