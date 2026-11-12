import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

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

import Header from "./components/Header/header";

function App() {
    // Recupera o tema salvo ou detecta a preferência do sistema.
    const [tema, setTema] = useState(() => {
        const temaSalvo = localStorage.getItem("tema");

        if (temaSalvo) {
            return temaSalvo;
        }

        const prefereEscuro = window.matchMedia(
            "(prefers-color-scheme: dark)"
        ).matches;

        return prefereEscuro ? "dark" : "light";
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
            </Routes>
        </BrowserRouter>
    );
}

export default App;