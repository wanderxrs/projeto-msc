import { useState } from "react";
import { FiMenu } from "react-icons/fi";
import "./header.css";

function Header() {

    const [menuAberto, setMenuAberto] = useState(false);

    return (
        <header className="header">

            <button
                className="botao-menu"
                onClick={() => setMenuAberto(!menuAberto)}
            >
                <FiMenu />
            </button>

            <h1>YrPlace</h1>

            {menuAberto && (
                <div className="menu">
                    <button>Editar Perfil</button>
                    <button>Trocar Senha</button>
                    <button>Sair</button>
                </div>
            )}

        </header>
    );
}

export default Header;