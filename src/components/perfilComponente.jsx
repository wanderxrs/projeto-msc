import { useEffect, useState } from "react";

import { carregarPerfil } from "../api";

import "./perfilComponente.css";


function PerfilComponente() {

    const [usuario, setUsuario] = useState(null);


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

                <img
                    src={usuario.foto_url}
                    alt="Foto do perfil"
                    className="foto-perfil"
                />


                <h3>{usuario.nome}</h3>


                <div className="botoesDiv">

                    <button className="botao-perfil">
                        <strong>Editar</strong>
                    </button>


                    <button className="botao-perfil">
                        <strong>Participando</strong>
                    </button>

                </div>

            </div>

        </div>

    );

}


export default PerfilComponente;