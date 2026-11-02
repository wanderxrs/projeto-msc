
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./ConfirmarSenha.css";

import { confirmarSenha } from "../../api";

function ConfirmarSenha() {
    const navigate = useNavigate();
    const location = useLocation();

    const [senha, setSenha] = useState("");
    const [erro, setErro] = useState("");
    const [carregando, setCarregando] = useState(false);

    const estado = location.state;

    async function handleConfirmar(event) {
        event.preventDefault();

        setErro("");
        setCarregando(true);

        try {
            await confirmarSenha(senha);

            // Verifica se a confirmação veio da exclusão de comunidade
            if (estado?.acao === "excluir-comunidade") {
                navigate(estado.returnTo, {
                    replace: true,
                    state: {
                        abrirModalExclusao: true,
                        comunidadeId: estado.comunidadeId
                    }
                });

                return;
            }

            // Comportamento original: trocar senha do perfil
            navigate("/mudar-senha-perfil");

        } catch (error) {
            if (error.response?.status === 401) {
                setErro("Senha incorreta.");
            } else {
                setErro("Não foi possível confirmar a senha.");
            }
        } finally {
            setCarregando(false);
        }
    }

    return (
        <div className="confirmar-senha">
            <div className="container">
                <h1>Yrplace</h1>

                <p className="descricao">
                    Digite sua senha atual para continuar.
                </p>

                <form onSubmit={handleConfirmar}>
                    <div className="form-group">
                        <label htmlFor="senha">
                            Senha atual
                        </label>

                        <input
                            id="senha"
                            type="password"
                            placeholder="Senha atual"
                            value={senha}
                            onChange={(event) => setSenha(event.target.value)}
                            required
                            disabled={carregando}
                        />
                    </div>

                    {erro && (
                        <p className="mensagem-erro">
                            {erro}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={carregando}
                    >
                        {carregando ? "Confirmando..." : "Confirmar"}
                    </button>

                    <button
                        type="button"
                        className="botao-voltar"
                        onClick={() => navigate("/home")}
                        disabled={carregando}
                    >
                        Voltar
                    </button>

                    <p className="texto-recuperacao">
                        Esqueceu sua senha?{" "}
                        <a
                            href="/Recuperacao"
                            onClick={(event) => {
                                event.preventDefault();

                                navigate("/Recuperacao", {
                                    state: {
                                        veioDoPerfil: true
                                    }
                                });
                            }}
                        >
                            Recuperar senha
                        </a>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default ConfirmarSenha;
