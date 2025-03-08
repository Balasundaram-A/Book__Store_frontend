import { useEffect, useState, useCallback } from "react";
import { getAllPurchaseHistory } from "../services/bookService";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Pagination, TextField, Box, Button } from "@mui/material";

const AdminPurchaseHistory = () => {
    const [history, setHistory] = useState([]);
    const [filteredHistory, setFilteredHistory] = useState([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [searchQuery, setSearchQuery] = useState("");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");

    // ✅ Wrap fetchHistory in useCallback to prevent infinite loops
    const fetchHistory = useCallback(() => {
        getAllPurchaseHistory(page, 5)
            .then((data) => {
                setHistory(data.content);
                setTotalPages(data.totalPages);
            })
            .catch(() => console.error("Failed to fetch history"));
    }, [page]);

    // ✅ Fetch data when page changes
    useEffect(() => {
        fetchHistory();
    }, [fetchHistory]);

    // ✅ Filter search results & date range
    useEffect(() => {
        const lowercasedQuery = searchQuery.toLowerCase();
        const filtered = history.filter((entry) => {
            const matchesSearch =
                (entry?.bookTitle?.toLowerCase() || "").includes(lowercasedQuery) ||
                (entry?.bookAuthor?.toLowerCase() || "").includes(lowercasedQuery) ||
                (entry?.userName?.toLowerCase() || "").includes(lowercasedQuery);

            const purchaseDate = new Date(entry.purchaseDate);
            const from = fromDate ? new Date(fromDate) : null;
            const to = toDate ? new Date(toDate) : null;

            const matchesDate =
                (!from || purchaseDate >= from) &&
                (!to || purchaseDate <= to);

            return matchesSearch && matchesDate;
        });

        setFilteredHistory(filtered);
    }, [searchQuery, history, fromDate, toDate]);

    return (
        <TableContainer component={Paper} sx={{ p: 2 }}>

            {/* 🔍 Search & Date Filters in One Row */}
            <Box sx={{ display: "flex", gap: 2, mb: 2, px: 2, alignItems: "center" }}>
                <TextField
                    label="🔍 Search"
                    variant="outlined"
                    sx={{  width: 250,
                        backgroundColor: "#f9f9f9",
                        borderRadius: "12px",
                        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                        transition: "all 0.3s ease-in-out",
                        "&:hover": {
                            backgroundColor: "#f0f0f0",
                            transform: "scale(1.02)"
                        },
                        "& .MuiOutlinedInput-root": {
                            "& fieldset": {
                                borderRadius: "12px",
                            },
                            "&:hover fieldset": {
                                borderColor: "#1976d2",
                            },
                            "&.Mui-focused fieldset": {
                                borderColor: "#1565c0",
                                borderWidth: "2px"
                            }
                        } }}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <TextField
                    label="From Date"
                    type="datetime-local"
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    sx={{
                        width: 250,
                        backgroundColor: "#f9f9f9",
                        borderRadius: "12px",
                        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                        transition: "all 0.3s ease-in-out",
                        "&:hover": {
                            backgroundColor: "#f0f0f0",
                            transform: "scale(1.02)"
                        },
                        "& .MuiOutlinedInput-root": {
                            "& fieldset": {
                                borderRadius: "12px",
                            },
                            "&:hover fieldset": {
                                borderColor: "#1976d2",
                            },
                            "&.Mui-focused fieldset": {
                                borderColor: "#1565c0",
                                borderWidth: "2px"
                            }
                        }
                    }}
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                />

                <TextField
                    label="To Date"
                    type="datetime-local"
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    sx={{
                        width: 250,
                        backgroundColor: "#f9f9f9",
                        borderRadius: "12px",
                        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                        transition: "all 0.3s ease-in-out",
                        "&:hover": {
                            backgroundColor: "#f0f0f0",
                            transform: "scale(1.02)"
                        },
                        "& .MuiOutlinedInput-root": {
                            "& fieldset": {
                                borderRadius: "12px",
                            },
                            "&:hover fieldset": {
                                borderColor: "#1976d2",
                            },
                            "&.Mui-focused fieldset": {
                                borderColor: "#1565c0",
                                borderWidth: "2px"
                            }
                        }
                    }}
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                />

                <Button variant="contained" color="primary" onClick={() => setPage(0)}>
                    Apply Filter
                </Button>
                <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => {
                        setFromDate("");
                        setToDate("");
                    }}
                >
                    Reset
                </Button>
            </Box>

            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>#</TableCell>
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
