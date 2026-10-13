import { useState } from "react";
import { trocarSenhaPerfil } from "../../api";
import { useNavigate } from "react-router-dom";
import "./login.css";

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
        <div className="tela-login">

            <div className="login-card">

                <div className="login-cabecalho">
                    <h1>YrPlace</h1>
                    <p>Seu lugar para compartilhar música.</p>
                </div>

                <div className="login-titulo">
                    <h2>Crie uma nova senha</h2>
                    <p>
                        Digite sua nova senha para continuar.
                    </p>
                </div>

                {mensagem && (
                    <div className="login-mensagem">
                        {mensagem}
                    </div>
                )}

                <form
                    className="login-form"
                    onSubmit={handleTrocarSenhaPerfil}
                >

                    <label htmlFor="novasenha">
                        Nova senha
                    </label>

                    <input
                        id="novasenha"
                        type="password"
                        placeholder="Nova senha"
                        value={novasenha}
                        onChange={(event) => setNovasenha(event.target.value)}
                    />

                    <button
                        type="submit"
                        className="login-botao-principal"
                    >
                        Confirmar
                    </button>

                </form>

            </div>

        </div>
    );
}

export default MudarSenhaPerfil;