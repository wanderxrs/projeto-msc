import { useState } from "react";
import { fazerLogin  } from "../../api";
import { Container, Box, Paper, Button, Typography, TextField } from '@mui/material';
import { useNavigate, Link } from "react-router-dom";

function Login() {
    const navigate = useNavigate()
    const [mensagem, setMensagem] = useState('')
    const [email, setEmail] = useState('')
    const [senha, setSenha] = useState('')

    const onSignIn = async (e) => {
        e.preventDefault()

        const data = {
            email,
            senha
        }

        try {
            const result = await fazerLogin (data)
            setMensagem(result.data.message)

            navigate("/home")

        } catch (e) {
            const error = e.response?.data?.error || "Não foi possível conectar à API"
            setMensagem(error)
        }
    }

    return (
        <>
        
        <Container maxWidth="xs">
            <Paper elevation={3} sx={{ p: 4, mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography component="h1" variant="h5">Login</Typography>
                {mensagem && (<Typography component="h4">{mensagem}</Typography>)}

                <Box sx={{ width: '100%', mt: 1 }}>
                    <form id="submit-login" onSubmit={onSignIn}>
                        <TextField margin="normal" fullWidth label="email" type='email' value={email} onChange={(e) => setEmail(e.target.value)} />
                        <TextField margin="normal" fullWidth label="senha" type='password' value={senha} onChange={(e) => setSenha(e.target.value)} />
                    </form>

                    <Button type="submit" form="submit-login" variant="contained">Entrar</Button>
                    <Button component={Link} to={"/registro"} variant="contained">Criar conta</Button>
                    <Button component={Link} to={"/Recuperacao"} variant="contained">Esqueci minha senha</Button>
                </Box>
            </Paper>
        </Container>

        </>
    )

}

export default Login