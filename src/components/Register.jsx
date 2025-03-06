import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, TextField, Button, Typography, Stack } from "@mui/material";

const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();

        const response = await fetch("http://localhost:8080/users/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name, email, password }),
        });

        if (response.ok) {
            alert("Registration Successful! Please log in.");
            navigate("/"); // Redirect to login page
        } else {
            alert("Registration Failed. Try again.");
        }
    };

    return (
        <Container maxWidth="sm">
            <Typography variant="h4" sx={{
                textAlign: "center",  // Center align
                fontWeight: "bold",  // Make it bold
                color: "#2E3B55",
                marginBottom:"5px"

            }}>
                Register
            </Typography>
            <form onSubmit={handleRegister}>
                <Stack spacing={2}>
                    <TextField
                        label="Name"
                        fullWidth
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                    <TextField
                        label="Email"
                        type="email"
                        fullWidth
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <TextField
                        label="Password"
                        type="password"
                        fullWidth
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <Button variant="contained" type="submit">
                        Register
                    </Button>
                </Stack>
            </form>
            <Typography variant="body2" sx={{
                textAlign: "center",
                fontWeight: "bold",
                color: "#2E3B55"
            }}>
                Already have an account?{" "}
                <Button variant="text" onClick={() => navigate("/")}>
                    Login
                </Button>
            </Typography>
        </Container>
    );
};

export default Register;
