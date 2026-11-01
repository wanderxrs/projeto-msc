
import { useEffect, useState, useCallback } from "react";
import {
    listarParticipantes,
    listarUsuariosBloqueados,
    bloquearUsuario,
    desbloquearUsuario
} from "../../api";

import "./ModalGerenciarParticipantes.css";

function ModalGerenciarParticipantes({
    comunidadeId,
    onFechar,
    onMembrosAtualizados
}) {
    const [aba, setAba] = useState("participantes");
    const [participantes, setParticipantes] = useState([]);
    const [bloqueados, setBloqueados] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [mensagem, setMensagem] = useState("");
    const [processando, setProcessando] = useState(null);

    const carregarDados = useCallback(async () => {
        setCarregando(true);
        setMensagem("");

        try {
            const [respostaParticipantes, respostaBloqueados] =
                await Promise.all([
                    listarParticipantes(comunidadeId),
                    listarUsuariosBloqueados(comunidadeId)
                ]);

            setParticipantes(respostaParticipantes.data);
            setBloqueados(respostaBloqueados.data);

        } catch (erro) {
            console.error("Erro ao carregar participantes:", erro);

            setMensagem(
                erro.response?.data?.erro ||
                "Não foi possível carregar os participantes."
            );
        } finally {
            setCarregando(false);
        }
    }, [comunidadeId]);

    useEffect(() => {
    let ativo = true;

    async function carregar() {
        try {
            const [respostaParticipantes, respostaBloqueados] =
                await Promise.all([
                    listarParticipantes(comunidadeId),
                    listarUsuariosBloqueados(comunidadeId)
                ]);

            if (ativo) {
                setParticipantes(respostaParticipantes.data);
                setBloqueados(respostaBloqueados.data);
            }
        } catch (erro) {
            if (ativo) {
                console.error("Erro ao carregar participantes:", erro);

                setMensagem(
                    erro.response?.data?.erro ||
                    "Não foi possível carregar os participantes."
                );
            }
        } finally {
            if (ativo) {
                setCarregando(false);
            }
        }
    }

    carregar();

    return () => {
        ativo = false;
    };
}, [comunidadeId]);

    async function handleBloquear(usuarioId) {
        const confirmar = window.confirm(
            "Tem certeza que deseja bloquear este participante?"
        );

        if (!confirmar) return;

        setProcessando(usuarioId);
        setMensagem("");

        try {
            await bloquearUsuario(comunidadeId, usuarioId);

            await carregarDados();

            if (onMembrosAtualizados) {
                await onMembrosAtualizados();
            }

            setMensagem("Participante bloqueado com sucesso!");

        } catch (erro) {
            setMensagem(
                erro.response?.data?.erro ||
                "Erro ao bloquear participante."
            );
        } finally {
            setProcessando(null);
        }
    }

    async function handleDesbloquear(usuarioId) {
        const confirmar = window.confirm(
            "Tem certeza que deseja desbloquear este usuário?"
        );

        if (!confirmar) return;

        setProcessando(usuarioId);
        setMensagem("");

        try {
            await desbloquearUsuario(comunidadeId, usuarioId);

            await carregarDados();

            setMensagem("Usuário desbloqueado com sucesso!");

        } catch (erro) {
            setMensagem(
                erro.response?.data?.erro ||
                "Erro ao desbloquear usuário."
            );
        } finally {
            setProcessando(null);
        }
    }

    return (
        <div className="modal-gerenciar-overlay">
            <div className="modal-gerenciar">

                <div className="modal-gerenciar-header">
                    <div>
                        <h2>Gerenciar participantes</h2>
                        <p>Gerencie os membros da sua comunidade.</p>
                    </div>

                    <button
                        className="modal-gerenciar-fechar"
                        onClick={onFechar}
                    >
                        ×
                    </button>
                </div>

                <div className="modal-gerenciar-abas">
                    <button
                        className={aba === "participantes" ? "ativa" : ""}
                        onClick={() => {
                            setAba("participantes");
                            setMensagem("");
                        }}
                    >
                        Participantes ({participantes.length})
                    </button>

                    <button
                        className={aba === "bloqueados" ? "ativa" : ""}
                        onClick={() => {
                            setAba("bloqueados");
                            setMensagem("");
                        }}
                    >
                        Bloqueados ({bloqueados.length})
                    </button>
                </div>

                {mensagem && (
                    <p className="modal-gerenciar-mensagem">
                        {mensagem}
                    </p>
                )}

                <div className="modal-gerenciar-conteudo">
                    {carregando ? (
                        <p className="modal-gerenciar-vazio">
                            Carregando usuários...
                        </p>
                    ) : aba === "participantes" ? (
                        participantes.length === 0 ? (
                            <p className="modal-gerenciar-vazio">
                                Nenhum participante encontrado.
                            </p>
                        ) : (
                            participantes.map((usuario) => (
                                <div
                                    className="participante-item"
                                    key={usuario.id}
                                >
                                    <div className="participante-info">
                                        <img
                                            src={
                                                usuario.foto_url ||
                                                "/imagem-padrao.png"
                                            }
                                            alt={usuario.nome}
                                        />

                                        <span>{usuario.nome}</span>
                                    </div>

                                    <button
                                        className="botao-bloquear"
                                        disabled={processando === usuario.id}
                                        onClick={() =>
                                            handleBloquear(usuario.id)
                                        }
                                    >
                                        {processando === usuario.id
                                            ? "Aguarde..."
                                            : "Bloquear"}
                                    </button>
                                </div>
                            ))
                        )
                    ) : (
                        bloqueados.length === 0 ? (
                            <p className="modal-gerenciar-vazio">
                                Nenhum usuário bloqueado.
                            </p>
                        ) : (
                            bloqueados.map((usuario) => (
                                <div
                                    className="participante-item"
                                    key={usuario.id}
                                >
                                    <div className="participante-info">
                                        <img
                                            src={
                                                usuario.foto_url ||
                                                "/imagem-padrao.png"
                                            }
                                            alt={usuario.nome}
                                        />

                                        <span>{usuario.nome}</span>
                                    </div>

                                    <button
                                        className="botao-desbloquear"
                                        disabled={processando === usuario.id}
                                        onClick={() =>
                                            handleDesbloquear(usuario.id)
                                        }
                                    >
                                        {processando === usuario.id
                                            ? "Aguarde..."
                                            : "Desbloquear"}
                                    </button>
                                </div>
                            ))
                        )
                    )}
                </div>

                <div className="modal-gerenciar-footer">
                    <button onClick={onFechar}>
                        Fechar
                    </button>
                </div>

            </div>
        </div>
    );
}

export default ModalGerenciarParticipantes;
