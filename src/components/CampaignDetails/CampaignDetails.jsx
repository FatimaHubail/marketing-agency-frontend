import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { getCampaignById } from "../../services/campaignService";
import { getCampaignTasks } from "../../services/taskService";
import "./CampaignDetails.css";

const CampaignDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [campaign, setCampaign] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        const [campaignData, tasksData] = await Promise.all([
          getCampaignById(id),
          getCampaignTasks(id).catch(() => []),
        ]);

        setCampaign(campaignData);
        setTasks(tasksData);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCampaign();
  }, [id]);

  if (isLoading) {
    return (
      <main className="campaign-loading">
        <p>Loading...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="campaign-error">
        <p role="alert">{error}</p>
      </main>
    );
  }

  const request = campaign.requestId;

  return (
    <main className="campaign-details">
      <div className="campaign-details-container">

        <button
          className="campaign-back-button"
          onClick={() => navigate("/campaigns")}
        >
          ← Back to Campaigns
        </button>

        <div className="campaign-details-card">

          <div className="campaign-details-header">
            <h1>{request?.title || "Campaign"}</h1>

            <span className={`campaign-status status-${campaign.status}`}>
              {campaign.status?.replace(/_/g, " ") || "N/A"}
            </span>
          </div>

          <div className="campaign-details-grid">

            <div className="campaign-detail">
              <strong>Campaign Type</strong>
              <p>
                {request?.campaignType?.replace(/_/g, " ") || "N/A"}
              </p>
            </div>

            <div className="campaign-detail">
              <strong>Goal</strong>
              <p>
                {request?.goal?.replace(/_/g, " ") || "N/A"}
              </p>
            </div>

            <div className="campaign-detail">
              <strong>Budget</strong>
              <p>{request?.budget || "N/A"} BHD</p>
            </div>

            <div className="campaign-detail">
              <strong>Budget Spent</strong>
              <p>{campaign.budgetSpent || 0} BHD</p>
            </div>

            <div className="campaign-detail">
              <strong>Start Date</strong>
              <p>
                {campaign.startDate
                  ? new Date(campaign.startDate).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>

            <div className="campaign-detail">
              <strong>End Date</strong>
              <p>
                {campaign.endDate
                  ? new Date(campaign.endDate).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>

            <div className="campaign-detail full-width">
              <strong>Description</strong>
              <p>{request?.description || "N/A"}</p>
            </div>

            <div className="campaign-detail full-width">
              <strong>Preferred Channels</strong>
              <p>
                {request?.preferredChannels?.join(", ") || "N/A"}
              </p>
            </div>

            <div className="campaign-detail full-width">
              <strong>Notes</strong>
              <p>{request?.notes || "N/A"}</p>
            </div>

          </div>

          <div className="campaign-tasks">
            <h2>Tasks</h2>

            {tasks.length === 0 ? (
              <p className="campaign-tasks-empty">No tasks have been added to this campaign yet.</p>
            ) : (
              <ul className="campaign-tasks-list">
                {tasks.map((task) => (
                  <li className="campaign-task-item" key={task._id}>
                    <div className="campaign-task-info">
                      <strong>{task.title}</strong>
                      {task.description && <p>{task.description}</p>}
                    </div>

                    <div className="campaign-task-meta">
                      <span className="campaign-task-assignee">
                        {task.assignedTo?.name || task.assignedTo?.username || "Unassigned"}
                      </span>

                      <span
                        className={`status-badge status-${task.status.replace(/\s+/g, "-").toLowerCase()}`}
                      >
                        {task.status}
                      </span>

                      <span className="campaign-task-date">
                        {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "N/A"}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

        </div>
      </div>
    </main>
  );
};

export default CampaignDetails;