import { useState, useEffect } from "react";
import { Button, Stack, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";
import BooksPage from "../pages/BooksPage";
import PurchaseHistory from "../pages/PurchaseHistory";
import UsersPage from "../pages/UsersPage";
import AdminPurchaseHistory from "../pages/AdminPurchaseHistory";
import { getrole } from "../services/userService";
import Swal from "sweetalert2";

const Home = () => {
  const [currentPage, setCurrentPage] = useState("books");
  const [role, setRole] = useState(null);
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate(); 

  useEffect(() => {
    if (!userId) {
      navigate("/", { replace: true }); 
  }

    if (userId) {
      getrole(userId)
        .then((userRole) => {
          setRole(userRole); 
        })
        .catch((error) => console.error("Error fetching role:", error));
    }
  }, [userId,navigate]);

  const handleLogout = () => {
    Swal.fire({
        title: "Are you sure?",
        text: "You will be logged out!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, logout!"
    }).then((result) => {
        if (result.isConfirmed) {
            localStorage.clear(); // ✅ Clears all stored data
            navigate("/", { replace: true }); // ✅ Redirect to login
        }
    });
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
