
import { useNavigate } from "react-router-dom";
import { IoMenu } from "react-icons/io5";
import {
    PiHeartStraight,
    PiHeartStraightFill
} from "react-icons/pi";
import { VscCommentCompact } from "react-icons/vsc";

import "./Publicacao.css";

function Publicacao({
    publicacao,
    curtido = false,
    onCurtir,
    onExcluir,
    podeExcluir
}) {
    const navigate = useNavigate();

    // Identifica se a mídia da publicação é um vídeo.
    function ehVideo() {
        if (publicacao.tipo_midia) {
            return publicacao.tipo_midia.toLowerCase() === "video";
        }

        const url = publicacao.imagem_url || "";

        return (
            url.includes("/video/upload/") ||
            /\.(mp4|webm|mov|m4v)(\?|$)/i.test(url)
        );
    }

    // Verifica se o usuário pode excluir a publicação.
    const mostrarExclusao = podeExcluir ?? publicacao.eh_dono;

    // Abre o perfil do autor da publicação.
    function abrirPerfil() {
        navigate(`/perfil/${publicacao.usuario_id}`);
    }

    return (
        <article className="publicacao">

            {/* Cabeçalho */}
            <div className="cabecalho-publicacao">

                <img
                    src={publicacao.foto_url}
                    alt="Foto do usuário"
                    className="foto-usuario"
                    onClick={abrirPerfil}
                    style={{ cursor: "pointer" }}
                />

                <div className="informacoes-usuario">

                    <h3
                        onClick={abrirPerfil}
                        style={{ cursor: "pointer" }}
                    >
                        {publicacao.nome_usuario}
                    </h3>

                    <div className="data-publicacao">
                        {publicacao.data_criacao &&
                            new Date(
                                publicacao.data_criacao
                            ).toLocaleDateString("pt-BR")}
                    </div>

                </div>

                {/* Opções de exclusão */}
                {mostrarExclusao && (
                    <button
                        type="button"
                        className="hamburguer"
                        onClick={() => onExcluir?.(publicacao)}
                        aria-label="Opções da publicação"
                        style={{
                            background: "none",
                            padding: 0,
                            height: "auto",
                            marginLeft: "auto",
                            border: "none"
                        }}
                    >
                        <IoMenu
                            size={25}
                            style={{ cursor: "pointer" }}
                        />
                    </button>
                )}

            </div>

            {/* Legenda */}
            {publicacao.legenda && (
                <p>{publicacao.legenda}</p>
            )}

            {/* Comunidade */}
            <strong
                className="Nome-comunidade-feed"
                onClick={() =>
                    navigate(`/comunidade/${publicacao.comunidade_id}`)
                }
                style={{ cursor: "pointer" }}
            >
                {publicacao.nome_comunidade}
            </strong>

            {/* Imagem ou vídeo */}
            {publicacao.imagem_url && (
                <div className="midia-container">

                    {ehVideo() ? (
                        <video
                            className="midia-publicacao"
                            src={publicacao.imagem_url}
                            controls
                            preload="metadata"
                            playsInline
                        >
                            Seu navegador não suporta a reprodução de vídeos.
                        </video>
                    ) : (
                        <img
                            className="midia-publicacao"
                            src={publicacao.imagem_url}
                            alt="Imagem da publicação"
                            loading="lazy"
                        />
                    )}

                </div>
            )}

            {/* Curtidas e comentários */}
            <div className="area-curtida">

                {/* Botão de curtir */}
                <button
                    type="button"
                    className="botao-curtida"
                    onClick={() => onCurtir?.(publicacao.id)}
                    aria-label={
                        curtido
                            ? "Descurtir publicação"
                            : "Curtir publicação"
                    }
                    style={{ background: "none" }}
                >
                    <span
                        className={
                            curtido
                                ? "coracao curtido"
                                : "coracao"
                        }
                    >
                        {curtido ? (
                            <PiHeartStraightFill fontSize={30} />
                        ) : (
                            <PiHeartStraight fontSize={30} />
                        )}
                    </span>
                </button>

                {/* Quantidade de curtidas */}
                <span className="quantidade-curtidas">
                    {Number(publicacao.total_curtidas) || 0}
                </span>

                {/* Botão de comentários */}
                <button
                    type="button"
                    className="botao-comentar"
                    onClick={() =>
                        navigate(`/comentarios/${publicacao.id}`)
                    }
                    aria-label="Ver comentários"
                >
                    <VscCommentCompact fontSize={26} />
                </button>

                {/* Quantidade de comentários */}
                {Number(publicacao.total_comentarios) || 0}

            </div>

        </article>
    );
}

export default Publicacao;
