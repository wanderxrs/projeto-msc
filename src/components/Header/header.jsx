import { useEffect, useState } from "react";
import { FiMenu, FiSearch } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import "./header.css";

import {
    fazerLogout,
    buscarUsuariosPorNome
} from "../../api";

function Header() {
    const [menuAberto, setMenuAberto] = useState(false);
    const [nomeBusca, setNomeBusca] = useState("");
    const [usuarios, setUsuarios] = useState([]);
    const [carregando, setCarregando] = useState(false);

    const navigate = useNavigate();

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

    const fazendoLogout = async () => {
        try {
            await fazerLogout();
            navigate("/login");
        } catch (error) {
            console.error("Não foi possível fazer o logout:", error);
        }
    };

    function abrirPerfil(usuario) {
        setNomeBusca("");
        setUsuarios([]);
        setMenuAberto(false);

        navigate(`/perfil/${usuario.id}`);
    }

    return (
        <header className="header">

            <button
                type="button"
                className="botao-menu"
                onClick={() => setMenuAberto(!menuAberto)}
                aria-label="Abrir menu"
            >
                <FiMenu />
            </button>

            {menuAberto && (
                <div className="menu">
                    <button
                        type="button"
                        onClick={() => {
                            setMenuAberto(false);
                            navigate("/confirmar-senha");
                        }}
                    >
                        Trocar Senha
                    </button>
                </div>
            )}

            <h1
                className="logo-yrplace"
                onClick={() => navigate("/home")}
            >
                YrPlace
            </h1>

            <button
                type="button"
                className="boton-elegante"
                onClick={() => navigate("/home")}
            >
                Início
            </button>

            <button
                type="button"
                className="boton-elegante"
                onClick={fazendoLogout}
            >
                Sair
            </button>

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

        </header>
    );
}

export default Header;