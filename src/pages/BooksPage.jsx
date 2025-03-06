import { Container, Button, Box } from "@mui/material";
import BookList from "../components/BookList";
import { addBook, getBooks } from "../services/bookService";
import { getrole } from "../services/userService";
import Swal from "sweetalert2";
import { useState, useEffect } from "react";

const BooksPage = () => {
  const [books, setBooks] = useState([]);
  const [role, setRole] = useState(null);


  useEffect(() => {
    refreshBooks();
    fetchUserRole();
  }, []);

  const refreshBooks = () => {
    getBooks()
      .then((response) => setBooks(response.data))
      .catch((error) => console.error("Error fetching books:", error));
  };

  const fetchUserRole = () => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      getrole(userId)
        .then((userRole) => setRole(userRole))
        .catch((error) => console.error("Error fetching role:", error));
    }
  };

  const handleAddBook = () => {
    Swal.fire({
      title: "Add New Book",
      html: `
        <input id="swal-title" class="swal2-input" placeholder="Title">
        <input id="swal-author" class="swal2-input" placeholder="Author">
        <input id="swal-copies" class="swal2-input" type="number" placeholder="Copies Available">
      `,
      showCancelButton: true,
      confirmButtonText: "Add Book",
      preConfirm: () => {
        return {
          title: document.getElementById("swal-title").value.trim(),
          author: document.getElementById("swal-author").value.trim(),
          copiesAvailable: parseInt(document.getElementById("swal-copies").value, 10) || 0,
        };
      },
    }).then((result) => {
      if (result.isConfirmed) {
        addBook(result.value)
          .then(() => {
            Swal.fire("Success!", "Book added successfully!", "success");
            refreshBooks();
          })
          .catch(() => Swal.fire("Error", "Failed to add book!", "error"));
      }
    });
  };

  return (
    <Container>
      <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        {role === "ADMIN" && (
          <Button variant="contained" color="success" onClick={handleAddBook}>
            Add Book
          </Button>
        )}
      </Box>

      <BookList books={books} refreshBooks={refreshBooks} />
    </Container>
  );
};

export default BooksPage;
