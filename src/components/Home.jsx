import { useState, useEffect } from "react";
import { Button, Stack, Container } from "@mui/material";
import BooksPage from "../pages/BooksPage";
import PurchaseHistory from "../pages/PurchaseHistory";
import UsersPage from "../pages/UsersPage";
import AdminPurchaseHistory from "../pages/AdminPurchaseHistory";
import { getrole } from "../services/userService";

const Home = () => {
  const [currentPage, setCurrentPage] = useState("books");
  const [role, setRole] = useState(null);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    console.log("User ID:", userId);

    if (userId) {
      getrole(userId)
        .then((userRole) => {
          console.log("API Response:", userRole);  
          setRole(userRole); // Now this should be a string like "USER" or "ADMIN"
        })
        .catch((error) => console.error("Error fetching role:", error));
    }
  });

  useEffect(() => {
    console.log("User Role (Updated):", role);
  }, [role]);

  return (
    <Container>
      <Stack direction="row" spacing={2} sx={{ mt: 2, display: "flex", justifyContent: "flex-end",marginBottom:"2px" }}>
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
