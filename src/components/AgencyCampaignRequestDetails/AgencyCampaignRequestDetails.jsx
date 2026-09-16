import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { getCampaignRequest } from "../../services/campaignRequestService";
import './AgencyCampaignRequestDetails.css';

const AgencyCampaignRequestDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [request, setRequest] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadRequest = async () => {
      try {
        const data = await getCampaignRequest(id);
        setRequest(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadRequest();
  }, [id]);

if (isLoading) {
  return (
    <main className="request-loading">
      <p>Loading...</p>
    </main>
  );
}

if (error) {
  return (
    <main className="request-error">
      <p>{error}</p>
    </main>
  );
}

 return (
  <main className="agency-request-details">
    <div className="request-details-container">

      <button
        className="request-back-button"
        onClick={() => navigate("/agency-dashboard")}
      >
        ← Back to dashboard
      </button>

      <div className="request-details-card">

        <div className="request-details-header">
          <h1>{request.title}</h1>

          <span className="request-status">
            {request.status || "N/A"}
          </span>
        </div>

        <div className="request-details">

          <div className="request-detail">
            <strong>Campaign Type</strong>
            <p>
              {request.campaignType?.replace(/_/g, " ") || "N/A"}
            </p>
          </div>

          <div className="request-detail">
            <strong>Goal</strong>
            <p>
              {request.goal?.replace(/_/g, " ") || "N/A"}
            </p>
          </div>

          <div className="request-detail">
            <strong>Budget</strong>
            <p>{request.budget || "N/A"} BHD</p>
          </div>

          <div className="request-detail">
            <strong>Submitted</strong>
            <p>
              {request.createdAt
                ? new Date(request.createdAt).toLocaleDateString()
                : "N/A"}
            </p>
          </div>

          <div className="request-detail full-width">
            <strong>Description</strong>
            <p>{request.description || "N/A"}</p>
          </div>

          <div className="request-detail full-width">
            <strong>Preferred Channels</strong>
            <p>
              {request.preferredChannels?.join(", ") || "N/A"}
            </p>
          </div>

          <div className="request-detail full-width">
            <strong>Notes</strong>
            <p>{request.notes || "N/A"}</p>
          </div>

        </div>
      </div>
    </div>
  </main>
);
};

export default AgencyCampaignRequestDetails;