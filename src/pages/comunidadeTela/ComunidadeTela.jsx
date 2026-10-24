import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import {
    buscarPublicacoesDaComunidade,
    curtirPublicacao,
    buscarComunidade
} from "../../api";

import InformacoesComunidade from "../../components/cabecalhoComunidade/InformacoesComunidade";
import Publicacao from "../../components/PublicaçãoComponente/Publicacao";
import ModalPublicacao from "../../modals/ModalPublicacao";
import ModalApagarPublicacao from "../../modals/Publicacoes/ModalApagarPublicacao";

import "./ComunidadeTela.css";

function obterUsuarioLogadoId() {
    try {
        const usuarioSalvo = localStorage.getItem("usuario");

        if (usuarioSalvo) {
            const usuario = JSON.parse(usuarioSalvo);

            if (usuario?.id != null) {
                return usuario.id;
            }
        }

        const token = localStorage.getItem("token");

        if (token) {
            const partes = token.split(".");

            if (partes.length === 3) {
                const payload = JSON.parse(atob(partes[1]));

                if (payload?.id != null) {
                    return payload.id;
                }

                if (payload?.user_id != null) {
                    return payload.user_id;
                }
            }
        }
    } catch (erro) {
        console.error("Erro ao obter usuário logado:", erro);
    }

    return null;
}

function ComunidadeTela() {
    const { id } = useParams();

    const [publicacoes, setPublicacoes] = useState([]);
    const [curtidas, setCurtidas] = useState({});
    const [modalAberto, setModalAberto] = useState(false);
    const [publicacaoSelecionada, setPublicacaoSelecionada] = useState(null);
    const [comunidade, setComunidade] = useState(null);
    const [usuarioId, setUsuarioId] = useState(null);

    useEffect(() => {
        setUsuarioId(obterUsuarioLogadoId());
    }, []);

    async function buscarDadosComunidade() {
        try {
            const response = await buscarComunidade(id);
            setComunidade(response.data);
        } catch (erro) {
            console.error(
                "Erro ao carregar comunidade:",
                erro.response?.data || erro.message
            );
        }
    }

    async function buscarPublicacoes() {
        try {
            const response = await buscarPublicacoesDaComunidade(id);

            const lista = Array.isArray(response.data)
                ? response.data
                : [];

            setPublicacoes(lista);

            const estadoCurtidas = {};

            lista.forEach((publicacao) => {
                estadoCurtidas[publicacao.id] = Boolean(
                    publicacao.curtida_usuario
                );
            });

            setCurtidas(estadoCurtidas);
        } catch (erro) {
            console.error(
                "Erro ao carregar publicações:",
                erro.response?.data || erro.message
            );
        }
    }

    useEffect(() => {
        buscarDadosComunidade();
        buscarPublicacoes();
    }, [id]);

    async function handleCurtir(publicacaoId) {
        try {
            await curtirPublicacao(publicacaoId);

            const novoValor = !curtidas[publicacaoId];

            setCurtidas((anteriores) => ({
                ...anteriores,
                [publicacaoId]: novoValor
            }));

            setPublicacoes((anteriores) =>
                anteriores.map((publicacao) => {
                    if (publicacao.id !== publicacaoId) {
                        return publicacao;
                    }

                    const quantidadeAtual =
                        Number(publicacao.total_curtidas) || 0;

                    return {
                        ...publicacao,
                        total_curtidas: novoValor
                            ? quantidadeAtual + 1
                            : Math.max(0, quantidadeAtual - 1)
                    };
                })
            );
        } catch (erro) {
            console.error(
                "Erro ao curtir publicação:",
                erro.response?.data || erro.message
            );
        }
    }

    function abrirModalApagar(publicacao) {
        setPublicacaoSelecionada(publicacao);
    }

    function fecharModalApagar() {
        setPublicacaoSelecionada(null);
    }

    const ehCriadorComunidade =
        Boolean(comunidade?.eh_criador) ||
        (
            comunidade?.criador_id != null &&
            usuarioId != null &&
            Number(comunidade.criador_id) === Number(usuarioId)
        );

    return (
        <div className="comunidade-tela">
            <div className="conteudo-comunidade">
                <main className="feed-comunidade">
                    {publicacoes.length === 0 ? (
                        <p>
                            Ainda não há publicações nesta comunidade.
                        </p>
                    ) : (
                        publicacoes.map((publicacao) => {
                            const ehAutor = Boolean(publicacao.eh_dono);

                            const podeApagar =
                                ehAutor || ehCriadorComunidade;

                            return (
                                <Publicacao
                                    key={publicacao.id}
                                    publicacao={publicacao}
                                    curtido={Boolean(curtidas[publicacao.id])}
                                    onCurtir={handleCurtir}
                                    podeExcluir={podeApagar}
                                    onExcluir={abrirModalApagar}
                                />
                            );
                        })
                    )}
                </main>

                <aside className="lateral-comunidade">
                    <InformacoesComunidade />

                    <button
                        className="botao-publicar-comunidade"
                        type="button"
                        onClick={() => setModalAberto(true)}
                    >
                        Fazer publicação
                    </button>
                </aside>
            </div>

            {modalAberto && (
                <ModalPublicacao
                    onClose={() => setModalAberto(false)}
                    onPublicacaoCriada={() => {
                        setModalAberto(false);
                        buscarPublicacoes();
                    }}
                    comunidadeId={id}
                />
            )}

            {publicacaoSelecionada && (
                <ModalApagarPublicacao
                    publicacao={publicacaoSelecionada}
                    onClose={fecharModalApagar}
                    onPublicacaoApagada={() => {
                        fecharModalApagar();
                        buscarPublicacoes();
                    }}
                />
            )}
        </div>
    );
}

export default ComunidadeTela;