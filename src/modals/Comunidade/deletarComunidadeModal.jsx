import { useState } from "react";
import { deletarComunidade } from "../../api";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';

function DeletarComunidadeModal({ isOpen, onClose, comunidade_id }) {
    const [mensagem, setMensagem] = useState("")

    const apagarComunidade = async () => {

        try {
            const resposta = await deletarComunidade(comunidade_id)
            setMensagem(resposta.data.mensagem)

            onClose()

        } catch (e) {
            const erro = e.response?.data?.erro || "Não foi possível conectar à API"
            setMensagem(erro)
        }
    }

    return(
        <>
        
        <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth='xs'>
            <DialogTitle>Deletar comunidade</DialogTitle>
            <DialogContent>
                {mensagem && (<Typography>{mensagem}</Typography>)}
            </DialogContent>
            <DialogActions>
                    <Button onClick={onClose}>Cancelar</Button>
                    <Button onClick={apagarComunidade} color="error" variant="contained">Deletar</Button>
            </DialogActions>
        </Dialog>

        </>
    )
}

export default DeletarComunidadeModal