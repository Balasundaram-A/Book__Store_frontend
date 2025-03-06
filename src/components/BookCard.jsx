import PropTypes from "prop-types";
import { Card, CardContent, Typography, Button, Stack } from "@mui/material";
import Swal from "sweetalert2";
import { deleteBook, purchaseBook, updateBook } from "../services/bookService";
import { useState, useEffect } from "react";
import { getrole } from "../services/userService";

const BookCard = ({ book, refreshBooks }) => {
    // ✅ Move useState outside of any condition
    const [role, setRole] = useState(null);

    // ✅ useEffect must also be at the top level
    useEffect(() => {
        const userId = localStorage.getItem("userId");
        if (userId) {
            getrole(userId)
                .then(setRole)
                .catch(() => setRole(null));
        } else {
            setRole(null);
        }
    }, []); // Runs only on mount

    // ✅ If book is null, return early (AFTER hooks)
    if (!book) return null;

    const handleDelete = () => {
        Swal.fire({
            title: "Are you sure?",
            text: "This action cannot be undone!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!",
        }).then((result) => {
            if (result.isConfirmed) {
                deleteBook(book.id)
                    .then(() => {
                        Swal.fire("Deleted!", "The book has been deleted.", "success");
                        refreshBooks();
                    })
                    .catch(() => Swal.fire("Error", "Something went wrong!", "error"));
            }
        });
    };

    const handlePurchase = () => {
        Swal.fire({
            title: "Confirm Purchase",
            text: "Are you sure you want to purchase this book?",
            icon: "info",
            showCancelButton: true,
            confirmButtonText: "Yes, Purchase!",
        }).then((purchaseResult) => {
            if (purchaseResult.isConfirmed) {
                const userId = localStorage.getItem("userId");
                if (!userId) {
                    Swal.fire("Error", "User not logged in!", "error");
                    return;
                }
    
                purchaseBook(userId, book.id)
                    .then(() => {
                        Swal.fire("Success!", "Book purchased successfully!", "success");
                        refreshBooks();
                    })
                    .catch((error) => {
                        console.error("Purchase Error:", error);
                        Swal.fire("Error", "Purchase failed!", "error");
                    });
            }
        });
    };

    const handleEdit = () => {
        Swal.fire({
            title: "Edit Book",
            html: `
                <input id="swal-title" class="swal2-input" value="${book.title}" placeholder="Title">
                <input id="swal-author" class="swal2-input" value="${book.author}" placeholder="Author">
                <input id="swal-copies" class="swal2-input" type="number" value="${book.copiesAvailable}" placeholder="Copies Available">
            `,
            showCancelButton: true,
            confirmButtonText: "Save",
            preConfirm: () => {
                return {
                    title: document.getElementById("swal-title").value.trim(),
                    author: document.getElementById("swal-author").value.trim(),
                    copiesAvailable: parseInt(document.getElementById("swal-copies").value, 10) || 0,
                };
            },
        }).then((result) => {
            if (result.isConfirmed) {
                updateBook(book.id, { ...book, ...result.value })
                    .then(() => {
                        Swal.fire("Updated!", "Book details updated successfully!", "success");
                        refreshBooks();
                    })
                    .catch(() => Swal.fire("Error", "Update failed!", "error"));
            }
        });
    };

    return (
        <Card sx={{ maxWidth: 345, boxShadow: 3, p: 2 }}>
            <CardContent>
                <Typography variant="h6">{book.title || "Untitled"}</Typography>
                <Typography color="textSecondary">Author: {book.author || "Unknown"}</Typography>
                <Typography color="textSecondary">Copies Available: {book.copiesAvailable ?? "N/A"}</Typography>
                <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                    <Button variant="contained" color="primary" onClick={handlePurchase} disabled={book.copiesAvailable === 0}>
                        Purchase
                    </Button>

                    {/* Show Edit/Delete buttons only if role is ADMIN */}
                    {role === "ADMIN" && (
                        <>
                            <Button variant="contained" color="warning" onClick={handleEdit}>
                                Edit
                            </Button>
                            <Button variant="contained" color="error" onClick={handleDelete}>
                                Delete
                            </Button>
                        </>
                    )}
                </Stack>
            </CardContent>
        </Card>
    );
};

BookCard.propTypes = {
    book: PropTypes.shape({
        id: PropTypes.number.isRequired,
        title: PropTypes.string.isRequired,
        author: PropTypes.string.isRequired,
        copiesAvailable: PropTypes.number,
        users: PropTypes.shape({
            id: PropTypes.number,
            name: PropTypes.string,
            email: PropTypes.string,
            role: PropTypes.string,
        }),
    }).isRequired,
    refreshBooks: PropTypes.func.isRequired,
};

export default BookCard;
