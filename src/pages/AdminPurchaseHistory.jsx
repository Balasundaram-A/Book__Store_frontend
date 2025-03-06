import { useEffect, useState } from "react";
import { getAllPurchaseHistory } from "../services/bookService";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from "@mui/material";

const AdminPurchaseHistory = () => {
    const [history, setHistory] = useState([]);

    useEffect(() => {
        getAllPurchaseHistory()
            .then((data) => setHistory(data))
            .catch(() => console.error("Failed to fetch history"));
    }, []);

    return (
        <TableContainer component={Paper}>
            <Typography variant="h5" sx={{ m: 2 }}>
                All Users Purchase History (Admin View)
            </Typography>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>User ID</TableCell>
                        <TableCell>User Name</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Book Title</TableCell>
                        <TableCell>Author</TableCell>
                        <TableCell>Purchase Date</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {history.length > 0 ? (
                        history.map((entry, index) => (
                            <TableRow key={index}>
                                <TableCell>{entry.userId}</TableCell>
                                <TableCell>{entry.userName}</TableCell>
                                <TableCell>{entry.userEmail}</TableCell>
                                <TableCell>{entry.bookTitle}</TableCell>
                                <TableCell>{entry.bookAuthor}</TableCell>
                                <TableCell>{new Date(entry.purchaseDate).toLocaleString()}</TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={6}>No purchase history found</TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default AdminPurchaseHistory;

