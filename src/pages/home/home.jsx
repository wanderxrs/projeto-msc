
import { useEffect, useState } from "react";

import {
    carregarPublicacoes,
    carregarPublicacoesSeguindo,
    curtirPublicacao
} from "../../api";

import "./home.css";

import ComunidadesRecomendadas from "../../components/ComunidadesRecomendadas/ComunidadesRecomendadas";
import PerfilComponente from "../../components/PerfilComponente/PerfilComponente";
import Publicacao from "../../components/PublicaçãoComponente/Publicacao";

import ModalPublicacao from "../../modals/ModalPublicacao";
import ModalApagarPublicacao from "../../modals/Publicacoes/ModalApagarPublicacao";

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

    // Curtir ou descurtir uma publicação.
    // Usa os valores reais retornados pelo backend.
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

                    {/* Carregamento */}
                    {carregando && (
                        <p className="mensagem-feed">
                            Carregando publicações...
                        </p>
                    )}

                    {/* Erro ao carregar */}
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

                    {/* Usuário ainda não segue comunidades */}
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

                    {/* Não existem publicações nas comunidades seguidas */}
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

                    {/* Não existem publicações para descobrir */}
                    {!carregando &&
                        !erro &&
                        abaAtiva === "descobrir" &&
                        publicacoes.length === 0 && (

                            <p className="mensagem-feed">
                                Nenhuma publicação encontrada.
                            </p>
                        )}

                    {/* Lista de publicações */}
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

                <PerfilComponente />

            </div>

            {/* Modal de exclusão */}
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
