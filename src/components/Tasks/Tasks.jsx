import { useEffect, useState } from "react";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} from "../../services/taskService";
import { getCampaigns } from "../../services/campaignService";
import { getOutsourceUsers } from "../../services/userService";

import DatePicker from "../../components/common/DatePicker/DatePicker";
import Select from "../../components/common/Select/Select";

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
        const tasksData = await getTasks();
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
    <div className="tasks">

      <h1>Tasks</h1>

      <form onSubmit={handleSubmit}>

        <Select
          label="Campaign"
          value={formData.campaignId}
          onChange={handleCampaignChange}
          options={campaignOptions}
          placeholder="Select Campaign"
        />

        <div className="task-input-group">
          <label>Task Title</label>

          <input
            type="text"
            name="title"
            placeholder="Task title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="task-input-group">
          <label>Description</label>

          <input
            type="text"
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
          />
        </div>

        <Select
          label="Assign To"
          value={formData.assignedTo}
          onChange={handleOutsourceChange}
          options={outsourceOptions}
          placeholder="Select Outsource"
        />

        <DatePicker
          label="Due Date"
          value={formData.dueDate}
          onChange={handleDateChange}
          placeholder="Select a due date"
        />

        <Select
          label="Status"
          value={formData.status}
          onChange={handleStatusChange}
          options={statusOptions}
          placeholder="Select Status"
        />

        <div className="task-form-buttons">

          <button type="submit">
            {editingTaskId
              ? "Update Task"
              : "Create Task"}
          </button>

          {editingTaskId && (
            <button
              type="button"
              onClick={handleCancel}
            >
              Cancel
            </button>
          )}

        </div>

      </form>

      <table>

        <thead>
          <tr>
            <th>Campaign</th>
            <th>Title</th>
            <th>Description</th>
            <th>Assigned To</th>
            <th>Status</th>
            <th>Due Date</th>
            <th>Actions</th>
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

              <td>
                {task.title}
              </td>

              <td>
                {task.description || "—"}
              </td>

              <td>
                {task.assignedTo?.name ||
                  task.assignedTo?.username ||
                  "Not Assigned"}
              </td>

              <td>
                <span
                  className={`task-status status-${task.status
                    .replace(" ", "-")
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

              <td>

                <button
                  onClick={() => handleEdit(task)}
                >
                  Edit
                </button>

                <button
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
  );
};

export default Tasks;