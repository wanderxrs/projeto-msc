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

    // Identifica vídeos mesmo quando a API não informa o tipo.
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

    const mostrarExclusao =
        podeExcluir ?? publicacao.eh_dono;

    return (
        <article className="publicacao">

            {/* Cabeçalho */}
            <div className="cabecalho-publicacao">
                <img
                    src={publicacao.foto_url}
                    alt="Foto do usuário"
                    className="foto-usuario"
                />

                <div className="informacoes-usuario">
                    <h3
                        onClick={() =>
                            navigate(`/perfil/${publicacao.usuario_id}`)
                        }
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
                            color: "white",
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
                    navigate(
                        `/comunidade/${publicacao.comunidade_id}`
                    )
                }
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
                            <PiHeartStraightFill
                                color="white"
                                fontSize={30}
                            />
                        ) : (
                            <PiHeartStraight
                                color="white"
                                fontSize={30}
                            />
                        )}
                    </span>
                </button>

                <span className="quantidade-curtidas">
                    {Number(publicacao.total_curtidas) || 0}
                </span>

                <button
                    type="button"
                    className="botao-comentar"
                    onClick={() =>
                        navigate(`/comentarios/${publicacao.id}`)
                    }
                    aria-label="Ver comentários"
                >
                    <VscCommentCompact
                        fontSize={26}
                        color="white"
                    />
                </button>

                {Number(publicacao.total_comentarios) || 0}
            </div>

        </article>
    );
}

export default Publicacao;