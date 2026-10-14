import "./filtroGeneroModal.css";

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

    return (
        <div className="modal-filtro-overlay">
            <div className="modal-filtro">

                <h2>Filtrar por gênero</h2>

                <div className="lista-generos">
                    {generos.map((genero) => (
                        <button
                            className="botao-genero" key={genero}
                            onClick={() => aplicarFiltro(genero)}
                        >
                            {genero.charAt(0).toUpperCase() + genero.slice(1)}
                        </button>
                    ))}
                </div>

                <button className="botao-cancelar"onClick={fechar}>Cancelar</button>

            </div>
        </div>
    );
}

export default FiltroGeneroModal;