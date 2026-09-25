import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { buscarComunidade, entrarComunidade, sairComunidade } from "../../api";
import "./InformacoesComunidade.css";

function InformacoesComunidade() {

    const { id } = useParams();
    const [comunidade, setComunidade] = useState(null);
    const [mensagem, setMensagem] = useState("");

    useEffect(() => {
        async function carregarComunidade() {
            try {
                const resposta = await buscarComunidade(id);

                console.log("Dados recebidos:", resposta.data);
                setComunidade(resposta.data);

            } catch (erro) {
                console.error("Erro ao carregar comunidade:", erro);
            }
        }

        carregarComunidade();
    }, [id]);


    const handleEntrar = async () => {
        try {
            const resposta = await entrarComunidade(id);
            setMensagem(resposta.data.mensagem);
        } catch (erro) {
            setMensagem(erro.response?.data?.erro || "Erro ao entrar na comunidade");
        }
    };

    const handleSair = async () => {
        try {
            const resposta = await sairComunidade(id);
            setMensagem(resposta.data.mensagem);
        } catch (erro) {
            setMensagem(erro.response?.data?.erro || "Erro ao sair na comunidade");
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

                <button onClick={handleEntrar}>
                    Entrar na comunidade
                </button>

                <button onClick={handleSair}>
                    Sair da comunidade
                </button>

                {mensagem && <p>{mensagem}</p>}

            </div>

        </div>
    );
}

export default InformacoesComunidade;