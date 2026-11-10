import "./MenuHeaderModal.css";

function ModalMenu({ onClose, onTrocarSenha, onSair }) {
    return (
        <div className="overlay-menu" onClick={onClose}>
            <div
                className="modal-menu"
                onClick={(e) => e.stopPropagation()}
            >
                <h2>Menu</h2>

                <button
                    type="button"
                    className="botao-trocar-senha"
                    onClick={onTrocarSenha}
                >
                    Trocar Senha
                </button>

                <button
                    type="button"
                    className="botao-sair-menu"
                    onClick={onSair}
                >
                    Sair
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