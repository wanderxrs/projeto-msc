import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { carregarPerfil } from "../../api";
import "./perfilComponente.css";

import ModalArtistasEmAlta from "../../modals/ArtistaEmAlta/ModalArtistasEmAlta";
import MinhasComunidadesModal from "../../modals/Comunidade/MinhasComunidadesModal";

// Ícones
import { HiChevronRight } from "react-icons/hi";
import { HiUser } from "react-icons/hi";
import { HiTrendingUp } from "react-icons/hi";
import { PiVinylRecordBold } from "react-icons/pi";
import { HiUsers } from "react-icons/hi";
import { MdLyrics } from "react-icons/md";
import { FaPencil } from "react-icons/fa6";
import { Orbit } from "lucide-react";

function PerfilComponente() {
    const [usuario, setUsuario] = useState(null);
    const [modalArtistasAberto, setModalArtistasAberto] = useState(false);
    const [minhasComunidadesAberto, setMinhasComunidadesAberto] =
        useState(false);

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

    // Abrir perfil do usuário
    const abrirMeuPerfil = () => {
        navegar(`/perfil/${usuario.id}`);
    };

    // Abrir comunidades das quais o usuário participa
    const abrirComunidades = () => {
        navegar(`/participandoComunidade/${usuario.id}`);
    };

    return (
        <div className="perfil-componente">
            <div className="perfil-usuario">
                {/* Foto de perfil clicável */}
                <img
                    className="foto-perfil"
                    src={usuario.foto_url || "/avatar-padrao.png"}
                    alt="Foto de perfil"
                    onClick={abrirMeuPerfil}
                    title="Acessar meu perfil"
                    role="button"
                    tabIndex={0}
                    onKeyDown={(evento) => {
                        if (
                            evento.key === "Enter" ||
                            evento.key === " "
                        ) {
                            evento.preventDefault();
                            abrirMeuPerfil();
                        }
                    }}
                />

                <div className="informacoes-usuario">
                    {/* Nome clicável */}
                    <h2
                        onClick={abrirMeuPerfil}
                        title="Acessar meu perfil"
                        role="button"
                        tabIndex={0}
                        onKeyDown={(evento) => {
                            if (
                                evento.key === "Enter" ||
                                evento.key === " "
                            ) {
                                evento.preventDefault();
                                abrirMeuPerfil();
                            }
                        }}
                    >
                        {usuario.nome}
                    </h2>
                </div>
            </div>

            <div className="botoesDiv">
                <button
                    type="button"
                    className="botao-perfil"
                    onClick={abrirMeuPerfil}
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
                    <MdLyrics />
                    <strong>Letras de músicas</strong>
                    <p>Explore composições</p>
                </div>
            </div>

            <div
                className="botao-analise-ia"
                role="button"
                tabIndex={0}
                onClick={abrirComunidades}
                onKeyDown={(evento) => {
                    if (
                        evento.key === "Enter" ||
                        evento.key === " "
                    ) {
                        evento.preventDefault();
                        abrirComunidades();
                    }
                }}
            >
                <Orbit size={20} />
                <strong>Comunidades que faço parte</strong>
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
                onClick={() => setMinhasComunidadesAberto(true)}
                onKeyDown={(evento) => {
                    if (
                        evento.key === "Enter" ||
                        evento.key === " "
                    ) {
                        evento.preventDefault();
                        setMinhasComunidadesAberto(true);
                    }
                }}
            >
                <HiUsers />
                <strong>Minhas comunidades</strong>
                <HiChevronRight />
            </div>

            {modalArtistasAberto && (
                <ModalArtistasEmAlta
                    onFechar={() => setModalArtistasAberto(false)}
                />
            )}

            <MinhasComunidadesModal
                isOpen={minhasComunidadesAberto}
                onClose={() => setMinhasComunidadesAberto(false)}
            />
        </div>
    );
}

export default PerfilComponente;