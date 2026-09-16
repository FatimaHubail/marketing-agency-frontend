import { useEffect, useState } from "react";
import {
  createTask,
  updateTask,
  deleteTask,
  getMyTasks,
} from "../../services/taskService";
import { getCampaigns } from "../../services/campaignService";
import { getOutsourceUsers } from "../../services/userService";

import DatePicker from "../../components/common/DatePicker/DatePicker";
import Select from "../../components/common/Select/Select";

import "../../styles/CampaignRequestForm.css";
import "./Tasks.css";

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [outsourceUsers, setOutsourceUsers] = useState([]);
  const [editingTaskId, setEditingTaskId] = useState(null);

  const [formData, setFormData] = useState({
    campaignId: "",
    title: "",
    description: "",
    assignedTo: "",
    dueDate: "",
    status: "pending",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tasksData = await getMyTasks();
        const campaignsData = await getCampaigns();
        const outsourceData = await getOutsourceUsers();

        setTasks(tasksData);
        setCampaigns(campaignsData);
        setOutsourceUsers(outsourceData);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, []);

  const handleChange = (evt) => {
    setFormData({
      ...formData,
      [evt.target.name]: evt.target.value,
    });
  };

  const handleCampaignChange = (value) => {
    setFormData({
      ...formData,
      campaignId: value,
    });
  };

  const handleOutsourceChange = (value) => {
    setFormData({
      ...formData,
      assignedTo: value,
    });
  };

  const handleDateChange = (value) => {
    setFormData({
      ...formData,
      dueDate: value,
    });
  };

  const handleStatusChange = (value) => {
    setFormData({
      ...formData,
      status: value,
    });
  };

  const resetForm = () => {
    setFormData({
      campaignId: "",
      title: "",
      description: "",
      assignedTo: "",
      dueDate: "",
      status: "pending",
    });
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();

    try {
      if (editingTaskId) {
        const updatedTask = await updateTask(
          editingTaskId,
          formData
        );

        setTasks(
          tasks.map((task) =>
            task._id === editingTaskId
              ? updatedTask
              : task
          )
        );

        setEditingTaskId(null);
      } else {
        const newTask = await createTask(formData);

        setTasks([...tasks, newTask]);
      }

      resetForm();
    } catch (err) {
      console.log(err);
    }
  };

  const handleEdit = (task) => {
    setEditingTaskId(task._id);

    setFormData({
      campaignId:
        task.campaignId?._id || task.campaignId,
      title: task.title,
      description: task.description || "",
      assignedTo:
        task.assignedTo?._id || task.assignedTo,
      dueDate: task.dueDate
        ? task.dueDate.split("T")[0]
        : "",
      status: task.status,
    });
  };

  const handleDelete = async (id) => {
    try {
      await deleteTask(id);

      setTasks(
        tasks.filter((task) => task._id !== id)
      );
    } catch (err) {
      console.log(err);
    }
  };

  const handleCancel = () => {
    setEditingTaskId(null);
    resetForm();
  };

  const campaignOptions = campaigns.map((campaign) => ({
    value: campaign._id,
    label:
      campaign.requestId?.title ||
      campaign.title ||
      campaign._id,
  }));

  const outsourceOptions = outsourceUsers.map((user) => ({
    value: user._id,
    label: user.name || user.username,
  }));

  const statusOptions = [
    {
      value: "pending",
      label: "Pending",
    },
    {
      value: "in progress",
      label: "In Progress",
    },
    {
      value: "completed",
      label: "Completed",
    },
  ];

  return (
    <main className="tasks-page">
      <div className="tasks-page-header">
        <h1>Tasks</h1>
        <p className="tasks-page-subtitle">Assign and track work across your active campaigns.</p>
      </div>

      <div className="tasks-form-card">
        <h2>{editingTaskId ? "Edit Task" : "Create Task"}</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <Select
              id="campaignId"
              label="Campaign"
              value={formData.campaignId}
              onChange={handleCampaignChange}
              options={campaignOptions}
              placeholder="Select Campaign"
            />

            <Select
              id="assignedTo"
              label="Assign To (optional)"
              value={formData.assignedTo}
              onChange={handleOutsourceChange}
              options={outsourceOptions}
              placeholder="Select Outsource"
            />

            <Select
              id="status"
              label="Status"
              value={formData.status}
              onChange={handleStatusChange}
              options={statusOptions}
              placeholder="Select Status"
            />
          </div>

          <div className="form-row">
            <div className="form-field">
              <label htmlFor="title">Task Title</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="description">Description</label>
              <input
                type="text"
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            <DatePicker
              id="dueDate"
              label="Due Date"
              value={formData.dueDate}
              onChange={handleDateChange}
              placeholder="Select a due date"
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-primary-action">
              {editingTaskId
                ? "Update Task"
                : "Create Task"}
            </button>

            {editingTaskId && (
              <button
                type="button"
                className="btn-secondary-action"
                onClick={handleCancel}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="tasks-table-card">
        <h2>All Tasks</h2>

        <div className="tasks-table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Campaign</th>
                <th>Title</th>
                <th>Description</th>
                <th>Assigned To</th>
                <th>Status</th>
                <th>Due Date</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {tasks.map((task) => (
                <tr key={task._id}>
                  <td>
                    {task.campaignId?.requestId?.title ||
                      task.campaignId?.title ||
                      "No Campaign"}
                  </td>

                  <td>{task.title}</td>

                  <td>{task.description || "—"}</td>

                  <td>
                    {task.assignedTo?.name ||
                      task.assignedTo?.username ||
                      "Not Assigned"}
                  </td>

                  <td>
                    <span
                      className={`status-badge status-${task.status
                        .replace(/\s+/g, "-")
                        .toLowerCase()}`}
                    >
                      {task.status}
                    </span>
                  </td>

                  <td>
                    {task.dueDate
                      ? new Date(
                          task.dueDate
                        ).toLocaleDateString()
                      : "—"}
                  </td>

                  <td className="tasks-table-actions">
                    <button
                      className="task-edit-btn"
                      onClick={() => handleEdit(task)}
                    >
                      Edit
                    </button>

                    <button
                      className="task-delete-btn"
                      onClick={() =>
                        handleDelete(task._id)
                      }
                    >
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

export default Tasks;
