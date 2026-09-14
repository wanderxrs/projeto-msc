import { useState, useEffect } from "react";
import { atualizarComunidade } from "../../api";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, TextField } from '@mui/material';

function AtualizarComunidadeModal({ isOpen, onClose, comunidade_id, comunidade }) {
    const [mensagem, setMensagem] = useState("")
    const [nome, setNome] = useState("")
    const [genero, setGenero] = useState("")
    const [descricao, setDescricao] = useState("")
    const [imagem_url, setImagem_url] = useState("")
    const [imagem, setImagem] = useState(null)

    useEffect(() => {
        if (comunidade) {

            setNome(comunidade.nome)
            setGenero(comunidade.genero)
            setDescricao(comunidade.descricao)
            setImagem_url(comunidade.imagem_url)
            setImagem(null)

        }
    }, [comunidade])

    const alterarComunidade = async (e) => {
        e.preventDefault()

        const dadosComunidade = new FormData()

        dadosComunidade.append("nome", nome)
        dadosComunidade.append("genero", genero)
        dadosComunidade.append("descricao", descricao)
        dadosComunidade.append("imagem_url", imagem_url)

        if (imagem) {
            dadosComunidade.append("imagem", imagem)
        }

        try {
            const resultado = await atualizarComunidade(comunidade_id, dadosComunidade)
            setMensagem(resultado.data.mensagem)

            onClose()
            
        }  catch (e) {
            const erro = e.response?.data?.erro || "Não foi possível conectar à API"
            setMensagem(erro)
        }
    }

    return (
        <>
        <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="xs">
            <DialogTitle>Atualizar Comunidade</DialogTitle>

            <DialogContent>
                {mensagem && (<Typography>{mensagem}</Typography>)}

                <form id="submit" onSubmit={alterarComunidade}>

                    <TextField margin="normal" fullWidth label="Imagem" type="file" onChange={(e) => setImagem(e.target.files[0])}/>
                    <TextField margin="normal" fullWidth label="Nome" type="text" value={nome} onChange={(e) => setNome(e.target.value)}/>
                    <TextField margin="normal" fullWidth label="Gênero" type="text" value={genero} onChange={(e) => setGenero(e.target.value)}/>
                    <TextField margin="normal" fullWidth label="Descrição" type="text" value={descricao} onChange={(e) => setDescricao(e.target.value)}/>

                </form>

            </DialogContent>

            <DialogActions>

                <Button onClick={onClose}>Cancelar</Button>
                <Button type="submit" form="submit" variant="contained">Atualizar</Button>

            </DialogActions>

        </Dialog>

        </>
    )

}

export default AtualizarComunidadeModal