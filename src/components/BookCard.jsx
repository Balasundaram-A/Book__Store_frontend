import PropTypes from "prop-types";
import { Card, CardContent, Typography, Button, Stack } from "@mui/material";
import Swal from "sweetalert2";
import { deleteBook, purchaseBook, updateBook, getBookDocument } from "../services/bookService";
import { useState, useEffect } from "react";
import { getrole, hasUserPurchasedBook } from "../services/userService";

const BookCard = ({ book, refreshBooks }) => {
    const [role, setRole] = useState(null);
    const [isPurchased, setIsPurchased] = useState(false);

    useEffect(() => {
        const userId = localStorage.getItem("userId");
        if (userId) {
            getrole(userId)
                .then(setRole)
                .catch(() => setRole(null));
    
            hasUserPurchasedBook(userId, book.id)
                .then(setIsPurchased) // ✅ Directly sets the boolean value
                .catch(() => setIsPurchased(false)); // ✅ Default to false in case of errors
        }
    }, [book.id]); // ✅ Removed isPurchased to avoid infinite loops

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
                        setIsPurchased(true); // ✅ Update state after purchase
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
                <input id="swal-author" class="swal2-input" value="${book.author}" placeholder="Author">`,
            showCancelButton: true,
            confirmButtonText: "Save",
            preConfirm: () => {
                return {
                    title: document.getElementById("swal-title").value.trim(),
                    author: document.getElementById("swal-author").value.trim(),
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

    const handleView = async () => {
        try {
            const response = await getBookDocument(book.id);
            const blob = new Blob([response.data], { type: response.headers["content-type"] });
            const url = URL.createObjectURL(blob);
            
            // ✅ Open in a new tab
            window.open(url, "_blank");
        } catch (error) {
            console.error("Error fetching document:", error);
            Swal.fire("Error", "Failed to load document!", "error");
        }
    };
    

    return (
        <Card sx={{ maxWidth: 345, boxShadow: 3, p: 2 }}>
            <CardContent>
                <Typography variant="h6">{book.title || "Untitled"}</Typography>
                <Typography color="textSecondary">Author: {book.author || "Unknown"}</Typography>
                
                <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                    {isPurchased ? (
                        <Button variant="contained" color="success" onClick={handleView}>
                            view
                        </Button>
                    ) : (
                        <Button variant="contained" color="primary" onClick={handlePurchase}>
                            Purchase
                        </Button>
                    )}

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
    }).isRequired,
    refreshBooks: PropTypes.func.isRequired,
};

export default BookCard;
