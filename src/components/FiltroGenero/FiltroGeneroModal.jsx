import { createPortal } from "react-dom";
import "./FiltroGeneroModal.css";

function FiltroGeneroModal({ aberto, fechar, aplicarFiltro }) {

    if (!aberto) {
        return null;
    }

    const generos = [
        "Pop",
        "Rock",
        "Rap",
        "Eletrônica",
        "R&B",
        "Country",
        "Reggae",
        "Latin",
        "Jazz",
        "Clássica",
        "Metal",
        "Folk",
        "Blues",
        "Funk",
        "Kpop",
        "Outro"
    ];

    return createPortal(
        <div className="modal-filtro-overlay" onClick={fechar}>
            <div
                className="modal-filtro" onClick={(e) => e.stopPropagation()}>
                    
                <h2>Filtrar por gênero</h2>

                <div className="lista-generos">
                    {generos.map((genero) => (
                        <button
                            type="button"
                            className="botao-genero"
                            key={genero}
                            onClick={() => aplicarFiltro(genero)}
                        >
                            {genero}
                        </button>
                    ))}
                </div>

                <button type="button" className="botao-cancelar" onClick={fechar}>
                    Cancelar
                </button>
            </div>
        </div>,
        document.body
    );
}

export default FiltroGeneroModal;