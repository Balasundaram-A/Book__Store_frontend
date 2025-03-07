import { useEffect, useState } from "react";
import { getAllPurchaseHistory } from "../services/bookService";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Pagination, TextField, Box } from "@mui/material";

const AdminPurchaseHistory = () => {
    const [history, setHistory] = useState([]);
    const [filteredHistory, setFilteredHistory] = useState([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        getAllPurchaseHistory(page, 5).then((data) => {
            setHistory(data.content);
            setFilteredHistory(data.content); // Default to full list
            setTotalPages(data.totalPages);
        }).catch(() => console.error("Failed to fetch history"));
    }, [page]);

    // 🔍 Handle search filtering
    useEffect(() => {
        const lowercasedQuery = searchQuery.toLowerCase();
        const filtered = history.filter(
            (entry) =>
                entry.bookTitle.toLowerCase().includes(lowercasedQuery) ||
                entry.bookAuthor.toLowerCase().includes(lowercasedQuery) ||
                entry.userName.toLowerCase().includes(lowercasedQuery)
        );
        setFilteredHistory(filtered);
    }, [searchQuery, history]);

    return (
        <TableContainer component={Paper} sx={{ p: 2 }}>
            <Typography variant="h5" sx={{ mb: 2, textAlign: "center" }}>
                All Users Purchase History
            </Typography>

            {/* Search Bar */}
            <Box sx={{ display: "flex", justifyContent: "flex-start", mb: 2, px: 2 }}>
    <TextField
        label="🔍 Search"
        variant="outlined"
        sx={{ 
            width: 300, 
            backgroundColor: "#f9f9f9", 
            borderRadius: "8px", 
            "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#b0bec5" },
                "&:hover fieldset": { borderColor: "#1976d2" },
                "&.Mui-focused fieldset": { borderColor: "#1565c0" }
            }
        }}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
    />
</Box>


            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell> </TableCell>
                        <TableCell>User Name</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Book</TableCell>
                        <TableCell>Author</TableCell>
                        <TableCell>Purchased Date</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {filteredHistory.length > 0 ? (
                        filteredHistory.map((entry, index) => (
                            <TableRow key={index}>
                                <TableCell>{page * 5 + index + 1}</TableCell>
                                <TableCell>{entry.userName}</TableCell>
                                <TableCell>{entry.userEmail}</TableCell>
                                <TableCell>{entry.bookTitle}</TableCell>
                                <TableCell>{entry.bookAuthor}</TableCell>
                                <TableCell>{new Date(entry.purchaseDate).toLocaleString()}</TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={6} align="center">
                                No purchase history found
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            {/* Pagination Component */}
            <Pagination 
                count={totalPages} 
                page={page + 1} 
                onChange={(event, value) => setPage(value - 1)}
                variant="outlined" 
                shape="rounded"
                size="large"
                color="primary"
                showFirstButton
                showLastButton
                sx={{ 
                    mt: 2, 
                    display: "flex", 
                    justifyContent: "center",
                    "& .MuiPaginationItem-root": { 
                        fontSize: "1.1rem", 
                        fontWeight: "bold",
                        color: "black",
                        borderRadius: "10px",
                        transition: "all 0.3s ease-in-out",
                        "&:hover": { 
                            backgroundColor: "#f5f5f5",
                            transform: "scale(1.1)"
                        }
                    },
                    "& .Mui-selected": {
                        backgroundColor: "#1976d2", 
                        color: "white",
                        fontWeight: "bold",
                        "&:hover": { 
                            backgroundColor: "#1565c0",
                            transform: "scale(1.1)"
                        }
                    }
                }} 
            />
        </TableContainer>
    );
};

export default AdminPurchaseHistory;
