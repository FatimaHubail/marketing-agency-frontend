import { useEffect, useState } from "react";
import "./AgencyDashboard.css";

import { getCampaignRequests } from "../../services/campaignRequestService";
import { getCampaigns } from "../../services/campaignService";
import { getTasks } from "../../services/taskService";

const AgencyDashboard = () => {
  const [requests, setRequests] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [requestsData, campaignsData, tasksData] = await Promise.all([
          getCampaignRequests(),
          getCampaigns(),
          getTasks(),
        ]);

        setRequests(requestsData);
        setCampaigns(campaignsData);
        setTasks(tasksData);
        console.log("CAMPAIGNS:", campaigns);
      } catch (err) {
        console.log(err);
      }
    };

    loadDashboard();
  }, []);

  const pendingRequests = requests.filter(
    (request) =>
      request.status === "submitted" ||
      request.status === "under review"
  );

  const inProgressCampaigns = campaigns.filter(
    (campaign) => campaign.status === "in_progress"
  );

  const completedCampaigns = campaigns.filter(
    (campaign) => campaign.status === "completed"
  );

  const upcomingTasks = tasks
    .filter((task) => task.status !== "completed")
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 5);

  return (
    <div className="agency-dashboard">
      <header className="dashboard-header">
        <div className="dashboard-logo">MarkAura</div>

        <input
          type="text"
          placeholder="Search campaigns, requests, clients..."
        />

        <div className="dashboard-profile">
          <span>🔔</span>

          <div>
            <strong>Agency Manager</strong>
            <small>Marketing Manager</small>
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
                <button>View All</button>
              </div>

              <div className="campaign-columns">

                <div className="campaign-column">
                  <div className="column-header">
                    <h3>Client Requests</h3>
                    <span>{pendingRequests.length}</span>
                  </div>

                  {pendingRequests.length === 0 ? (
                    <p>No requests yet.</p>
                  ) : (
                    pendingRequests.slice(0, 3).map((request) => (
                      <div className="dashboard-item" key={request._id}>
                        <strong>{request.title}</strong>

                        <small>
                          {request.clientId?.user?.username || "Unknown client"}
                        </small>
                      </div>
                    ))
                  )}
                </div>

                <div className="campaign-column">
                  <div className="column-header">
                    <h3>In Progress</h3>
                    <span>{inProgressCampaigns.length}</span>
                  </div>

                  {inProgressCampaigns.length === 0 ? (
                    <p>No campaigns in progress.</p>
                  ) : (
                    inProgressCampaigns.slice(0, 3).map((campaign) => (
                      <div className="dashboard-item" key={campaign._id}>
                        <strong>
                          {campaign.requestId?.title || "Campaign"}
                        </strong>

                        <small>In Progress</small>
                      </div>
                    ))
                  )}
                </div>

                <div className="campaign-column">
                  <div className="column-header">
                    <h3>Completed</h3>
                    <span>{completedCampaigns.length}</span>
                  </div>

                  {completedCampaigns.length === 0 ? (
                    <p>No completed campaigns.</p>
                  ) : (
                    completedCampaigns.slice(0, 3).map((campaign) => (
                      <div className="dashboard-item" key={campaign._id}>
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
                <button>View All</button>
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
                          {task.campaignId?.requestId?.title || "Campaign"}
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

            <div className="sidebar-card">
              <h2>Quick Actions</h2>

              <button>View Campaign Requests</button>
              <button>View Tasks</button>
              <button>View Clients</button>
            </div>

            <div className="sidebar-card">
              <h2>Recent Activity</h2>

              {requests.length === 0 ? (
                <p>No recent activity.</p>
              ) : (
                <p>
                  {requests.length} campaign request
                  {requests.length !== 1 ? "s" : ""} in the system.
                </p>
              )}
            </div>

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