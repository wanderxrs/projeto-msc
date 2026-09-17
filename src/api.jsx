import axios from "axios"


const api = axios.create({
    baseURL: "http://localhost:5000",
    withCredentials: true
})

export const fazerRegistro = (dadosUsuario) => {
    return api.post(`/registro`, dadosUsuario)
}

export const fazerLogin = (dadosUsuario) => {
    return api.post(`/logar`, dadosUsuario)
}

export const fazerLogout = () => {
    return api.post(`/logout`)
}

export const confirmacao = (email) => {
    return api.post(`/enviar-codigo`, {email})
}
export const confirmarCodigo = (codigo) => {
    return api.post(`/conf-codigo`, { codigo })
}

export const mudarSenha = (novasenha) => {
    return api.post(`/mudar-senha`, {novasenha})
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



export default api