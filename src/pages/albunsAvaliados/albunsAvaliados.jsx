import { useCallback, useEffect, useState } from "react";

import {
    buscarAlbunsDeezer,
    salvarAlbum,
    carregarAlbunsSalvos,
    removerAlbumSalvo,
    salvarAvaliacao,
    editarAvaliacao,
    carregarAvaliacoes
} from "../../api";

import "./albunsAvaliados.css";

function AlbunsAvaliados() {
    const [query, setQuery] = useState("");
    const [resultados, setResultados] = useState([]);
    const [albunsSalvos, setAlbunsSalvos] = useState([]);
    const [avaliacoes, setAvaliacoes] = useState([]);
    const [notas, setNotas] = useState({});

    const [carregando, setCarregando] = useState(true);
    const [pesquisando, setPesquisando] = useState(false);
    const [executandoAcao, setExecutandoAcao] = useState(false);

    const [erro, setErro] = useState("");
    const [mensagem, setMensagem] = useState("");
    const [albumParaRemover, setAlbumParaRemover] = useState(null);

    const carregarDados = useCallback(async () => {
        const [respostaAlbuns, respostaAvaliacoes] = await Promise.all([
            carregarAlbunsSalvos(),
            carregarAvaliacoes()
        ]);

        setAlbunsSalvos(respostaAlbuns.data);
        setAvaliacoes(respostaAvaliacoes.data);

        const notasCarregadas = {};

        respostaAvaliacoes.data.forEach(({ album_id, nota }) => {
            notasCarregadas[album_id] = String(nota);
        });

        setNotas((anteriores) => ({
            ...anteriores,
            ...notasCarregadas
        }));
    }, []);

    useEffect(() => {
        async function inicializar() {
            try {
                await carregarDados();
            } catch (erro) {
                console.error("Erro ao carregar os álbuns:", erro);
                setErro(
                    erro.response?.data?.erro ||
                    "Não foi possível carregar sua biblioteca."
                );
            } finally {
                setCarregando(false);
            }
        }

        inicializar();
    }, [carregarDados]);

    async function pesquisarAlbuns(evento) {
        evento.preventDefault();

        if (!query.trim()) {
            setErro("Digite o nome de um álbum ou artista.");
            return;
        }

        setErro("");
        setMensagem("");
        setPesquisando(true);

        try {
            const resposta = await buscarAlbunsDeezer(query.trim());
            setResultados(resposta.data);
        } catch (erro) {
            console.error("Erro ao pesquisar álbuns:", erro);
            setErro(
                erro.response?.data?.erro ||
                "Não foi possível pesquisar os álbuns."
            );
        } finally {
            setPesquisando(false);
        }
    }

    async function adicionarAlbum(album) {
        setErro("");
        setMensagem("");
        setExecutandoAcao(true);

        try {
            await salvarAlbum({
                deezer_id: album.deezer_id,
                titulo: album.titulo,
                artista: album.artista,
                capa_url: album.capa_url || ""
            });

            await carregarDados();
            setMensagem("Álbum adicionado à sua biblioteca!");
        } catch (erro) {
            console.error("Erro ao salvar álbum:", erro);
            setErro(
                erro.response?.data?.erro ||
                "Não foi possível salvar o álbum."
            );
        } finally {
            setExecutandoAcao(false);
        }
    }

    function removerAlbum(album) {
        setAlbumParaRemover(album);
    }

    async function confirmarRemocao() {
        if (!albumParaRemover) return;

        setErro("");
        setMensagem("");
        setExecutandoAcao(true);

        try {
            await removerAlbumSalvo(albumParaRemover.id);
            await carregarDados();

            setMensagem(
                "Álbum removido da biblioteca. Sua avaliação foi mantida."
            );

            setAlbumParaRemover(null);
        } catch (erro) {
            console.error("Erro ao remover álbum:", erro);
            setErro(
                erro.response?.data?.erro ||
                "Não foi possível remover o álbum."
            );
        } finally {
            setExecutandoAcao(false);
        }
    }

    async function salvarOuEditarNota(evento, albumId) {
        evento.preventDefault();

        setErro("");
        setMensagem("");

        const notaInformada = notas[albumId];

        if (notaInformada === undefined || notaInformada.trim() === "") {
            setErro("Informe uma nota para o álbum.");
            return;
        }

        const nota = Number(notaInformada);

        if (!Number.isFinite(nota) || nota < 0 || nota > 10) {
            setErro("A nota deve estar entre 0 e 10.");
            return;
        }

        const avaliacaoExistente = avaliacoes.find(
            (avaliacao) => Number(avaliacao.album_id) === Number(albumId)
        );

        setExecutandoAcao(true);

        try {
            if (avaliacaoExistente) {
                await editarAvaliacao(albumId, nota);
                setMensagem("Avaliação atualizada com sucesso!");
            } else {
                await salvarAvaliacao({ album_id: albumId, nota });
                setMensagem("Álbum avaliado com sucesso!");
            }

            await carregarDados();
        } catch (erro) {
            console.error("Erro ao salvar avaliação:", erro);
            setErro(
                erro.response?.data?.erro ||
                "Não foi possível salvar a avaliação."
            );
        } finally {
            setExecutandoAcao(false);
        }
    }

    if (carregando) {
        return (
            <main className="albuns-avaliados">
                <p>Carregando sua biblioteca musical...</p>
            </main>
        );
    }

    return (
        <main className="albuns-avaliados">
            <header className="albuns-cabecalho">
                <h1>Minha biblioteca musical</h1>
                <p>Descubra álbuns, organize sua coleção e dê suas notas.</p>
            </header>

            {erro && (
                <div className="albuns-mensagem albuns-erro">
                    {erro}
                </div>
            )}

            {mensagem && (
                <div className="albuns-mensagem albuns-sucesso">
                    {mensagem}
                </div>
            )}

            <section className="albuns-secao">
                <h2>Pesquisar álbuns</h2>

                <form
                    className="albuns-form-pesquisa"
                    onSubmit={pesquisarAlbuns}
                >
                    <input
                        type="text"
                        placeholder="Nome do álbum ou artista..."
                        value={query}
                        onChange={(evento) => {
                            setQuery(evento.target.value);

                            if (!evento.target.value.trim()) {
                                setResultados([]);
                            }
                        }}
                    />

                    <button type="submit" disabled={pesquisando}>
                        {pesquisando ? "Pesquisando..." : "Pesquisar"}
                    </button>
                </form>

                {resultados.length > 0 && (
                    <div className="albuns-grade">
                        {resultados.map((album) => {
                            const jaSalvo = albunsSalvos.some(
                                (salvo) =>
                                    Number(salvo.deezer_id) ===
                                    Number(album.deezer_id)
                            );

                            return (
                                <article
                                    className="album-card"
                                    key={album.deezer_id}
                                >
                                    {album.capa_url ? (
                                        <img
                                            src={album.capa_url}
                                            alt={`Capa de ${album.titulo}`}
                                        />
                                    ) : (
                                        <div className="album-sem-capa">
                                            Sem capa
                                        </div>
                                    )}

                                    <h3>{album.titulo}</h3>
                                    <p>{album.artista}</p>

                                    <button
                                        type="button"
                                        disabled={jaSalvo || executandoAcao}
                                        onClick={() => adicionarAlbum(album)}
                                    >
                                        {jaSalvo
                                            ? "Já está na biblioteca"
                                            : "Salvar na biblioteca"}
                                    </button>
                                </article>
                            );
                        })}
                    </div>
                )}

                {!pesquisando &&
                    resultados.length === 0 &&
                    query.trim() !== "" && (
                        <p className="albuns-vazio">
                            Nenhum resultado encontrado. Tente outra pesquisa.
                        </p>
                    )}
            </section>

            <section className="albuns-secao">
                <h2>Meus álbuns salvos</h2>

                {albunsSalvos.length === 0 ? (
                    <p className="albuns-vazio">
                        Você ainda não salvou nenhum álbum.
                    </p>
                ) : (
                    <div className="albuns-grade">
                        {albunsSalvos.map((album) => {
                            const avaliacao = avaliacoes.find(
                                (item) =>
                                    Number(item.album_id) === Number(album.id)
                            );

                            return (
                                <article
                                    className="album-card"
                                    key={album.id}
                                >
                                    {album.capa_url && (
                                        <img
                                            src={album.capa_url}
                                            alt={`Capa de ${album.titulo}`}
                                        />
                                    )}

                                    <h3>{album.titulo}</h3>
                                    <p>{album.artista}</p>

                                    <form
                                        className="album-form-nota"
                                        onSubmit={(evento) =>
                                            salvarOuEditarNota(
                                                evento,
                                                album.id
                                            )
                                        }
                                    >
                                        <label htmlFor={`nota-${album.id}`}>
                                            {avaliacao
                                                ? "Sua nota atual"
                                                : "Avalie este álbum"}
                                        </label>

                                        <input
                                            id={`nota-${album.id}`}
                                            type="number"
                                            min="0"
                                            max="10"
                                            step="0.1"
                                            placeholder="Nota de 0 a 10"
                                            value={notas[album.id] ?? ""}
                                            onChange={(evento) =>
                                                setNotas((anteriores) => ({
                                                    ...anteriores,
                                                    [album.id]:
                                                        evento.target.value
                                                }))
                                            }
                                        />

                                        <button
                                            type="submit"
                                            disabled={executandoAcao}
                                        >
                                            {avaliacao
                                                ? "Atualizar nota"
                                                : "Avaliar álbum"}
                                        </button>
                                    </form>

                                    <button
                                        type="button"
                                        className="album-botao-remover"
                                        disabled={executandoAcao}
                                        onClick={() => removerAlbum(album)}
                                    >
                                        Remover da biblioteca
                                    </button>
                                </article>
                            );
                        })}
                    </div>
                )}
            </section>

            {albumParaRemover && (
                <div
                    className="modal-fundo"
                    onMouseDown={(evento) => {
                        if (
                            evento.target === evento.currentTarget &&
                            !executandoAcao
                        ) {
                            setAlbumParaRemover(null);
                        }
                    }}
                >
                    <section
                        className="modal-remover"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="modal-titulo"
                    >
                        <h2 id="modal-titulo">Remover álbum?</h2>

                        <p>
                            Deseja remover{" "}
                            <strong>{albumParaRemover.titulo}</strong> da sua
                            biblioteca?
                        </p>

                        <p>Sua avaliação será mantida.</p>

                        <div className="modal-acoes">
                            <button
                                type="button"
                                className="modal-cancelar"
                                disabled={executandoAcao}
                                onClick={() => setAlbumParaRemover(null)}
                            >
                                Cancelar
                            </button>

                            <button
                                type="button"
                                className="modal-confirmar"
                                disabled={executandoAcao}
                                onClick={confirmarRemocao}
                            >
                                {executandoAcao ? "Removendo..." : "Remover"}
                            </button>
                        </div>
                    </section>
                </div>
            )}
        </main>
    );
}

export default AlbunsAvaliados;