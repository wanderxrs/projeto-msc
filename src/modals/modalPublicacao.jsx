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
    const [comunidade] = useState(comunidadeId || "");
    const [mensagem, setMensagem] = useState("");
    const [carregando, setCarregando] = useState(false);
    const [tipoMidia, setTipoMidia] = useState("");

    function handleImagem(event) {
        const arquivo = event.target.files?.[0];

        if (!arquivo) return;

        const ehImagem = arquivo.type.startsWith("image/");
        const ehVideo = arquivo.type.startsWith("video/");

        if (!ehImagem && !ehVideo) {
            setMensagem(
                "Selecione um arquivo de imagem ou vídeo válido."
            );
            setImagem(null);
            setTipoMidia("");
            event.target.value = "";
            return;
        }

        // Limite de 50 MB por arquivo.
        if (arquivo.size > 50 * 1024 * 1024) {
            setMensagem("O arquivo deve ter no máximo 50 MB.");
            setImagem(null);
            setTipoMidia("");
            event.target.value = "";
            return;
        }

        // Formatos de vídeo aceitos.
        const formatosVideo = [
            "video/mp4",
            "video/webm",
            "video/quicktime",
            "video/ogg"
        ];

        if (ehVideo && !formatosVideo.includes(arquivo.type)) {
            setMensagem(
                "Formato de vídeo não aceito. Use MP4, WebM, MOV ou OGG."
            );
            setImagem(null);
            setTipoMidia("");
            event.target.value = "";
            return;
        }

        setImagem(arquivo);
        setTipoMidia(ehVideo ? "video" : "imagem");
        setMensagem("");
    }

    function removerArquivo() {
        setImagem(null);
        setTipoMidia("");
        setMensagem("");

        const campoArquivo = document.getElementById("imagem");

        if (campoArquivo) {
            campoArquivo.value = "";
        }
    }

    async function handlePublicar(event) {
        event.preventDefault();

        if (carregando) return;

        if (!imagem) {
            setMensagem("Selecione uma imagem ou um vídeo.");
            return;
        }

        if (!comunidade) {
            setMensagem("Comunidade não definida.");
            return;
        }

        const dadosPublicacao = new FormData();

        // Mantém o nome do campo esperado pela rota Flask.
        dadosPublicacao.append("imagem", imagem);
        dadosPublicacao.append("legenda", legenda);
        dadosPublicacao.append("comunidade", comunidade);
        dadosPublicacao.append("tipo_midia", tipoMidia);

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
            console.error("Erro ao publicar:", erro);

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
                        aria-label="Fechar modal"
                    >
                        <IoClose size={35} />
                    </button>
                </div>

                <form onSubmit={handlePublicar}>
                    <label htmlFor="imagem">
                        Imagem ou vídeo da publicação
                    </label>

                    <input
                        id="imagem"
                        type="file"
                        accept="image/*,video/mp4,video/webm,video/quicktime,video/ogg"
                        onChange={handleImagem}
                        disabled={carregando}
                        required
                    />

                    {/* Exibe somente as informações do arquivo */}
                    {imagem && (
                        <div className="arquivo-selecionado">
                            <p>
                                {tipoMidia === "video" ? "🎬" : "🖼️"}{" "}
                                {tipoMidia === "video"
                                    ? "Vídeo selecionado:"
                                    : "Imagem selecionada:"}
                            </p>

                            <p className="nome-arquivo">
                                {imagem.name}
                            </p>

                            <button
                                type="button"
                                onClick={removerArquivo}
                                disabled={carregando}
                            >
                                Remover arquivo
                            </button>
                        </div>
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
                                Sua publicação está sendo processada.
                                Aguarde um momento.
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