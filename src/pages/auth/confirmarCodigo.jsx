import { useState } from "react";
import { confirmarCodigo } from "../../api";
import { useNavigate } from "react-router-dom";

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
        <div className="confirmar-codigo">

            <div className="caixa-confirmar-codigo">

                <h1>MusicFy</h1>

                <h2>
                    Digite o código
                </h2>

                <p>
                    Enviamos um código para seu e-mail.
                </p>

                {mensagem && (
                    <p>{mensagem}</p>
                )}

                <form onSubmit={handleConfirmarCodigo}>

                    <input
                        type="text"
                        placeholder="Código"
                        value={codigo}
                        onChange={(event) => setCodigo(event.target.value)}
                    />

                    <button type="submit">
                        Confirmar
                    </button>

                </form>

            </div>

        </div>
    );
}

export default ConfirmarCodigo;