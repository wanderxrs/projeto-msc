
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    carregarPerfilUsuario,
    curtirPublicacao
} from "../../api";
import {
    PiHeartStraight,
    PiHeartStraightFill
} from "react-icons/pi";
import { VscCommentCompact } from "react-icons/vsc";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { HiOutlineChevronLeft } from "react-icons/hi";
import ModalApagarPublicacao from "../../modals/Publicacoes/ModalApagarPublicacao";
import "./perfil.css";

function Perfil() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [perfil, setPerfil] = useState(null);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("");
    const [curtidas, setCurtidas] = useState({});
    const [publicacaoSelecionada, setPublicacaoSelecionada] = useState(null);
    const [abaAtiva, setAbaAtiva] = useState("visao-geral");

    async function buscarPerfil() {
        setCarregando(true);
        setErro("");

        try {
            const resposta = await carregarPerfilUsuario(id);
            setPerfil(resposta.data);

            const estadoCurtidas = {};

            (resposta.data.publicacoes || []).forEach((publicacao) => {
                estadoCurtidas[publicacao.id] =
                    publicacao.curtida_usuario;
            });

            setCurtidas(estadoCurtidas);
        } catch (erro) {
            console.error(erro);
            setErro("Erro ao carregar o perfil.");
        } finally {
            setCarregando(false);
        }
    }

    useEffect(() => {
        buscarPerfil();
    }, [id]);

    async function handleCurtir(publicacao_id) {
        try {
            await curtirPublicacao(publicacao_id);

            const novoValor = !curtidas[publicacao_id];

            setCurtidas((curtidasAnteriores) => ({
                ...curtidasAnteriores,
                [publicacao_id]: novoValor
            }));

            setPerfil((perfilAnterior) => ({
                ...perfilAnterior,
                publicacoes: perfilAnterior.publicacoes.map(
                    (publicacao) => {
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
                    }
                )
            }));
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

    if (carregando) {
        return <p>Carregando perfil...</p>;
    }

    if (erro && !perfil) {
        return <p>{erro}</p>;
    }

    if (!perfil) {
        return <p>Perfil não encontrado.</p>;
    }

    const usuario = perfil.usuario;
    const publicacoes = perfil.publicacoes || [];
    const capaUrl = usuario.capa_url;

    const totalComunidades = usuario.total_comunidades ?? 0;
    const totalAlbuns = usuario.total_albuns_avaliados ?? 0;

    return (
        <>
            <main className="perfil-page">
                <section className="perfil-header">
                    <div
                        className="perfil-capa"
                        style={
                            capaUrl
                                ? {
                                    backgroundImage: `url("${capaUrl}")`
                                }
                                : {}
                        }
                    />
                    
                    <div className="perfil-identidade">
                        
                        <img
                            src={usuario.foto_url}
                            alt={`Foto de ${usuario.nome}`}
                            className="perfil-foto"
                        />

                        <div className="perfil-dados">
                            <h1 className="perfil-nome">
                                {usuario.nome}
                            </h1>

                            <p className="perfil-usuario-nome">
                                @{usuario.nome_usuario || usuario.nome}
                            </p>

                            <p className="perfil-descricao">
                                {usuario.bio || "Seu espaço musical 🎸"}
                            </p>

                            <div className="perfil-estatisticas">
                                <div>
                                    <strong>{publicacoes.length}</strong>
                                    <span>publicações</span>
                                </div>

                                <div>
                                    <strong>{totalComunidades}</strong>
                                    <span>comunidades</span>
                                </div>

                                <div>
                                    <strong>{totalAlbuns}</strong>
                                    <span>álbuns avaliados</span>
                                </div>
                            </div>
                        </div>

                        <button
                            type="button"
                            className="perfil-opcoes"
                            onClick={() => {
                                // Modal de edição será conectado depois.
                            }}
                            aria-label="Opções do perfil"
                            title="Opções do perfil"
                        >
                            <HiOutlineDotsVertical />
                        </button>
                    </div>
                </section>

                <nav className="perfil-abas">
                    <button
                        type="button"
                        className={`perfil-aba ${
                            abaAtiva === "visao-geral" ? "ativa" : ""
                        }`}
                        onClick={() => setAbaAtiva("visao-geral")}
                    >
                        Visão geral
                    </button>

                    <button
                        type="button"
                        className={`perfil-aba ${
                            abaAtiva === "comunidades" ? "ativa" : ""
                        }`}
                        onClick={() => setAbaAtiva("comunidades")}
                    >
                        Comunidades
                    </button>
                </nav>

                {abaAtiva === "visao-geral" && (
                    <section className="perfil-publicacoes">
                        <h2>Publicações</h2>

                        {publicacoes.length === 0 ? (
                            <p>
                                Esse usuário ainda não possui publicações.
                            </p>
                        ) : (
                            publicacoes.map((publicacao) => (
                                <article
                                    className="perfil-publicacao"
                                    key={publicacao.id}
                                >
                                    <div className="cabecalho-publicacao">
                                        <img
                                            src={publicacao.foto_url}
                                            alt="Foto do usuário"
                                            className="foto-usuario"
                                        />

                                        <h3>{publicacao.nome_usuario}</h3>

                                        <div className="data-publicacao">
                                            {new Date(
                                                publicacao.data_criacao
                                            ).toLocaleDateString("pt-BR")}
                                        </div>

                                        <button
                                            type="button"
                                            className="hamburguer"
                                            aria-label="Opções da publicação"
                                            onClick={() =>
                                                abrirModalApagar(publicacao)
                                            }
                                        >
                                            <HiOutlineDotsVertical size={22} />
                                        </button>
                                    </div>

                                    <p>{publicacao.legenda}</p>

                                    <img
                                        src={publicacao.imagem_url}
                                        alt="Imagem da publicação"
                                    />

                                    <div className="area-curtida">
                                        <button
                                            type="button"
                                            className="botao-curtida"
                                            onClick={() =>
                                                handleCurtir(publicacao.id)
                                            }
                                            aria-label={
                                                curtidas[publicacao.id]
                                                    ? "Descurtir publicação"
                                                    : "Curtir publicação"
                                            }
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

                                        <div className="quantidade-curtidas">
                                            {Number(
                                                publicacao.total_curtidas
                                            ) || 0}
                                        </div>

                                        <button
                                            type="button"
                                            className="botao-comentar"
                                            aria-label="Ver comentários"
                                            onClick={() =>
                                                navigate(
                                                    `/comentarios/${publicacao.id}`
                                                )
                                            }
                                        >
                                            <VscCommentCompact fontSize={24} />
                                        </button>

                                        <span>
                                            {Number(
                                                publicacao.total_comentarios
                                            ) || 0}
                                        </span>
                                    </div>
                                </article>
                            ))
                        )}
                    </section>
                )}

                {abaAtiva === "comunidades" && (
                    <section className="perfil-conteudo-aba">
                        <h2>Comunidades</h2>
                        <p>
                            As comunidades desse usuário aparecerão aqui.
                        </p>
                    </section>
                )}
            </main>

            {publicacaoSelecionada && (
                <ModalApagarPublicacao
                    publicacao={publicacaoSelecionada}
                    onClose={fecharModalApagar}
                    onPublicacaoApagada={() => {
                        setPublicacaoSelecionada(null);
                        buscarPerfil();
                    }}
                />
            )}
        </>
    );
}

export default Perfil;
