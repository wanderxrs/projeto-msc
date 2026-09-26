import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { buscarComunidadesDisponiveis } from "../api";
import { buscarComunidadesPeloNome } from "../api";
import "./ComunidadesRecomendadas.css";

function ComunidadesRecomendadas() {

    const navigate = useNavigate();
    const [comunidades, setComunidades] = useState([]);
    const [nomeBusca, setNomeBusca] = useState("");

    async function carregarComunidades() {
        try {
            const resposta = await buscarComunidadesDisponiveis();

            console.log("Dados recebidos:", resposta.data);

            setComunidades(
                Array.isArray(resposta.data)
                    ? resposta.data
                    : resposta.data.comunidades || []
            );
        } catch (erro) {
            console.error("Erro ao carregar comunidades:", erro);
        }
    }

    useEffect(() => {
        carregarComunidades();
    }, []);

    async function pesquisarComunidades() {

        if (nomeBusca.trim() === "") {
            carregarComunidades();
            return;
        }

        try {
            const resposta = await buscarComunidadesPeloNome(nomeBusca);

            console.log("Resultados da pesquisa:", resposta.data);

            setComunidades(
                Array.isArray(resposta.data)
                    ? resposta.data
                    : resposta.data.comunidades || []
            );
        } catch (erro) {
            console.error("Erro ao pesquisar comunidades:", erro);
        }
    }

    return (
        <aside className="comunidades-recomendadas">

            <input
                type="text"
                placeholder="Pesquisar comunidade..." value={nomeBusca} name="pesquisa-comunidade"
                onChange={(e) => setNomeBusca(e.target.value)} onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        pesquisarComunidades();
                    }
                }}
            />

            <h2>{nomeBusca ? "Resultados da pesquisa" : "Comunidades recomendadas"}</h2>

            <div className="lista-comunidades">
                {comunidades.length === 0 ? (
                    <p>Nenhuma comunidade disponível.</p>
                ) : (
                    comunidades.map((comunidade) => (
                        <div
                            className="item-comunidade"
                            key={comunidade.id}
                            onClick={() => navigate(`/comunidade/${comunidade.id}`)}
                        >
                            {comunidade.nome}
                        </div>
                    ))
                )}
            </div>
        </aside>
    );
}

export default ComunidadesRecomendadas;