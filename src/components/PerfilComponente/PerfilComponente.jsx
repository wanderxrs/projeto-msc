import { useEffect, useState } from "react";
import { carregarPerfil } from "../../api";
import "./perfilComponente.css";
import CriarComunidadeModal from "../../modals/Comunidade/criarComunidadeModal";
import { useNavigate } from "react-router-dom";

import { HiChevronRight } from "react-icons/hi";
import { HiUser } from "react-icons/hi";
import { HiTrendingUp } from "react-icons/hi";
import { HiOutlineDocumentText } from "react-icons/hi";
import { LuBrainCircuit } from "react-icons/lu";
import { PiVinylRecordBold } from "react-icons/pi";
import { HiUsers } from "react-icons/hi";

function PerfilComponente() {
    const [usuario, setUsuario] = useState(null);
    const [modalAberto, setModalAberto] = useState(false);
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
                    <div className="container1">
                        <HiTrendingUp />
                        <strong>Artistas em alta</strong>
                        <p>Quem está bombando</p>
                    </div>

                    <div
                        className="container2"
                        onClick={() => navegar("/letras-publicas")}
                        role="button"
                        tabIndex={0}
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
                </div>

                <div
                    className="botao-analise-ia"
                    onClick={() => navegar("/composicoes")}
                    role="button"
                    tabIndex={0}
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
                    onClick={() => navegar("/albuns-avaliados")}
                    role="button"
                    tabIndex={0}
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

                <div className="botao-ver-minhas-comunidades">
                    <HiUsers />
                    <strong>Minhas comunidades</strong>
                    <HiChevronRight />
                </div>
            </div>
        </div>
    );
}

export default PerfilComponente;