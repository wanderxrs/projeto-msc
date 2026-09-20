import { useState } from "react";
import { trocarSenhaPerfil } from "../../api";
import { useNavigate } from "react-router-dom";

function MudarSenhaPerfil() {

    const navigate = useNavigate();

    const [novasenha, setNovasenha] = useState("");
    const [mensagem, setMensagem] = useState("");

    async function handleTrocarSenhaPerfil(event) {
        event.preventDefault();

        try {

            const resposta = await trocarSenhaPerfil(novasenha);

            setMensagem(resposta.data);

            navigate("/login");

        } catch (e) {

            const error =
                e.response?.data ||
                "Não foi possível alterar a senha";

            setMensagem(error);
        }
    }

    return (
        <div className="mudar-senha">

            <div className="container">

                <h1>YrPlace</h1>

                <h2>Crie uma nova senha</h2>

                {mensagem && (
                    <p>{mensagem}</p>
                )}

                <form onSubmit={handleTrocarSenhaPerfil}>

                    <input
                        type="password"
                        placeholder="Nova senha"
                        value={novasenha}
                        onChange={(event) => setNovasenha(event.target.value)}
                    />

                    <button type="submit">
                        Confirmar
                    </button>

                </form>

            </div>

        </div>
    );
}

export default MudarSenhaPerfil;