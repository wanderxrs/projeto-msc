import { useState } from "react";
import { fazerRegistro } from "../../api";
import { Container, Box, Paper, Button, Typography, TextField } from "@mui/material";
import { useNavigate, Link } from "react-router-dom";
import "./registro.css";

function Registro() {
    const navigate = useNavigate();
    const [mensagem, setMensagem] = useState("");
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");

    const onSignUp = async (e) => {
        e.preventDefault();

        const data = { nome, email, senha };

        try {
            const result = await fazerRegistro(data);
            setMensagem(result.data.mensagem);
            navigate("/login");
        } catch (e) {
            const erro = e.response?.data?.erro || "Não foi possível conectar à API";
            setMensagem(erro);
        }
    };

    return (
        <Container maxWidth="xs" className="registro-container">
            <Paper elevation={3} className="registro-card">
                <Typography component="h1" variant="h5">
                    Criar conta
                </Typography>

                {mensagem && (
                    <Typography className="registro-mensagem">
                        {mensagem}
                    </Typography>
                )}

                <Box className="registro-form-container">
                    <form id="submit-registro" onSubmit={onSignUp}>
                        <TextField
                            margin="normal"
                            fullWidth
                            label="Nome"
                            type="text"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                            required
                        />

                        <TextField
                            margin="normal"
                            fullWidth
                            label="Email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />

                        <TextField
                            margin="normal"
                            fullWidth
                            label="Senha"
                            type="password"
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
                            required
                        />
                    </form>

                    <Button
                        type="submit"
                        form="submit-registro"
                        variant="contained"
                        fullWidth
                        className="registro-criar"
                    >
                        Criar conta
                    </Button>

                    <Button
                        component={Link}
                        to="/login"
                        fullWidth
                        className="registro-entrar"
                    >
                        Já tenho uma conta
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
}

export default Registro;