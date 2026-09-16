import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import "./AgencyDashboard.css";
import { getClients } from "../../services/clientService";

import { UserContext } from "../../contexts/UserContext";

import { getCampaignRequests } from "../../services/campaignRequestService";
import { getCampaigns } from "../../services/campaignService";
import { getTasks } from "../../services/taskService";

const AgencyDashboard = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const [requests, setRequests] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [clients, setClients] = useState([]);
const [search, setSearch] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [requestsData, campaignsData, tasksData, clientsData] = await Promise.all([
          getCampaignRequests(),
          getCampaigns(),
          getTasks(),
          getClients(),
        ]);

        setRequests(requestsData);
        setCampaigns(campaignsData);
        setTasks(tasksData);
        setClients(clientsData);
        

        console.log("CAMPAIGNS:", campaignsData);
      } catch (err) {
        console.log(err);
      }
    };

    loadDashboard();
  }, []);

  // Pending campaign requests
  const pendingRequests = requests
    .filter(
      (request) =>
        request.status === "submitted" ||
        request.status === "under review"
    )
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  // Campaigns in progress
  const inProgressCampaigns = campaigns.filter(
    (campaign) => campaign.status === "in_progress"
  );

  // Completed campaigns
  const completedCampaigns = campaigns.filter(
    (campaign) => campaign.status === "completed"
  );

  // Upcoming tasks
  const upcomingTasks = tasks
    .filter((task) => task.status !== "completed")
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 5);

    const searchResults = [
  ...requests
    .filter((request) =>
      (request.title || "").toLowerCase().includes(search.toLowerCase())
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

  return (
    <div className="agency-dashboard">
      <header className="dashboard-header">
        <div className="dashboard-logo">MarkAura</div>

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
        searchResults.slice(0, 6).map((result) => (
          <div
            className="search-result"
            key={`${result.type}-${result.id}`}
            onClick={() => navigate(result.path)}
          >
            <strong>{result.title}</strong>
            <small>{result.type}</small>
          </div>
        ))
      )}
    </div>
  )}
