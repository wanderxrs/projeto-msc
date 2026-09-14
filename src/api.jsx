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

export default api