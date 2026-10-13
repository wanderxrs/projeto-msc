import { useState } from "react";
import { fazerPublicacao } from "../api";
import "./ModalPublicacao.css";
import { IoClose } from "react-icons/io5";

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
            setMensagem("");
        }
    }

    async function handlePublicar(event) {
        event.preventDefault();

        if (carregando) return;

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
            const resposta = await fazerPublicacao(dadosPublicacao);

            console.log(resposta.data);

            if (onPublicacaoCriada) {
                onPublicacaoCriada();
            }

            onClose();
        } catch (erro) {
            console.error(erro);

            const dados = erro.response?.data;

            if (dados) {
                setMensagem(
                    typeof dados === "string"
                        ? dados
                        : dados.error ||
                          dados.message ||
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
                        disabled={carregando}
                        style={{
                            height: "auto",
                            background: "none"
                        }}
                    >
                        <IoClose size={35} />
                    </button>
                </div>

                <form onSubmit={handlePublicar}>
                    <label htmlFor="imagem">
                        Imagem da publicação
                    </label>

                    <input
                        id="imagem"
                        type="file"
                        accept="image/*"
                        onChange={handleImagem}
                        disabled={carregando}
                        required
                    />

                    {imagem && (
                        <p>
                            Imagem selecionada: {imagem.name}
                        </p>
                    )}

                    <label htmlFor="legenda">
                        Legenda
                    </label>

                    <textarea
                        id="legenda"
                        value={legenda}
                        onChange={(event) =>
                            setLegenda(event.target.value)
                        }
                        placeholder="O que você está ouvindo?"
                        disabled={carregando}
                    />

                    {carregando && (
                        <div
                            className="loading-moderacao"
                            role="status"
                            aria-live="polite"
                        >
                            <div className="spinner"></div>

                            <p>
                                Verificando sua publicação...
                            </p>

                            <span>
                                A IA está analisando a imagem
                                e a legenda. Aguarde um momento.
                            </span>
                        </div>
                    )}

                    {mensagem && (
                        <p
                            className="mensagem-erro"
                            role="alert"
                        >
                            {mensagem}
                        </p>
                    )}

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
                                ? "Verificando..."
                                : "Publicar"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ModalPublicacao;