import { useState } from "react";
import { fazerRegistro } from "../../api";
import { useNavigate, Link } from "react-router-dom";
import "./login.css";

function Registro() {
    const navigate = useNavigate();

    const [mensagem, setMensagem] = useState("");
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");

    const onSignUp = async (e) => {
        e.preventDefault();

        const data = {
            nome,
            email,
            senha
        };

        try {
            const result = await fazerRegistro(data);

            setMensagem(result.data.mensagem);
            navigate("/login");

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
                    <h2>Crie sua conta</h2>

                </div>

                {mensagem && (
                    <div className="login-mensagem">
                        {mensagem}
                    </div>
                )}

                <form
                    id="submit-registro"
                    onSubmit={onSignUp}
                    className="login-form"
                >
                    <label htmlFor="nome">Nome</label>
                    <input
                        id="nome"
                        type="text"
                        placeholder="Como podemos te chamar?"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        autoComplete="name"
                        required
                    />

                    <label htmlFor="email">E-mail</label>
                    <input
                        id="email"
                        type="email"
                        placeholder="Digite seu e-mail"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        autoComplete="email"
                        required
                    />

                    <label htmlFor="senha">Senha</label>
                    <input
                        id="senha"
                        type="password"
                        placeholder="Crie uma senha"
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                        autoComplete="new-password"
                        required
                    />

                    <button
                        type="submit"
                        className="login-botao-principal"
                    >
                        Criar conta
                    </button>
                </form>

                <div className="login-rodape">
                    <p>Já tem uma conta?</p>

                    <Link
                        to="/login"
                        className="login-link-registro"
                    >
                        Entrar
                    </Link>
                </div>

            </div>
        </div>
    );
}

export default Registro;
