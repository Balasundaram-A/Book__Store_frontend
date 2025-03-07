import { useState, useEffect } from "react";
import { Button, Stack, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";  // ✅ Import useNavigate
import BooksPage from "../pages/BooksPage";
import PurchaseHistory from "../pages/PurchaseHistory";
import UsersPage from "../pages/UsersPage";
import AdminPurchaseHistory from "../pages/AdminPurchaseHistory";
import { getrole } from "../services/userService";

const Home = () => {
  const [currentPage, setCurrentPage] = useState("books");
  const [role, setRole] = useState(null);
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();  // ✅ Initialize useNavigate()

  useEffect(() => {
    if (!userId) {
      navigate("/", { replace: true }); // ✅ Redirect to login if not authenticated
  }

if (!userId) {
  return null; // Prevents rendering before redirection
}

    if (userId) {
      getrole(userId)
        .then((userRole) => {
          setRole(userRole); // ✅ Ensure role is stored correctly
        })
        .catch((error) => console.error("Error fetching role:", error));
    }
  }, [userId,navigate]); // ✅ Add userId as dependency

  // ✅ Logout Function
  const handleLogout = () => {
    localStorage.clear(); // ✅ Clears all stored data

    navigate("/", { replace: true }); // ✅ Redirect to login and remove from history

    setTimeout(() => {
        window.location.reload(); // ✅ Ensures state reset after navigation
    }, 100);
};


  return (
    <Container>
      <Stack direction="row" spacing={2} sx={{ mt: 2, display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <Button variant="contained" onClick={() => setCurrentPage("books")}>
          Books
        </Button>

        {role === "ADMIN" && (
          <Button variant="contained" onClick={() => setCurrentPage("users")}>
            Users
          </Button>
        )}

        <Button variant="contained" onClick={() => setCurrentPage("purchases")}>
          My History
        </Button>

        {role === "ADMIN" && (
          <Button variant="contained" onClick={() => setCurrentPage("allpurchases")}>
            History
          </Button>
        )}

        {/* ✅ Fixed Logout Button */}
        <Button color="error" variant="contained" onClick={handleLogout}>
          Logout
        </Button>
      </Stack>

      <div style={{ marginTop: "20px" }}>
        {currentPage === "books" && <BooksPage />}
        {currentPage === "users" && role === "ADMIN" && <UsersPage />}
        {currentPage === "purchases" && <PurchaseHistory />}
        {currentPage === "allpurchases" && role === "ADMIN" && <AdminPurchaseHistory />}
      </div>
    </Container>
  );
};

export default Home;
