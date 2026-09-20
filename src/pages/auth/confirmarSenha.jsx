import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { trocarSenhaPerfil } from "../../api";

function ConfirmarSenha() {

    const navigate = useNavigate();

    const [senha, setSenha] = useState("");
    const [erro, setErro] = useState("");

    async function handleConfirmar(event) {

        event.preventDefault();

        setErro("");

        try {

            await trocarSenhaPerfil(senha);

            navigate("/mudar-senha");

        } catch (error) {

            if (error.response?.status === 401) {
                setErro("Senha incorreta");
            } else {
                setErro("Não foi possível confirmar a senha");
            }

        }
    }

    return (
        <div className="container">

            <h1>Yrplace</h1>

            <form onSubmit={handleConfirmar}>

                <p>Digite sua senha atual para continuar</p>

                <input
                    type="password"
                    placeholder="Senha atual"
                    value={senha}
                    onChange={(event) => setSenha(event.target.value)}
                />

                {erro && <p>{erro}</p>}

                <button type="submit">
                    Confirmar
                </button>

                <button type="button" onClick={() => navigate("/home")}>
                    Voltar
                </button>

                <a onClick={() => navigate("/Recuperacao", {
                    state: { veioDoPerfil: true }})}>
                    Esqueci minha senha
                </a>

            </form>

        </div>
    );
}

export default ConfirmarSenha;