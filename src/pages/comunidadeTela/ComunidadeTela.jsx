
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    buscarPublicacoesDaComunidade,
    curtirPublicacao,
    buscarComunidade
} from "../../api";

import {
    PiHeartStraight,
    PiHeartStraightFill
} from "react-icons/pi";

import { VscCommentCompact } from "react-icons/vsc";
import { FiArrowLeft } from "react-icons/fi";
import { IoMenu } from "react-icons/io5";

import InformacoesComunidade from "../../components/cabecalhoComunidade/InformacoesComunidade";
import ModalPublicacao from "../../modals/modalPublicacao";
import ModalApagarPublicacao from "../../modals/Publicacoes/ModalApagarPublicacao";

import "./ComunidadeTela.css";

/*
 * Identifica se a publicação contém um vídeo.
 * Considera o tipo de mídia e o endereço retornado pela API.
 */
function ehVideo(publicacao) {
    const tipo = String(
        publicacao.tipo_midia || publicacao.tipo_media || ""
    ).toLowerCase();

    const url = String(
        publicacao.imagem_url || publicacao.video_url || ""
    ).toLowerCase();

    return (
        tipo === "video" ||
        tipo.startsWith("video/") ||
        url.includes("/video/upload/") ||
        /\.(mp4|webm|mov|m4v|ogg)(?:$|[?#])/.test(url)
    );
}

/*
 * Descobre o ID do usuário logado.
 */
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
    const navigate = useNavigate();

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

            console.log("DADOS DA COMUNIDADE:", response.data);

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

            /*
             * LOG DE DIAGNÓSTICO:
             * mostra exatamente os dados recebidos do backend.
             */
            console.log(
                "DADOS COMPLETOS DAS PUBLICAÇÕES:",
                JSON.stringify(response.data, null, 2)
            );

            const lista = Array.isArray(response.data)
                ? response.data
                : [];

            lista.forEach((publicacao) => {
                console.log("DIAGNÓSTICO DA MÍDIA:", {
                    id: publicacao.id,
                    legenda: publicacao.legenda,
                    imagem_url: publicacao.imagem_url,
                    video_url: publicacao.video_url,
                    tipo_midia: publicacao.tipo_midia,
                    tipo_media: publicacao.tipo_media,
                    ehVideo: ehVideo(publicacao)
                });
            });

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

            setCurtidas((curtidasAnteriores) => ({
                ...curtidasAnteriores,
                [publicacaoId]: novoValor
            }));

            setPublicacoes((publicacoesAnteriores) =>
                publicacoesAnteriores.map((publicacao) => {
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
            <button
                className="botao-voltar"
                type="button"
                onClick={() => navigate("/home")}
            >
                <FiArrowLeft size={20} />
                <span>Voltar para Home</span>
            </button>

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

                            /*
                             * Aceita a URL de mídia nos campos existentes.
                             * Se o backend usar outro campo, ele precisará
                             * ser incluído aqui.
                             */
                            const urlMidia =
                                publicacao.imagem_url ||
                                publicacao.video_url ||
                                null;

                            const video = ehVideo(publicacao);

                            return (
                                <div
                                    key={publicacao.id}
                                    className="publicacao"
                                >
                                    <div className="cabecalho-publicacao">
                                        <img
                                            src={
                                                publicacao.foto_url ||
                                                "/avatar-padrao.png"
                                            }
                                            alt="Foto do usuário"
                                            className="foto-usuario"
                                        />

                                        <h3>
                                            {publicacao.nome_usuario ||
                                                "Usuário"}
                                        </h3>

                                        <div className="data-publicacao">
                                            {publicacao.data_criacao &&
                                                new Date(
                                                    publicacao.data_criacao
                                                ).toLocaleDateString("pt-BR")}
                                        </div>

                                        {podeApagar && (
                                            <button
                                                type="button"
                                                className="hamburguer"
                                                onClick={() =>
                                                    abrirModalApagar(publicacao)
                                                }
                                                aria-label="Opções da publicação"
                                                style={{
                                                    background: "none",
                                                    padding: 0,
                                                    height: "auto",
                                                    marginLeft: "auto"
                                                }}
                                            >
                                                <IoMenu
                                                    size={25}
                                                    style={{
                                                        cursor: "pointer"
                                                    }}
                                                />
                                            </button>
                                        )}
                                    </div>

                                    {publicacao.legenda && (
                                        <p>{publicacao.legenda}</p>
                                    )}

                                    {urlMidia && (
                                        <div className="midia-comunidade-container">
                                            {video ? (
                                                <video
                                                    key={urlMidia}
                                                    className="imagem-publicacao midia-comunidade"
                                                    src={urlMidia}
                                                    controls
                                                    playsInline
                                                    preload="metadata"
                                                    onError={(evento) => {
                                                        console.error(
                                                            "ERRO AO CARREGAR VÍDEO:",
                                                            {
                                                                url: urlMidia,
                                                                erro: evento.currentTarget.error
                                                            }
                                                        );
                                                    }}
                                                >
                                                    Seu navegador não suporta
                                                    a reprodução deste vídeo.
                                                </video>
                                            ) : (
                                                <img
                                                    className="imagem-publicacao midia-comunidade"
                                                    src={urlMidia}
                                                    alt="Imagem da publicação"
                                                    loading="lazy"
                                                    onError={() => {
                                                        console.error(
                                                            "ERRO AO CARREGAR IMAGEM:",
                                                            urlMidia
                                                        );
                                                    }}
                                                />
                                            )}
                                        </div>
                                    )}

                                    <div className="area-curtida">
                                        <button
                                            className="botao-curtida"
                                            type="button"
                                            onClick={() =>
                                                handleCurtir(publicacao.id)
                                            }
                                            style={{ background: "none" }}
                                            aria-label={
                                                curtidas[publicacao.id]
                                                    ? "Descurtir publicação"
                                                    : "Curtir publicação"
                                            }
                                        >
                                            {curtidas[publicacao.id] ? (
                                                <PiHeartStraightFill
                                                    color="white"
                                                    fontSize={30}
                                                />
                                            ) : (
                                                <PiHeartStraight
                                                    color="white"
                                                    fontSize={30}
                                                />
                                            )}
                                        </button>

                                        <span className="quantidade-curtidas">
                                            {Number(
                                                publicacao.total_curtidas
                                            ) || 0}
                                        </span>

                                        <button
                                            className="botao-comentar"
                                            type="button"
                                            onClick={() =>
                                                navigate(
                                                    `/comentarios/${publicacao.id}`
                                                )
                                            }
                                            aria-label="Ver comentários"
                                        >
                                            <VscCommentCompact
                                                fontSize={26}
                                                color="white"
                                            />
                                        </button>

                                        <span>
                                            {Number(
                                                publicacao.total_comentarios
                                            ) || 0}
                                        </span>
                                    </div>
                                </div>
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
