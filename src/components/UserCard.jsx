import PropTypes from "prop-types";
import { Card, CardContent, Typography, Button, Stack } from "@mui/material";
import Swal from "sweetalert2";
import { deleteUser, updateUser } from "../services/userService";

const UserCard = ({ user, refreshUsers }) => {
  if (!user) return null;

  const handleDelete = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "This will delete the user permanently!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteUser(user.id)
          .then(() => {
            Swal.fire("Deleted!", "User removed successfully!", "success");
            refreshUsers();
          })
          .catch(() => Swal.fire("Error", "User deletion failed!", "error"));
      }
    });
  };

  const handleEdit = () => {
    Swal.fire({
      title: "Edit User",
      html: `
        <input id="swal-name" class="swal2-input" value="${user.name || ""}" placeholder="Name">
        <input id="swal-email" class="swal2-input" value="${user.email || ""}" placeholder="Email">`,
      showCancelButton: true,
      confirmButtonText: "Save",
      preConfirm: () => {
        const name = document.getElementById("swal-name").value.trim();
        const email = document.getElementById("swal-email").value.trim();

        if (!name || !email) {
          Swal.showValidationMessage("Both fields are required!");
          return false;
        }

        return { name, email };
      },
    }).then((result) => {
      if (result.isConfirmed) {
        updateUser(user.id, result.value)
          .then(() => {
            Swal.fire("Updated!", "User details updated!", "success");
            refreshUsers();
          })
          .catch(() => Swal.fire("Error", "Update failed!", "error"));
      }
    });
  };
  const role = localStorage.getItem("role");
  console.log("User Role:", role);
  return (
    <Card sx={{ maxWidth: 345, boxShadow: 3, p: 2 }}>
      <CardContent>
        <Typography variant="h6">{user.name || "No Name"}</Typography>
        <Typography color="textSecondary">Email: {user.email || "No Email"}</Typography>
        <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
          <Button variant="contained" color="warning" onClick={handleEdit}>
            Edit
          </Button>
          <Button variant="contained" color="error" onClick={handleDelete}>
            Delete
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
};

UserCard.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string,
    email: PropTypes.string,
    role :PropTypes.string,
  }).isRequired,
  refreshUsers: PropTypes.func.isRequired,
};

export default UserCard;
