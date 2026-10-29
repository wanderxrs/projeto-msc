
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { buscarComunidade, entrarComunidade, sairComunidade } from "../../api";
import "./informacoesComunidade.css";
import { HiUsers } from "react-icons/hi";
import "./InformacoesComunidade.css";

function InformacoesComunidade({ comunidade: dadosRecebidos, onMembrosAtualizados }) {

    const { id } = useParams();

    const [comunidade, setComunidade] = useState(null);
    const [mensagem, setMensagem] = useState("");
    const [participando, setParticipando] = useState(false);

    // Busca as informações da comunidade
    async function carregarComunidade() {
        try {
            const resposta = await buscarComunidade(id);

            setComunidade(resposta.data);
            setParticipando(resposta.data.participando);

        } catch (erro) {
            console.error("Erro ao carregar comunidade:", erro);
        }
    }

    useEffect(() => {
        setComunidade(null);
        setMensagem("");
        carregarComunidade();
    }, [id]);

    // Atualiza os dados recebidos da tela principal
    useEffect(() => {
        if (dadosRecebidos && Number(dadosRecebidos.id) === Number(id)) {
            setComunidade(dadosRecebidos);
            setParticipando(dadosRecebidos.participando);
        }
    }, [dadosRecebidos, id]);

    // Entrar na comunidade
    const handleEntrar = async () => {
        setMensagem("");

        try {
            const resposta = await entrarComunidade(id);

            setParticipando(true);
            setMensagem(resposta.data.mensagem);

            await carregarComunidade();

            if (onMembrosAtualizados) {
                await onMembrosAtualizados();
            }

        } catch (erro) {
            setMensagem(
                erro.response?.data?.erro ||
                "Erro ao entrar na comunidade"
            );
        }
    };

    // Sair da comunidade
    const handleSair = async () => {
        setMensagem("");

        try {
            const resposta = await sairComunidade(id);

            setParticipando(false);
            setMensagem(resposta.data.mensagem);

            await carregarComunidade();

            if (onMembrosAtualizados) {
                await onMembrosAtualizados();
            }

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

    const totalMembros = Number(comunidade.total_membros) || 0;

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

                {/* QUANTIDADE DE MEMBROS ABAIXO DO GÊNERO */}
                <div className="comunidade-total-membros">
                    <HiUsers size={16} />

                    <span>
                        {totalMembros}{" "}
                        {totalMembros === 1
                            ? "membro"
                            : "membros"}
                    </span>
                </div>

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
