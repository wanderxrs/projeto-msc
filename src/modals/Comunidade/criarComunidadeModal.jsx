import { useState } from "react";
import { criarComunidade } from "../../api";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, TextField } from '@mui/material';

function CriarComunidadeModal({ isOpen, onClose }) {
    const [mensagem, setMensagem] = useState("")
    const [nome, setNome] = useState("")
    const [genero, setGenero] = useState("")
    const [descricao, setDescricao] = useState("")
    const [imagem_url, setImagem_url] = useState(null)

    const novaComunidade = async (e) => {
        e.preventDefault()

        const dadosComunidade = new FormData()

        dadosComunidade.append("nome", nome)
        dadosComunidade.append("genero", genero)
        dadosComunidade.append("descricao", descricao)

        if (imagem_url) {
            dadosComunidade.append("imagem_url", imagem_url)
        }

        try {
            const resultado = await criarComunidade(dadosComunidade)
            setMensagem(resultado.data.mensagem)

            setNome('')
            setGenero('')
            setDescricao('')
            setImagem_url(null)

            onClose()
            
        }  catch (e) {
            const erro = e.response?.data?.erro || "Não foi possível conectar à API"
            setMensagem(erro)
        }
    }

    return (
        <>
        <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="xs">
            <DialogTitle>Criar Comunidade</DialogTitle>

            <DialogContent>
                {mensagem && (<Typography>{mensagem}</Typography>)}

                <form id="submit" onSubmit={novaComunidade}>

                    <TextField margin="normal" fullWidth label="Imagem" type="file" onChange={(e) => setImagem_url(e.target.files[0])}/>
                    <TextField margin="normal" fullWidth label="Nome" type="text" value={nome} onChange={(e) => setNome(e.target.value)}/>
                    <TextField margin="normal" fullWidth label="Gênero" type="text" value={genero} onChange={(e) => setGenero(e.target.value)}/>
                    <TextField margin="normal" fullWidth label="Descrição" type="text" value={descricao} onChange={(e) => setDescricao(e.target.value)}/>

                </form>

            </DialogContent>

            <DialogActions>

                <Button onClick={onClose}>Cancelar</Button>
                <Button type="submit" form="submit" variant="contained">Criar</Button>

            </DialogActions>

        </Dialog>

        </>
    )

}

export default CriarComunidadeModal