import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import "./OutsourceDashboard.css";
import { getOutsourceTasks } from "../../../services/outsourceTaskService";
import { getCampaigns } from "../../../services/campaignService";
import { UserContext } from "../../../contexts/UserContext";

const TASK_STATES = ["pending", "accepted", "in_progress", "delivered", "completed", "rejected"];

const OutsourceDashboard = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const [outsourceTasks, setOutsourceTasks] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [tasksData, campaignsData] = await Promise.all([
          getOutsourceTasks(),
          getCampaigns().catch(() => []),
        ]);
        setOutsourceTasks(tasksData || []);
        setCampaigns(campaignsData || []);
      } catch (err) {
        console.log(err);
      }
    };

    loadDashboard();
  }, []);

  const getCampaignTitle = (task) => {
    if (task.campaignId && typeof task.campaignId === "object") {
      return task.campaignId.requestId?.title || task.campaignId.title || "";
    }
    const matched = campaigns.find((c) => c._id === task.campaignId);
    if (matched) {
      return matched.requestId?.title || matched.title || "";
    }
    return task.campaignTitle || task.campaignName || "";
  };

  // 1. Search results across tasks by task title or campaign title
  const searchResults = outsourceTasks
    .filter((task) => {
      if (!search.trim()) return false;
      const query = search.toLowerCase();
      const taskTitle = (task.title || "").toLowerCase();
      const campaignTitle = getCampaignTitle(task).toLowerCase();
      return taskTitle.includes(query) || campaignTitle.includes(query);
    })
    .map((task) => ({
      id: task._id,
      title: task.title,
      type: task.serviceType || "Task",
      status: task.status,
      campaign: getCampaignTitle(task),
      path: `/outsource-tasks/${task._id}`,
    }));

  // 2. Amount of campaigns participated in
  const participatedCampaignIds = new Set([
    ...campaigns.map((c) => c._id),
    ...outsourceTasks.map((t) => t.campaignId?._id || t.campaignId).filter(Boolean),
  ]);
  const campaignsParticipatedCount = participatedCampaignIds.size > 0 ? participatedCampaignIds.size : campaigns.length;

  // 3. Net income (active & completed) and completed earnings
  const netIncome = outsourceTasks
    .filter((t) => ["accepted", "in_progress", "delivered", "completed"].includes(t.status))
    .reduce((sum, t) => sum + (Number(t.paymentAmount) || 0), 0);

  const completedIncome = outsourceTasks
    .filter((t) => t.status === "completed")
    .reduce((sum, t) => sum + (Number(t.paymentAmount) || 0), 0);

  // 4. Amount of tasks within each state
  const tasksPerState = TASK_STATES.reduce((acc, state) => {
    acc[state] = outsourceTasks.filter((t) => (t.status || "pending") === state).length;
    return acc;
  }, {});

  // 5. Amount of tasks per service type
  const tasksPerServiceType = outsourceTasks.reduce((acc, task) => {
    const type = task.serviceType || "Uncategorized";
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});

  // 6. Tasks closest to deadline (active upcoming)
  const now = new Date();
  const closestDeadlineTasks = outsourceTasks
    .filter((task) => {
      if (!task.dueDate) return false;
      if (["completed", "delivered", "rejected"].includes(task.status)) return false;
      return new Date(task.dueDate) >= now;
    })
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

  // 7. Tasks past deadline without completing it (overdue)
  const overdueTasks = outsourceTasks
    .filter((task) => {
      if (!task.dueDate) return false;
      if (["completed", "delivered", "rejected"].includes(task.status)) return false;
      return new Date(task.dueDate) < now;
    })
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

  return (
    <div className="outsource-dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="dashboard-logo">MarkAura</div>

        {/* 1. Search Bar */}
        <div className="dashboard-search">
          <input
            type="text"
            placeholder="Search tasks by title or campaign..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {search.trim() && (
            <div className="search-results">
              {searchResults.length === 0 ? (
                <p>No results found.</p>
              ) : (
                searchResults.slice(0, 6).map((result) => (
                  <div
                    className="search-result"
                    key={result.id}
                    onClick={() => navigate(result.path)}
                  >
                    <strong>{result.title}</strong>
                    <small>
                      {result.campaign ? `${result.campaign} • ` : ""}
                      {result.type} • {result.status}
                    </small>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        <div className="dashboard-profile">
          <span>🔔</span>
          <div>
            <strong>{user?.username || "Outsource User"}</strong>
            <small>{user?.role || "Outsource Partner"}</small>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="dashboard-main">
        {/* Welcome */}
        <div className="welcome">
          <h1>Welcome back!</h1>
          <p>Here's what's happening with your assigned tasks and earnings.</p>
        </div>

        <div className="dashboard-layout">
          {/* LEFT SIDE */}
          <div className="dashboard-left">
            {/* 2 & 3. Summary Cards (Participation & Net Income) */}
            <div className="summary-cards">
              <div className="summary-card">
                <h3>Campaigns Participated</h3>
                <strong>{campaignsParticipatedCount}</strong>
                <p>Total campaigns</p>
              </div>

              <div className="summary-card">
                <h3>Net Income</h3>
                <strong>${netIncome.toLocaleString()}</strong>
                <p>Active & completed payout</p>
              </div>

              <div className="summary-card">
                <h3>Completed Earnings</h3>
                <strong>${completedIncome.toLocaleString()}</strong>
                <p>Earned from completed tasks</p>
              </div>

              <div className="summary-card">
                <h3>Total Tasks</h3>
                <strong>{outsourceTasks.length}</strong>
                <p>Assigned tasks</p>
              </div>
            </div>

            {/* 6. Tasks Closest to Deadline */}
            <section className="dashboard-section">
              <div className="section-header">
                <h2>Tasks Closest to Deadline</h2>
              </div>

              {closestDeadlineTasks.length === 0 ? (
                <div className="empty-state">
                  No upcoming tasks with deadlines.
                </div>
              ) : (
                <table className="tasks-table">
                  <thead>
                    <tr>
                      <th>Task</th>
                      <th>Campaign</th>
                      <th>Service Type</th>
                      <th>Due Date</th>
                      <th>Status</th>
                      <th>Payment</th>
                    </tr>
                  </thead>
                  <tbody>
                    {closestDeadlineTasks.map((task) => (
                      <tr key={task._id}>
                        <td>
                          <strong>{task.title}</strong>
                        </td>
                        <td>{getCampaignTitle(task) || "—"}</td>
                        <td>{task.serviceType}</td>
                        <td>
                          {task.dueDate
                            ? new Date(task.dueDate).toLocaleDateString()
                            : "—"}
                        </td>
                        <td>
                          <span
                            className={`status status-${(task.status || "pending")
                              .replace("_", "-")
                              .toLowerCase()}`}
                          >
                            {task.status}
                          </span>
                        </td>
                        <td>${Number(task.paymentAmount || 0).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </section>

            {/* 7. Tasks Past Deadline without Completing (Overdue) */}
            <section className="dashboard-section">
              <div className="section-header">
                <h2>Tasks Past Deadline (Overdue)</h2>
              </div>

              {overdueTasks.length === 0 ? (
                <div className="empty-state">
                  No overdue tasks.
                </div>
              ) : (
                <table className="tasks-table">
                  <thead>
                    <tr>
                      <th>Task</th>
                      <th>Campaign</th>
                      <th>Service Type</th>
                      <th>Due Date</th>
                      <th>Status</th>
                      <th>Payment</th>
                    </tr>
                  </thead>
                  <tbody>
                    {overdueTasks.map((task) => (
                      <tr key={task._id}>
                        <td>
                          <strong>{task.title}</strong>
                        </td>
                        <td>{getCampaignTitle(task) || "—"}</td>
                        <td>{task.serviceType}</td>
                        <td>
                          {task.dueDate
                            ? new Date(task.dueDate).toLocaleDateString()
                            : "—"}
                        </td>
                        <td>
                          <span
                            className={`status status-${(task.status || "pending")
                              .replace("_", "-")
                              .toLowerCase()}`}
                          >
                            {task.status}
                          </span>
                        </td>
                        <td>${Number(task.paymentAmount || 0).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </section>
          </div>

          {/* RIGHT SIDEBAR */}
          <aside className="dashboard-sidebar">
            {/* 4. Tasks by State */}
            <div className="sidebar-card">
              <h2>Tasks by State</h2>
              {TASK_STATES.map((state) => (
                <div className="activity-item" key={state}>
                  <strong>{state.replace("_", " ").toUpperCase()}</strong>
                  <small>
                    {tasksPerState[state]} {tasksPerState[state] === 1 ? "task" : "tasks"}
                  </small>
                </div>
              ))}
            </div>

            {/* 5. Tasks per Service Type */}
            <div className="sidebar-card">
              <h2>Tasks per Service Type</h2>
              {Object.keys(tasksPerServiceType).length === 0 ? (
                <div className="empty-state">No tasks assigned yet.</div>
              ) : (
                Object.entries(tasksPerServiceType).map(([type, count]) => (
                  <div className="activity-item" key={type}>
                    <strong>{type}</strong>
                    <small>
                      {count} {count === 1 ? "task" : "tasks"}
                    </small>
                  </div>
                ))
              )}
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default OutsourceDashboard;


