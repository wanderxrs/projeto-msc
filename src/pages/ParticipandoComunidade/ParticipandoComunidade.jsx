import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { buscarComunidadesDoPerfil } from "../../api";

import "./ParticipandoComunidade.css";

function ParticipandoComunidade() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [comunidades, setComunidades] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("");

    // BUSCAR COMUNIDADES DO PERFIL
    async function buscarComunidadesPerfil() {
        setCarregando(true);
        setErro("");
        setComunidades([]);

        try {
            const resposta = await buscarComunidadesDoPerfil(id);

            const lista = Array.isArray(resposta.data)
                ? resposta.data
                : [];

            setComunidades(lista);

        } catch (erro) {
            console.error(
                "Erro ao carregar comunidades:",
                erro.response?.data || erro.message
            );

            setErro("Erro ao carregar as comunidades.");

        } finally {
            setCarregando(false);
        }
    }

    // CARREGAR COMUNIDADES AO MUDAR DE PERFIL
    useEffect(() => {
        buscarComunidadesPerfil();
    }, [id]);

    return (
        <main className="perfil-page">

            <section className="perfil-conteudo-aba">

                <h2>Comunidades</h2>

                {carregando ? (
                    <p>Carregando comunidades...</p>

                ) : erro ? (
                    <p>{erro}</p>

                ) : comunidades.length === 0 ? (
                    <p>
                        Esse usuário ainda não participa de comunidades.
                    </p>

                ) : (
                    <div className="perfil-comunidades-lista">

                        {comunidades.map((comunidade) => (
                            <article
                                className="perfil-comunidade-card"
                                key={comunidade.id}
                                onClick={() =>
                                    navigate(`/comunidade/${comunidade.id}`)
                                }
                                role="link"
                                tabIndex={0}
                                onKeyDown={(evento) => {
                                    if (
                                        evento.key === "Enter" ||
                                        evento.key === " "
                                    ) {
                                        evento.preventDefault();

                                        navigate(
                                            `/comunidade/${comunidade.id}`
                                        );
                                    }
                                }}
                            >

                                {comunidade.imagem_url && (
                                    <img
                                        src={comunidade.imagem_url}
                                        alt={`Imagem da comunidade ${comunidade.nome}`}
                                        className="perfil-comunidade-imagem"
                                    />
                                )}

                                <div className="perfil-comunidade-info">

                                    <h3>{comunidade.nome}</h3>

                                    {comunidade.genero && (
                                        <span>
                                            {comunidade.genero}
                                        </span>
                                    )}

                                    <p>
                                        {Number(comunidade.total_membros) || 0}{" "}
                                        {Number(comunidade.total_membros) === 1
                                            ? "membro"
                                            : "membros"}
                                    </p>

                                    {comunidade.descricao && (
                                        <p>{comunidade.descricao}</p>
                                    )}

                                </div>

                            </article>
                        ))}

                    </div>
                )}

            </section>

        </main>
    );
}

export default ParticipandoComunidade;