import { useState } from "react";
import { FiMenu } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import "./header.css";
import { fazerLogout } from "../api";

function Header() {

    const [menuAberto, setMenuAberto] = useState(false);
    const navigate = useNavigate();

    const fazendoLogout = async () => {
        try {
            await fazerLogout()
            navigate("/login")
        } catch (error) {
            console.error("Não foi possivel fazer o logout:", error)
        }
    }



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
                    <button onClick={() => navigate("/confirmar-senha")}>Trocar Senha</button>
                    <button onClick={fazendoLogout}>Sair</button>
                </div>
            )}

        </header>
    );
}

export default Header;