import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {carregarPerfilUsuario,curtirPublicacao} from "../../api";
import {PiHeartStraight,PiHeartStraightFill} from "react-icons/pi";
import { VscCommentCompact } from "react-icons/vsc";
import { IoMenu } from "react-icons/io5";
import ModalApagarPublicacao from "../../modals/Publicacoes/ModalApagarPublicacao";
import "./perfil.css";
import { IoIosArrowBack } from "react-icons/io";

function Perfil() {

    const { id } = useParams();
    const navigate = useNavigate();
    const [perfil, setPerfil] = useState(null);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("");
    const [curtidas, setCurtidas] = useState({});

    const [publicacaoSelecionada, setPublicacaoSelecionada] =
        useState(null);

    async function buscarPerfil() {

        try {

            const resposta = await carregarPerfilUsuario(id);

            setPerfil(resposta.data);

            const estadoCurtidas = {};

            resposta.data.publicacoes.forEach((publicacao) => {

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

            const novoValor =
                !curtidas[publicacao_id];


            setCurtidas((curtidasAnteriores) => ({

                ...curtidasAnteriores,

                [publicacao_id]: novoValor
            }));


            setPerfil((perfilAnterior) => ({

                ...perfilAnterior,

                publicacoes:
                    perfilAnterior.publicacoes.map(
                        (publicacao) => {

                            if (publicacao.id !== publicacao_id) {
                                return publicacao;
                            }

                            const quantidadeAtual =
                                Number(
                                    publicacao.total_curtidas
                                ) || 0;

                            return {

                                ...publicacao,

                                total_curtidas:
                                    novoValor
                                        ? quantidadeAtual + 1
                                        : Math.max(
                                            0,
                                            quantidadeAtual - 1
                                        )

                            };

                        }
                    )

            }));

        } catch (erro) {

            console.error(erro);

            setErro(
                "Erro ao curtir a publicação."
            );

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


    if (carregando) {

        return (
            <p>
                Carregando perfil...
            </p>
        );

    }

    if (erro) {

        return (
            <p>
                {erro}
            </p>
        );

    }

    if (!perfil) {

        return (
            <p>
                Perfil não encontrado.
            </p>
        );

    }

    return (

        <>

            <div className="perfil-page">

                <div className="perfil-header">
                    <IoIosArrowBack size={45} style={{cursor : "pointer"}}  onClick={() => navigate("/home")}/>

                    <img src={perfil.usuario.foto_url} alt="Foto do perfil" className="perfil-foto"/>

                    <h1 className="perfil-nome">

                        {perfil.usuario.nome}

                    </h1>

                </div>

                <div className="perfil-publicacoes">

                    <h2> Publicações</h2>
                    
                    {perfil.publicacoes.length === 0 ? (

                        <p>Esse usuário ainda não possui publicações.</p>

                    ) : (

                        perfil.publicacoes.map(
                            (publicacao) => (

                                <div
                                    className="perfil-publicacao"
                                    key={publicacao.id}
                                >

                                    <div className="cabecalho-publicacao">

                                        <img src={ publicacao.foto_url} alt="Foto do usuário" className="foto-usuario"/>

                                        <h3> {publicacao.nome_usuario}</h3>

                                        <div className="data-publicacao">

                                            {new Date(
                                                publicacao.data_criacao
                                            ).toLocaleDateString(
                                                "pt-BR"
                                            )}

                                        </div>

                                        <button className="hamburguer" onClick={() => abrirModalApagar( publicacao)} style={{background: "none", padding: "0",  height: "0", marginLeft: "auto"}}>
                                            <IoMenu size={25} style={{ cursor: "pointer" }}/>
                                        </button>
                                    </div>

                                    <p> {publicacao.legenda} </p>

                                    <img src={ publicacao.imagem_url }alt="Imagem da publicação"/>

                                    <div className="area-curtida">

                                        <button className="botao-curtida" onClick={() => handleCurtir(publicacao.id)}
                                             aria-label={
                                                curtidas[
                                                    publicacao.id
                                                ]
                                                    ? "Descurtir publicação"
                                                    : "Curtir publicação"
                                            }
                                            style={{
                                                background: "none"
                                            }}
                                        >

                                            <span
                                                className={
                                                    curtidas[
                                                        publicacao.id
                                                    ]
                                                        ? "coracao curtido"
                                                        : "coracao"
                                                }
                                            >

                                                {
                                                    curtidas[
                                                        publicacao.id
                                                    ]
                                                        ? (

                                                            <PiHeartStraightFill
                                                                color="white"
                                                                fontSize={30}
                                                            />

                                                        )
                                                        :(

                                                            <PiHeartStraight
                                                                color="white"
                                                                fontSize={30}
                                                            />

                                                        )
                                                }
                                            </span>

                                        </button>


                                        <div className="quantidade-curtidas">

                                            {
                                                Number(
                                                    publicacao.total_curtidas
                                                ) || 0
                                            }

                                        </div>

                                        <button className="botao-comentar" onClick={() => navigate( `/comentarios/${publicacao.id}`)}> <VscCommentCompact fontSize={24}/> </button>
                                        {
                                            Number(
                                                publicacao.total_comentarios
                                            ) || 0
                                        }
                                    </div>
                                </div>
                            )
                        )

                    )}

                </div>

            </div>

            {publicacaoSelecionada && (

                <ModalApagarPublicacao
                    publicacao={
                        publicacaoSelecionada
                    }

                    onClose={
                        fecharModalApagar
                    }

                    onPublicacaoApagada={() => {

                        setPublicacaoSelecionada(
                            null
                        );

                        window.location.reload();

                    }}
                />

            )}


        </>

    );

}

export default Perfil;