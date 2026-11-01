
import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";

import {
    buscarComunidade,
    buscarPublicacoesDaComunidade
} from "../../api";

import InformacoesComunidade from "../../components/cabecalhoComunidade/InformacoesComunidade";
import PublicacaoComunidade from "../../components/publicacaoComunidade/PublicacaoComunidade";
import AcessoBloqueado from "./AcessoBloqueado";

import "./comunidadeTela.css";

function ComunidadeTela() {
    const { id } = useParams();

    const [comunidade, setComunidade] = useState(null);
    const [publicacoes, setPublicacoes] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [acessoBloqueado, setAcessoBloqueado] = useState(false);

    const carregarComunidade = useCallback(async () => {
        try {
            const resposta = await buscarComunidade(id);

            setComunidade(resposta.data);
            setAcessoBloqueado(false);
        } catch (erro) {
            if (erro.response?.status === 403) {
                setAcessoBloqueado(true);
            } else {
                console.error("Erro ao buscar comunidade:", erro);
            }
        } finally {
            setCarregando(false);
        }
    }, [id]);

    const carregarPublicacoes = useCallback(async () => {
        try {
            const resposta = await buscarPublicacoesDaComunidade(id);
            setPublicacoes(resposta.data);
        } catch (erro) {
            if (erro.response?.status === 403) {
                setAcessoBloqueado(true);
            } else {
                console.error("Erro ao buscar publicações:", erro);
            }
        }
    }, [id]);

    const verificarAcesso = useCallback(async () => {
        try {
            await buscarComunidade(id);
        } catch (erro) {
            if (erro.response?.status === 403) {
                setAcessoBloqueado(true);
            }
        }
    }, [id]);

    useEffect(() => {
        let cancelado = false;

        const iniciar = async () => {
            await carregarComunidade();

            if (!cancelado) {
                await carregarPublicacoes();
            }
        };

        iniciar();

        const intervalo = setInterval(() => {
            if (!cancelado) {
                verificarAcesso();
            }
        }, 5000);

        return () => {
            cancelado = true;
            clearInterval(intervalo);
        };
    }, [carregarComunidade, carregarPublicacoes, verificarAcesso]);

    if (acessoBloqueado) {
        return <AcessoBloqueado />;
    }

    if (carregando) {
        return <p>Carregando comunidade...</p>;
    }

    if (!comunidade) {
        return <p>Não foi possível carregar a comunidade.</p>;
    }

    return (
        <div className="comunidade-tela">
            <InformacoesComunidade />

            <div className="comunidade-publicacoes">
                {publicacoes.length > 0 ? (
                    publicacoes.map((publicacao) => (
                        <PublicacaoComunidade
                            key={publicacao.id}
                            publicacao={publicacao}
                        />
                    ))
                ) : (
                    <p>Nenhuma publicação encontrada.</p>
                )}
            </div>
        </div>
    );
}

export default ComunidadeTela;
