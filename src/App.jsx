import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/auth/login";
import Registro from "./pages/auth/registro";
import Recuperacao from "./pages/auth/recuperacao";
import ConfirmarCodigo from "./pages/auth/confirmarCodigo";
import MudarSenha from "./pages/auth/mudarSenha";
import MudarSenhaPerfil from "./pages/auth/mudarSenhaPerfil";
import Home from "./pages/home";
import Comentarios from "./pages/comentarios/comentarios";
import Header from "./components/header";
import ConfirmarSenha from "./pages/auth/confirmarSenha";
import Perfil from "./pages/perfil/perfil";

function App() {
    return (
        <BrowserRouter>

            <Routes>
                <Route path="/" element={<Navigate to="/login" />} />
                <Route path="/login" element={<Login />} />
                <Route path="/registro" element={<Registro />} />
                <Route path="/Recuperacao" element={<Recuperacao />} />
                <Route path="/confirma-codigo" element={<ConfirmarCodigo />} />
                <Route path="/mudar-senha" element={<MudarSenha />} />
                <Route path="/mudar-senha-perfil" element={<MudarSenhaPerfil />} />
                <Route path="/confirmar-senha" element={<ConfirmarSenha />} />
                <Route path="/home" element={<>
                    <Header />
                    <Home />
                    </>} />

                <Route path="/comentarios/:publicacao_id" element={<Comentarios />}/>
                <Route path="/perfil/:id" element={<Perfil />}/>
                
            </Routes>
        </BrowserRouter>
    );
}

export default App;