import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/auth/login";
import Registro from "./pages/auth/registro";
import Recuperacao from "./pages/auth/recuperacao";
import ConfirmarCodigo from "./pages/auth/confirmarCodigo";
import MudarSenha from "./pages/auth/mudarSenha";
import Home from "./pages/home";
import Comentarios from "./pages/comentarios/comentarios";
import Header from "./components/header";

function App() {
    return (
        <BrowserRouter>
            <Header />

            <Routes>
                <Route path="/" element={<Navigate to="/login" />} />
                <Route path="/login" element={<Login />} />
                <Route path="/registro" element={<Registro />} />
                <Route path="/Recuperacao" element={<Recuperacao />} />
                <Route path="/confirma-codigo" element={<ConfirmarCodigo />} />
                <Route path="/mudar-senha" element={<MudarSenha />} />
                <Route path="/home" element={<Home />} />

                <Route path="/comentarios/:publicacao_id" element={<Comentarios />}/>
                
            </Routes>
        </BrowserRouter>
    );
}

export default App;