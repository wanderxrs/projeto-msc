import { useState } from "react";
import { mudarSenha } from "../../api";
import { useNavigate } from "react-router-dom";

function MudarSenha() {

    const navigate = useNavigate();

    const [novasenha, setNovasenha] = useState("");
    const [mensagem, setMensagem] = useState("");

    async function handleMudarSenha(event) {
        event.preventDefault();

        try {

            const resposta = await mudarSenha(novasenha);

            setMensagem(resposta.data.message);

            navigate("/login");

        } catch (e) {

            const error =
                e.response?.data?.error ||
                "Não foi possível alterar a senha";

            setMensagem(error);
        }
    }

    return (
        <div className="mudar-senha">

            <div className="caixa-mudar-senha">

                <h1>MusicFy.</h1>

                <h2>Crie uma nova senha</h2>

                {mensagem && (
                    <p>{mensagem}</p>
                )}

                <form onSubmit={handleMudarSenha}>

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

export default MudarSenha;