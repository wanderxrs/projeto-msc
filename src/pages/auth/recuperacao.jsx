import { useState } from "react";
import { confirmacao } from "../../api";
import { useNavigate, useLocation } from "react-router-dom";
import "./login.css";

function Recuperacao() {
    const navigate = useNavigate();
    const location = useLocation();
    const veioDoPerfil = location.state?.veioDoPerfil;

    const [email, setEmail] = useState("");
    const [mensagem, setMensagem] = useState("");
    const [carregando, setCarregando] = useState(false);

    async function handleEnviarCodigo(event) {
        event.preventDefault();
        setMensagem("");
        setCarregando(true);

        try {
            await confirmacao(email);
            navigate("/confirma-codigo");
        } catch (e) {
            const erro =
                e.response?.data?.erro ||
                e.response?.data?.mensagem ||
                "Não foi possível enviar o código. Tente novamente.";

            setMensagem(erro);
        } finally {
            setCarregando(false);
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
                    <h2>Recuperar senha</h2>
                    <p>
                        Esqueceu sua senha? Informe seu e-mail
                        para receber o código de recuperação.
                    </p>
                </div>

                {mensagem && (
                    <div className="login-mensagem">
                        {mensagem}
                    </div>
                )}

                <form
                    className="login-form"
                    onSubmit={handleEnviarCodigo}
                >
                    <label htmlFor="email-recuperacao">
                        E-mail
                    </label>

                    <input
                        id="email-recuperacao"
                        type="email"
                        placeholder="Digite o e-mail da sua conta"
                        value={email}
                        onChange={(event) =>
                            setEmail(event.target.value)
                        }
                        autoComplete="email"
                        required
                    />

                    <button
                        type="submit"
                        className="login-botao-principal"
                        disabled={carregando}
                    >
                        {carregando
                            ? "Enviando código..."
                            : "Enviar código"}
                    </button>

                    <button
                        type="button"
                        className="recuperacao-botao-voltar"
                        onClick={() =>
                            navigate(
                                veioDoPerfil ? "/home" : "/login"
                            )
                        }
                    >
                        Voltar
                    </button>
                </form>

            </div>
        </div>
    );
}

export default Recuperacao;