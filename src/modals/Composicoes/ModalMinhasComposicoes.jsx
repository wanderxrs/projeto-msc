
import { useEffect, useState } from "react";
import {
    criarComposicao,
    carregarComposicoes,
    atualizarComposicao,
    excluirComposicao
} from "../../api";
import { IoClose, IoCreateOutline, IoTrashOutline } from "react-icons/io5";
import "./modalMinhasComposicoes.css";

const formularioInicial = {
    titulo: "",
    estilo_musical: "Outro",
    letra: "",
    publica: false
};

function ModalMinhasComposicoes({ isOpen, onClose }) {
    const [composicoes, setComposicoes] = useState([]);
    const [formulario, setFormulario] = useState(formularioInicial);
    const [editando, setEditando] = useState(null);
    const [carregando, setCarregando] = useState(true);
    const [salvando, setSalvando] = useState(false);
    const [erro, setErro] = useState("");
    const [mensagem, setMensagem] = useState("");

    async function carregarLista() {
        try {
            const resposta = await carregarComposicoes();
            setComposicoes(resposta.data);
            setErro("");
        } catch (error) {
            setErro(
                error.response?.data?.erro ||
                "Não foi possível carregar suas composições."
            );
        } finally {
            setCarregando(false);
        }
    }

    useEffect(() => {
        if (!isOpen) return;

        let ativo = true;

        async function buscarComposicoes() {
            try {
                const resposta = await carregarComposicoes();

                if (ativo) {
                    setComposicoes(resposta.data);
                    setErro("");
                }
            } catch (error) {
                if (ativo) {
                    setErro(
                        error.response?.data?.erro ||
                        "Não foi possível carregar suas composições."
                    );
                }
            } finally {
                if (ativo) {
                    setCarregando(false);
                }
            }
        }

        buscarComposicoes();

        return () => {
            ativo = false;
        };
    }, [isOpen]);

    if (!isOpen) return null;

    function alterarCampo(evento) {
        const { name, value, type, checked } = evento.target;

        setFormulario((anterior) => ({
            ...anterior,
            [name]: type === "checkbox" ? checked : value
        }));
    }

    function limparFormulario() {
        setFormulario(formularioInicial);
        setEditando(null);
        setMensagem("");
        setErro("");
    }

    function editarComposicao(composicao) {
        setFormulario({
            titulo: composicao.titulo || "",
            estilo_musical: composicao.estilo_musical || "Outro",
            letra: composicao.letra || "",
            publica: Boolean(composicao.publica)
        });

        setEditando(composicao.id);
        setMensagem("");
        setErro("");

        document.querySelector(".modal-composicoes-conteudo")
            ?.scrollTo({ top: 0, behavior: "smooth" });
    }

    async function salvarComposicao(evento) {
        evento.preventDefault();

        if (!formulario.titulo.trim() || !formulario.letra.trim()) {
            setErro("Preencha o título e a letra da música.");
            return;
        }

        setSalvando(true);
        setErro("");
        setMensagem("");

        try {
            if (editando) {
                await atualizarComposicao(editando, formulario);
                setMensagem("Composição atualizada com sucesso!");
            } else {
                await criarComposicao(formulario);
                setMensagem("Composição criada com sucesso!");
            }

            setFormulario(formularioInicial);
            setEditando(null);

            await carregarLista();

        } catch (error) {
            setErro(
                error.response?.data?.erro ||
                "Não foi possível salvar a composição."
            );
        } finally {
            setSalvando(false);
        }
    }

    async function deletarComposicao(id) {
        const confirmar = window.confirm(
            "Tem certeza que deseja excluir esta composição?"
        );

        if (!confirmar) return;

        setErro("");
        setMensagem("");

        try {
            await excluirComposicao(id);

            if (editando === id) {
                limparFormulario();
            }

            setMensagem("Composição excluída com sucesso!");
            await carregarLista();

        } catch (error) {
            setErro(
                error.response?.data?.erro ||
                "Não foi possível excluir a composição."
            );
        }
    }

    async function alterarVisibilidade(composicao) {
        const novaVisibilidade = !Boolean(composicao.publica);

        try {
            setErro("");
            setMensagem("");

            await atualizarComposicao(composicao.id, {
                titulo: composicao.titulo,
                estilo_musical: composicao.estilo_musical,
                letra: composicao.letra,
                publica: novaVisibilidade
            });

            setMensagem(
                novaVisibilidade
                    ? "Composição publicada com sucesso!"
                    : "Composição agora é privada."
            );

            await carregarLista();

        } catch (error) {
            setErro(
                error.response?.data?.erro ||
                "Não foi possível alterar a visibilidade."
            );
        }
    }

    return (
        <div
            className="modal-composicoes-overlay"
            onClick={salvando ? undefined : onClose}
        >
            <div
                className="modal-composicoes"
                onClick={(evento) => evento.stopPropagation()}
            >
                {salvando && (
                    <div className="loading-composicao">
                        <div className="spinner-composicao"></div>

                        <h3>Analisando sua composição...</h3>

                        <p>
                            A inteligência artificial está verificando
                            sua letra. Aguarde enquanto concluímos a análise.
                        </p>

                        <span>Verificando conteúdo...</span>
                    </div>
                )}

                <header className="modal-composicoes-header">
                    <div>
                        <h2>Minhas composições</h2>
                        <p>Crie e gerencie suas letras musicais.</p>
                    </div>

                    <button
                        type="button"
                        className="fechar-modal-composicoes"
                        onClick={onClose}
                        aria-label="Fechar modal"
                        disabled={salvando}
                    >
                        <IoClose />
                    </button>
                </header>

                <div className="modal-composicoes-conteudo">
                    <form
                        className="form-composicao"
                        onSubmit={salvarComposicao}
                    >
                        <h3>
                            {editando
                                ? "Editar composição"
                                : "Nova composição"}
                        </h3>

                        <label htmlFor="titulo-composicao">
                            Título da música
                        </label>

                        <input
                            id="titulo-composicao"
                            type="text"
                            name="titulo"
                            maxLength={150}
                            placeholder="Digite o título da música"
                            value={formulario.titulo}
                            onChange={alterarCampo}
                            required
                        />

                        <label htmlFor="estilo-composicao">
                            Estilo musical
                        </label>

                        <select
                            id="estilo-composicao"
                            name="estilo_musical"
                            value={formulario.estilo_musical}
                            onChange={alterarCampo}
                        >
                            <option value="Rock">Rock</option>
                            <option value="Pop">Pop</option>
                            <option value="Rap / Hip-hop">Rap / Hip-hop</option>
                            <option value="Trap">Trap</option>
                            <option value="Sertanejo">Sertanejo</option>
                            <option value="MPB">MPB</option>
                            <option value="Indie">Indie</option>
                            <option value="Reggae">Reggae</option>
                            <option value="Outro">Outro</option>
                        </select>

                        <label htmlFor="letra-composicao">
                            Letra da música
                        </label>

                        <textarea
                            id="letra-composicao"
                            name="letra"
                            placeholder="Escreva sua composição..."
                            value={formulario.letra}
                            onChange={alterarCampo}
                            maxLength={100000}
                            required
                        />

                        <label className="visibilidade-composicao">
                            <input
                                type="checkbox"
                                name="publica"
                                checked={formulario.publica}
                                onChange={alterarCampo}
                            />

                            <span>
                                Publicar composição para todos visualizarem
                            </span>
                        </label>

                        <div className="acoes-form-composicao">
                            <button
                                type="submit"
                                disabled={salvando}
                                className="salvar-composicao"
                            >
                                {salvando
                                    ? "Verificando conteúdo..."
                                    : editando
                                        ? "Salvar alterações"
                                        : "Criar composição"}
                            </button>

                            {editando && (
                                <button
                                    type="button"
                                    className="cancelar-edicao-composicao"
                                    onClick={limparFormulario}
                                    disabled={salvando}
                                >
                                    Cancelar
                                </button>
                            )}
                        </div>
                    </form>

                    {erro && (
                        <p className="mensagem-erro-composicao">
                            {erro}
                        </p>
                    )}

                    {mensagem && (
                        <p className="mensagem-sucesso-composicao">
                            {mensagem}
                        </p>
                    )}

                    <section className="minhas-lista-composicoes">
                        <h3>Minhas músicas</h3>

                        {carregando ? (
                            <p className="estado-composicoes">
                                Carregando composições...
                            </p>
                        ) : composicoes.length === 0 ? (
                            <p className="estado-composicoes">
                                Você ainda não criou nenhuma composição.
                            </p>
                        ) : (
                            composicoes.map((composicao) => (
                                <article
                                    className="item-minha-composicao"
                                    key={composicao.id}
                                >
                                    <div className="dados-minha-composicao">
                                        <h4>{composicao.titulo}</h4>

                                        <span>
                                            {composicao.estilo_musical}
                                        </span>

                                        <span
                                            className={
                                                Boolean(composicao.publica)
                                                    ? "status-composicao publica"
                                                    : "status-composicao privada"
                                            }
                                        >
                                            {Boolean(composicao.publica)
                                                ? "Pública"
                                                : "Privada"}
                                        </span>
                                    </div>

                                    <div className="acoes-minha-composicao">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                editarComposicao(composicao)
                                            }
                                            title="Editar composição"
                                        >
                                            <IoCreateOutline />
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                deletarComposicao(composicao.id)
                                            }
                                            title="Excluir composição"
                                        >
                                            <IoTrashOutline />
                                        </button>
                                    </div>

                                    <button
                                        type="button"
                                        className="alternar-visibilidade"
                                        onClick={() =>
                                            alterarVisibilidade(composicao)
                                        }
                                    >
                                        {Boolean(composicao.publica)
                                            ? "Tornar privada"
                                            : "Tornar pública"}
                                    </button>
                                </article>
                            ))
                        )}
                    </section>
                </div>
            </div>
        </div>
    );
}

export default ModalMinhasComposicoes;
