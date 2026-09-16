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

const OUTSOURCE_ONLY_TYPES = [
  "display",
  "influencer",
  "email_marketing",
  "ooh",
  "broadcast",
  "direct_mail",
  "instore_activation",
  "product_launch",
];

const AdminUserManagement = () => {
  const [users, setUsers] = useState([]);
  const [editingUserId, setEditingUserId] = useState(null);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "staff",
    specialty: "",
    name: "",
    phone: "",
    contactPerson: "",
    serviceTypes: [],
  });

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

  const resetForm = () => {
    setFormData({
      username: "",
      email: "",
      password: "",
      role: "staff",
      specialty: "",
      name: "",
      phone: "",
      contactPerson: "",
      serviceTypes: [],
    });

    setEditingUserId(null);
    setError("");
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    setError("");

    try {
      if (editingUserId) {
        const updatedUser = await updateUser(editingUserId, formData);

        setUsers(
          users.map((user) =>
            user._id === editingUserId ? updatedUser : user
          )
        );
      } else {
        const newUser = await createUser(formData);
        setUsers([...users, newUser]);
      }

      resetForm();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      setError("");

      await deleteUser(id);

      setUsers(users.filter((user) => user._id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (user) => {
    setError("");
    setEditingUserId(user._id);

    setFormData({
      username: user.username || "",
      email: user.email || "",
      password: "",
      role: user.role || "staff",
      specialty: user.specialty || "",
      name: user.name || "",
      phone: user.phone || "",
      contactPerson: user.contactPerson || "",
      serviceTypes: user.serviceTypes || [],
    });
  };

  return (
    <div className="admin-user-management">
      <h1>Admin User Management</h1>

      <h2>{editingUserId ? "Edit User" : "Add User"}</h2>

      {error && <p className="error-message">{error}</p>}

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
          required={!editingUserId}
        />

        <select
          name="role"
          value={formData.role}
          onChange={(evt) =>
            setFormData({
              ...formData,
              role: evt.target.value,
              specialty: "",
              serviceTypes: [],
            })
          }
        >
          <option value="staff">Staff</option>
          <option value="outsource">Outsource Agency</option>
        </select>

        {formData.role === "staff" && (
          <select
            name="specialty"
            value={formData.specialty}
            onChange={handleChange}
            required
          >
            <option value="">Select Specialty</option>

            {campaignTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        )}

        {formData.role === "outsource" && (
          <>
            <input
              type="text"
              name="name"
              placeholder="Outsource Agency Name"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="phone"
              placeholder="Phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="contactPerson"
              placeholder="Contact Person"
              value={formData.contactPerson}
              onChange={handleChange}
              required
            />

            <select
              name="serviceTypes"
              value={formData.serviceTypes[0] || ""}
              onChange={(evt) =>
                setFormData({
                  ...formData,
                  serviceTypes: evt.target.value
                    ? [evt.target.value]
                    : [],
                })
              }
              required
            >
              <option value="">Select Service Type</option>

              {OUTSOURCE_ONLY_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </>
        )}

        <button type="submit">
          {editingUserId ? "Update User" : "Add User"}
        </button>

        {editingUserId && (
          <button type="button" onClick={resetForm}>
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
            <th>Specialty / Service</th>
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
                {user.role === "staff"
                  ? user.specialty || "-"
                  : user.serviceTypes?.length > 0
                  ? user.serviceTypes.join(", ")
                  : "-"}
              </td>

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