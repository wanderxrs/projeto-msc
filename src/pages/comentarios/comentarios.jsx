
import { useEffect, useState } from "react";

import { useParams, useNavigate } from "react-router-dom";

import {
    carregarComentarios,
    criarComentario
} from "../../api";

import "./comentarios.css";

import ModalComentario from "../../modals/Comentario/ModalComentario";

import { IoPaperPlane } from "react-icons/io5";

import { IoMenu } from "react-icons/io5";


function Comentarios() {

    const { publicacao_id } = useParams();
    const navigate = useNavigate();

    const [comentarios, setComentarios] = useState([]);

    const [texto, setTexto] = useState("");

    const [comentarioSelecionado, setComentarioSelecionado] =
        useState(null);


    async function buscarComentarios() {

        try {

            const resposta =
                await carregarComentarios(publicacao_id);

            console.log(
                "Comentários recebidos:",
                resposta.data
            );

            setComentarios(resposta.data);

        } catch (erro) {

            console.log(
                "Erro ao carregar comentários:",
                erro
            );

        }

    }


    useEffect(() => {

        buscarComentarios();

    }, [publicacao_id]);


    async function handleComentario(event) {

        event.preventDefault();

        if (!texto.trim()) {
            return;
        }

        try {

            await criarComentario({

                texto: texto,

                publicacao_id: publicacao_id

            });

            setTexto("");

            buscarComentarios();

        } catch (erro) {

            console.log(
                "Erro ao criar comentário:",
                erro
            );

        }

    }


    // Abrir perfil do usuário que comentou
    function abrirPerfil(usuario_id) {

        if (!usuario_id) {
            console.error("ID do usuário não encontrado.");
            return;
        }

        navigate(`/perfil/${usuario_id}`);

    }


    function abrirModalComentario(comentario) {

        setComentarioSelecionado(comentario);

    }


    function fecharModalComentario() {

        setComentarioSelecionado(null);

    }


    return (

        <div className="comentarios">
        <br /> <br />

            <h3 className="titulo">

                Comentários

            </h3>


            <form onSubmit={handleComentario}>

                <input
                    type="text"
                    placeholder="Escreva um comentário..."
                    value={texto}
                    onChange={(event) =>
                        setTexto(event.target.value)
                    }
                />

                <button
                    type="submit"
                    className="botaoComentar"
                >

                    <IoPaperPlane
                        fontSize={30}
                    />

                </button>

            </form>


            <div className="lista-comentarios">

                {comentarios.map((comentario) => (

                    <div
                        className="caixa-comentario"
                        key={comentario.id}
                    >

                        <div className="cabecalho-comentario">

                            <div className="usuario-comentario">

                                <img
                                    className="foto-comentario"
                                    src={comentario.foto_url}
                                    alt="Foto do usuário"
                                    onClick={() =>
                                        abrirPerfil(comentario.usuario_id)
                                    }
                                    style={{ cursor: "pointer" }}
                                />

                                <strong
                                    className="usuario-nome"
                                    onClick={() =>
                                        abrirPerfil(comentario.usuario_id)
                                    }
                                    style={{ cursor: "pointer" }}
                                >

                                    {comentario.nome_usuario}

                                </strong>

                            </div>


                            <div>

                                <span className="data-comentario">

                                    {new Date(
                                        comentario.data_criacao
                                    ).toLocaleDateString(
                                        "pt-BR"
                                    )}

                                </span>

                                &nbsp;&nbsp;


                                {comentario.eh_dono && (

                                    <IoMenu
                                        color="white"
                                        size={30}
                                        style={{
                                            cursor: "pointer"
                                        }}
                                        onClick={() =>
                                            abrirModalComentario(
                                                comentario
                                            )
                                        }
                                    />

                                )}

                            </div>

                        </div>


                        <p className="comentario-texto">

                            {comentario.texto}

                        </p>

                    </div>

                ))}

            </div>


            {comentarioSelecionado && (

                <ModalComentario

                    comentario={comentarioSelecionado}

                    onClose={
                        fecharModalComentario
                    }

                    onComentarioAlterado={
                        buscarComentarios
                    }

                />

            )}

        </div>

    );

}


export default Comentarios;
