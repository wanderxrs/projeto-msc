
import { useState } from "react";
import { criarComunidade } from "../../api";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    TextField
} from "@mui/material";
import "./criarComunidadeModal.css";

function CriarComunidadeModal({ isOpen, onClose }) {
    const [mensagem, setMensagem] = useState("");
    const [nome, setNome] = useState("");
    const [genero, setGenero] = useState("");
    const [descricao, setDescricao] = useState("");
    const [imagem_url, setImagem_url] = useState(null);
    const [carregando, setCarregando] = useState(false);

    const novaComunidade = async (e) => {
        e.preventDefault();
        setMensagem("");

        const dadosComunidade = new FormData();

        dadosComunidade.append("nome", nome);
        dadosComunidade.append("genero", genero);
        dadosComunidade.append("descricao", descricao);

        if (imagem_url) {
            dadosComunidade.append("imagem_url", imagem_url);
        }

        try {
            setCarregando(true);

            const resultado = await criarComunidade(dadosComunidade);

            setMensagem(
                resultado.data.mensagem || "Comunidade criada com sucesso!"
            );

            setNome("");
            setGenero("");
            setDescricao("");
            setImagem_url(null);

            e.target.reset();
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
        if (carregando) return;
        onClose();
    };

    return (
        <Dialog
            open={isOpen}
            onClose={fecharModal}
            fullWidth
            maxWidth="sm"
            className="yrplace-criar-dialog"
        >
            <DialogTitle className="yrplace-criar-titulo">
                Criar comunidade
                <Typography className="yrplace-criar-subtitulo">
                    Crie um espaço para reunir fãs e compartilhar sua paixão.
                </Typography>
            </DialogTitle>

            <DialogContent className="yrplace-criar-conteudo">
                {mensagem && (
                    <Typography className="yrplace-criar-mensagem">
                        {mensagem}
                    </Typography>
                )}

                <form
                    id="form-criar-comunidade"
                    onSubmit={novaComunidade}
                >
                    <div className="yrplace-criar-imagem">
                        <Typography className="yrplace-criar-label">
                            Imagem da comunidade
                        </Typography>

                        <Button
                            component="label"
                            variant="outlined"
                            className="yrplace-upload-botao"
                        >
                            Escolher imagem
                            <input
                                type="file"
                                accept="image/*"
                                hidden
                                onChange={(e) =>
                                    setImagem_url(e.target.files[0] || null)
                                }
                            />
                        </Button>

                        <Typography className="yrplace-upload-nome">
                            {imagem_url
                                ? imagem_url.name
                                : "Nenhum arquivo selecionado"}
                        </Typography>
                    </div>

                    <TextField
                        margin="normal"
                        fullWidth
                        required
                        label="Nome da comunidade"
                        placeholder="Ex.: Fãs de Arctic Monkeys"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                    />

                    <TextField
                        margin="normal"
                        fullWidth
                        required
                        label="Gênero musical"
                        placeholder="Ex.: Indie Rock"
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
                        placeholder="Conte um pouco sobre essa comunidade..."
                        value={descricao}
                        onChange={(e) => setDescricao(e.target.value)}
                    />
                </form>
            </DialogContent>

            <DialogActions className="yrplace-criar-acoes">
                <Button
                    onClick={fecharModal}
                    disabled={carregando}
                    className="yrplace-criar-cancelar"
                >
                    Cancelar
                </Button>

                <Button
                    type="submit"
                    form="form-criar-comunidade"
                    variant="contained"
                    disabled={carregando}
                    className="yrplace-criar-confirmar"
                >
                    {carregando ? "Criando..." : "Criar comunidade"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default CriarComunidadeModal;
