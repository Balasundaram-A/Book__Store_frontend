import { useEffect, useState } from "react";
import { getPurchaseHistory } from "../services/bookService";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from "@mui/material";

const PurchaseHistory = () => {
    const [history, setHistory] = useState([]);
    const userId = localStorage.getItem("userId");

    useEffect(() => {
        if (userId) {
            getPurchaseHistory(userId)
                .then((data) => setHistory(data))
                .catch(() => console.error("Failed to fetch history"));
        }
    }, [userId]);

    return (
        <TableContainer component={Paper}>
            <Typography variant="h5" sx={{ m: 2 }}>
                Purchase History
            </Typography>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Book Title</TableCell>
                        <TableCell>Author</TableCell>
                        <TableCell>Purchase Date</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {history.length > 0 ? (
                        history.map((purchase) => (
                            <TableRow key={purchase.id}>
                                <TableCell>{purchase.book.title}</TableCell>
                                <TableCell>{purchase.book.author}</TableCell>
                                <TableCell>{new Date(purchase.purchaseDate).toLocaleString()}</TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={3}>No purchases found</TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default PurchaseHistory;
