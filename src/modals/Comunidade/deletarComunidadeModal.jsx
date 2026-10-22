
import { useState } from "react";
import { deletarComunidade } from "../../api";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography
} from "@mui/material";
import "./deletarComunidadeModal.css";

function DeletarComunidadeModal({
    isOpen,
    onClose,
    comunidade_id
}) {
    const [mensagem, setMensagem] = useState("");
    const [carregando, setCarregando] = useState(false);

    const apagarComunidade = async () => {
        try {
            setCarregando(true);
            setMensagem("");

            const resposta = await deletarComunidade(comunidade_id);

            setMensagem(
                resposta.data.mensagem || "Comunidade deletada com sucesso!"
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

    return (
        <Dialog
            open={isOpen}
            onClose={carregando ? undefined : onClose}
            fullWidth
            maxWidth="xs"
            className="yrplace-deletar-dialog"
        >
            <DialogTitle className="yrplace-deletar-titulo">
                Deletar comunidade
            </DialogTitle>

            <DialogContent className="yrplace-deletar-conteudo">
                <Typography className="yrplace-deletar-aviso">
                    Tem certeza de que deseja excluir esta comunidade?
                </Typography>

                <Typography className="yrplace-deletar-descricao">
                    Essa ação pode remover as publicações e os dados
                    associados à comunidade. Verifique antes de continuar.
                </Typography>

                {mensagem && (
                    <Typography className="yrplace-deletar-erro">
                        {mensagem}
                    </Typography>
                )}
            </DialogContent>

            <DialogActions className="yrplace-deletar-acoes">
                <Button
                    onClick={onClose}
                    disabled={carregando}
                    className="yrplace-deletar-cancelar"
                >
                    Cancelar
                </Button>

                <Button
                    onClick={apagarComunidade}
                    disabled={carregando}
                    variant="contained"
                    className="yrplace-deletar-confirmar"
                >
                    {carregando ? "Deletando..." : "Deletar comunidade"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default DeletarComunidadeModal;
