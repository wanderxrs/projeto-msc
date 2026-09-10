import { useState } from "react";
import { confirmacao } from "../../api";
import { useNavigate } from "react-router-dom";

function Recuperacao() {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");

    async function handleEnviarCodigo(event) {
        event.preventDefault();

        try {
            const resposta = await confirmacao(email);

            console.log(resposta.data);

            navigate("/confirma-codigo");

        } catch (e) {
            console.log(e.response?.data || e.message);
        }
    }

    return (
        <div>
            <h1>MusicFy</h1>

            <form onSubmit={handleEnviarCodigo}>

                <input
                    type="email"
                    placeholder="E-mail"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                />

                <button type="submit">
                    Confirmar
                </button>

            </form>
        </div>
    );
}

export default Recuperacao;