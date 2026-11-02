import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";

import {
    buscarComunidade,
    entrarComunidade,
    sairComunidade
} from "../../api";

import { HiUsers } from "react-icons/hi";

import ModalGerenciarParticipantes from "../../modals/Comunidade/ModalGerenciarParticipantes";
import DeletarComunidadeModal from "../../modals/Comunidade/DeletarComunidadeModal";

import "./informacoesComunidade.css";

function InformacoesComunidade({ onMembrosAtualizados }) {

    const { id } = useParams();

    const navigate = useNavigate();
    const location = useLocation();

    const [comunidade, setComunidade] = useState(null);
    const [mensagem, setMensagem] = useState("");

    const [modalParticipantesAberto, setModalParticipantesAberto] = useState(false);
    const [modalExclusaoAberto, setModalExclusaoAberto] = useState(false);

    const [carregandoAcao, setCarregandoAcao] = useState(false);

    const ehCriador = comunidade?.eh_criador === true;
    const participando = comunidade?.participando === true;

    // CARREGAR COMUNIDADE

    const carregarComunidade = async () => {
        try {
            const resposta = await buscarComunidade(id);

            setComunidade(resposta.data);

            return resposta.data;

        } catch (erro) {
            console.error("Erro ao carregar comunidade:", erro);
            throw erro;
        }
    };

    useEffect(() => {
        let ativo = true;

        async function carregar() {
            try {
                const resposta = await buscarComunidade(id);

                if (ativo) {
                    setComunidade(resposta.data);
                }

            } catch (erro) {
                console.error("Erro ao carregar comunidade:", erro);
            }
        }

        carregar();

        return () => {
            ativo = false;
        };

    }, [id]);

    // ABRIR MODAL APÓS CONFIRMAR SENHA

    useEffect(() => {

        if (location.state?.abrirModalExclusao) {

            setModalExclusaoAberto(true);

            // Limpa o estado para não abrir novamente
            navigate(location.pathname, {
                replace: true,
                state: null
            });
        }

    }, [location.state, location.pathname, navigate]);

    // ENTRAR NA COMUNIDADE

    const handleEntrar = async () => {

        if (carregandoAcao) return;

        setMensagem("");
        setCarregandoAcao(true);

        try {
            const resposta = await entrarComunidade(id);

            setMensagem(resposta.data.mensagem);

            await carregarComunidade();

            if (onMembrosAtualizados) {
                await onMembrosAtualizados();
            }

        } catch (erro) {

            const status = erro.response?.status;

            if (status === 403) {
                setMensagem(
                    "Você foi bloqueado pelo criador desta comunidade."
                );

            } else if (status === 409) {
                setMensagem(
                    "Você já participa desta comunidade."
                );

            } else if (status === 404) {
                setMensagem(
                    "Comunidade não encontrada."
                );

            } else {
                setMensagem(
                    erro.response?.data?.erro ||
                    "Erro ao entrar na comunidade."
                );
            }

        } finally {
            setCarregandoAcao(false);
        }
    };

    // SAIR DA COMUNIDADE

    const handleSair = async () => {

        if (carregandoAcao) return;

        setMensagem("");
        setCarregandoAcao(true);

        try {
            const resposta = await sairComunidade(id);

            setMensagem(resposta.data.mensagem);

            await carregarComunidade();

            if (onMembrosAtualizados) {
                await onMembrosAtualizados();
            }

        } catch (erro) {

            setMensagem(
                erro.response?.data?.erro ||
                "Erro ao sair da comunidade."
            );

        } finally {
            setCarregandoAcao(false);
        }
    };

    // INICIAR EXCLUSÃO DA COMUNIDADE

    const handleIniciarExclusao = () => {

        navigate("/confirmar-senha", {
            state: {
                acao: "excluir-comunidade",
                comunidadeId: id,
                returnTo: location.pathname
            }
        });

    };

    // FECHAR MODAL DE EXCLUSÃO

    const fecharModalExclusao = () => {
        setModalExclusaoAberto(false);
    };

    // CARREGAMENTO

    if (!comunidade || Number(comunidade.id) !== Number(id)) {
        return <p>Carregando...</p>;
    }

    const totalMembros = Number(comunidade.total_membros) || 0;

    return (
        <div className="informacoes-comunidade">

            <img
                src={comunidade.imagem_url}
                alt={`Imagem da comunidade ${comunidade.nome}`}
                className="imagem-comunidade"
            />

            <div className="dados-comunidade">

                <h1>{comunidade.nome}</h1>

                <p className="genero">
                    {comunidade.genero}
                </p>

                <div className="comunidade-total-membros">

                    <HiUsers size={16} />

                    <span>
                        {totalMembros}{" "}
                        {totalMembros === 1 ? "membro" : "membros"}
                    </span>

                </div>

                <p>{comunidade.descricao}</p>

            </div>

            <div className="botoes-comunidade">

                {ehCriador ? (

                    <button
                        onClick={handleIniciarExclusao}
                        disabled={carregandoAcao}
                    >
                        Excluir comunidade
                    </button>

                ) : participando ? (

                    <button
                        onClick={handleSair}
                        disabled={carregandoAcao}
                    >
                        {carregandoAcao
                            ? "Saindo..."
                            : "Sair da comunidade"}
                    </button>

                ) : (

                    <button
                        onClick={handleEntrar}
                        disabled={carregandoAcao}
                    >
                        {carregandoAcao
                            ? "Entrando..."
                            : "Entrar na comunidade"}
                    </button>

                )}

                {ehCriador && (

                    <button
                        onClick={() => setModalParticipantesAberto(true)}
                    >
                        Gerenciar participantes
                    </button>

                )}

                {mensagem && <p>{mensagem}</p>}

            </div>

            {/* MODAL DE GERENCIAMENTO */}

            {modalParticipantesAberto && (

                <ModalGerenciarParticipantes
                    comunidadeId={id}
                    onFechar={() => setModalParticipantesAberto(false)}
                    onMembrosAtualizados={carregarComunidade}
                />

            )}

            {/* MODAL DE EXCLUSÃO */}

            <DeletarComunidadeModal
                isOpen={modalExclusaoAberto}
                onClose={fecharModalExclusao}
                comunidade_id={id}
                onDeleted={() => navigate("/home")}
            />

        </div>
    );
}

export default InformacoesComunidade;