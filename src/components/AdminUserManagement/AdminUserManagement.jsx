import { useEffect, useState } from "react";
import {
  getUsers,
  createUser,
  deleteUser,
  updateUser,
} from "../../services/adminService";
import "./AdminUserManagement.css";

const campaignTypes = [
  "social_media",
  "sem",
  "display",
  "influencer",
  "content_marketing",
  "email_marketing",
  "brand_awareness",
  "print",
  "ooh",
  "event",
  "broadcast",
  "direct_mail",
  "instore_activation",
  "product_launch",
  "seo",
  "pr",
];

const AdminUserManagement = () => {
  const [users, setUsers] = useState([]);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "staff",
    specialties: [],
  });

  const [editingUserId, setEditingUserId] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getUsers();
        setUsers(data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchUsers();
  }, []);

  const handleChange = (evt) => {
    setFormData({
      ...formData,
      [evt.target.name]: evt.target.value,
    });
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();

    try {
      if (editingUserId) {
        const updatedUser = await updateUser(editingUserId, formData);

        setUsers(
          users.map((user) =>
            user._id === editingUserId ? updatedUser : user
          )
        );

        setEditingUserId(null);
      } else {
        const newUser = await createUser(formData);
        setUsers([...users, newUser]);
      }

      setFormData({
        username: "",
        email: "",
        password: "",
        role: "staff",
        specialties: [],
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteUser(id);
      setUsers(users.filter((user) => user._id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  const handleEdit = (user) => {
    setEditingUserId(user._id);

    setFormData({
      username: user.username,
      email: user.email,
      password: "",
      role: user.role,
      specialties: user.specialties || [],
    });
  };

  return (
    <div className="admin-user-management">
      <h1>Admin User Management</h1>

      <h2>Add User</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
        >
          <option value="staff">Staff</option>
          <option value="campaign-manager">Campaign Manager</option>
          <option value="outsource">Outsource</option>
        </select>

        {formData.role === "staff" && (
          <select
            name="specialties"
            value={formData.specialties[0] || ""}
            onChange={(evt) =>
              setFormData({
                ...formData,
                specialties: evt.target.value ? [evt.target.value] : [],
              })
            }
          >
            <option value="">Select Specialty</option>

            {campaignTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        )}

        <button type="submit">
          {editingUserId ? "Update User" : "Add User"}
        </button>

        {editingUserId && (
          <button
            type="button"
            onClick={() => {
              setEditingUserId(null);
              setFormData({
                username: "",
                email: "",
                password: "",
                role: "staff",
                specialties: [],
              });
            }}
          >
            Cancel
          </button>
        )}
      </form>

      <table>
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <button onClick={() => handleEdit(user)}>
                  Edit
                </button>

                <button onClick={() => handleDelete(user._id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminUserManagement;