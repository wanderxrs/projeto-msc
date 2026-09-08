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

export default api