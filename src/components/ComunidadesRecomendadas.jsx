import { useEffect, useState } from "react";
import { buscarComunidadesDisponiveis } from "../api";
import "./ComunidadesRecomendadas.css";

function ComunidadesRecomendadas() {
    const [comunidades, setComunidades] = useState([]);

    useEffect(() => {
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

        carregarComunidades();
    }, []);

    return (
        <aside className="comunidades-recomendadas">
            <h2>Comunidades recomendadas</h2>

            <div className="lista-comunidades">
                {comunidades.length === 0 ? (
                    <p>Nenhuma comunidade disponível.</p>
                ) : (
                    comunidades.map((comunidade) => (
                        <div
                            className="item-comunidade"
                            key={comunidade.id}
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