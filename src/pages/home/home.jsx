
import { useEffect, useState } from "react";

import {
    carregarPublicacoes,
    carregarPublicacoesSeguindo,
    curtirPublicacao
} from "../../api";

import "./home.css";

import ComunidadesRecomendadas from "../../components/ComunidadesRecomendadas/ComunidadesRecomendadas";
import PerfilComponente from "../../components/PerfilComponente/PerfilComponente";

//icones
import { FaUserGroup } from "react-icons/fa6";
import { HiUser } from "react-icons/hi";

// Modais
import Publicacao from "../../components/PublicaçãoComponente/Publicacao";
import ModalApagarPublicacao from "../../modals/Publicacoes/ModalApagarPublicacao";
import ModalPublicacao from "../../modals/modalPublicacao";

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

    // Controla os painéis laterais no mobile.
    const [painelAberto, setPainelAberto] = useState(null);

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

    useEffect(() => {
        buscarPublicacoes();
    }, [abaAtiva]);

    // Fecha painel com a tecla ESC.
    useEffect(() => {
        function fecharComEsc(evento) {
            if (evento.key === "Escape") {
                setPainelAberto(null);
            }
        }

        window.addEventListener("keydown", fecharComEsc);

        return () => {
            window.removeEventListener("keydown", fecharComEsc);
        };
    }, []);

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

                    {/* BOTÕES MOBILE */}
                    <div className="acoes-mobile-paineis">

                        <button
                            type="button"
                            onClick={() =>
                                setPainelAberto("comunidades")
                            }
                        >
                            <span><FaUserGroup /></span>
                            Comunidades
                        </button>

                        <button
                            type="button"
                            onClick={() =>
                                setPainelAberto("perfil")
                            }
                        >
                            <span><HiUser /></span>
                            Meu perfil
                        </button>

                    </div>

                    {/* MODAL DE PUBLICAÇÃO */}
                    {modalAberto && (
                        <ModalPublicacao
                            onClose={() => setModalAberto(false)}
                            onPublicacaoCriada={buscarPublicacoes}
                        />
                    )}

                    <h1>Feed inicial</h1>

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
                                    Seu feed está esperando por você 🎵
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
                                    Nenhuma publicação por enquanto 🎧
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

            </div>

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
