
import { useState, useEffect } from "react";
import { atualizarComunidade } from "../../api";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    TextField
} from "@mui/material";
import "./atualizarComunidadeModal.css";

function AtualizarComunidadeModal({
    isOpen,
    onClose,
    comunidade_id,
    comunidade
}) {
    const [mensagem, setMensagem] = useState("");
    const [nome, setNome] = useState("");
    const [genero, setGenero] = useState("");
    const [descricao, setDescricao] = useState("");
    const [imagem_url, setImagem_url] = useState("");
    const [imagem, setImagem] = useState(null);
    const [carregando, setCarregando] = useState(false);

    useEffect(() => {
        if (comunidade) {
            setNome(comunidade.nome || "");
            setGenero(comunidade.genero || "");
            setDescricao(comunidade.descricao || "");
            setImagem_url(comunidade.imagem_url || "");
            setImagem(null);
            setMensagem("");
        }
    }, [comunidade]);

    const alterarComunidade = async (e) => {
        e.preventDefault();
        setMensagem("");

        const dadosComunidade = new FormData();

        dadosComunidade.append("nome", nome);
        dadosComunidade.append("genero", genero);
        dadosComunidade.append("descricao", descricao);
        dadosComunidade.append("imagem_url", imagem_url);

        if (imagem) {
            dadosComunidade.append("imagem", imagem);
        }

        try {
            setCarregando(true);

            const resultado = await atualizarComunidade(
                comunidade_id,
                dadosComunidade
            );

            setMensagem(
                resultado.data.mensagem || "Comunidade atualizada com sucesso!"
            );

            onClose();
        } catch (e) {
            const erro =
                e.response?.data?.erro ||
                "Não foi possível conectar à API.";

            setMensagem(erro);
        } finally {
            setCarregando(false);
        }
    };

    const fecharModal = () => {
        if (!carregando) {
            onClose();
        }
    };

    return (
        <Dialog
            open={isOpen}
            onClose={fecharModal}
            fullWidth
            maxWidth="xs"
            className="yrplace-atualizar-dialog"
        >
            <DialogTitle className="yrplace-atualizar-titulo">
                Atualizar comunidade

                <Typography className="yrplace-atualizar-subtitulo">
                    Edite as informações da sua comunidade.
                </Typography>
            </DialogTitle>

            <DialogContent className="yrplace-atualizar-conteudo">
                {mensagem && (
                    <Typography className="yrplace-atualizar-mensagem">
                        {mensagem}
                    </Typography>
                )}

                <form
                    id="form-atualizar-comunidade"
                    onSubmit={alterarComunidade}
                >
                    <div className="yrplace-atualizar-imagem">
                        <Typography className="yrplace-atualizar-label">
                            Imagem da comunidade
                        </Typography>

                        <Button
                            component="label"
                            variant="outlined"
                            className="yrplace-atualizar-upload"
                        >
                            Escolher imagem
                            <input
                                type="file"
                                accept="image/*"
                                hidden
                                onChange={(e) =>
                                    setImagem(e.target.files[0] || null)
                                }
                            />
                        </Button>

                        <Typography className="yrplace-atualizar-nome-arquivo">
                            {imagem
                                ? imagem.name
                                : "Selecione uma imagem para substituir a atual"}
                        </Typography>
                    </div>

                    <TextField
                        margin="normal"
                        fullWidth
                        required
                        label="Nome"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                    />

                    <TextField
                        margin="normal"
                        fullWidth
                        required
                        label="Gênero musical"
                        value={genero}
                        onChange={(e) => setGenero(e.target.value)}
                    />

                    <TextField
                        margin="normal"
                        fullWidth
                        required
                        multiline
                        minRows={3}
                        label="Descrição"
                        value={descricao}
                        onChange={(e) => setDescricao(e.target.value)}
                    />
                </form>
            </DialogContent>

            <DialogActions className="yrplace-atualizar-acoes">
                <Button
                    onClick={fecharModal}
                    disabled={carregando}
                    className="yrplace-atualizar-cancelar"
                >
                    Cancelar
                </Button>

                <Button
                    type="submit"
                    form="form-atualizar-comunidade"
                    variant="contained"
                    disabled={carregando}
                    className="yrplace-atualizar-confirmar"
                >
                    {carregando ? "Atualizando..." : "Salvar alterações"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default AtualizarComunidadeModal;
