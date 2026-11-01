
import { useEffect, useState } from "react";
import { listarLetrasPublicas } from "../../api";
import "./LetrasPublicas.css";

function LetrasPublicas() {
    const [letras, setLetras] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("");
    const [letraSelecionada, setLetraSelecionada] = useState(null);

    useEffect(() => {
        async function carregarLetras() {
            try {
                const resposta = await listarLetrasPublicas();
                setLetras(resposta.data);
            } catch (error) {
                setErro(
                    error.response?.data?.erro ||
                    "Não foi possível carregar as letras públicas."
                );
            } finally {
                setCarregando(false);
            }
        }

        carregarLetras();
    }, []);

    if (carregando) {
        return (
            <main className="letras-publicas">
                <p>Carregando letras...</p>
            </main>
        );
    }

    return (
        <main className="letras-publicas">
            <h1>Letras de músicas</h1>

            <p className="descricao-letras">
                Explore as composições compartilhadas pela comunidade.
            </p>

            {erro && <p className="erro-letras">{erro}</p>}

            {!erro && letras.length === 0 && (
                <p className="vazio-letras">
                    Ainda não há letras disponíveis.
                </p>
            )}

            <div className="lista-letras-publicas">
                {letras.map((letra) => (
                    <article
                        className="card-letra-publica"
                        key={letra.id}
                    >
                        <div className="autor-letra-publica">
                            {letra.autor_foto_url ? (
                                <img
                                    src={letra.autor_foto_url}
                                    alt={`Foto de ${letra.autor_nome}`}
                                    className="foto-autor-letra"
                                />
                            ) : (
                                <div className="foto-autor-letra foto-autor-fallback">
                                    {letra.autor_nome?.charAt(0)?.toUpperCase() || "?"}
                                </div>
                            )}

                            <div className="dados-autor-letra">
                                <span className="nome-autor-letra">
                                    {letra.autor_nome || "Usuário"}
                                </span>

                                <span className="legenda-autor-letra">
                                    Publicou uma composição
                                </span>
                            </div>
                        </div>

                        <h2>{letra.titulo}</h2>

                        <p className="estilo-letra-publica">
                            {letra.estilo_musical}
                        </p>

                        <button
                            type="button"
                            onClick={() =>
                                setLetraSelecionada(
                                    letraSelecionada?.id === letra.id
                                        ? null
                                        : letra
                                )
                            }
                        >
                            {letraSelecionada?.id === letra.id
                                ? "Ocultar letra"
                                : "Ver letra completa"}
                        </button>

                        {letraSelecionada?.id === letra.id && (
                            <pre className="conteudo-letra-publica">
                                {letra.letra}
                            </pre>
                        )}
                    </article>
                ))}
            </div>
        </main>
    );
}

export default LetrasPublicas;
