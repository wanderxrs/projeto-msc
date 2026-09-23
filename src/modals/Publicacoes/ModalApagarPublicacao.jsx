import { apagarPublicacao } from "../../api";
import "./ModalApagarPublicacao.css";

import { IoClose } from "react-icons/io5";

function ModalApagarPublicacao({
    publicacao,
    onClose,
    onPublicacaoApagada
}) {

    async function handleApagar() {

        try {

            await apagarPublicacao(publicacao.id);

            // Atualiza o feed da Home
            onPublicacaoApagada();

            // Fecha o modal
            onClose();

        } catch (erro) {

            console.error(erro);

        }

    }


    return (

        <div className="modal-overlay">

            <div className="modal-apagar">

                <div className="modal-header">

                    <h2>Apagar publicação</h2>

                    <button type="button" onClick={onClose} className="btn-fechar" style={{height : "0", background : "none"}}> <IoClose size={35} /> </button>

                </div>


                <div className="modal-conteudo">

                    <p>
                        Tem certeza que deseja apagar esta publicação?
                    </p>

                    <p>
                        Essa ação não poderá ser desfeita.
                    </p>

                </div>


                <div className="modal-acoes">

                    <button
                        type="button"
                        onClick={onClose}
                    >
                        Cancelar
                    </button>


                    <button className="btn-apagar-publicacao" type="button" onClick={handleApagar}> Apagar </button>

                </div>

            </div>

        </div>

    );

}


export default ModalApagarPublicacao;