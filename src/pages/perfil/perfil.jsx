
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    carregarPerfil,
    carregarPerfilUsuario,
    curtirPublicacao,
    buscarComunidadesDoPerfil
} from "../../api";

import { HiOutlineDotsVertical } from "react-icons/hi";

import Publicacao from "../../components/PublicaçãoComponente/Publicacao";
import ModalApagarPublicacao from "../../modals/Publicacoes/ModalApagarPublicacao";
import ModalEditarPerfil from "../../modals/Perfil/ModalEditarPerfil";

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
    const [modalEditarAberto, setModalEditarAberto] = useState(false);
    const [usuarioLogadoId, setUsuarioLogadoId] = useState(null);

    // Comunidades do usuário visualizado
    const [comunidadesPerfil, setComunidadesPerfil] = useState([]);
    const [carregandoComunidades, setCarregandoComunidades] = useState(true);
    const [erroComunidades, setErroComunidades] = useState("");

    // BUSCAR PERFIL
    async function buscarPerfil() {
        setCarregando(true);
        setErro("");

        try {
            const resposta = await carregarPerfilUsuario(id);

            setPerfil(resposta.data);

            const estadoCurtidas = {};

            (resposta.data.publicacoes || []).forEach((publicacao) => {
                estadoCurtidas[publicacao.id] =
                    publicacao.curtida_usuario === true ||
                    publicacao.curtida_usuario === 1;
            });

            setCurtidas(estadoCurtidas);

        } catch (erro) {
            console.error("Erro ao carregar perfil:", erro);
            setErro("Erro ao carregar o perfil.");
            setPerfil(null);
        } finally {
            setCarregando(false);
        }
    }

    // IDENTIFICAR USUÁRIO LOGADO
    async function buscarUsuarioLogado() {
        try {
            const resposta = await carregarPerfil();

            setUsuarioLogadoId(Number(resposta.data.id));

        } catch (erro) {
            console.error("Erro ao identificar usuário logado:", erro);
            setUsuarioLogadoId(null);
        }
    }

    // BUSCAR COMUNIDADES DO PERFIL
    async function buscarComunidadesPerfil() {
        setCarregandoComunidades(true);
        setErroComunidades("");
        setComunidadesPerfil([]);

        try {
            const resposta = await buscarComunidadesDoPerfil(id);

            const lista = Array.isArray(resposta.data)
                ? resposta.data
                : [];

            setComunidadesPerfil(lista);

        } catch (erro) {
            console.error(
                "Erro ao carregar comunidades:",
                erro.response?.data || erro.message
            );

            setErroComunidades("Erro ao carregar as comunidades.");
        } finally {
            setCarregandoComunidades(false);
        }
    }

    // CARREGAR DADOS AO MUDAR DE PERFIL
    useEffect(() => {
        setPerfil(null);
        setAbaAtiva("visao-geral");
        setPublicacaoSelecionada(null);
        setModalEditarAberto(false);

        buscarPerfil();
        buscarUsuarioLogado();
        buscarComunidadesPerfil();
    }, [id]);

    // CURTIR OU DESCURTIR PUBLICAÇÃO
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

                publicacoes: perfilAnterior.publicacoes.map((publicacao) => {
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
            }));

        } catch (erro) {
            console.error("Erro ao curtir publicação:", erro);
            setErro("Erro ao curtir a publicação.");
        }
    }

    // VERIFICAR SE O PERFIL É DO USUÁRIO LOGADO
    const perfilEhMeu =
        usuarioLogadoId !== null &&
        perfil?.usuario?.id != null &&
        Number(perfil.usuario.id) === usuarioLogadoId;

    // ABRIR MODAL DE EXCLUSÃO
    function abrirModalApagar(publicacao) {
        if (!perfilEhMeu) return;

        setPublicacaoSelecionada(publicacao);
    }

    // FECHAR MODAL DE EXCLUSÃO
    function fecharModalApagar() {
        setPublicacaoSelecionada(null);
    }

    // ESTADOS DE CARREGAMENTO
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
    const avaliacoes = perfil.avaliacoes || [];
    const comunidades = comunidadesPerfil;

    const capaUrl =
        usuario.foto_url_background || usuario.capa_url || "";

    const totalComunidades = carregandoComunidades
        ? (usuario.total_comunidades ?? 0)
        : comunidades.length;

    const totalAlbuns =
        usuario.total_albuns_avaliados ?? avaliacoes.length;

    return (
        <>
            <main className="perfil-page">

                {/* CABEÇALHO DO PERFIL */}
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
                            src={usuario.foto_url || "/avatar-padrao.png"}
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

                        {perfilEhMeu && (
                            <button
                                type="button"
                                className="perfil-opcoes"
                                onClick={() => setModalEditarAberto(true)}
                                aria-label="Editar perfil"
                                title="Editar perfil"
                            >
                                <HiOutlineDotsVertical />
                            </button>
                        )}

                    </div>
                </section>

                {/* NAVEGAÇÃO ENTRE ABAS */}
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

                    <button
                        type="button"
                        className={`perfil-aba ${
                            abaAtiva === "avaliacoes" ? "ativa" : ""
                        }`}
                        onClick={() => setAbaAtiva("avaliacoes")}
                    >
                        Avaliações
                    </button>

                </nav>

                {/* ABA: VISÃO GERAL */}
                {abaAtiva === "visao-geral" && (
                    <section className="perfil-publicacoes">

                        <h2>Publicações</h2>

                        {publicacoes.length === 0 ? (
                            <p>
                                Esse usuário ainda não possui publicações.
                            </p>
                        ) : (
                            <div className="feed">

                                {publicacoes.map((publicacao) => (
                                    <Publicacao
                                        key={publicacao.id}
                                        publicacao={publicacao}
                                        curtido={Boolean(
                                            curtidas[publicacao.id]
                                        )}
                                        onCurtir={handleCurtir}
                                        podeExcluir={perfilEhMeu}
                                        onExcluir={abrirModalApagar}
                                    />
                                ))}

                            </div>
                        )}

                    </section>
                )}

                {/* ABA: COMUNIDADES */}
                {abaAtiva === "comunidades" && (
                    <section className="perfil-conteudo-aba">

                        <h2>Comunidades</h2>

                        {carregandoComunidades ? (
                            <p>Carregando comunidades...</p>
                        ) : erroComunidades ? (
                            <p>{erroComunidades}</p>
                        ) : comunidades.length === 0 ? (
                            <p>
                                Esse usuário ainda não participa de comunidades.
                            </p>
                        ) : (
                            <div className="perfil-comunidades-lista">

                                {comunidades.map((comunidade) => (
                                    <article
                                        className="perfil-comunidade-card"
                                        key={comunidade.id}
                                        onClick={() =>
                                            navigate(`/comunidade/${comunidade.id}`)
                                        }
                                        role="link"
                                        tabIndex={0}
                                        onKeyDown={(evento) => {
                                            if (
                                                evento.key === "Enter" ||
                                                evento.key === " "
                                            ) {
                                                evento.preventDefault();
                                                navigate(
                                                    `/comunidade/${comunidade.id}`
                                                );
                                            }
                                        }}
                                    >

                                        {comunidade.imagem_url && (
                                            <img
                                                src={comunidade.imagem_url}
                                                alt={`Imagem da comunidade ${comunidade.nome}`}
                                                className="perfil-comunidade-imagem"
                                            />
                                        )}

                                        <div className="perfil-comunidade-info">

                                            <h3>{comunidade.nome}</h3>

                                            {comunidade.genero && (
                                                <span>
                                                    {comunidade.genero}
                                                </span>
                                            )}

                                            <p>
                                                {Number(comunidade.total_membros) || 0}{" "}
                                                {Number(comunidade.total_membros) === 1
                                                    ? "membro"
                                                    : "membros"}
                                            </p>

                                            {comunidade.descricao && (
                                                <p>{comunidade.descricao}</p>
                                            )}

                                        </div>

                                    </article>
                                ))}

                            </div>
                        )}

                    </section>
                )}

                {/* ABA: AVALIAÇÕES */}
                {abaAtiva === "avaliacoes" && (
                    <section className="perfil-avaliacoes">

                        <h2>Avaliações musicais</h2>

                        {avaliacoes.length === 0 ? (
                            <p>
                                Esse usuário ainda não avaliou nenhum álbum.
                            </p>
                        ) : (
                            <div className="perfil-avaliacoes-grade">

                                {avaliacoes.map((avaliacao) => (
                                    <article
                                        className="perfil-avaliacao-card"
                                        key={avaliacao.album_id}
                                    >

                                        {avaliacao.capa_url ? (
                                            <img
                                                src={avaliacao.capa_url}
                                                alt={`Capa de ${avaliacao.titulo}`}
                                            />
                                        ) : (
                                            <div className="perfil-avaliacao-sem-capa">
                                                Sem capa
                                            </div>
                                        )}

                                        <h3>{avaliacao.titulo}</h3>

                                        <p>{avaliacao.artista}</p>

                                        <span className="perfil-avaliacao-nota">
                                            ★ {avaliacao.nota}/10
                                        </span>

                                    </article>
                                ))}

                            </div>
                        )}

                    </section>
                )}

            </main>

            {/* MODAL DE EXCLUSÃO */}
            {publicacaoSelecionada && perfilEhMeu && (
                <ModalApagarPublicacao
                    publicacao={publicacaoSelecionada}
                    onClose={fecharModalApagar}
                    onPublicacaoApagada={() => {
                        setPublicacaoSelecionada(null);
                        buscarPerfil();
                    }}
                />
            )}

            {/* MODAL DE EDIÇÃO DO PERFIL */}
            {modalEditarAberto && perfilEhMeu && (
                <ModalEditarPerfil
                    perfil={usuario}
                    onFechar={() => setModalEditarAberto(false)}
                    onSalvo={() => {
                        setModalEditarAberto(false);
                        buscarPerfil();
                    }}
                />
            )}

        </>
    );
}

export default Perfil;
