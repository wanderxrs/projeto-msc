import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

// API e Estilos
import { carregarPublicacoes, curtirPublicacao } from "../api";

import "./home.css";

// Componentes
import ComunidadesRecomendadas from "../components/ComunidadesRecomendadas";

import PerfilComponente from "../components/perfilComponente";

// Ícones
import { IoMenu } from "react-icons/io5";
import { PiHeartStraight, PiHeartStraightFill } from "react-icons/pi";
import { VscCommentCompact } from "react-icons/vsc";

function Home() {

    const [publicacoes, setPublicacoes] = useState([]);

    const [carregando, setCarregando] = useState(true);

    const [erro, setErro] = useState("");

    const [curtidas, setCurtidas] = useState({});

    // Publicação que foi selecionada para apagar
    const [publicacaoSelecionada, setPublicacaoSelecionada] =
        useState(null);

    const navigate = useNavigate();


    async function buscarPublicacoes() {

        try {

            const resposta = await carregarPublicacoes();

            setPublicacoes(resposta.data);

            const estadoCurtidas = {};

            resposta.data.forEach((publicacao) => {

                estadoCurtidas[publicacao.id] =
                    publicacao.curtida_usuario;

            });

            setCurtidas(estadoCurtidas);

        } catch (erro) {

            console.error(erro);

            setErro("Erro ao carregar as publicações.");

        } finally {

            setCarregando(false);

        }

    }


    useEffect(() => {

        buscarPublicacoes();

    }, []);


    async function handleCurtir(publicacao_id) {

        try {

            await curtirPublicacao(publicacao_id);

            const novoValor = !curtidas[publicacao_id];

            setCurtidas((curtidasAnteriores) => ({

                ...curtidasAnteriores,

                [publicacao_id]: novoValor

            }));


            setPublicacoes((publicacoesAnteriores) =>

                publicacoesAnteriores.map((publicacao) => {

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


    // Abre o modal de apagar
    function abrirModalApagar(publicacao) {

        setPublicacaoSelecionada(publicacao);

    }


    // Fecha o modal de apagar
    function fecharModalApagar() {

        setPublicacaoSelecionada(null);

    }


    return (

        <>

            <div className="conteudo-principal">

                <ComunidadesRecomendadas />

                <main className="conteudo-central">

                    <h1>Feed inicial</h1>


                    {carregando && (
                        <p>Carregando publicações...</p>
                    )}


                    {erro && (
                        <p>{erro}</p>
                    )}


                    {!carregando && publicacoes.length === 0 && (
                        <p>Nenhuma publicação encontrada.</p>
                    )}


                    <div className="feed">

                        {publicacoes.map((publicacao) => (

                            <div
                                key={publicacao.id}
                                className="publicacao"
                            >

                                <div className="cabecalho-publicacao">

                                    <img
                                        src={publicacao.foto_url}
                                        alt="foto de usuario"
                                        className="foto-usuario"
                                    />

                                    <h3
                                        onClick={() =>
                                            navigate(
                                                `/perfil/${publicacao.usuario_id}`
                                            )
                                        }
                                        style={{
                                            cursor: "pointer"
                                        }}
                                    >
                                        {publicacao.nome_usuario}
                                    </h3>

                                    <div className="data-publicacao">

                                        {new Date(
                                            publicacao.data_criacao
                                        ).toLocaleDateString("pt-BR")}

                                    </div>

                                    <button
                                        className="hamburguer"
                                        style={{
                                            background: "none",
                                            padding: "0",
                                            height: "0",
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

                                </div>


                                <p>
                                    {publicacao.legenda}
                                </p>


                                <img
                                    src={publicacao.imagem_url}
                                    alt="Imagem da publicação"
                                />


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
                                        style={{
                                            background: "none"
                                        }}
                                    >

                                        <span
                                            className={
                                                curtidas[publicacao.id]
                                                    ? "coracao curtido"
                                                    : "coracao"
                                            }
                                        >

                                            {curtidas[publicacao.id]

                                                ? (
                                                    <PiHeartStraightFill
                                                        color="white"
                                                        fontSize={30}
                                                    />
                                                )

                                                : (
                                                    <PiHeartStraight
                                                        color="white"
                                                        fontSize={30}
                                                    />
                                                )
                                            }

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
                                    >
                                        <VscCommentCompact
                                            fontSize={24}
                                        />
                                    </button>

                                    {Number(
                                        publicacao.total_comentarios
                                    ) || 0}

                                </div>

                            </div>

                        ))}

                    </div>

                </main>

                <PerfilComponente />

            </div>

        </>
    );

}


export default Home;