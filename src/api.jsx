import axios from "axios"


const api = axios.create({
    baseURL: "http://localhost:5000",
    withCredentials: true
})


    // AUTH


export const fazerRegistro = (dadosUsuario) => {
    return api.post(`/registro`, dadosUsuario)
}

export const fazerLogin = (dadosUsuario) => {
    return api.post(`/logar`, dadosUsuario)
}

export const fazerLogout = () => {
    return api.post(`/logout`)
}


    // COMUNIDADES


export const criarComunidade = (dadosComunidade) => {
    return api.post(`/comunidade`, dadosComunidade)
}

export const atualizarComunidade = (comunidade_id, dadosComunidade) => {
    return api.put(`/comunidade/${comunidade_id}`, dadosComunidade)
}

export const deletarComunidade = (comunidade_id) => {
    return api.delete(`/comunidade/${comunidade_id}`)
}


    // BUSCA DE COMUNIDADES


export const buscarComunidade = (comunidade_id) => {
    return api.get(`/buscarComunidade/${comunidade_id}`)
}

export const buscarComunidadesDisponiveisParaEntrar = () => {
    return api.get(`/buscarComunidadesDisponiveis`) // não manda o id do usuario pq ja vem no credentials
}

export const buscarComunidadeUsuario = () => {
    return api.get(`/buscarComunidadeUsuario`)
}


    // FILTRO DE COMUNIDADES POR GENERO


export const filtroGeneroComunidade = (genero) => {
    return api.get(`/filtroGeneroComunidade/${genero}`)
}


    // ENTRAR E SAIR DE COMUNIDADES


export const entrarComunidade = (comunidade_id) => {
    return api.post(`/entrarComunidade/${comunidade_id}`)
}

export const sairComunidade = (comunidade_id) => {
    return api.post(`/sairComunidade/${comunidade_id}`)
}


// trocar senha


export const confirmacao = (email) => {
    return api.post(`/enviar-codigo`, {email})
}
export const confirmarCodigo = (codigo) => {
    return api.post(`/conf-codigo`, { codigo })
}

export const mudarSenha = (novasenha) => {
    return api.post(`/mudar-senha`, {novasenha})
}


// trocar senha no perfil


export const confirmarSenha = (senhaAtual) => {
    return api.post(`/confirmar-senha`, {senha: senhaAtual})
}


export const trocarSenhaPerfil = (novasenha) => {
    return api.post(`mudar-senha-perfil`, { novasenha })
}


//partes reservadas a publicações############################

export const fazerPublicacao = (dadosPublicacao) => {
    return api.post("/publicacao", dadosPublicacao)
}

export const carregarPublicacoes = () => {
    return api.get("/publicacoes")
}

export const curtirPublicacao = (publicacao_id) => {
    return api.post(`/curtir/${publicacao_id}`)
}

export async function apagarPublicacao(id) {
    return api.delete(`/apagar-publicacao/${id}`);
}



//comentarios ################################################

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

//comunidades##################################################

export const buscarComunidadesDisponiveis = () => {
    return api.get("/buscarComunidadesDisponiveis");
};

//coisas do perfil##############################################

export function carregarPerfil() {
    return api.get("/perfil");
}



export default api