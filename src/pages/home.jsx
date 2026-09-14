
import { useEffect, useState } from "react";
import ModalPublicacao from "../modals/modalPublicacao";
import { carregarPublicacoes } from "../api";
import "./home.css";


function Home() {

    const [modalAberto, setModalAberto] = useState(false);

    const [publicacoes, setPublicacoes] = useState([]);

    const [carregando, setCarregando] = useState(true);

    const [erro, setErro] = useState("");

    async function buscarPublicacoes() {

        try {

            const resposta = await carregarPublicacoes();

            setPublicacoes(resposta.data);

        } catch (erro) {

            console.error(erro);

            setErro("Erro ao carregar as publicações.");

        } finally {

            setCarregando(false);

        }
    }

    useEffect(() => {
        buscarPublicacoes();
    }, []);

    return (

        <div>

            <button
                onClick={() => setModalAberto(true)}
            >
                Fazer publicação
            </button>

            {modalAberto && (
                <ModalPublicacao
                    onClose={() => setModalAberto(false)}
                    onPublicacaoCriada={buscarPublicacoes}
                />
            )}

            <h1>Feed inicial</h1>

            {carregando && (
                <p>Carregando publicações...</p>
            )}

            {erro && (
                <p>{erro}</p>
            )}

            {!carregando && publicacoes.length === 0 && (
                <p>Nenhuma publicação encontrada.</p>
            )}



            <div className="feed">

                {publicacoes.map((publicacao) => (

                    <div key={publicacao.id}className="publicacao">

                        <h3>{publicacao.nome_usuario}</h3>

                        <p> {publicacao.legenda} </p>

                        <img src={publicacao.imagem_url} alt="Imagem da publicação"/>

                        

                    </div>

                ))}

            </div>

        </div>

    );
}

export default Home;