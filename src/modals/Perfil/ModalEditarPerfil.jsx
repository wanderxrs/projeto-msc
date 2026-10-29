
import { useEffect, useState } from "react";
import { atualizarPerfil } from "../../api";
import "./ModalEditarPerfil.css";

function ModalEditarPerfil({ perfil, onFechar, onSalvo }) {
    const [nome, setNome] = useState(perfil?.nome || "");
    const [fotoPerfil, setFotoPerfil] = useState(null);
    const [fotoCapa, setFotoCapa] = useState(null);

    const [previewPerfil, setPreviewPerfil] = useState(
        perfil?.foto_url || ""
    );

    const [previewCapa, setPreviewCapa] = useState(
        perfil?.foto_url_background || perfil?.capa_url || ""
    );

    const [carregando, setCarregando] = useState(false);
    const [erro, setErro] = useState("");

    useEffect(() => {
        return () => {
            if (previewPerfil?.startsWith("blob:")) {
                URL.revokeObjectURL(previewPerfil);
            }

            if (previewCapa?.startsWith("blob:")) {
                URL.revokeObjectURL(previewCapa);
            }
        };
    }, [previewPerfil, previewCapa]);

    function selecionarImagem(evento, tipo) {
        const arquivo = evento.target.files?.[0];

        if (!arquivo) return;

        if (!arquivo.type.startsWith("image/")) {
            setErro("Selecione um arquivo de imagem válido.");
            evento.target.value = "";
            return;
        }

        if (arquivo.size > 5 * 1024 * 1024) {
            setErro("A imagem deve ter no máximo 5 MB.");
            evento.target.value = "";
            return;
        }

        setErro("");

        const url = URL.createObjectURL(arquivo);

        if (tipo === "perfil") {
            setFotoPerfil(arquivo);
            setPreviewPerfil(url);
        } else {
            setFotoCapa(arquivo);
            setPreviewCapa(url);
        }
    }

    async function salvarPerfil(evento) {
        evento.preventDefault();
        setErro("");

        if (!nome.trim()) {
            setErro("O nome não pode ficar vazio.");
            return;
        }

        const dados = new FormData();
        dados.append("nome", nome.trim());

        if (fotoPerfil) {
            dados.append("foto_perfil", fotoPerfil);
        }

        if (fotoCapa) {
            dados.append("foto_url_background", fotoCapa);
        }

        try {
            setCarregando(true);

            await atualizarPerfil(dados);

            if (onSalvo) {
                await onSalvo();
            }

            onFechar();
        } catch (erro) {
            console.error("Erro ao atualizar perfil:", erro);

            setErro(
                erro.response?.data?.erro ||
                "Não foi possível atualizar o perfil."
            );
        } finally {
            setCarregando(false);
        }
    }

    return (
        <div
            className="modal-editar-overlay"
            onClick={() => {
                if (!carregando) onFechar();
            }}
        >
            <div
                className="modal-editar-perfil"
                onClick={(evento) => evento.stopPropagation()}
            >
                <div className="modal-editar-cabecalho">
                    <h2>Editar perfil</h2>

                    <button
                        type="button"
                        className="modal-editar-fechar"
                        onClick={onFechar}
                        disabled={carregando}
                        aria-label="Fechar modal"
                    >
                        ×
                    </button>
                </div>

                <form onSubmit={salvarPerfil}>
                    <div className="campo-capa">
                        <div
                            className="preview-capa"
                            style={
                                previewCapa
                                    ? {
                                        backgroundImage: `url("${previewCapa}")`
                                    }
                                    : {}
                            }
                        >
                            {!previewCapa && (
                                <span>Sua capa</span>
                            )}
                        </div>

                        <label className="botao-imagem">
                            Alterar capa

                            <input
                                type="file"
                                accept="image/*"
                                onChange={(evento) =>
                                    selecionarImagem(evento, "capa")
                                }
                                disabled={carregando}
                            />
                        </label>
                    </div>

                    <div className="campo-foto-perfil">
                        <img
                            src={previewPerfil || "/avatar-padrao.png"}
                            alt="Foto de perfil"
                            className="preview-foto-perfil"
                        />

                        <label className="botao-imagem">
                            Alterar foto

                            <input
                                type="file"
                                accept="image/*"
                                onChange={(evento) =>
                                    selecionarImagem(evento, "perfil")
                                }
                                disabled={carregando}
                            />
                        </label>
                    </div>

                    <div className="campo-nome-perfil">
                        <label htmlFor="editar-nome">
                            Nome de usuário
                        </label>

                        <input
                            id="editar-nome"
                            type="text"
                            value={nome}
                            onChange={(evento) =>
                                setNome(evento.target.value)
                            }
                            maxLength={100}
                            required
                            disabled={carregando}
                        />
                    </div>

                    {erro && (
                        <p className="erro-editar-perfil">
                            {erro}
                        </p>
                    )}

                    <div className="modal-editar-acoes">
                        <button
                            type="button"
                            className="botao-cancelar-edicao"
                            onClick={onFechar}
                            disabled={carregando}
                        >
                            Cancelar
                        </button>

                        <button
                            type="submit"
                            className="botao-salvar-edicao"
                            disabled={carregando}
                        >
                            {carregando
                                ? "Salvando..."
                                : "Salvar alterações"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ModalEditarPerfil;
