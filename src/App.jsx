import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Container, Typography } from "@mui/material";
import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./components/Home";


function App() {
  return (
    <Router>
      <Container>
      <Typography
  variant="h3"  // Increased size
  sx={{
    textAlign: "center",  // Center align
    fontWeight: "bold",  // Make it bold
    color: "#2E3B55",  // Dark blue shade
    textShadow: "2px 2px 4px rgba(0,0,0,0.2)",  // Subtle shadow
    p: 2,  // Padding
    borderBottom: "3px solid #3f51b5",  // Stylish underline
    borderRadius: "5px",
    display: "inline-block",
    width: "100%", // Full width
    marginBottom:"10px",
  
  }}
>
  📚 Book Store
</Typography>
        <Routes>
          <Route path="/" element={<Login />} /> 
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<Home />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
