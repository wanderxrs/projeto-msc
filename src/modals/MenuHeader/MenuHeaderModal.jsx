import "./MenuHeaderModal.css";

function ModalMenu({ onClose, onTrocarSenha }) {
    return (
        <div className="overlay-menu" onClick={onClose}>
            <div
                className="modal-menu"
                onClick={(e) => e.stopPropagation()}
            >
                <h2>Menu</h2>

                <button
                    type="button"
                    onClick={onTrocarSenha}
                >
                    Trocar Senha
                </button>

                <button
                    type="button"
                    className="botao-fechar-menu"
                    onClick={onClose}
                >
                    Fechar
                </button>
            </div>
        </div>
    );
}

export default ModalMenu;