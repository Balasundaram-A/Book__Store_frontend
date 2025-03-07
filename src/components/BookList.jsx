import { useEffect, useState } from "react";
import { CircularProgress, Typography, TextField, Container ,Box} from "@mui/material";
import { getBooks, searchBooks } from "../services/bookService";
import Grid2 from "@mui/material/Grid";
import BookCard from "./BookCard";

const BookList = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchBooks = () => {
        getBooks()
            .then((response) => {
                setBooks(response.data);
                console.log("Books Updated:", response.data); // ✅ Debugging log
                setLoading(false);
            })
            .catch(() => setLoading(false));
    };

    useEffect(() => {
        fetchBooks();
    }, []);

    const handleSearch = (event) => {
        const value = event.target.value;
        setSearchTerm(value);

        if (value.trim() === "") {
            fetchBooks(); // If search is empty, reset to all books
        } else {
            searchBooks(value)
                .then((response) => {
                    setBooks(response);
                })
                .catch(() => console.error("Error searching books"));
        }
    };

    return (
        <Container>
            {/* Search Bar */}
            <Box display="flex" marginTop="2px">
    <TextField
        label="Search Books"
        variant="outlined"
        size="small"
        sx={{ width: "250px", mb: 2 }} // Adjust width as needed
        value={searchTerm}
        onChange={handleSearch}
    />
</Box>

            {/* Loading Indicator */}
            {loading ? (
                <CircularProgress />
            ) : books.length === 0 ? (
                <Typography variant="h6">No books available.</Typography>
            ) : (
                <Grid2 container spacing={4}>
                    {books.map((book) => (
                        <Grid2 item xs={12} sm={6} md={4} key={book.id}>
                            <BookCard book={book} refreshBooks={fetchBooks} />
                        </Grid2>
                    ))}
                </Grid2>
            )}
        </Container>
    );
};

export default BookList;
