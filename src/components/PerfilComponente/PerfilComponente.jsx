import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { carregarPerfil } from "../../api";
import "./perfilComponente.css";

import CriarComunidadeModal from "../../modals/Comunidade/criarComunidadeModal";
import ModalArtistasEmAlta from "../../modals/ArtistaEmAlta/ModalArtistasEmAlta";

// Icons
import { HiChevronRight } from "react-icons/hi";
import { HiUser } from "react-icons/hi";
import { HiTrendingUp } from "react-icons/hi";
import { HiOutlineDocumentText } from "react-icons/hi";
import { HiTicket } from "react-icons/hi";
import { LuBrainCircuit } from "react-icons/lu";
import { PiVinylRecordBold } from "react-icons/pi";
import { HiUsers } from "react-icons/hi";

function PerfilComponente() {
    const [usuario, setUsuario] = useState(null);
    const [modalAberto, setModalAberto] = useState(false);
    const [modalArtistasAberto, setModalArtistasAberto] = useState(false);

    const navegar = useNavigate();

    useEffect(() => {
        async function buscarPerfil() {
            try {
                const resposta = await carregarPerfil();
                setUsuario(resposta.data);
            } catch (erro) {
                console.error("Erro ao carregar perfil:", erro);
            }
        }

        buscarPerfil();
    }, []);

    if (!usuario) {
        return (
            <div className="perfil-componente">
                <p>Carregando perfil...</p>
            </div>
        );
    }

    return (
        <div className="perfil-componente">
            <div className="perfil-usuario">
                <div className="perfil-usuario">
                    <img
                        className="foto-perfil"
                        src={usuario.foto_url}
                        alt="Foto de perfil"
                    />

                    <div className="informacoes-usuario">
                        <h2>{usuario.nome}</h2>
                    </div>
                </div>

                <div className="botoesDiv">
                    <button
                        type="button"
                        className="botao-perfil"
                        onClick={() => navegar(`/perfil/${usuario.id}`)}
                    >
                        <HiUser />
                        <strong>Meu perfil</strong>
                        <HiChevronRight />
                    </button>
                </div>

                <h3>Descobrir</h3>

                <div className="container-artistas">
                    <button
                        type="button"
                        className="container1"
                        onClick={() => setModalArtistasAberto(true)}
                    >
                        <HiTrendingUp />
                        <strong>Artistas em alta</strong>
                        <p>Quem está bombando</p>
                    </button>

                    <div
                        className="container2"
                        role="button"
                        tabIndex={0}
                        onClick={() => navegar("/letras-publicas")}
                        onKeyDown={(evento) => {
                            if (
                                evento.key === "Enter" ||
                                evento.key === " "
                            ) {
                                evento.preventDefault();
                                navegar("/letras-publicas");
                            }
                        }}
                    >
                        <HiOutlineDocumentText />
                        <strong>Letras de músicas</strong>
                        <p>Explore composições</p>
                    </div>

                    <div
                        className="container2"
                        role="button"
                        tabIndex={0}
                        onClick={() => navegar("/shows")}
                        onKeyDown={(evento) => {
                            if (
                                evento.key === "Enter" ||
                                evento.key === " "
                            ) {
                                evento.preventDefault();
                                navegar("/shows");
                            }
                        }}
                    >
                        <HiTicket />
                        <strong>Próximos shows</strong>
                        <p>Encontre eventos</p>
                    </div>
                </div>

                <div
                    className="botao-analise-ia"
                    role="button"
                    tabIndex={0}
                    onClick={() => navegar("/composicoes")}
                    onKeyDown={(evento) => {
                        if (
                            evento.key === "Enter" ||
                            evento.key === " "
                        ) {
                            evento.preventDefault();
                            navegar("/composicoes");
                        }
                    }}
                >
                    <LuBrainCircuit />
                    <strong>Analisar letras com IA</strong>
                    <p>Explore suas composições</p>
                    <HiChevronRight />
                </div>

                <div
                    className="botao-album-avaliacao"
                    role="button"
                    tabIndex={0}
                    onClick={() => navegar("/albuns-avaliados")}
                    onKeyDown={(evento) => {
                        if (
                            evento.key === "Enter" ||
                            evento.key === " "
                        ) {
                            evento.preventDefault();
                            navegar("/albuns-avaliados");
                        }
                    }}
                >
                    <PiVinylRecordBold />
                    <strong>Álbuns avaliados</strong>
                    <p>Suas avaliações</p>
                    <HiChevronRight />
                </div>

                <hr className="linha-comunidades" />

                <div
                    className="botao-ver-minhas-comunidades"
                    role="button"
                    tabIndex={0}
                    onClick={() => navegar("/minhas-comunidades")}
                    onKeyDown={(evento) => {
                        if (
                            evento.key === "Enter" ||
                            evento.key === " "
                        ) {
                            evento.preventDefault();
                            navegar("/minhas-comunidades");
                        }
                    }}
                >
                    <HiUsers />
                    <strong>Minhas comunidades</strong>
                    <HiChevronRight />
                </div>
            </div>

            {modalArtistasAberto && (
                <ModalArtistasEmAlta
                    onFechar={() => setModalArtistasAberto(false)}
                />
            )}
        </div>
    );
}

export default PerfilComponente;