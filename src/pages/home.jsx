import { useEffect, useState } from "react";
import ModalPublicacao from "../modals/modalPublicacao";
import {carregarPublicacoes,curtirPublicacao} from "../api";
import "./home.css";
import { useNavigate } from "react-router-dom";

import ComunidadesRecomendadas from "../components/ComunidadesRecomendadas";

import { VscCommentCompact } from "react-icons/vsc";
import { VscHeart } from "react-icons/vsc";

import PerfilComponente from "../components/perfilComponente";


function Home() {

    const [modalAberto, setModalAberto] = useState(false);

    const [publicacoes, setPublicacoes] = useState([]);

    const [carregando, setCarregando] = useState(true);

    const [erro, setErro] = useState("");

    const [curtidas, setCurtidas] = useState({});

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

            const resposta = await curtirPublicacao(publicacao_id);

            const curtidaAtiva = resposta.data.curtida;

            setCurtidas((curtidasAnteriores) => ({

                ...curtidasAnteriores,

                [publicacao_id]: curtidaAtiva

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

                        total_curtidas: curtidaAtiva

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


    return (

        
        <div className="conteudo-principal">
            <ComunidadesRecomendadas />
            <main className="conteudo-central">

                <button onClick={() => setModalAberto(true)}>
                    Fazer publicação
                </button>


                {modalAberto && (

                    <ModalPublicacao
                        onClose={() => setModalAberto(false)}
                        onPublicacaoCriada={buscarPublicacoes}
                    />

                )}

            

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

                            <h3>{publicacao.nome_usuario}</h3>

                            <p>{publicacao.legenda}</p>

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
                                >

                                    <span
                                        className={
                                            curtidas[publicacao.id]
                                                ? "coracao curtido"
                                                : "coracao"
                                        }
                                    >

                                        {curtidas[publicacao.id]
                                            ? "♥"
                                            : <VscHeart color="white" fontSize={29} />}

                                    </span>

                                </button>


                                <span className="quantidade-curtidas">

                                    {Number(publicacao.total_curtidas) || 0}

                                </span>


                                <button className="botao-comentar" onClick={() => navigate(`/comentarios/${publicacao.id}`)}> <VscCommentCompact fontSize={24} /> </button>

                            </div>

                        </div>

                    ))}

                </div>

            </main>
            <PerfilComponente/>
        </div>

    );

}


export default Home;