import { useState } from "react";
import { confirmacao } from "../../api";
import { useNavigate } from "react-router-dom";
import "./recuperacao.css";


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
        <div className="container">
            <h1>Yrplace</h1>

            <form onSubmit={handleEnviarCodigo}>

                <p>Para recuperar sua senha, digite seu E-mail no campo abaixo</p>
                <input
                    type="email"
                    placeholder="E-mail"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                />
                <br />
                <button type="submit">
                    Confirmar
                </button>

            </form>
        </div>
    );
}

export default Recuperacao;