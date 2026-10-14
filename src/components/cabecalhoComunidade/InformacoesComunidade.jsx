import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { buscarComunidade, entrarComunidade, sairComunidade } from "../../api";
import "./informacoesComunidade.css";

function InformacoesComunidade() {

    const { id } = useParams();
    const [comunidade, setComunidade] = useState(null);
    const [mensagem, setMensagem] = useState("");
    const [participando, setParticipando] = useState(false);

    useEffect(() => {
        async function carregarComunidade() {
            try {

                const resposta = await buscarComunidade(id);

                setComunidade(resposta.data);
                setParticipando(resposta.data.participando);

            } catch (erro) {
                console.error("Erro ao carregar comunidade:", erro);
            }
        }

        carregarComunidade();
    }, [id]);


    const handleEntrar = async () => {
        setMensagem("");

        try {
            const resposta = await entrarComunidade(id);

            setParticipando(true);
            setMensagem(resposta.data.mensagem);

        } catch (erro) {
            setMensagem(
                erro.response?.data?.erro ||
                "Erro ao entrar na comunidade"
            );
        }
    };

    const handleSair = async () => {
        setMensagem("");

        try {
            const resposta = await sairComunidade(id);

            setParticipando(false);
            setMensagem(resposta.data.mensagem);

        } catch (erro) {
            setMensagem(
                erro.response?.data?.erro ||
                "Erro ao sair da comunidade"
            );
        }
    };


    if (!comunidade) {
        return <p>Carregando...</p>;
    }

    return (
        <div className="informacoes-comunidade">

            <img
                src={comunidade.imagem_url}
                alt={`Imagem da comunidade ${comunidade.nome}`}
                className="imagem-comunidade"
            />

            <div className="dados-comunidade">

                <h1>{comunidade.nome}</h1>

                <p className="genero">{comunidade.genero}</p>

                <p>{comunidade.descricao}</p>

            </div>

            <div className="botoes-comunidade">

                {participando ? (
                    <button onClick={handleSair}>
                        Sair da comunidade
                    </button>
                ) : (
                    <button onClick={handleEntrar}>
                        Entrar na comunidade
                    </button>
                )}

                {mensagem && <p>{mensagem}</p>}

            </div>

        </div>
    );
}

export default InformacoesComunidade;