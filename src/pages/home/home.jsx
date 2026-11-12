
import { useEffect, useState } from "react";

import { carregarPublicacoes, carregarPublicacoesSeguindo, curtirPublicacao, carregarPerfil} from "../../api";

import "./home.css";

import ComunidadesRecomendadas from "../../components/ComunidadesRecomendadas/ComunidadesRecomendadas";
import PerfilComponente from "../../components/PerfilComponente/PerfilComponente";

// Ícones
import { FaUserGroup } from "react-icons/fa6";
import { IoAdd } from "react-icons/io5";
import { PiMusicNotesFill } from "react-icons/pi";
import { ImHeadphones } from "react-icons/im";

// Componentes e modais
import Publicacao from "../../components/PublicaçãoComponente/Publicacao";
import ModalApagarPublicacao from "../../modals/Publicacoes/ModalApagarPublicacao";
import CriarComunidadeModal from "../../modals/Comunidade/criarComunidadeModal";

function Home() {
    const [modalCriarComunidadeAberto, setModalCriarComunidadeAberto] =
        useState(false);

    const [publicacoes, setPublicacoes] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("");
    const [curtidas, setCurtidas] = useState({});
    const [abaAtiva, setAbaAtiva] = useState("descobrir");
    const [segueComunidades, setSegueComunidades] = useState(true);

    const [publicacaoSelecionada, setPublicacaoSelecionada] =
        useState(null);

    // Controla os painéis laterais no mobile.
    const [painelAberto, setPainelAberto] = useState(null);

    // Foto de perfil do usuário logado.
    const [fotoPerfil, setFotoPerfil] = useState(
        "/avatar-padrao.png"
    );

    // Carrega a foto de perfil do usuário na navbar.
    useEffect(() => {
        async function buscarPerfil() {
            try {
                const resposta = await carregarPerfil();

                setFotoPerfil(
                    resposta.data.foto_url || "/avatar-padrao.png"
                );
            } catch (erro) {
                console.error(
                    "Erro ao carregar foto de perfil:",
                    erro
                );
            }
        }

        buscarPerfil();
    }, []);

    // Carrega as publicações da aba selecionada.
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

            // Recupera o estado das curtidas do backend.
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

    // Atualiza o feed quando a aba muda.
    useEffect(() => {
        buscarPublicacoes();
    }, [abaAtiva]);

    // Curtir ou descurtir uma publicação.
    async function handleCurtir(publicacao_id) {
        try {
            const resposta = await curtirPublicacao(publicacao_id);

            const { curtido, total_curtidas } = resposta.data;

            setCurtidas((anteriores) => ({
                ...anteriores,
                [publicacao_id]: curtido
            }));

            setPublicacoes((anteriores) =>
                anteriores.map((publicacao) => {
                    if (publicacao.id !== publicacao_id) {
                        return publicacao;
                    }

                    return {
                        ...publicacao,
                        total_curtidas: total_curtidas
                    };
                })
            );

        } catch (erro) {
            console.error(erro);
            setErro("Erro ao curtir a publicação.");
        }
    }

    // Abre o modal de exclusão.
    function abrirModalApagar(publicacao) {
        setPublicacaoSelecionada(publicacao);
    }

    // Fecha o modal de exclusão.
    function fecharModalApagar() {
        setPublicacaoSelecionada(null);
    }

    // Abre o modal de criar comunidade.
    function abrirModalCriarComunidade() {
        setPainelAberto(null);
        setModalCriarComunidadeAberto(true);
    }

    // Fecha o modal de criar comunidade.
    function fecharModalCriarComunidade() {
        setModalCriarComunidadeAberto(false);
    }

    return (
        <>
            <div className="conteudo-principal">

                {/* PAINEL DE COMUNIDADES */}
                <div
                    className={`painel-lateral painel-comunidades ${
                        painelAberto === "comunidades"
                            ? "painel-aberto"
                            : ""
                    }`}
                >
                    <div className="cabecalho-painel-mobile">
                        <span>Comunidades</span>

                        <button
                            type="button"
                            onClick={() => setPainelAberto(null)}
                            aria-label="Fechar comunidades"
                        >
                            ✕
                        </button>
                    </div>

                    <ComunidadesRecomendadas />
                </div>

                {/* FUNDO PARA FECHAR OS PAINÉIS */}
                {painelAberto && (
                    <button
                        type="button"
                        className="fundo-paineis-mobile"
                        onClick={() => setPainelAberto(null)}
                        aria-label="Fechar painel"
                    />
                )}

                {/* CONTEÚDO CENTRAL */}
                <main className="conteudo-central">
                    
                    {/* ABAS DO FEED */}
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

                    {/* CARREGAMENTO */}
                    {carregando && (
                        <p className="mensagem-feed">
                            Carregando publicações...
                        </p>
                    )}

                    {/* ERRO AO CARREGAR */}
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

                    {/* USUÁRIO AINDA NÃO SEGUE COMUNIDADES */}
                    {!carregando &&
                        !erro &&
                        abaAtiva === "seguindo" &&
                        !segueComunidades && (

                            <div className="feed-vazio">

                                <h2>
                                    Seu feed está esperando por você <PiMusicNotesFill />
                                </h2>

                                <p>
                                    Você ainda não segue nenhuma comunidade.
                                </p>

                                <button
                                    type="button"
                                    onClick={() =>
                                        setAbaAtiva("descobrir")
                                    }
                                >
                                    Explorar publicações
                                </button>

                            </div>
                        )}

                    {/* NÃO EXISTEM PUBLICAÇÕES NAS COMUNIDADES SEGUIDAS */}
                    {!carregando &&
                        !erro &&
                        abaAtiva === "seguindo" &&
                        segueComunidades &&
                        publicacoes.length === 0 && (

                            <div className="feed-vazio">

                                <h2>
                                    Nenhuma publicação por enquanto  <ImHeadphones />
                                </h2>

                            </div>
                        )}

                    {/* NÃO EXISTEM PUBLICAÇÕES PARA DESCOBRIR */}
                    {!carregando &&
                        !erro &&
                        abaAtiva === "descobrir" &&
                        publicacoes.length === 0 && (

                            <p className="mensagem-feed">
                                Nenhuma publicação encontrada.
                            </p>
                        )}

                    {/* LISTA DE PUBLICAÇÕES */}
                    {!carregando && !erro && (

                        <div className="feed">

                            {publicacoes.map((publicacao) => (

                                <Publicacao
                                    key={publicacao.id}
                                    publicacao={publicacao}
                                    curtido={
                                        Boolean(curtidas[publicacao.id])
                                    }
                                    onCurtir={handleCurtir}
                                    onExcluir={abrirModalApagar}
                                />

                            ))}

                        </div>
                    )}

                </main>

                {/* PAINEL DE PERFIL */}
                <div
                    className={`painel-lateral painel-perfil ${
                        painelAberto === "perfil"
                            ? "painel-aberto"
                            : ""
                    }`}
                >
                    <div className="cabecalho-painel-mobile">
                        <span>Meu perfil</span>

                        <button
                            type="button"
                            onClick={() => setPainelAberto(null)}
                            aria-label="Fechar perfil"
                        >
                            ✕
                        </button>
                    </div>

                    <PerfilComponente />
                </div>

                {/* NAVBAR MOBILE INFERIOR */}
                <nav className="navbar-mobile">

                    {/* BOTÃO DE COMUNIDADES */}
                    <button
                        type="button"
                        className="botao-navbar-mobile botao-icone-navbar"
                        onClick={() =>
                            setPainelAberto(
                                painelAberto === "comunidades"
                                    ? null
                                    : "comunidades"
                            )
                        }
                        aria-label="Abrir comunidades"
                        title="Comunidades"
                    >
                        <FaUserGroup />
                    </button>

                    {/* BOTÃO DE CRIAR COMUNIDADE */}
                    <button
                        type="button"
                        className="botao-navbar-mobile botao-icone-navbar"
                        onClick={abrirModalCriarComunidade}
                        aria-label="Criar comunidade"
                        title="Criar comunidade"
                    >
                        <IoAdd />
                    </button>

                    {/* BOTÃO DE PERFIL COM FOTO */}
                    <button
                        type="button"
                        className="botao-navbar-mobile botao-perfil-navbar"
                        onClick={() =>
                            setPainelAberto(
                                painelAberto === "perfil"
                                    ? null
                                    : "perfil"
                            )
                        }
                        aria-label="Abrir meu perfil"
                        title="Meu perfil"
                    >
                        <img
                            src={fotoPerfil}
                            alt="Minha foto de perfil"
                            onError={(evento) => {
                                evento.currentTarget.src =
                                    "/avatar-padrao.png";
                            }}
                        />
                    </button>

                </nav>

            </div>

            {/* MODAL DE CRIAR COMUNIDADE */}
            <CriarComunidadeModal
                isOpen={modalCriarComunidadeAberto}
                onClose={fecharModalCriarComunidade}
            />

            {/* MODAL DE EXCLUSÃO */}
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