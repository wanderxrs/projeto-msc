
import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import {
    buscarComunidade,
    entrarComunidade,
    sairComunidade
} from "../../api";
import { HiUsers } from "react-icons/hi";
import ModalGerenciarParticipantes from "../../modals/Comunidade/ModalGerenciarParticipantes";
import "./informacoesComunidade.css";

function InformacoesComunidade({ onMembrosAtualizados }) {

    const { id } = useParams();

    const [comunidade, setComunidade] = useState(null);
    const [mensagem, setMensagem] = useState("");
    const [modalParticipantesAberto, setModalParticipantesAberto] = useState(false);

    const ehCriador = comunidade?.eh_criador === true;
    const participando = comunidade?.participando === true;

    const carregarComunidade = useCallback(async () => {
        try {
            const resposta = await buscarComunidade(id);
            setComunidade(resposta.data);

        } catch (erro) {
            console.error("Erro ao carregar comunidade:", erro);
        }
    }, [id]);

    useEffect(() => {
        let ativo = true;

        async function carregar() {
            try {
                const resposta = await buscarComunidade(id);

                if (ativo) {
                    setComunidade(resposta.data);
                }

            } catch (erro) {
                if (ativo) {
                    console.error("Erro ao carregar comunidade:", erro);
                }
            }
        }

        carregar();

        return () => {
            ativo = false;
        };
    }, [id]);

    // Entrar na comunidade
    const handleEntrar = async () => {
        setMensagem("");

        try {
            const resposta = await entrarComunidade(id);

            setMensagem(resposta.data.mensagem);

            await carregarComunidade();

            if (onMembrosAtualizados) {
                await onMembrosAtualizados();
            }

        } catch (erro) {
            setMensagem(
                erro.response?.data?.erro ||
                "Erro ao entrar na comunidade"
            );
        }
    };

    // Sair da comunidade
    const handleSair = async () => {
        setMensagem("");

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
                "Erro ao sair da comunidade"
            );
        }
    };

    // Evita mostrar os dados da comunidade anterior enquanto carrega outra
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

                <p className="genero">{comunidade.genero}</p>

                <div className="comunidade-total-membros">
                    <HiUsers size={16} />

                    <span>
                        {totalMembros}{" "}
                        {totalMembros === 1
                            ? "membro"
                            : "membros"}
                    </span>
                </div>

                <p>{comunidade.descricao}</p>

            </div>

            <div className="botoes-comunidade">

                {participando ? (
                    <button onClick={handleSair}>
                        Sair da comunidade
                    </button>
                ) : (
                    <button onClick={handleEntrar}>
                        Entrar na comunidade
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

            {modalParticipantesAberto && (
                <ModalGerenciarParticipantes
                    comunidadeId={id}
                    onFechar={() => setModalParticipantesAberto(false)}
                    onMembrosAtualizados={carregarComunidade}
                />
            )}

        </div>
    );
}

export default InformacoesComunidade;
