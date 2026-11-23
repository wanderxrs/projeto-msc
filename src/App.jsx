
import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";

import Login from "./pages/auth/login";
import Registro from "./pages/auth/registro";
import Recuperacao from "./pages/auth/recuperacao";
import ConfirmarCodigo from "./pages/auth/confirmarCodigo";
import MudarSenha from "./pages/auth/mudarSenha";
import MudarSenhaPerfil from "./pages/auth/mudarSenhaPerfil";
import ConfirmarSenha from "./pages/auth/confirmarSenha";

import Home from "./pages/home/home";
import Comentarios from "./pages/comentarios/comentarios";
import ComunidadeTela from "./pages/comunidadeTela/ComunidadeTela";
import Perfil from "./pages/perfil/perfil";
import AlbunsAvaliados from "./pages/albunsAvaliados/albunsAvaliados";
import LetrasPublicas from "./pages/letras/LetrasPublicas";
import ParticipandoComunidade from "./pages/ParticipandoComunidade/ParticipandoComunidade";

import PoliticaPrivacidade from "./pages/politicaPrivacidade/PoliticaPrivacidade";

import Header from "./components/Header/header";

// Faz a página voltar ao topo ao mudar de rota.
function ScrollToTop() {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return null;
}

function App() {
    // Recupera o tema salvo ou utiliza o modo escuro como padrão.
    const [tema, setTema] = useState(() => {
        const temaSalvo = localStorage.getItem("tema");

        return temaSalvo || "dark";
    });

    // Aplica e salva o tema selecionado.
    useEffect(() => {
        document.documentElement.setAttribute("data-theme", tema);
        localStorage.setItem("tema", tema);
    }, [tema]);

    // Alterna entre modo escuro e claro.
    function alternarTema() {
        setTema((temaAtual) =>
            temaAtual === "dark" ? "light" : "dark"
        );
    }

    return (
        <BrowserRouter>
            <ScrollToTop />

            <Routes>
                <Route
                    path="/"
                    element={<Navigate to="/login" />}
                />

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/registro"
                    element={<Registro />}
                />

                <Route
                    path="/Recuperacao"
                    element={<Recuperacao />}
                />

                <Route
                    path="/confirma-codigo"
                    element={<ConfirmarCodigo />}
                />

                <Route
                    path="/mudar-senha"
                    element={<MudarSenha />}
                />

                <Route
                    path="/mudar-senha-perfil"
                    element={<MudarSenhaPerfil />}
                />

                <Route
                    path="/confirmar-senha"
                    element={<ConfirmarSenha />}
                />

                <Route
                    path="/comunidade/:id"
                    element={
                        <>
                            <Header
                                tema={tema}
                                onAlternarTema={alternarTema}
                            />
                            <ComunidadeTela />
                        </>
                    }
                />

                <Route
                    path="/home"
                    element={
                        <>
                            <Header
                                tema={tema}
                                onAlternarTema={alternarTema}
                            />
                            <Home />
                        </>
                    }
                />

                <Route
                    path="/comentarios/:publicacao_id"
                    element={
                        <>
                            <Header
                                tema={tema}
                                onAlternarTema={alternarTema}
                            />
                            <Comentarios />
                        </>
                    }
                />

                <Route
                    path="/perfil/:id"
                    element={
                        <>
                            <Header
                                tema={tema}
                                onAlternarTema={alternarTema}
                            />
                            <Perfil />
                        </>
                    }
                />

                <Route
                    path="/albuns-avaliados"
                    element={
                        <>
                            <Header
                                tema={tema}
                                onAlternarTema={alternarTema}
                            />
                            <AlbunsAvaliados />
                        </>
                    }
                />

                <Route
                    path="/participandoComunidade/:id"
                    element={
                        <>
                            <Header
                                tema={tema}
                                onAlternarTema={alternarTema}
                            />
                            <ParticipandoComunidade />
                        </>
                    }
                />

                <Route
                    path="/letras-publicas"
                    element={
                        <>
                            <Header
                                tema={tema}
                                onAlternarTema={alternarTema}
                            />
                            <LetrasPublicas />
                        </>
                    }
                />

                {/* POLÍTICA DE PRIVACIDADE */}
                <Route
                    path="/politica-de-privacidade"
                    element={<PoliticaPrivacidade />}
                />

            </Routes>
        </BrowserRouter>
    );
}

export default App;
