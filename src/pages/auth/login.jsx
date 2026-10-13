
import { useState } from "react";
import { fazerLogin } from "../../api";
import { useNavigate, Link } from "react-router-dom";
import "./login.css";

function Login() {
    const navigate = useNavigate();

    const [mensagem, setMensagem] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");

    const onSignIn = async (e) => {
        e.preventDefault();

        const data = {
            email,
            senha
        };

        try {
            const result = await fazerLogin(data);
            setMensagem(result.data.mensagem);
            navigate("/home");
        } catch (e) {
            const erro =
                e.response?.data?.erro ||
                "Não foi possível conectar à API";

            setMensagem(erro);
        }
    };

    return (
        <div className="tela-login">
            <div className="login-card">

                <div className="login-cabecalho">
                    <h1>YrPlace</h1>
                </div>

                <div className="login-titulo">
                    <h2>Bem-vindo!</h2>
                </div>

                {mensagem && (
                    <div className="login-mensagem">
                        {mensagem}
                    </div>
                )}

                <form
                    id="submit-login"
                    onSubmit={onSignIn}
                    className="login-form"
                >
                    <label htmlFor="email">E-mail</label>
                    <input
                        id="email"
                        type="email"
                        placeholder="Digite seu e-mail"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <label htmlFor="senha">Senha</label>
                    <input
                        id="senha"
                        type="password"
                        placeholder="Digite sua senha"
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                        required
                    />

                    <div className="login-recuperacao">
                        <Link to="/Recuperacao">
                            Esqueci minha senha
                        </Link>
                    </div>

                    <button type="submit" className="login-botao-principal">
                        Entrar
                    </button>
                </form>

                <div className="login-rodape">
                    <p>Ainda não tem uma conta?</p>
                    <Link to="/registro" className="login-link-registro">
                        Criar conta
                    </Link>
                </div>

            </div>
        </div>
    );
}

export default Login;
