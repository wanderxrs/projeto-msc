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

            // VERIFICA SE A CONFIRMAÇÃO VEIO DA EXCLUSÃO

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

            // COMPORTAMENTO ORIGINAL: TROCAR SENHA

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

        <div className="container">

            <h1>Yrplace</h1>

            <form onSubmit={handleConfirmar}>

                <p>Digite sua senha atual para continuar.</p>

                <input
                    type="password"
                    placeholder="Senha atual"
                    value={senha}
                    onChange={(event) => setSenha(event.target.value)}
                    required
                />

                {erro && <p>{erro}</p>}

                <button
                    type="submit"
                    disabled={carregando}
                >
                    {carregando ? "Confirmando..." : "Confirmar"}
                </button>

                <button
                    type="button"
                    onClick={() => navigate("/home")}
                    disabled={carregando}
                >
                    Voltar
                </button>

                <a
                    onClick={() => navigate("/Recuperacao", {
                        state: { veioDoPerfil: true }
                    })}
                >
                    Esqueci minha senha
                </a>

            </form>

        </div>
    );
}

export default ConfirmarSenha;