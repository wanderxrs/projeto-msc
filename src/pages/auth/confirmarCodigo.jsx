import { useState } from "react";
import { confirmarCodigo } from "../../api";
import { useNavigate } from "react-router-dom";
import "./login.css";

function ConfirmarCodigo() {

    const navigate = useNavigate();

    const [codigo, setCodigo] = useState("");
    const [mensagem, setMensagem] = useState("");

    async function handleConfirmarCodigo(event) {
        event.preventDefault();

        try {

            const resposta = await confirmarCodigo(codigo);

            console.log(resposta.data);

            navigate("/mudar-senha");

        } catch (e) {

            const error =
                e.response?.data?.error ||
                "Código não compatível";

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
                    <h2>Digite o código</h2>
                    <p>
                        Enviamos um código para seu e-mail.
                        Digite-o abaixo para continuar.
                    </p>
                </div>

                {mensagem && (
                    <div className="login-mensagem">
                        {mensagem}
                    </div>
                )}

                <form
                    className="login-form"
                    onSubmit={handleConfirmarCodigo}
                >

                    <label htmlFor="codigo">
                        Código de confirmação
                    </label>

                    <input
                        id="codigo"
                        type="text"
                        placeholder="Digite o código"
                        value={codigo}
                        onChange={(event) => setCodigo(event.target.value)}
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

export default ConfirmarCodigo;