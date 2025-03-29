import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Card, CardContent } from "./components/ui/card";
import { Button } from "./components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./components/ui/dialog";
import { Label } from "./components/ui/label";
import { Input } from "./components/ui/input";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./components/context/AuthContext";

const BASE_URL = "https://reqres.in/api";

function UserList() {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editUser, setEditUser] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const { setToken } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/users?page=${page}`);
        setUsers(response.data.data);
        setTotalPages(response.data.total_pages);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };
    fetchUsers();
  }, [page]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/users/${id}`);
      setUsers(users.filter((user) => user.id !== id));
      toast.success("User deleted successfully.");
    } catch (err) {
      toast.error("Failed to delete user.");
    }
  };

  const handleEdit = (user) => {
    setEditUser(user);
    setFirstName(user.first_name);
    setLastName(user.last_name);
    setEmail(user.email);
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`${BASE_URL}/users/${editUser.id}`, {
        first_name: firstName,
        last_name: lastName,
        email: email,
      });
      setUsers(
        users.map((user) =>
          user.id === editUser.id
            ? {
                ...user,
                first_name: firstName,
                last_name: lastName,
                email: email,
              }
            : user
        )
      );
      setEditUser(null);
      toast.success("User updated successfully.");
    } catch (err) {
      toast.error("Failed to update user.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    toast.success("Logout Successfully");
    navigate("/login");
  };

  return (
    <div className="p-6">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Users List</h1>
        <Button onClick={handleLogout} className="bg-red-500">
          Logout
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map((user) => (
          <Card key={user.id}>
            <CardContent className="flex items-center gap-4">
              <img
                src={user.avatar}
                alt={user.first_name}
                className="w-16 h-16 rounded-full"
              />
              <div className="space-y-2">
                <p>
                  {" "}
                  {user.first_name} {user.last_name}
                </p>
                <p className="text-gray-500"> {user.email}</p>
                <Button onClick={() => handleEdit(user)}>Edit</Button>
                <Button
                  onClick={() => handleDelete(user.id)}
                  className="ml-2 bg-red-500"
                >
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-center mt-5">
        <Button
          disabled={page === 1}
          onClick={() => setPage((prev) => prev - 1)}
        >
          Previous
        </Button>
        <span className="m-2.5">
          {page} / {totalPages}
        </span>
        <Button
          disabled={page === totalPages}
          onClick={() => setPage((prev) => prev + 1)}
        >
          Next
        </Button>
      </div>

      <Dialog open={!!editUser} onOpenChange={() => setEditUser(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                type="text"
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                type="text"
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          <Button onClick={handleUpdate}>Update</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default UserList;
