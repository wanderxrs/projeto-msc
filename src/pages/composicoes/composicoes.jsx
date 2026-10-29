import { useEffect, useState } from "react";
import {
    criarComposicao,
    carregarComposicoes,
    buscarComposicao,
    atualizarComposicao,
    excluirComposicao
} from "../../api";
import "./composicoes.css";

const estilos = [
    "Rock",
    "Pop",
    "Rap / Hip-hop",
    "Trap",
    "Sertanejo",
    "MPB",
    "Indie",
    "Reggae",
    "Outro"
];

function Composicoes() {
    const [composicoes, setComposicoes] = useState([]);
    const [titulo, setTitulo] = useState("");
    const [estilo, setEstilo] = useState("Outro");
    const [letra, setLetra] = useState("");
    const [publica, setPublica] = useState(false);
    const [editando, setEditando] = useState(null);
    const [mensagem, setMensagem] = useState("");
    const [erro, setErro] = useState("");
    const [carregando, setCarregando] = useState(true);
    const [salvando, setSalvando] = useState(false);

    async function carregar() {
        setCarregando(true);
        setErro("");

        try {
            const resposta = await carregarComposicoes();
            setComposicoes(resposta.data);
        } catch (e) {
            setErro(
                e.response?.data?.erro ||
                "Não foi possível carregar suas composições."
            );
        } finally {
            setCarregando(false);
        }
    }

    useEffect(() => {
        carregar();
    }, []);

    function limparFormulario() {
        setTitulo("");
        setEstilo("Outro");
        setLetra("");
        setPublica(false);
        setEditando(null);
    }

    async function salvar(evento) {
        evento.preventDefault();
        setErro("");
        setMensagem("");

        if (!titulo.trim() || !letra.trim()) {
            setErro("Preencha o título e a letra da música.");
            return;
        }

        setSalvando(true);

        try {
            const dados = {
                titulo: titulo.trim(),
                estilo_musical: estilo,
                letra: letra.trim(),
                publica: publica
            };

            if (editando !== null) {
                await atualizarComposicao(editando, dados);
                setMensagem("Composição atualizada com sucesso!");
            } else {
                await criarComposicao(dados);
                setMensagem("Composição salva com sucesso!");
            }

            limparFormulario();
            await carregar();
        } catch (e) {
            setErro(
                e.response?.data?.erro ||
                "Não foi possível salvar a composição."
            );
        } finally {
            setSalvando(false);
        }
    }

    async function editar(id) {
        setErro("");
        setMensagem("");

        try {
            const resposta = await buscarComposicao(id);
            const composicao = resposta.data;

            setTitulo(composicao.titulo);
            setEstilo(composicao.estilo_musical);
            setLetra(composicao.letra);
            setPublica(Boolean(composicao.publica));
            setEditando(composicao.id);

            window.scrollTo({ top: 0, behavior: "smooth" });
        } catch (e) {
            setErro(
                e.response?.data?.erro ||
                "Não foi possível abrir essa composição."
            );
        }
    }

    async function excluir(id) {
        const confirmado = window.confirm(
            "Deseja realmente excluir esta composição?"
        );

        if (!confirmado) return;

        setErro("");
        setMensagem("");

        try {
            await excluirComposicao(id);

            if (editando === id) {
                limparFormulario();
            }

            setMensagem("Composição excluída com sucesso!");
            await carregar();
        } catch (e) {
            setErro(
                e.response?.data?.erro ||
                "Não foi possível excluir a composição."
            );
        }
    }

    return (
        <main className="composicoes-pagina">
            <header className="composicoes-cabecalho">
                <div>
                    <span className="composicoes-etiqueta">
                        SEU ESPAÇO CRIATIVO
                    </span>
                    <h1>Minhas composições</h1>
                    <p>
                        Transforme suas ideias em músicas.
                        Guarde suas letras e continue criando.
                    </p>
                </div>
            </header>

            {erro && (
                <div className="composicoes-mensagem erro">
                    {erro}
                </div>
            )}

            {mensagem && (
                <div className="composicoes-mensagem sucesso">
                    {mensagem}
                </div>
            )}

            <section className="composicoes-formulario">
                <h2>
                    {editando !== null
                        ? "Editar composição"
                        : "Nova composição"}
                </h2>

                <form onSubmit={salvar}>
                    <label htmlFor="titulo-composicao">
                        Título da música
                    </label>
                    <input
                        id="titulo-composicao"
                        type="text"
                        maxLength={150}
                        placeholder="Ex.: Noites sem fim"
                        value={titulo}
                        onChange={(e) => setTitulo(e.target.value)}
                        required
                    />

                    <label htmlFor="estilo-composicao">
                        Estilo musical
                    </label>
                    <select
                        id="estilo-composicao"
                        value={estilo}
                        onChange={(e) => setEstilo(e.target.value)}
                    >
                        {estilos.map((item) => (
                            <option key={item} value={item}>
                                {item}
                            </option>
                        ))}
                    </select>

                    <label htmlFor="letra-composicao">
                        Letra da música
                    </label>
                    <textarea
                        id="letra-composicao"
                        placeholder={"[Verso 1]\nEscreva sua letra aqui...\n\n[Refrão]\nContinue sua composição..."}
                        maxLength={100000}
                        rows={12}
                        value={letra}
                        onChange={(e) => setLetra(e.target.value)}
                        required
                    />

                    <div className="composicoes-contagem">
                        {letra.length} / 100000 caracteres
                    </div>

                    <div className="composicao-privacidade">
                        <label htmlFor="composicao-publica">
                            <input
                                id="composicao-publica"
                                type="checkbox"
                                checked={publica}
                                onChange={(e) => setPublica(e.target.checked)}
                            />
                            Tornar esta letra pública
                        </label>
                        <p>
                            {publica
                                ? "Sua letra poderá aparecer na página Letras de Músicas para outros úsuarios."
                                : "Sua letra ficará privada e não aparecerá para outros úsuarios na página Letras de Músicas."}
                        </p>
                    </div>

                    <div className="composicoes-acoes">
                        <button
                            type="submit"
                            disabled={salvando}
                            className="composicoes-botao-principal"
                        >
                            {salvando
                                ? "Salvando..."
                                : editando !== null
                                ? "Salvar alterações"
                                : "Salvar composição"}
                        </button>

                        {editando !== null && (
                            <button
                                type="button"
                                className="composicoes-botao-secundario"
                                onClick={limparFormulario}
                            >
                                Cancelar edição
                            </button>
                        )}
                    </div>
                </form>
            </section>

            <section className="composicoes-lista">
                <div className="composicoes-lista-cabecalho">
                    <h2>Suas letras</h2>
                    <span>{composicoes.length} composições</span>
                </div>

                {carregando ? (
                    <p>Carregando suas composições...</p>
                ) : composicoes.length === 0 ? (
                    <div className="composicoes-vazio">
                        <h3>Sua próxima música começa aqui</h3>
                        <p>
                            Você ainda não salvou nenhuma letra.
                            Use o formulário acima para começar.
                        </p>
                    </div>
                ) : (
                    <div className="composicoes-grade">
                        {composicoes.map((item) => (
                            <article
                                className="composicao-card"
                                key={item.id}
                            >
                                <div className="composicao-card-icone">
                                    ♪
                                </div>

                                <h3>{item.titulo}</h3>

                                <span className="composicao-estilo">
                                    {item.estilo_musical}
                                </span>

                                <span
                                    className={
                                        item.publica
                                            ? "composicao-status publica"
                                            : "composicao-status privada"
                                    }
                                >
                                    {item.publica
                                        ? "Pública"
                                        : "Privada"}
                                </span>

                                <p className="composicao-trecho">
                                    Abra para continuar trabalhando na sua letra.
                                </p>

                                <div className="composicao-card-acoes">
                                    <button
                                        type="button"
                                        onClick={() => editar(item.id)}
                                    >
                                        Editar letra
                                    </button>

                                    <button
                                        type="button"
                                        className="composicao-excluir"
                                        onClick={() => excluir(item.id)}
                                    >
                                        Excluir
                                    </button>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </section>
        </main>
    );
}

export default Composicoes;