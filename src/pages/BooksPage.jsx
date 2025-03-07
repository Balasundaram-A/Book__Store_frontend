import { useState, useEffect } from "react";
import { Container, Button, Box} from "@mui/material";
import BookList from "../components/BookList";
import { addBook, getBooks } from "../services/bookService";
import { getrole } from "../services/userService";
import Swal from "sweetalert2";

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
        <input id="swal-pdf" type="file" accept=".pdf" class="swal2-file">
      `,
      showCancelButton: true,
      confirmButtonText: "Add Book",
      preConfirm: () => {
        const title = document.getElementById("swal-title").value.trim();
        const author = document.getElementById("swal-author").value.trim();
        const pdfFile = document.getElementById("swal-pdf").files[0];

        if (!title || !author || !pdfFile) {
          Swal.showValidationMessage("All fields are required!");
          return false;
        }

        return { title, author, pdfFile };
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const formData = new FormData();
        formData.append("book", new Blob([JSON.stringify({ 
          title: result.value.title, 
          author: result.value.author 
        })], { type: "application/json" }));
        formData.append("doc", result.value.pdfFile);

        addBook(formData)
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
