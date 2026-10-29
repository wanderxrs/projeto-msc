
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import {
    buscarPublicacoesDaComunidade,
    curtirPublicacao,
    buscarComunidade
} from "../../api";

import InformacoesComunidade from "../../components/cabecalhoComunidade/InformacoesComunidade";
import Publicacao from "../../components/PublicaçãoComponente/Publicacao";
import ModalPublicacao from "../../modals/modalPublicacao";
import ModalApagarPublicacao from "../../modals/Publicacoes/ModalApagarPublicacao";

import "./ComunidadeTela.css";

function ComunidadeTela() {
    const { id } = useParams();

    const [publicacoes, setPublicacoes] = useState([]);
    const [curtidas, setCurtidas] = useState({});
    const [modalAberto, setModalAberto] = useState(false);
    const [publicacaoSelecionada, setPublicacaoSelecionada] = useState(null);
    const [comunidade, setComunidade] = useState(null);

    // Busca as informações da comunidade
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

    // Busca as publicações da comunidade
    async function buscarPublicacoes() {
        try {
            const response = await buscarPublicacoesDaComunidade(id);

            const lista = Array.isArray(response.data)
                ? response.data
                : [];

            setPublicacoes(lista);

            const estadoCurtidas = {};

            lista.forEach((publicacao) => {
                estadoCurtidas[publicacao.id] =
                    publicacao.curtida_usuario === true ||
                    publicacao.curtida_usuario === 1;
            });

            setCurtidas(estadoCurtidas);
        } catch (erro) {
            console.error(
                "Erro ao carregar publicações:",
                erro.response?.data || erro.message
            );
        }
    }

    // Carrega os dados quando a comunidade muda
    useEffect(() => {
        setComunidade(null);
        setPublicacoes([]);
        setCurtidas({});
        setPublicacaoSelecionada(null);

        buscarDadosComunidade();
        buscarPublicacoes();
    }, [id]);

    // Curtir ou descurtir publicação
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

    // Abre o modal de exclusão
    function abrirModalApagar(publicacao) {
        setPublicacaoSelecionada(publicacao);
    }

    // Fecha o modal de exclusão
    function fecharModalApagar() {
        setPublicacaoSelecionada(null);
    }

    // Verifica se o usuário é criador da comunidade
    const ehCriadorComunidade =
        comunidade?.eh_criador === true;

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

                            // Verifica se é autor da publicação
                            const ehAutor =
                                publicacao.eh_dono === true;

                            // Autor ou criador podem excluir
                            const podeApagar =
                                ehAutor || ehCriadorComunidade;

                            return (
                                <Publicacao
                                    key={publicacao.id}
                                    publicacao={publicacao}
                                    curtido={Boolean(
                                        curtidas[publicacao.id]
                                    )}
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

            {/* Modal para criar publicação */}
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

            {/* Modal para apagar publicação */}
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
