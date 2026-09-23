import { useState } from "react";
import {editarComentario, deletarComentario} from "../../api";
import "./ModalComentario.css";
import { IoClose } from "react-icons/io5";


function ModalComentario({
    comentario,
    onClose,
    onComentarioAlterado
}) {

    const [editando, setEditando] = useState(false);

    const [texto, setTexto] = useState(
        comentario.texto
    );

    const [carregando, setCarregando] =
        useState(false);

    const [mensagem, setMensagem] =
        useState("");


    async function handleEditar() {

        if (!texto.trim()) {

            setMensagem(
                "O comentário não pode ficar vazio."
            );

            return;

        }


        setCarregando(true);

        setMensagem("");


        try {

            await editarComentario(
                comentario.id,
                {
                    texto: texto
                }
            );


            onComentarioAlterado();

            onClose();


        } catch (erro) {

            console.error(erro);

            setMensagem(
                "Erro ao editar o comentário."
            );


        } finally {

            setCarregando(false);

        }

    }


    async function handleApagar() {

        setCarregando(true);

        setMensagem("");


        try {

            await deletarComentario(
                comentario.id
            );


            onComentarioAlterado();

            onClose();


        } catch (erro) {

            console.error(erro);

            setMensagem(
                "Erro ao apagar o comentário."
            );


        } finally {

            setCarregando(false);

        }

    }


    return (

        <div className="modal-overlay">

            <div className="modal-comentario">


                <div className="modal-header">

                    <h2>
                        Comentário
                    </h2>


                    <button type="button" className="btn-fechar" onClick={onClose} disabled={carregando} style={{height : "0", background : "none"}}> <IoClose size={30} /> </button>

                </div>


                {!editando && (

                    <div className="opcoes-comentario">

                        <button
                            type="button"
                            onClick={() =>
                                setEditando(true)
                            }
                        >
                            Editar comentário
                        </button>


                        <button
                            type="button"
                            onClick={handleApagar}
                            disabled={carregando}
                        >

                            {carregando
                                ? "Apagando..."
                                : "Apagar comentário"}

                        </button>


                        <button
                            type="button"
                            onClick={onClose}
                            disabled={carregando}
                        >
                            Cancelar
                        </button>

                    </div>

                )}


                {editando && (

                    <div className="editar-comentario">

                        <label htmlFor="texto-comentario">
                            Editar comentário
                        </label>


                        <textarea
                            id="texto-comentario"
                            value={texto}
                            onChange={(event) =>
                                setTexto(
                                    event.target.value
                                )
                            }
                        />


                        {mensagem && (

                            <p className="mensagem-modal">
                                {mensagem}
                            </p>

                        )}


                        <div className="modal-acoes">

                            <button
                                type="button"
                                onClick={() =>
                                    setEditando(false)
                                }
                                disabled={carregando}
                            >
                                Voltar
                            </button>


                            <button
                                type="button"
                                onClick={handleEditar}
                                disabled={carregando}
                            >

                                {carregando
                                    ? "Salvando..."
                                    : "Salvar"}

                            </button>

                        </div>

                    </div>

                )}

            </div>

        </div>

    );

}


export default ModalComentario;