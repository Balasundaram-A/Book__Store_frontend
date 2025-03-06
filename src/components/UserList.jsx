import { useEffect, useState } from "react";
import { Grid, CircularProgress, Typography } from "@mui/material";
import { getAllUsers } from "../services/userService";
import UserCard from "./UserCard";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = () => {
    getAllUsers()
      .then((response) => {
        setUsers(response.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <>
      {loading ? (
        <CircularProgress />
      ) : users.length === 0 ? (
        <Typography variant="h6">No users found.</Typography>
      ) : (
        <Grid container spacing={3} justifyContent="center">
          {users.map((user) => (
            <Grid item xs={12} sm={6} md={4} key={user.id} sx={{ display: "flex" }}>
              <UserCard user={user} refreshUsers={fetchUsers} />
            </Grid>
          ))}
        </Grid>
      )}
    </>
  );
};

export default UserList;
