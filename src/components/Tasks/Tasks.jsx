import { useEffect, useState } from "react";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} from "../../services/taskService";
import { getCampaigns } from "../../services/campaignService";
import "./Tasks.css";

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [editingTaskId, setEditingTaskId] = useState(null);

  const [formData, setFormData] = useState({
    campaignId: "",
    title: "",
    description: "",
    dueDate: "",
    status: "pending",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tasksData = await getTasks();
        const campaignsData = await getCampaigns();

        setTasks(tasksData);
        setCampaigns(campaignsData);
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

  const resetForm = () => {
    setFormData({
      campaignId: "",
      title: "",
      description: "",
      dueDate: "",
      status: "pending",
    });
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();

    try {
      if (editingTaskId) {
        const updatedTask = await updateTask(editingTaskId, formData);

        setTasks(
          tasks.map((task) =>
            task._id === editingTaskId ? updatedTask : task
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
      campaignId: task.campaignId?._id || task.campaignId,
      title: task.title,
      description: task.description || "",
      dueDate: task.dueDate.split("T")[0],
      status: task.status,
    });
  };

  const handleDelete = async (id) => {
    try {
      await deleteTask(id);

      setTasks(tasks.filter((task) => task._id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  const handleCancel = () => {
    setEditingTaskId(null);
    resetForm();
  };

  return (
    <div className="tasks">
      <h1>Tasks</h1>

      <form onSubmit={handleSubmit}>
        <select
          name="campaignId"
          value={formData.campaignId}
          onChange={handleChange}
          required
        >
          <option value="">Select Campaign</option>

          {campaigns.map((campaign) => (
            <option key={campaign._id} value={campaign._id}>
              {campaign.requestId?.title || campaign._id}
            </option>
          ))}
        </select>

        <input
          type="text"
          name="title"
          placeholder="Task title"
          value={formData.title}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
        />

        <input
          type="date"
          name="dueDate"
          value={formData.dueDate}
          onChange={handleChange}
          required
        />

        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
        >
          <option value="pending">Pending</option>
          <option value="in progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>

        <button type="submit">
          {editingTaskId ? "Update Task" : "Create Task"}
        </button>

        {editingTaskId && (
          <button type="button" onClick={handleCancel}>
            Cancel
          </button>
        )}
      </form>

      <table>
        <thead>
          <tr>
            <th>Campaign</th>
            <th>Title</th>
            <th>Description</th>
            <th>Status</th>
            <th>Due Date</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {tasks.map((task) => (
            <tr key={task._id}>
              <td>{task.campaignId?.requestId?.title}</td>

              <td>{task.title}</td>

              <td>{task.description}</td>

              <td>{task.status}</td>

              <td>
                {new Date(task.dueDate).toLocaleDateString()}
              </td>

              <td>
                <button onClick={() => handleEdit(task)}>
                  Edit
                </button>

                <button onClick={() => handleDelete(task._id)}>
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