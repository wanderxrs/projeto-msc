import { createPortal } from "react-dom";

import { IoSunnyOutline, IoKeyOutline, IoLogOutOutline, IoChevronForwardOutline } from "react-icons/io5";
import { RiMoonClearLine } from "react-icons/ri";

import "./MenuHeaderModal.css";

function ModalMenu({
    onClose,
    onTrocarSenha,
    onSair,
    tema,
    onAlternarTema
}) {
    return createPortal(
        <div className="overlay-menu" onClick={onClose}>
            <div
                className="modal-menu"
                onClick={(e) => e.stopPropagation()}
            >
                {/* CABEÇALHO */}
                <div className="menu-cabecalho">
                    <h2>Menu</h2>
                    <span>Configurações da conta</span>
                </div>

                {/* OPÇÕES */}
                <div className="menu-opcoes">

                    {/* ALTERNAR TEMA */}
                    <button
                        type="button"
                        className="item-menu botao-tema-menu"
                        onClick={onAlternarTema}
                    >
                        <div className="menu-item-icone">
                            {tema === "dark"
                                ? <IoSunnyOutline size={21} />
                                : <RiMoonClearLine size={21} />
                            }
                        </div>

                        <div className="menu-item-texto">
                            <span className="menu-item-titulo">
                                {tema === "dark"
                                    ? "Modo claro"
                                    : "Modo escuro"
                                }
                            </span>

                            <span className="menu-item-descricao">
                                {tema === "dark"
                                    ? "Mudar para o tema branco"
                                    : "Mudar para o tema escuro"
                                }
                            </span>
                        </div>

                        <IoChevronForwardOutline className="menu-item-seta" size={18} />
                    </button>

                    {/* TROCAR SENHA */}
                    <button
                        type="button"
                        className="item-menu botao-trocar-senha"
                        onClick={onTrocarSenha}
                    >
                        <div className="menu-item-icone">
                            <IoKeyOutline size={21} />
                        </div>

                        <div className="menu-item-texto">
                            <span className="menu-item-titulo">
                                Trocar senha
                            </span>

                            <span className="menu-item-descricao">
                                Atualize sua senha de acesso
                            </span>
                        </div>

                        <IoChevronForwardOutline className="menu-item-seta" size={18} />
                    </button>

                </div>

                {/* LOGOUT */}
                <div className="menu-rodape">
                    <button
                        type="button"
                        className="item-menu botao-logout-menu"
                        onClick={onSair}
                    >
                        <div className="menu-item-icone icone-logout">
                            <IoLogOutOutline size={21} />
                        </div>

                        <div className="menu-item-texto">
                            <span className="menu-item-titulo">
                                Logout
                            </span>

                            <span className="menu-item-descricao">
                                Sair da sua conta
                            </span>
                        </div>

                        <IoChevronForwardOutline className="menu-item-seta" size={18} />
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}

export default ModalMenu;