</div>

        {/* Logged-in User */}
        <div className="dashboard-profile">
          <span>🔔</span>

          <div>
            <strong>{user?.username || "User"}</strong>
            <small>{user?.role || "Agency Manager"}</small>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="welcome">
          <h1>Welcome back!</h1>
          <p>Here's what's happening with your marketing campaigns.</p>
        </div>

        <div className="dashboard-layout">
          <div className="dashboard-left">

            {/* Summary Cards */}
            <div className="summary-cards">
              <div className="summary-card">
                <h3>Total Campaigns</h3>
                <strong>{campaigns.length}</strong>
                <p>Total campaigns</p>
              </div>

              <div className="summary-card">
                <h3>Client Requests</h3>
                <strong>{pendingRequests.length}</strong>
                <p>Pending requests</p>
              </div>

              <div className="summary-card">
                <h3>In Progress</h3>
                <strong>{inProgressCampaigns.length}</strong>
                <p>Active campaigns</p>
              </div>

              <div className="summary-card">
                <h3>Completed</h3>
                <strong>{completedCampaigns.length}</strong>
                <p>Completed campaigns</p>
              </div>
            </div>

            {/* Campaigns */}
            <section className="campaign-section">
              <div className="section-header">
                <h2>Campaigns</h2>

                <button onClick={() => navigate("/campaign-requests")}>
                  View All
                </button>
              </div>

              <div className="campaign-columns">

                {/* Client Requests */}
                <div className="campaign-column">
                  <div className="column-header">
                    <h3>Client Requests</h3>
                    <span>{pendingRequests.length}</span>
                  </div>

                  {pendingRequests.length === 0 ? (
                    <p>No requests yet.</p>
                  ) : (
                    pendingRequests.slice(0, 3).map((request) => (
                      <div
                        className="dashboard-item"
                        key={request._id}
                        onClick={() =>
                          navigate(`/campaign-requests/${request._id}`)
                        }
                      >
                        <strong>
                          {request.title || "Campaign Request"}
                        </strong>

                        <small>
                          {request.clientId?.user?.username ||
                            "Unknown client"}
                        </small>
                      </div>
                    ))
                  )}
                </div>

                {/* In Progress Campaigns */}
                <div className="campaign-column">
                  <div className="column-header">
                    <h3>In Progress</h3>
                    <span>{inProgressCampaigns.length}</span>
                  </div>

                  {inProgressCampaigns.length === 0 ? (
                    <p>No campaigns in progress.</p>
                  ) : (
                    inProgressCampaigns.slice(0, 3).map((campaign) => (
                      <div
                        className="dashboard-item"
                        key={campaign._id}
                        onClick={() =>
                          navigate(`/campaigns/${campaign._id}`)
                        }
                      >
                        <strong>
                          {campaign.requestId?.title || "Campaign"}
                        </strong>

                        <small>In Progress</small>
                      </div>
                    ))
                  )}
                </div>

                {/* Completed Campaigns */}
                <div className="campaign-column">
                  <div className="column-header">
                    <h3>Completed</h3>
                    <span>{completedCampaigns.length}</span>
                  </div>

                  {completedCampaigns.length === 0 ? (
                    <p>No completed campaigns.</p>
                  ) : (
                    completedCampaigns.slice(0, 3).map((campaign) => (
                      <div
                        className="dashboard-item"
                        key={campaign._id}
                        onClick={() =>
                          navigate(`/campaigns/${campaign._id}`)
                        }
                      >
                        <strong>
                          {campaign.requestId?.title || "Campaign"}
                        </strong>

                        <small>Completed</small>
                      </div>
                    ))
                  )}
                </div>

              </div>
            </section>

            {/* Upcoming Deadlines */}
            <section className="deadlines">
              <div className="section-header">
                <h2>Upcoming Deadlines</h2>

                <button onClick={() => navigate("/tasks")}>
                  View All
                </button>
              </div>

              <table>
                <thead>
                  <tr>
                    <th>Task</th>
                    <th>Campaign</th>
                    <th>Due Date</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {upcomingTasks.length === 0 ? (
                    <tr>
                      <td colSpan="4">No upcoming deadlines</td>
                    </tr>
                  ) : (
                    upcomingTasks.map((task) => (
                      <tr key={task._id}>
                        <td>{task.title}</td>

                        <td>
                          {task.campaignId?.requestId?.title ||
                            "Campaign"}
                        </td>

                        <td>
                          {new Date(task.dueDate).toLocaleDateString()}
                        </td>

                        <td>{task.status}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="dashboard-sidebar">

            {/* Quick Actions */}
            <div className="sidebar-card">
              <h2>Quick Actions</h2>

              <button
                onClick={() => navigate("/campaign-requests")}
              >
                View Campaign Requests
              </button>

              <button onClick={() => navigate("/tasks")}>
                View Tasks
              </button>

              <button onClick={() => navigate("/clients")}>
  View Clients
</button>
            </div>

            {/* Recent Activity */}
            <div className="sidebar-card">
              <h2>Recent Activity</h2>

              {pendingRequests.length === 0 ? (
                <p>No recent activity.</p>
              ) : (
                <div>
                  <p>
                    {pendingRequests.length} pending campaign request
                    {pendingRequests.length !== 1 ? "s" : ""}.
                  </p>

                  {pendingRequests.slice(0, 3).map((request) => (
                    <div
                      className="dashboard-item"
                      key={request._id}
                      onClick={() =>
                        navigate(`/campaign-requests/${request._id}`)
                      }
                    >
                      <strong>
                        {request.title || "Campaign Request"}
                      </strong>

                      <small>{request.status}</small>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Campaign Progress */}
            <div className="sidebar-card">
              <h2>Campaign Progress</h2>

              <div className="progress-item">
                <span>Client Requests</span>
                <span>{pendingRequests.length}</span>
              </div>

              <div className="progress-item">
                <span>In Progress</span>
                <span>{inProgressCampaigns.length}</span>
              </div>

              <div className="progress-item">
                <span>Completed</span>
                <span>{completedCampaigns.length}</span>
              </div>
            </div>

          </aside>
        </div>
      </main>
    </div>
  );
};

export default AgencyDashboard;