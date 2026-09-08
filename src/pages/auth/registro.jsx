import { useState } from "react";
import { fazerRegistro  } from "../../api";
import { Container, Box, Paper, Button, Typography, TextField } from "@mui/material";
import { useNavigate, Link } from "react-router-dom";

function Registro() {
    const navigate = useNavigate();
    const [mensagem, setMensagem] = useState("");
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");

    const onSignUp = async (e) => {
        e.preventDefault();

        const data = {
            nome,
            email,
            senha
        };

        try {
            const result = await fazerRegistro(data);

            setMensagem(result.data.message);

            navigate("/login");

        } catch (e) {
            const error = e.response?.data?.error || "Não foi possível conectar à API"
            setMensagem(error)
        }
    };

    return (
        <Container maxWidth="xs">
            <Paper elevation={3} sx={{ p: 4, mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography component="h1" variant="h5">Registro</Typography>
                {mensagem && (<Typography component="h4">{mensagem}</Typography>)}

                <Box sx={{ width: '100%', mt: 1 }}>
                    <form id="submit-registro" onSubmit={onSignUp}>
                        <TextField margin="normal" fullWidth label="nome" type='text' value={nome} onChange={(e) => setNome(e.target.value)} />
                        <TextField margin="normal" fullWidth label="email" type='email' value={email} onChange={(e) => setEmail(e.target.value)} />
                        <TextField margin="normal" fullWidth label="senha" type='password' value={senha} onChange={(e) => setSenha(e.target.value)} />
                    </form>

                    <Button type="submit" form="submit-registro" variant="contained">Criar Conta</Button>
                    <Button component={Link} to={"/login"} variant="contained">Entrar</Button>
                </Box>
            </Paper>
        </Container>
    );
}

export default Registro;