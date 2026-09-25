import { useState } from "react";
import { fazerPublicacao } from "../api";
import "./ModalPublicacao.css";

function ModalPublicacao({
    onClose,
    onPublicacaoCriada,
    comunidadeId
}) {

    const [imagem, setImagem] = useState(null);
    const [legenda, setLegenda] = useState("");
    const [comunidade, setComunidade] = useState(comunidadeId || "");
    const [mensagem, setMensagem] = useState("");
    const [carregando, setCarregando] = useState(false);

    function handleImagem(event) {

        const arquivo = event.target.files[0];

        if (arquivo) {
            setImagem(arquivo);
        }
    }


    async function handlePublicar(event) {
        event.preventDefault();

        if (!imagem) {
            setMensagem("Selecione uma imagem.");
            return;
        }


        if (!comunidade) {
            setMensagem("Comunidade não definida.");
            return;
        }


        const dadosPublicacao = new FormData();
        dadosPublicacao.append("imagem", imagem);
        dadosPublicacao.append("legenda", legenda);
        dadosPublicacao.append("comunidade", comunidade);
        setCarregando(true);
        setMensagem("");

        try {
            const resposta = await fazerPublicacao(
                dadosPublicacao
            );

            console.log(resposta.data);
            onPublicacaoCriada();
            onClose();

        } catch (erro) {
            console.error(erro);

            if (erro.response) {
                setMensagem(
                    erro.response.data ||
                    "Erro ao publicar."
                );

            } else {

                setMensagem(
                    "Erro ao conectar com o servidor."
                );
            }
        } finally {
            setCarregando(false);
        }
    }


    return (

        <div className="modal-overlay">

            <div className="modal-publicacao">

                <div className="modal-header">

                    <h2>Nova publicação</h2>

                    <button
                        type="button"
                        onClick={onClose}
                        className="btn-fechar"
                    >
                        X
                    </button>

                </div>


                <form onSubmit={handlePublicar}>


                    <label htmlFor="imagem">Imagem da publicação</label>


                    <input
                        id="imagem"
                        type="file"
                        accept="image/*"
                        onChange={handleImagem}
                        required
                    />


                    {imagem && (
                        <p>
                            Imagem selecionada: {imagem.name}
                        </p>
                    )}


                    <label htmlFor="legenda">Legenda</label>


                    <textarea
                        id="legenda"
                        value={legenda}
                        onChange={(event) =>
                            setLegenda(event.target.value)
                        }
                        placeholder="O que você está ouvindo?"
                    />


                    {mensagem && (<p>{mensagem}</p>)}


                    <div className="modal-acoes">

                        <button
                            type="button"
                            onClick={onClose}
                            disabled={carregando}
                        >
                            Cancelar
                        </button>


                        <button
                            type="submit"
                            disabled={carregando}
                        >

                            {carregando
                                ? "Publicando..."
                                : "Publicar"}

                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}


export default ModalPublicacao;