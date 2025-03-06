import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, TextField, Button, Typography, Stack } from "@mui/material";

const Login = () => {
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        const response = await fetch("http://localhost:8080/users/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name, password }),
        });

        if (response.ok) {
            const userData = await response.json(); // Get user details from response

            // ✅ Store user ID & username in localStorage
            localStorage.setItem("userId", userData.id);
            localStorage.setItem("userName", userData.name);

            alert("Login Successful");
            navigate("/Home"); // Redirect to home page
        } else {
            alert("Invalid Credentials");
        }
    };

    return (
        <Container maxWidth="sm">
            <Typography variant="h4" sx={{
                textAlign: "center",
                fontWeight: "bold",
                color: "#2E3B55",
                marginBottom: "5px"
            }}>
                Login
            </Typography>
            <form onSubmit={handleLogin}>
                <Stack spacing={2}>
                    <TextField
                        label="Username"
                        type="text"
                        fullWidth
                        value={name}
                        onChange={(e) => setName(e.target.value)}
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
                        Login
                    </Button>
                </Stack>
            </form>
            <Typography variant="body2" sx={{ mt: 2 }}>
                Dont have an account?{" "}
                <Button variant="text" onClick={() => navigate("/register")}>
                    Register
                </Button>
            </Typography>
        </Container>
    );
};

export default Login;
