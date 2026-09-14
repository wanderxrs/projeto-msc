import { useState } from "react"
import { Button } from "@mui/material"

import CriarComunidadeModal from "../modals/Comunidade/criarComunidadeModal"
import AtualizarComunidadeModal from "../modals/Comunidade/atualizarComunidadeModal"
import DeletarComunidadeModal from "../modals/Comunidade/deletarComunidadeModal"

function Home() {

    const [abrirCriar, setAbrirCriar] = useState(false)
    const [abrirAtualizar, setAbrirAtualizar] = useState(false)
    const [abrirApagar, setAbrirApagar] = useState(false)

    return (
        <>
            <h1>Teste dos modais</h1>

            <Button
                variant="contained"
                onClick={() => setAbrirCriar(true)}
            >
                Criar comunidade
            </Button>

            <Button
                variant="contained"
                onClick={() => setAbrirAtualizar(true)}
            >
                Atualizar comunidade
            </Button>

            <Button
                variant="contained"
                onClick={() => setAbrirApagar(true)}
            >
                Apagar comunidade
            </Button>


            <CriarComunidadeModal
                isOpen={abrirCriar}
                onClose={() => setAbrirCriar(false)}
            />

            <AtualizarComunidadeModal
                isOpen={abrirAtualizar}
                onClose={() => setAbrirAtualizar(false)}
            />

            <DeletarComunidadeModal
                isOpen={abrirApagar}
                onClose={() => setAbrirApagar(false)}
            />
        </>
    )
}

export default Home