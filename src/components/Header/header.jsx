import { useEffect, useState } from "react";
import { FiMenu, FiSearch } from "react-icons/fi";
import { FaBell } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

import "./header.css";

import {
    fazerLogout,
    buscarUsuariosPorNome,
    carregarNotificacoes
} from "../../api";

import FazerLogoutModal from "../../modals/FazerLogout/fazerLogoutModal";
import ModalNotificacoes from "../../modals/Notificacao/ModalNotificacoes";
import ModalMenu from "../../modals/MenuHeader/MenuHeaderModal";  

function Header() {
    const [nomeBusca, setNomeBusca] = useState("");
    const [usuarios, setUsuarios] = useState([]);
    const [carregando, setCarregando] = useState(false);
    const [modalLogoutAberto, setModalLogoutAberto] = useState(false);

    // Menu
    const [modalMenuAberto, setModalMenuAberto] = useState(false);

    // Notificações
    const [modalNotificacoesAberto, setModalNotificacoesAberto] = useState(false);
    const [temNotificacaoNova, setTemNotificacaoNova] = useState(false);

    const navigate = useNavigate();

    // PESQUISAR USUÁRIOS
    useEffect(() => {
        const nome = nomeBusca.trim();

        if (!nome) {
            setUsuarios([]);
            setCarregando(false);
            return;
        }

        let cancelado = false;

        const timeout = setTimeout(async () => {
            try {
                setCarregando(true);

                const resposta = await buscarUsuariosPorNome(nome);

                if (!cancelado) {
                    setUsuarios(resposta.data);
                }

            } catch (error) {
                console.error("Erro ao pesquisar usuários:", error);

                if (!cancelado) {
                    setUsuarios([]);
                }

            } finally {
                if (!cancelado) {
                    setCarregando(false);
                }
            }
        }, 300);

        return () => {
            cancelado = true;
            clearTimeout(timeout);
        };
    }, [nomeBusca]);

    // VERIFICAR NOTIFICAÇÕES NOVAS
    useEffect(() => {
        async function verificarNotificacoes() {
            try {
                const resposta = await carregarNotificacoes();
                const notificacoes = resposta.data;

                if (notificacoes.length === 0) {
                    setTemNotificacaoNova(false);
                    return;
                }

                const ultimaNotificacao = notificacoes[0];

                const ultimaVisualizada = localStorage.getItem(
                    "ultimaNotificacaoVisualizada"
                );

                setTemNotificacaoNova(
                    String(ultimaNotificacao.id) !== ultimaVisualizada
                );

            } catch (error) {
                console.error("Erro ao verificar notificações:", error);
            }
        }

        verificarNotificacoes();
    }, []);

    // LOGOUT
    const fazendoLogout = async () => {
        try {
            await fazerLogout();

            setModalLogoutAberto(false);
            navigate("/login");

        } catch (error) {
            console.error("Não foi possível fazer o logout:", error);
        }
    };

    // ABRIR PERFIL
    function abrirPerfil(usuario) {
        setNomeBusca("");
        setUsuarios([]);

        navigate(`/perfil/${usuario.id}`);
    }

    // ABRIR NOTIFICAÇÕES
    async function abrirNotificacoes() {
        try {
            const resposta = await carregarNotificacoes();

            if (resposta.data.length > 0) {
                const ultimaNotificacao = resposta.data[0];

                localStorage.setItem(
                    "ultimaNotificacaoVisualizada",
                    String(ultimaNotificacao.id)
                );
            }

            setTemNotificacaoNova(false);
            setModalNotificacoesAberto(true);

        } catch (error) {
            console.error("Erro ao abrir notificações:", error);
            setModalNotificacoesAberto(true);
        }
    }

    return (
        <header className="header">

            {/* MENU */}
            <button
                type="button"
                className="botao-menu"
                onClick={() => setModalMenuAberto(true)}
                aria-label="Abrir menu"
            >
                <FiMenu />
            </button>

            {/* LOGO */}
            <h1
                className="logo-yrplace"
                onClick={() => navigate("/home")}
            >
                YrPlace
            </h1>

            {/* INÍCIO */}
            <button
                type="button"
                className="boton-elegante"
                onClick={() => navigate("/home")}
            >
                Início
            </button>

            {/* PESQUISA DE USUÁRIOS */}
            <div className="pesquisa-usuarios">

                <FiSearch className="icone-pesquisa" />

                <input
                    type="text"
                    placeholder="Pesquisar usuários..."
                    value={nomeBusca}
                    onChange={(e) => setNomeBusca(e.target.value)}
                />

                {nomeBusca.trim() !== "" && (
                    <div className="resultados-usuarios">

                        {carregando ? (
                            <p>Pesquisando...</p>

                        ) : usuarios.length > 0 ? (

                            usuarios.map((usuario) => (
                                <button
                                    type="button"
                                    className="resultado-usuario"
                                    key={usuario.id}
                                    onClick={() => abrirPerfil(usuario)}
                                >
                                    <img
                                        src={usuario.foto_url}
                                        alt=""
                                    />

                                    <span>{usuario.nome}</span>
                                </button>
                            ))

                        ) : (
                            <p>Nenhum usuário encontrado.</p>
                        )}

                    </div>
                )}

            </div>

            {/* SINO DE NOTIFICAÇÕES */}
            <div className="container-notificacoes">

                <button
                    type="button"
                    className="botao-notificacoes"
                    onClick={abrirNotificacoes}
                    aria-label="Abrir notificações"
                >
                    <FaBell />

                    {temNotificacaoNova && (
                        <span className="bolinha-notificacao"></span>
                    )}
                </button>

            </div>

            {/* MODAL DO MENU */}
            {modalMenuAberto && (
                <ModalMenu
                    onClose={() => setModalMenuAberto(false)}
                    onTrocarSenha={() => {
                        setModalMenuAberto(false);
                        navigate("/confirmar-senha");
                    }}
                    onSair={() => {
                        setModalMenuAberto(false);
                        setModalLogoutAberto(true);
                    }}
                />
            )}

            {/* MODAL DE NOTIFICAÇÕES */}
            {modalNotificacoesAberto && (
                <ModalNotificacoes
                    onClose={() => setModalNotificacoesAberto(false)}
                />
            )}

            {/* MODAL DE LOGOUT */}
            {modalLogoutAberto && (
                <FazerLogoutModal
                    onClose={() => setModalLogoutAberto(false)}
                    onConfirmar={fazendoLogout}
                />
            )}

        </header>
    );
}

export default Header;