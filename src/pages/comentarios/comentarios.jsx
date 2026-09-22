import { useEffect, useState } from "react";

import { useParams } from "react-router-dom";

import { carregarComentarios, criarComentario } from "../../api";

import "./comentarios.css";

import { IoPaperPlane } from "react-icons/io5";
import { IoMenu } from "react-icons/io5";


function Comentarios() {

    const { publicacao_id } = useParams();

    const [comentarios, setComentarios] = useState([]);

    const [texto, setTexto] = useState("");


    async function buscarComentarios() {

        try {

            const resposta = await carregarComentarios(publicacao_id);

            console.log("Comentários recebidos:", resposta.data);

            setComentarios(resposta.data);

        } catch (erro) {

            console.log("Erro ao carregar comentários:", erro);

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

            console.log("Erro ao criar comentário:", erro);

        }

    }


    return (

        <div className="comentarios">

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
                    <IoPaperPlane fontSize={30} />
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
                                />

                                <strong className="usuario-nome">
                                    {comentario.nome_usuario}
                                </strong>

                            </div >

                            <div>
                            <span className="data-comentario">
                                {new Date(comentario.data_criacao).toLocaleDateString("pt-BR")}
                            </span> {'\u00A0'}{'\u00A0'}
                            <IoMenu color="white" size={30} style={{cursor:"pointer"}}/>
                            </div>
                        </div>


                        <p className="comentario-texto">
                            {comentario.texto}
                        </p>

                    </div>

                ))}

            </div>

        </div>

    );

}


export default Comentarios;