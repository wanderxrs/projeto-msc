import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    carregarPublicacoes,
    carregarPublicacoesSeguindo,
    curtirPublicacao
} from "../../api";

import "./home.css";

import ComunidadesRecomendadas from "../../components/ComunidadesRecomendadas/ComunidadesRecomendadas";
import PerfilComponente from "../../components/PerfilComponente/PerfilComponente";

import ModalPublicacao from "../../modals/ModalPublicacao";
import ModalApagarPublicacao from "../../modals/Publicacoes/ModalApagarPublicacao";

import { IoMenu } from "react-icons/io5";
import {
    PiHeartStraight,
    PiHeartStraightFill
} from "react-icons/pi";
import { VscCommentCompact } from "react-icons/vsc";

function Home() {
    const [modalAberto, setModalAberto] = useState(false);
    const [publicacoes, setPublicacoes] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("");
    const [curtidas, setCurtidas] = useState({});
    const [abaAtiva, setAbaAtiva] = useState("descobrir");
    const [segueComunidades, setSegueComunidades] = useState(true);
    const [publicacaoSelecionada, setPublicacaoSelecionada] =
        useState(null);

    const navigate = useNavigate();

    // Carrega as publicações da aba selecionada
    async function buscarPublicacoes() {
        setCarregando(true);
        setErro("");

        try {
            let resposta;
            let lista = [];

            if (abaAtiva === "descobrir") {
                resposta = await carregarPublicacoes();

                lista = Array.isArray(resposta.data)
                    ? resposta.data
                    : resposta.data.publicacoes || [];
            } else {
                resposta = await carregarPublicacoesSeguindo();

                const dados = resposta.data;

                if (Array.isArray(dados)) {
                    lista = dados;

                    if (lista.length > 0) {
                        setSegueComunidades(true);
                    }
                } else {
                    lista = dados.publicacoes || [];

                    setSegueComunidades(
                        dados.segueComunidades ?? true
                    );
                }
            }

            setPublicacoes(lista);

            const estadoCurtidas = {};

            lista.forEach((publicacao) => {
                estadoCurtidas[publicacao.id] =
                    Boolean(publicacao.curtida_usuario);
            });

            setCurtidas((anteriores) => ({
                ...anteriores,
                ...estadoCurtidas
            }));
        } catch (erro) {
            console.error(erro);

            setErro(
                "Não foi possível carregar as publicações. Tente novamente."
            );
        } finally {
            setCarregando(false);
        }
    }

    useEffect(() => {
        buscarPublicacoes();
    }, [abaAtiva]);

    // Identifica se a publicação contém vídeo ou imagem.
    // O caminho do Cloudinary também ajuda a identificar
    // vídeos antigos caso tipo_midia ainda não venha da API.
    function ehVideo(publicacao) {
        if (publicacao.tipo_midia) {
            return publicacao.tipo_midia.toLowerCase() === "video";
        }

        const url = publicacao.imagem_url || "";

        return (
            url.includes("/video/upload/") ||
            /\.(mp4|webm|mov|m4v)(\?|$)/i.test(url)
        );
    }

    // Curtir ou descurtir publicação
    async function handleCurtir(publicacao_id) {
        try {
            await curtirPublicacao(publicacao_id);

            const novoValor = !curtidas[publicacao_id];

            setCurtidas((anteriores) => ({
                ...anteriores,
                [publicacao_id]: novoValor
            }));

            setPublicacoes((anteriores) =>
                anteriores.map((publicacao) => {
                    if (publicacao.id !== publicacao_id) {
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
            console.error(erro);
            setErro("Erro ao curtir a publicação.");
        }
    }

    function abrirModalApagar(publicacao) {
        setPublicacaoSelecionada(publicacao);
    }

    function fecharModalApagar() {
        setPublicacaoSelecionada(null);
    }

    return (
        <>
            <div className="conteudo-principal">
                <ComunidadesRecomendadas />

                <main className="conteudo-central">
                    {modalAberto && (
                        <ModalPublicacao
                            onClose={() => setModalAberto(false)}
                            onPublicacaoCriada={buscarPublicacoes}
                        />
                    )}

                    <h1>Feed inicial</h1>

                    {/* Abas do feed */}
                    <div className="abas-feed">
                        <button
                            type="button"
                            className={
                                abaAtiva === "descobrir"
                                    ? "aba-feed ativa"
                                    : "aba-feed"
                            }
                            onClick={() => setAbaAtiva("descobrir")}
                        >
                            Descobrir
                        </button>

                        <button
                            type="button"
                            className={
                                abaAtiva === "seguindo"
                                    ? "aba-feed ativa"
                                    : "aba-feed"
                            }
                            onClick={() => setAbaAtiva("seguindo")}
                        >
                            Seguindo
                        </button>
                    </div>

                    {carregando && (
                        <p className="mensagem-feed">
                            Carregando publicações...
                        </p>
                    )}

                    {!carregando && erro && (
                        <div className="mensagem-feed">
                            <p>{erro}</p>

                            <button
                                type="button"
                                onClick={buscarPublicacoes}
                            >
                                Tentar novamente
                            </button>
                        </div>
                    )}

                    {!carregando &&
                        !erro &&
                        abaAtiva === "seguindo" &&
                        !segueComunidades && (
                            <div className="feed-vazio">
                                <h2>
                                    Seu feed está esperando por você 🎵
                                </h2>

                                <p>
                                    Você ainda não segue nenhuma comunidade.
                                </p>

                                <button
                                    type="button"
                                    onClick={() => setAbaAtiva("descobrir")}
                                >
                                    Explorar publicações
                                </button>
                            </div>
                        )}

                    {!carregando &&
                        !erro &&
                        abaAtiva === "seguindo" &&
                        segueComunidades &&
                        publicacoes.length === 0 && (
                            <div className="feed-vazio">
                                <h2>
                                    Nenhuma publicação por enquanto 🎧
                                </h2>
                            </div>
                        )}

                    {!carregando &&
                        !erro &&
                        abaAtiva === "descobrir" &&
                        publicacoes.length === 0 && (
                            <p className="mensagem-feed">
                                Nenhuma publicação encontrada.
                            </p>
                        )}

                    {!carregando && !erro && (
                        <div className="feed">
                            {publicacoes.map((publicacao) => (
                                <div
                                    key={publicacao.id}
                                    className="publicacao"
                                >

                                    {/* Cabeçalho da publicação */}
                                    <div className="cabecalho-publicacao">
                                        <img
                                            src={publicacao.foto_url}
                                            alt="Foto do usuário"
                                            className="foto-usuario"
                                        />

                                        <h3
                                            onClick={() =>
                                                navigate(
                                                    `/perfil/${publicacao.usuario_id}`
                                                )
                                            }
                                            style={{ cursor: "pointer" }}
                                        >
                                            {publicacao.nome_usuario}
                                        </h3>

                                        <div className="data-publicacao">
                                            {publicacao.data_criacao &&
                                                new Date(
                                                    publicacao.data_criacao
                                                ).toLocaleDateString("pt-BR")}
                                        </div>

                                        {publicacao.eh_dono && (
                                            <button
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

                                    {/* Legenda */}
                                    {publicacao.legenda && (
                                        <p>{publicacao.legenda}</p>
                                    )}
                                    <strong
                                        className="Nome-comunidade-feed"
                                        onClick={() =>
                                            navigate(
                                                `/comunidade/${publicacao.comunidade_id}`
                                            )
                                        }
                                    >
                                        {publicacao.nome_comunidade}
                                    </strong>

                                    {/* Mídia: vídeo ou imagem */}
                                    {publicacao.imagem_url && (
                                        <div className="midia-container">
                                            {ehVideo(publicacao) ? (
                                                <video
                                                    className="midia-publicacao"
                                                    src={publicacao.imagem_url}
                                                    controls
                                                    preload="metadata"
                                                    playsInline
                                                >
                                                    Seu navegador não suporta
                                                    a reprodução de vídeos.
                                                </video>
                                            ) : (
                                                <img
                                                    className="midia-publicacao"
                                                    src={publicacao.imagem_url}
                                                    alt="Imagem da publicação"
                                                    loading="lazy"
                                                />
                                            )}
                                        </div>
                                    )}

                                    {/* Curtidas e comentários */}
                                    <div className="area-curtida">
                                        <button
                                            className="botao-curtida"
                                            onClick={() =>
                                                handleCurtir(publicacao.id)
                                            }
                                            aria-label={
                                                curtidas[publicacao.id]
                                                    ? "Descurtir publicação"
                                                    : "Curtir publicação"
                                            }
                                            style={{ background: "none" }}
                                        >
                                            <span
                                                className={
                                                    curtidas[publicacao.id]
                                                        ? "coracao curtido"
                                                        : "coracao"
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
                                            </span>
                                        </button>

                                        <span className="quantidade-curtidas">
                                            {Number(
                                                publicacao.total_curtidas
                                            ) || 0}
                                        </span>

                                        <button
                                            className="botao-comentar"
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

                                        {Number(
                                            publicacao.total_comentarios
                                        ) || 0}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </main>

                <PerfilComponente />
            </div>

            {publicacaoSelecionada && (
                <ModalApagarPublicacao
                    publicacao={publicacaoSelecionada}
                    onClose={fecharModalApagar}
                    onPublicacaoApagada={buscarPublicacoes}
                />
            )}
        </>
    );
}

export default Home;
