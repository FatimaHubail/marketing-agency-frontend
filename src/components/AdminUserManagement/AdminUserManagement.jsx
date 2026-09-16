import { useEffect, useState } from "react";
import {
  getUsers,
  createUser,
  deleteUser,
  updateUser,
} from "../../services/adminService";
import Select from "../../components/common/Select/Select";
import "../../styles/CampaignRequestForm.css";
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

  const handleRoleChange = (value) => {
    setFormData({
      ...formData,
      role: value,
      specialty: "",
      serviceTypes: [],
    });
  };

  const handleSpecialtyChange = (value) => {
    setFormData({
      ...formData,
      specialty: value,
    });
  };

  const handleServiceTypeChange = (value) => {
    setFormData({
      ...formData,
      serviceTypes: value ? [value] : [],
    });
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    setError("");

    try {
      if (editingUserId) {
        const updatedUser = await updateUser(
          editingUserId,
          formData
        );

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
    <main className="admin-page">
      <div className="admin-page-header">
        <h1>User Management</h1>
        <p className="admin-page-subtitle">Create staff and outsource agency accounts, and manage existing users.</p>
      </div>

      {error && <p role="alert" className="admin-alert">{error}</p>}

      <div className="admin-form-card">
        <h2>{editingUserId ? "Edit User" : "Add User"}</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-field">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required={!editingUserId}
              />
            </div>
          </div>

          <div className="form-row">
            <Select
              id="role"
              label="Role"
              value={formData.role}
              onChange={handleRoleChange}
              options={[
                { value: "staff", label: "Staff" },
                { value: "outsource", label: "Outsource Agency" },
              ]}
              placeholder="Select Role"
            />

            {formData.role === "staff" && (
              <Select
                id="specialty"
                label="Specialty"
                value={formData.specialty}
                onChange={handleSpecialtyChange}
                options={campaignTypes}
                placeholder="Select Specialty"
              />
            )}
          </div>

          {formData.role === "outsource" && (
            <>
              <div className="form-row">
                <div className="form-field">
                  <label htmlFor="name">Outsource Agency Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="phone">Phone</label>
                  <input
                    type="text"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="contactPerson">Contact Person</label>
                  <input
                    type="text"
                    id="contactPerson"
                    name="contactPerson"
                    value={formData.contactPerson}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <Select
                  id="serviceTypes"
                  label="Service Type"
                  value={formData.serviceTypes[0] || ""}
                  onChange={handleServiceTypeChange}
                  options={OUTSOURCE_ONLY_TYPES}
                  placeholder="Select Service Type"
                />
              </div>
            </>
          )}

          <div className="form-actions">
            <button type="submit" className="btn-primary-action">
              {editingUserId ? "Update User" : "Add User"}
            </button>

            {editingUserId && (
              <button type="button" className="btn-secondary-action" onClick={resetForm}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="admin-table-card">
        <h2>All Users</h2>

        <div className="admin-table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th>Role</th>
                <th>Specialty / Service</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>{user.username}</td>
                  <td>{user.email}</td>

                  <td>
                    <span className={`role-badge role-${user.role}`}>{user.role}</span>
                  </td>

                  <td>
                    {user.role === "staff"
                      ? user.specialty?.replace(/_/g, " ") || "-"
                      : user.serviceTypes?.length > 0
                      ? user.serviceTypes.join(", ").replace(/_/g, " ")
                      : "-"}
                  </td>

                  <td className="admin-table-actions">
                    <button className="admin-edit-btn" onClick={() => handleEdit(user)}>
                      Edit
                    </button>

                    <button className="admin-delete-btn" onClick={() => handleDelete(user._id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
};

export default AdminUserManagement;