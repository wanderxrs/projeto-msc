
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { confirmarSenha } from "../api";
import "./ConfirmarSenha.css";

function ConfirmarSenha() {
    const navigate = useNavigate();
    const location = useLocation();

    const estado = location.state;

    const [senha, setSenha] = useState("");
    const [erro, setErro] = useState("");
    const [carregando, setCarregando] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setErro("");
        setCarregando(true);

        try {
            await confirmarSenha(senha);

            // Fluxo para excluir uma comunidade
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

            // Fluxo normal para alterar a senha do perfil
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
    };

    const irParaRecuperacao = () => {
        navigate("/Recuperacao", {
            state: {
                veioDoPerfil: true
            }
        });
    };

    return (
        <div className="confirmar-senha">
            <div className="container">
                <h2>Confirmar senha</h2>

                <p>
                    Para continuar, confirme sua senha atual.
                </p>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="senha">
                            Senha atual
                        </label>

                        <input
                            type="password"
                            id="senha"
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
                            placeholder="Digite sua senha atual"
                            required
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
                        {carregando
                            ? "Verificando..."
                            : "Confirmar"}
                    </button>
                </form>

                <button
                    type="button"
                    className="botao-recuperacao"
                    onClick={irParaRecuperacao}
                >
                    Esqueci minha senha
                </button>

                <button
                    type="button"
                    className="botao-voltar"
                    onClick={() => navigate(-1)}
                >
                    Voltar
                </button>
            </div>
        </div>
    );
}

export default ConfirmarSenha;
