import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { buscarPublicacoesDaComunidade, curtirPublicacao} from "../../api";
import { PiHeartStraight, PiHeartStraightFill } from "react-icons/pi";
import { VscCommentCompact } from "react-icons/vsc";
import { FiArrowLeft } from "react-icons/fi";
import { IoMenu } from "react-icons/io5";
import InformacoesComunidade from "../../components/cabecalhoComunidade/InformacoesComunidade";
import ModalPublicacao from "../../modals/modalPublicacao";
import "./ComunidadeTela.css";


function ComunidadeTela() {

    const { id } = useParams();
    const navigate = useNavigate();
    const [publicacoes, setPublicacoes] = useState([]);
    const [curtidas, setCurtidas] = useState({});
    const [modalAberto, setModalAberto] = useState(false);


    async function buscarPublicacoes() {

        try {
            const response =
                await buscarPublicacoesDaComunidade(id);

            setPublicacoes(response.data);
            const estadoCurtidas = {};

            response.data.forEach((publicacao) => {

                estadoCurtidas[publicacao.id] =
                    publicacao.curtida_usuario;
            });

            setCurtidas(estadoCurtidas);

        } catch (erro) {

            console.error(
                "Erro ao carregar publicações:",
                erro
            );
        }
    }

    useEffect(() => {
        buscarPublicacoes();
    }, [id]);


    async function handleCurtir(publicacao_id) {

        try {

            await curtirPublicacao(publicacao_id);

            const novoValor =
                !curtidas[publicacao_id];

            setCurtidas((curtidasAnteriores) => ({
                ...curtidasAnteriores,
                [publicacao_id]: novoValor
            }));


            setPublicacoes((publicacoesAnteriores) =>

                publicacoesAnteriores.map((publicacao) => {

                    if (
                        publicacao.id !== publicacao_id
                    ) {
                        return publicacao;
                    }

                    const quantidadeAtual =
                        Number(
                            publicacao.total_curtidas
                        ) || 0;


                    return {

                        ...publicacao,
                        total_curtidas: novoValor
                            ? quantidadeAtual + 1
                            : Math.max(
                                0,
                                quantidadeAtual - 1
                            )
                    };
                })
            );

        } catch (erro) {
            console.error(erro);
        }
    }


    return (

        <div className="comunidade-tela">

            <button
                className="botao-voltar"
                onClick={() => navigate("/home")}
            >
                <FiArrowLeft size={20} />

                <span>Voltar para Home</span>
            </button>


            <div className="conteudo-comunidade">

                <main className="feed-comunidade">


                    {publicacoes.map((publicacao) => (
                        <div
                            key={publicacao.id}
                            className="publicacao">

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
                                    ).toLocaleDateString(
                                        "pt-BR"
                                    )}

                                </div>


                                <button
                                    className="hamburguer"
                                    style={{
                                        background: "none",
                                        padding: "0",
                                        height: "0",
                                        marginLeft: "auto"
                                    }}>

                                    <IoMenu
                                        size={25}
                                        style={{
                                            cursor: "pointer"
                                        }}
                                    />

                                </button>

                            </div>

                            <p>{publicacao.legenda}</p>


                            <img
                                className="imagem-publicacao"
                                src={publicacao.imagem_url}
                                alt="Imagem da publicação"
                            />


                            <div className="area-curtida">


                                <button
                                    className="botao-curtida"
                                    onClick={() =>
                                        handleCurtir(
                                            publicacao.id
                                        )
                                    }
                                    style={{
                                        background: "none"
                                    }}
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
                                        )}

                                </button>


                                <span className="quantidade-curtidas">

                                    {Number(
                                        publicacao.total_curtidas
                                    ) || 0}

                                </span>


                                <button
                                    className="botao-comentar"
                                    onClick={() => navigate( `/comentarios/${publicacao.id}`)}>

                                    <VscCommentCompact
                                        fontSize={24}
                                    />

                                </button>

                                <span>

                                    {Number(
                                        publicacao.total_comentarios
                                    ) || 0}

                                </span>
                            </div>
                        </div>
                    ))}
                </main>

                <aside className="lateral-comunidade">

                    <InformacoesComunidade />

                    <button
                        className="botao-publicar-comunidade"
                        onClick={() =>
                            setModalAberto(true)}>
                        Fazer publicação
                        </button>
                </aside>
            </div>

            {modalAberto && (
                <ModalPublicacao onClose={() => setModalAberto(false) }
                 onPublicacaoCriada={() => { setModalAberto(false); buscarPublicacoes();}}
                 comunidadeId={id}/>)}
        </div>
    );
}


export default ComunidadeTela;