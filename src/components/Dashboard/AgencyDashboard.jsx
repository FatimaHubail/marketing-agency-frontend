import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import "./AgencyDashboard.css";

import { UserContext } from "../../contexts/UserContext";

import { getCampaignRequests } from "../../services/campaignRequestService";
import { getCampaigns } from "../../services/campaignService";
import { getTasks } from "../../services/taskService";
import { getClients } from "../../services/clientService";

import DatePicker from "../../components/common/DatePicker/DatePicker";
import Select from "../../components/common/Select/Select";

const AgencyDashboard = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const [requests, setRequests] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [clients, setClients] = useState([]);
  const [search, setSearch] = useState("");

  const [taskDate, setTaskDate] = useState("");
  const [taskStatus, setTaskStatus] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [
          requestsData,
          campaignsData,
          tasksData,
          clientsData,
        ] = await Promise.all([
          getCampaignRequests(),
          getCampaigns(),
          getTasks(),
          getClients(),
        ]);

        setRequests(requestsData);
        setCampaigns(campaignsData);
        setTasks(tasksData);
        setClients(clientsData);
      } catch (err) {
        console.log(err);
      }
    };

    loadDashboard();
  }, []);

  // Requests that need agency review
  const requestsToReview = requests
    .filter(
      (request) =>
        request.status === "submitted" ||
        request.status === "under review"
    )
    .sort(
      (a, b) =>
        new Date(b.createdAt || 0) -
        new Date(a.createdAt || 0)
    );

  // Tasks
  const upcomingTasks = tasks
    .filter((task) => {
      const matchesStatus =
        !taskStatus || task.status === taskStatus;

      const matchesDate =
        !taskDate ||
        task.dueDate?.split("T")[0] === taskDate;

      return matchesStatus && matchesDate;
    })
    .sort(
      (a, b) =>
        new Date(a.dueDate || 0) -
        new Date(b.dueDate || 0)
    )
    .slice(0, 5);

  // Completed tasks
  const completedTasks = tasks.filter(
    (task) => task.status === "completed"
  );

  // Search
  const searchResults = [
    ...requests
      .filter((request) =>
        (request.title || "")
          .toLowerCase()
          .includes(search.toLowerCase())
      )
      .map((request) => ({
        type: "Request",
        title: request.title || "Campaign Request",
        id: request._id,
        path: `/campaign-requests/${request._id}`,
      })),

    ...campaigns
      .filter((campaign) =>
        String(campaign.requestId?.title || "")
          .toLowerCase()
          .includes(search.toLowerCase())
      )
      .map((campaign) => ({
        type: "Campaign",
        title: campaign.requestId?.title || "Campaign",
        id: campaign._id,
        path: `/campaigns/${campaign._id}`,
      })),

    ...clients
      .filter((client) =>
        (client.companyName || "")
          .toLowerCase()
          .includes(search.toLowerCase())
      )
      .map((client) => ({
        type: "Client",
        title: client.companyName,
        id: client._id,
        path: "/clients",
      })),
  ];

  const getClientName = (request) => {
    return (
      request.clientId?.companyName ||
      request.clientId?.user?.username ||
      "Unknown client"
    );
  };

  const getCampaignTitle = (task) => {
    return (
      task.campaignId?.requestId?.title ||
      "Campaign"
    );
  };

  return (
    <div className="agency-dashboard">

      {/* Header */}
      <header className="dashboard-header">

        <div className="dashboard-logo">
          MarkAura
        </div>

        <div className="dashboard-search">
          <input
            type="text"
            placeholder="Search campaigns, requests, clients..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {search && (
            <div className="search-results">

              {searchResults.length === 0 ? (
                <p>No results found.</p>
              ) : (
                searchResults
                  .slice(0, 6)
                  .map((result) => (
                    <div
                      className="search-result"
                      key={`${result.type}-${result.id}`}
                      onClick={() =>
                        navigate(result.path)
                      }
                    >
                      <strong>{result.title}</strong>
                      <small>{result.type}</small>
                    </div>
                  ))
              )}

            </div>
          )}
        </div>

        <div className="dashboard-profile">

          <span>🔔</span>

          <div>
            <strong>
              {user?.username || "User"}
            </strong>

            <small>
              {user?.role || "Agency Manager"}
            </small>
          </div>

        </div>

      </header>

      {/* Main */}
      <main className="dashboard-main">

        {/* Welcome */}
        <div className="welcome">

          <h1>Welcome back!</h1>

          <p>
            Here's what's happening with your marketing campaigns.
          </p>

        </div>

        <div className="dashboard-layout">

          {/* LEFT SIDE */}
          <div className="dashboard-left">

            {/* Summary */}
            <div className="summary-cards">

              <div className="summary-card">
                <h3>Requests to Review</h3>

                <strong>
                  {requestsToReview.length}
                </strong>

                <p>Need agency action</p>
              </div>

              <div className="summary-card">
                <h3>Tasks Due</h3>

                <strong>
                  {upcomingTasks.length}
                </strong>

                <p>Open tasks</p>
              </div>

              <div className="summary-card">
                <h3>Clients</h3>

                <strong>
                  {clients.length}
                </strong>

                <p>Total clients</p>
              </div>

              <div className="summary-card">
                <h3>Completed Tasks</h3>

                <strong>
                  {completedTasks.length}
                </strong>

                <p>Completed tasks</p>
              </div>

            </div>

            {/* Requests To Review */}
            <section className="dashboard-section">

              <div className="section-header">

                <h2>
                  Requests Requiring Action
                </h2>

                <button
                  onClick={() =>
                    navigate("/campaign-requests")
                  }
                >
                  View All
                </button>

              </div>

              {requestsToReview.length === 0 ? (
                <div className="empty-state">
                  No campaign requests require review.
                </div>
              ) : (
                <table className="requests-table">

                  <thead>
                    <tr>
                      <th>Request</th>
                      <th>Client</th>
                      <th>Campaign Type</th>
                      <th>Budget</th>
                      <th>Status</th>
                      <th></th>
                    </tr>
                  </thead>

                  <tbody>

                    {requestsToReview
                      .slice(0, 5)
                      .map((request) => (
                        <tr key={request._id}>

                          <td>
                            <strong>
                              {request.title ||
                                "Campaign Request"}
                            </strong>
                          </td>

                          <td>
                            {getClientName(request)}
                          </td>

                          <td>
                            {request.campaignType ||
                              "Not specified"}
                          </td>

                          <td>
                            {request.budget
                              ? `${request.budget} BHD`
                              : "—"}
                          </td>

                          <td>
                            <span className="status status-review">
                              {request.status}
                            </span>
                          </td>

                          <td>
                            <button
                              className="action-button"
                              onClick={() =>
                                navigate(
                                  `/campaign-requests/${request._id}`
                                )
                              }
                            >
                              Review
                            </button>
                          </td>

                        </tr>
                      ))}

                  </tbody>

                </table>
              )}

            </section>

            {/* Upcoming Tasks */}
            <section className="dashboard-section">

              <div className="section-header">

                <h2>Upcoming Tasks</h2>

                <button
                  onClick={() =>
                    navigate("/tasks")
                  }
                >
                  View All
                </button>

              </div>

              {/* Task Filters */}
              <div className="task-filters">

                <DatePicker
                  label="Due Date"
                  value={taskDate}
                  onChange={setTaskDate}
                  placeholder="All dates"
                />

                <Select
                  label="Status"
                  value={taskStatus}
                  onChange={setTaskStatus}
                  placeholder="All statuses"
                  options={[
                    {
                      value: "",
                      label: "All statuses",
                    },
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
                  ]}
                />

              </div>

              {upcomingTasks.length === 0 ? (
                <div className="empty-state">
                  No tasks found.
                </div>
              ) : (
                <table className="tasks-table">

                  <thead>
                    <tr>
                      <th>Task</th>
                      <th>Campaign</th>
                      <th>Due Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>

                  <tbody>

                    {upcomingTasks.map((task) => (
                      <tr key={task._id}>

                        <td>
                          <strong>
                            {task.title}
                          </strong>
                        </td>

                        <td>
                          {getCampaignTitle(task)}
                        </td>

                        <td>
                          {task.dueDate
                            ? new Date(
                                task.dueDate
                              ).toLocaleDateString()
                            : "—"}
                        </td>

                        <td>
                          <span className="status status-pending">
                            {task.status}
                          </span>
                        </td>

                      </tr>
                    ))}

                  </tbody>

                </table>
              )}

            </section>

          </div>

          {/* RIGHT SIDEBAR */}
          <aside className="dashboard-sidebar">

            {/* Quick Actions */}
            <div className="sidebar-card">

              <h2>Quick Actions</h2>

              <button
                className="quick-action"
                onClick={() =>
                  navigate("/campaign-requests")
                }
              >
                Review Campaign Requests
              </button>

              <button
                className="quick-action"
                onClick={() =>
                  navigate("/tasks")
                }
              >
                Manage Tasks
              </button>

              <button
                className="quick-action"
                onClick={() =>
                  navigate("/clients")
                }
              >
                Manage Clients
              </button>

            </div>

            {/* Recent Activity */}
            <div className="sidebar-card">

              <h2>Recent Activity</h2>

              {requests.length === 0 ? (
                <div className="empty-state">
                  No recent activity.
                </div>
              ) : (
                requests
                  .slice()
                  .sort(
                    (a, b) =>
                      new Date(
                        b.createdAt || 0
                      ) -
                      new Date(
                        a.createdAt || 0
                      )
                  )
                  .slice(0, 4)
                  .map((request) => (
                    <div
                      className="activity-item"
                      key={request._id}
                      onClick={() =>
                        navigate(
                          `/campaign-requests/${request._id}`
                        )
                      }
                      style={{
                        cursor: "pointer",
                      }}
                    >

                      <strong>
                        {request.title ||
                          "Campaign Request"}
                      </strong>

                      <small>
                        Status: {request.status}
                      </small>

                    </div>
                  ))
              )}

            </div>

            {/* Campaign Overview */}
            <div className="sidebar-card">

              <h2>Campaign Overview</h2>

              <div className="activity-item">

                <strong>
                  Requests to Review
                </strong>

                <small>
                  {requestsToReview.length} awaiting action
                </small>

              </div>

            </div>

          </aside>

        </div>

      </main>

    </div>
  );
};

export default AgencyDashboard;