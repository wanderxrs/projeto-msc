
import { useState } from "react";
import ModalPublicacao from "../modals/modalPublicacao";

function Home() {

    const [modalAberto, setModalAberto] = useState(false);

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
                />
            )}

        </div>
    );
}

export default Home;