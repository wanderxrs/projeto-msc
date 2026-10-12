import { useState } from "react";
import { fazerLogin } from "../../api";
import { Container, Box, Paper, Button, Typography, TextField } from '@mui/material';
import { useNavigate, Link } from "react-router-dom";

import "./login.css";

function Login() {
    const navigate = useNavigate();
    const [mensagem, setMensagem] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');

    const onSignIn = async (e) => {
        e.preventDefault();

        const data = {
            email,
            senha
        };

        try {
            const result = await fazerLogin(data);
            setMensagem(result.data.mensagem);

            navigate("/home");

        } catch (e) {
            const erro = e.response?.data?.erro || "Não foi possível conectar à API";
            setMensagem(erro);
        }
    };

    return (
        <>
            <Container maxWidth="xs" className="login-container">
                <Paper elevation={3} className="login-card">

                    <Typography component="h1" variant="h5">Login</Typography>

                    {mensagem && (
                        <Typography className="login-mensagem">
                            {mensagem}
                        </Typography>
                    )}

                    <Box className="login-form-container">
                        <form id="submit-login" onSubmit={onSignIn}>

                            <TextField
                                margin="normal" fullWidth label="Email" type="email" 
                                value={email} onChange={(e) => setEmail(e.target.value)} required
                            />

                            <TextField
                                margin="normal" fullWidth label="Senha" type="password"
                                value={senha} onChange={(e) => setSenha(e.target.value)} required
                            />

                        </form>

                        <Button
                            type="submit"
                            form="submit-login"
                            variant="contained"
                            fullWidth
                            className="login-entrar"
                        >
                            Entrar
                        </Button>

                        <Button
                            component={Link}
                            to="/registro"
                            fullWidth
                            className="login-secundario"
                        >
                            Criar conta
                        </Button>

                        <Button
                            component={Link}
                            to="/Recuperacao"
                            fullWidth
                            className="login-recuperacao"
                        >
                            Esqueci minha senha
                        </Button>

                    </Box>
                </Paper>
            </Container>
        </>
    );
}

export default Login;