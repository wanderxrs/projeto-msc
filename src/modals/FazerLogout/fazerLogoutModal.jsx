import "../../modals/FazerLogout/FazerLogoutModal.css";

function FazerLogoutModal({ onClose, onConfirmar }) {
    return (
        <div className="logout-overlay">
            <div className="logout-modal">
                <h2>Tem certeza?</h2>
                <p>Deseja realmente sair?</p>

                <div className="logout-botoes">
                    <button type="button" className="logout-cancelar" onClick={onClose}>
                        Cancelar
                    </button>

                    <button type="button" className="logout-confirmar" onClick={onConfirmar}>
                        Sair
                    </button>

                </div>
            </div>
        </div>
    );
}

export default FazerLogoutModal;