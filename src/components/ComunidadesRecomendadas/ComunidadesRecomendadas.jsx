
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoChevronForward } from "react-icons/io5";

import {
    buscarComunidadesDisponiveis,
    buscarComunidadesPeloNome,
    filtroGeneroComunidade
} from "../../api";

import FiltroGeneroModal from "../FiltroGenero/FiltroGeneroModal";
import "./ComunidadesRecomendadas.css";

function ComunidadesRecomendadas() {
    const navigate = useNavigate();

    const [comunidades, setComunidades] = useState([]);
    const [nomeBusca, setNomeBusca] = useState("");
    const [modalFiltroAberto, setModalFiltroAberto] = useState(false);

    // Carrega as comunidades disponíveis.
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

    // Carrega as comunidades ao abrir o componente.
    useEffect(() => {
        carregarComunidades();
    }, []);

    // Pesquisa comunidades pelo nome.
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

    // Filtra comunidades por gênero musical.
    async function filtrarPorGenero(genero) {
        try {
            const resposta = await filtroGeneroComunidade(genero);

            console.log("Comunidades filtradas:", resposta.data);

            setComunidades(
                Array.isArray(resposta.data)
                    ? resposta.data
                    : resposta.data.comunidades || []
            );

            setModalFiltroAberto(false);
        } catch (erro) {
            console.error("Erro ao filtrar comunidades:", erro);
        }
    }

    // Abre a página da comunidade.
    function abrirComunidade(id) {
        navigate(`/comunidade/${id}`);
    }

    return (
        <aside className="comunidades-recomendadas">

            {/* Barra de pesquisa e filtro */}
            <div className="barra-comunidades">

                <div className="input-container">
                    <input
                        className="styled_input_bar"
                        type="text"
                        placeholder=" "
                        value={nomeBusca}
                        name="pesquisa-comunidade"
                        id="styled_input_bar"
                        onChange={(e) => setNomeBusca(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                pesquisarComunidades();
                            }
                        }}
                    />

                    <label
                        className="input-label"
                        htmlFor="styled_input_bar"
                    >
                        Pesquisar
                    </label>
                </div>

                <button
                    type="button"
                    className="boton-elegante"
                    onClick={() => setModalFiltroAberto(true)}
                >
                    Filtrar
                </button>
            </div>

            {/* Título */}
            <h2>
                {nomeBusca
                    ? "Resultados da pesquisa"
                    : "Comunidades recomendadas"}
            </h2>

            {/* Lista de comunidades */}
            <div className="lista-comunidades">

                {comunidades.length === 0 ? (
                    <p>Nenhuma comunidade disponível.</p>
                ) : (
                    comunidades.map((comunidade) => (

                        <div
                            className="item-comunidade"
                            key={comunidade.id}
                            onClick={() => abrirComunidade(comunidade.id)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(evento) => {
                                if (
                                    evento.key === "Enter" ||
                                    evento.key === " "
                                ) {
                                    evento.preventDefault();
                                    abrirComunidade(comunidade.id);
                                }
                            }}
                        >

                            <img
                                src={
                                    comunidade.imagem_url ||
                                    "/avatar-padrao.png"
                                }
                                alt={`Imagem da comunidade ${comunidade.nome}`}
                                className="imagem_rec_comunidades"
                            />

                            <p>{comunidade.nome}</p>

                            {/* Ícone de seta */}
                            <IoChevronForward
                                className="seta-comunidade"
                                aria-hidden="true"
                            />

                        </div>
                    ))
                )}

            </div>

            {/* Modal de filtro por gênero */}
            <FiltroGeneroModal
                aberto={modalFiltroAberto}
                fechar={() => setModalFiltroAberto(false)}
                aplicarFiltro={filtrarPorGenero}
            />

        </aside>
    );
}

export default ComunidadesRecomendadas;
