import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import {
    buscarComunidade,
    entrarComunidade,
    sairComunidade
} from "../../api";

import { HiUsers } from "react-icons/hi";

import ModalGerenciarParticipantes from "../../modals/Comunidade/ModalGerenciarParticipantes";

import "./CabecalhoComunidade.css";

function CabecalhoComunidade({ onMembrosAtualizados }) {

    const { id } = useParams();

    const [comunidade, setComunidade] = useState(null);
    const [mensagem, setMensagem] = useState("");

    const [modalParticipantesAberto, setModalParticipantesAberto] = useState(false);

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

    // CARREGAMENTO
    if (!comunidade || Number(comunidade.id) !== Number(id)) {
        return <p>Carregando...</p>;
    }

    const totalMembros = Number(comunidade.total_membros) || 0;

    // IMAGEM DA CAPA
    const capaUrl =
        comunidade.capa_url ||
        comunidade.imagem_url ||
        "";

    return (
        <div className="informacoes-comunidade">

            {/* CAPA */}
            <div
                className="comunidade-capa"
                style={
                    capaUrl
                        ? {
                            backgroundImage: `url("${capaUrl}")`
                        }
                        : {}
                }
            />

            {/* IDENTIDADE DA COMUNIDADE */}
            <div className="comunidade-identidade">

                {/* FOTO QUADRADA */}
                <img
                    src={comunidade.imagem_url || "/avatar-padrao.png"}
                    alt={`Imagem da comunidade ${comunidade.nome}`}
                    className="imagem-comunidade"
                />

                {/* DADOS */}
                <div className="dados-comunidade">

                    <h1>{comunidade.nome}</h1>

                    {comunidade.genero && (
                        <p className="genero">
                            {comunidade.genero}
                        </p>
                    )}

                    {/* TOTAL DE MEMBROS */}
                    <div className="comunidade-total-membros">

                        <HiUsers size={16} />

                        <span>
                            {totalMembros}{" "}
                            {totalMembros === 1
                                ? "membro"
                                : "membros"}
                        </span>

                    </div>

                    {/* DESCRIÇÃO */}
                    {comunidade.descricao && (
                        <p className="comunidade-descricao">
                            {comunidade.descricao}
                        </p>
                    )}

                </div>

                {/* BOTÕES DE AÇÃO */}
                <div className="botoes-comunidade">

                    {!ehCriador && (
                        participando ? (

                            <button
                                type="button"
                                onClick={handleSair}
                                disabled={carregandoAcao}
                            >
                                {carregandoAcao
                                    ? "Saindo..."
                                    : "Sair da comunidade"}
                            </button>

                        ) : (

                            <button
                                type="button"
                                onClick={handleEntrar}
                                disabled={carregandoAcao}
                            >
                                {carregandoAcao
                                    ? "Entrando..."
                                    : "Entrar na comunidade"}
                            </button>

                        )
                    )}

                    {ehCriador && (

                        <button
                            type="button"
                            onClick={() => setModalParticipantesAberto(true)}
                        >
                            Gerenciar participantes
                        </button>

                    )}

                    {mensagem && (
                        <p className="mensagem-comunidade">
                            {mensagem}
                        </p>
                    )}

                </div>

            </div>

            {/* MODAL DE GERENCIAMENTO */}
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

export default CabecalhoComunidade;