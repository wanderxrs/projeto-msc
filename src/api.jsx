import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true
});


// AUTH ##################################################

export const fazerRegistro = (dadosUsuario) => {
    return api.post("/registro", dadosUsuario);
};

export const fazerLogin = (dadosUsuario) => {
    return api.post("/logar", dadosUsuario);
};

export const fazerLogout = () => {
    return api.post("/logout");
};


// COMUNIDADES ##########################################

export const criarComunidade = (dadosComunidade) => {
    return api.post("/comunidade", dadosComunidade);
};

export const atualizarComunidade = (comunidade_id, dadosComunidade) => {
    return api.put(`/comunidade/${comunidade_id}`, dadosComunidade);
};

export const deletarComunidade = (comunidade_id) => {
    return api.delete(`/comunidade/${comunidade_id}`);
};


// BUSCA DE COMUNIDADES #################################

export const buscarComunidade = (comunidade_id) => {
    return api.get(`/buscarComunidade/${comunidade_id}`);
};

export const buscarComunidadesDisponiveisParaEntrar = () => {
    return api.get("/buscarComunidadesDisponiveis");
};

export const buscarComunidadeUsuario = () => {
    return api.get("/buscarComunidadeUsuario");
};


// FILTRO DE COMUNIDADES POR GÊNERO #####################

export const filtroGeneroComunidade = (genero) => {
    return api.get(`/filtroGeneroComunidade/${genero}`);
};


// ENTRAR E SAIR DE COMUNIDADES #########################

export const entrarComunidade = (comunidade_id) => {
    return api.post(`/entrarComunidade/${comunidade_id}`);
};

export const sairComunidade = (comunidade_id) => {
    return api.post(`/sairComunidade/${comunidade_id}`);
};


// GERENCIAR PARTICIPANTES DA COMUNIDADE ################

// Listar participantes

export const listarParticipantes = (comunidade_id) => {
    return api.get(`/comunidade/${comunidade_id}/participantes`);
};

// Listar usuários bloqueados

export const listarUsuariosBloqueados = (comunidade_id) => {
    return api.get(`/comunidade/${comunidade_id}/bloqueados`);
};

// Bloquear participante

export const bloquearUsuario = (comunidade_id, usuario_id) => {
    return api.post(`/comunidade/${comunidade_id}/bloquear/${usuario_id}`);
};

// Desbloquear participante

export const desbloquearUsuario = (comunidade_id, usuario_id) => {
    return api.delete(`/comunidade/${comunidade_id}/desbloquear/${usuario_id}`);
};


// TROCAR SENHA ########################################

// Enviar código de recuperação para o e-mail

export const confirmacao = (email) => {
    return api.post("/enviar-codigo", { email });
};

// Confirmar código de recuperação

export const confirmarCodigo = (codigo) => {
    return api.post("/confirmar-codigo", { codigo });
};

// Alterar senha após recuperação

export const mudarSenha = (novasenha) => {
    return api.post("/mudar-senha", { novasenha });
};


// TROCAR SENHA NO PERFIL ###############################

// Confirmar senha atual

export const confirmarSenha = (senhaAtual) => {
    return api.post("/confirmar-senha", {
        senha: senhaAtual
    });
};

// Alterar senha do perfil

export const trocarSenhaPerfil = (novasenha) => {
    return api.post("/mudar-senha-perfil", {
        novasenha
    });
};


// PUBLICAÇÕES ##########################################

export const fazerPublicacao = (dadosPublicacao) => {
    return api.post("/publicacao", dadosPublicacao);
};

export const carregarPublicacoes = () => {
    return api.get("/publicacoes");
};

export const curtirPublicacao = (publicacao_id) => {
    return api.post(`/curtir/${publicacao_id}`);
};

export async function apagarPublicacao(id) {
    return api.delete(`/apagar-publicacao/${id}`);
}


// COMENTÁRIOS #########################################

export const carregarComentarios = (publicacao_id) => {
    return api.get(`/comentarios/${publicacao_id}`);
};

export const criarComentario = (dadosComentarios) => {
    return api.post("/comentario", dadosComentarios);
};

export const editarComentario = (id, dadosComentario) => {
    return api.put(`/comentario/${id}`, dadosComentario);
};

export const deletarComentario = (id) => {
    return api.delete(`/comentario/${id}`);
};


// COMUNIDADES ##########################################

export const buscarComunidadesDisponiveis = () => {
    return api.get("/buscarComunidadesDisponiveis");
};


// PERFIL ################################################

export function carregarPerfil() {
    return api.get("/perfil");
}

export function carregarPerfilUsuario(id) {
    return api.get(`/perfil/${id}`);
}

export function atualizarPerfil(dados) {
    return api.post("/perfil", dados);
}


// PUBLICAÇÕES DE UMA COMUNIDADE ########################

export function buscarPublicacoesDaComunidade(id) {
    return api.get(`/publicacoes/comunidade/${id}`);
}


// PESQUISAR COMUNIDADES PELO NOME ######################

export function buscarComunidadesPeloNome(nome) {
    return api.get("/buscarComunidades", {
        params: { nome }
    });
}


// ÁLBUNS ################################################

// Pesquisar álbuns na Deezer

export const buscarAlbunsDeezer = (query) => {
    return api.get("/albuns/buscar", {
        params: { query }
    });
};

// Salvar álbum na biblioteca

export const salvarAlbum = (dadosAlbum) => {
    return api.post("/albuns/salvar", dadosAlbum);
};

// Carregar álbuns salvos pelo usuário

export const carregarAlbunsSalvos = () => {
    return api.get("/albuns/salvos");
};

// Remover álbum da biblioteca

export const removerAlbumSalvo = (album_id) => {
    return api.delete(`/albuns/salvos/${album_id}`);
};


// AVALIAÇÕES ###########################################

// Criar avaliação

export const salvarAvaliacao = (dadosAvaliacao) => {
    return api.post("/avaliacoes", dadosAvaliacao);
};

// Editar nota de uma avaliação existente

export const editarAvaliacao = (album_id, nota) => {
    return api.put(`/avaliacoes/${album_id}`, {
        nota
    });
};

// Carregar avaliações do usuário

export const carregarAvaliacoes = () => {
    return api.get("/avaliacoes");
};


// PESQUISAR PERFIS ####################################

export function buscarUsuariosPorNome(nome) {
    return api.get("/buscarUsuarios", {
        params: { nome }
    });
}


// COMPOSIÇÕES MUSICAIS #################################

export const criarComposicao = (dados) => {
    return api.post("/composicoes", dados);
};

export const carregarComposicoes = () => {
    return api.get("/composicoes");
};

export const buscarComposicao = (id) => {
    return api.get(`/composicoes/${id}`);
};

export const atualizarComposicao = (id, dados) => {
    return api.put(`/composicoes/${id}`, dados);
};

export const excluirComposicao = (id) => {
    return api.delete(`/composicoes/${id}`);
};

export const listarLetrasPublicas = () => {
    return api.get("/composicoes/publicas");
};


// FEED ###############################################

export function carregarPublicacoesSeguindo() {
    return api.get("/publicacoes/seguindo");
}

export const buscarComunidadesDoPerfil = (usuarioId) => {
    return api.get(`/comunidadesUsuario/${usuarioId}`);
};


// NOTIFICAÇÕES ########################################

export const carregarNotificacoes = () => {
    return api.get("/notificacoes");
};

// COMUNIDADES QUE O USUARIO É DONO

export const comunidadesUsuarioDono = () => {
    return api.get("/minhasComunidades");
};

export default api;