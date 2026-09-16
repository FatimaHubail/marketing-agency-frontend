import { useEffect, useState } from "react";
import "./CampaignRequests.css";
import {
  getCampaignRequests,
  acceptCampaignRequest,
  rejectCampaignRequest,
} from "../../services/campaignRequestService";
import DatePicker from "../common/DatePicker/DatePicker";

const CampaignRequests = () => {
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [dateInputs, setDateInputs] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const requestsData = await getCampaignRequests();

        setRequests(requestsData);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, []);

  const handleReject = async (id) => {
    try {
      const updatedRequest = await rejectCampaignRequest(
        id,
        "Request rejected"
      );

      setRequests(
        requests.map((request) =>
          request._id === id ? updatedRequest : request
        )
      );
    } catch (err) {
      console.log(err);
    }
  };

  const handleDateChange = (requestId, field, value) => {
    setDateInputs((prev) => ({
      ...prev,
      [requestId]: { ...prev[requestId], [field]: value },
    }));
  };

  const handleAccept = async (request) => {
    try {
      const { startDate, endDate } = dateInputs[request._id] || {};

      if (!startDate || !endDate) {
        console.log("Start date and end date are required");
        return;
      }

      const data = await acceptCampaignRequest(request._id, {
        startDate,
        endDate,
      });

      setRequests(
        requests.map((item) =>
          item._id === request._id
            ? data.campaignRequest
            : item
        )
      );
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <main className="staff-requests-page">
      <div className="staff-requests-main">
        <h1>Campaign Requests</h1>
        <p className="staff-requests-subtitle">Review, accept, or reject incoming campaign requests from clients.</p>

        {requests.length === 0 ? (
          <div className="staff-requests-empty">
            <p>No campaign requests yet.</p>
          </div>
        ) : (
          <div className="staff-requests-table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Client</th>
                  <th>Campaign Type</th>
                  <th>Goal</th>
                  <th>Budget</th>
                  <th>Channels</th>
                  <th>Status</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th></th>
                </tr>
              </thead>

              <tbody>
                {requests.map((request) => (
                  <tr key={request._id}>
                    <td>
                      {request.clientId?.user?.username}
                    </td>

                    <td>{request.campaignType?.replace(/_/g, " ")}</td>

                    <td>{request.goal?.replace(/_/g, " ")}</td>

                    <td>{request.budget} BHD</td>

                    <td>
                      {request.preferredChannels?.join(", ")}
                    </td>

                    <td>
                      <span className={`status-badge status-${request.status}`}>{request.status}</span>
                    </td>

                    <td className="staff-requests-date-cell">
                      <DatePicker
                        id={`start-${request._id}`}
                        placeholder="Select"
                        value={dateInputs[request._id]?.startDate || ""}
                        onChange={(value) =>
                          handleDateChange(request._id, "startDate", value)
                        }
                      />
                    </td>

                    <td className="staff-requests-date-cell">
                      <DatePicker
                        id={`end-${request._id}`}
                        placeholder="Select"
                        value={dateInputs[request._id]?.endDate || ""}
                        onChange={(value) =>
                          handleDateChange(request._id, "endDate", value)
                        }
                        min={dateInputs[request._id]?.startDate}
                      />
                    </td>

                    <td className="staff-requests-actions">
                      <button
                        className="view-details-btn"
                        onClick={() =>
                          setSelectedRequest(request)
                        }
                      >
                        View Details
                      </button>

                      <button
                        className="btn-accept"
                        onClick={() =>
                          handleAccept(request)
                        }
                      >
                        Accept
                      </button>

                      <button
                        className="btn-reject"
                        onClick={() =>
                          handleReject(request._id)
                        }
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedRequest && (
        <div className="staff-request-overlay" onClick={() => setSelectedRequest(null)}>
          <div className="staff-request-modal" onClick={(evt) => evt.stopPropagation()}>
            <h2>Campaign Request Details</h2>

            <div className="staff-request-detail">
              <strong>Client</strong>
              <p>{selectedRequest.clientId?.user?.username}</p>
            </div>

            <div className="staff-request-detail">
              <strong>Title</strong>
              <p>{selectedRequest.title}</p>
            </div>

            <div className="staff-request-detail">
              <strong>Campaign Type</strong>
              <p>{selectedRequest.campaignType?.replace(/_/g, " ")}</p>
            </div>

            <div className="staff-request-detail">
              <strong>Goal</strong>
              <p>{selectedRequest.goal?.replace(/_/g, " ")}</p>
            </div>

            <div className="staff-request-detail">
              <strong>Description</strong>
              <p>{selectedRequest.description || "N/A"}</p>
            </div>

            <div className="staff-request-detail">
              <strong>Budget</strong>
              <p>{selectedRequest.budget} BHD</p>
            </div>

            <div className="staff-request-detail">
              <strong>Preferred Channels</strong>
              <p>{selectedRequest.preferredChannels?.join(", ") || "N/A"}</p>
            </div>

            <div className="staff-request-detail">
              <strong>Notes</strong>
              <p>{selectedRequest.notes || "N/A"}</p>
            </div>

            <div className="staff-request-detail">
              <strong>Status</strong>
              <p><span className={`status-badge status-${selectedRequest.status}`}>{selectedRequest.status}</span></p>
            </div>

            <button className="btn-secondary-action" onClick={() => setSelectedRequest(null)}>
              Close
            </button>
          </div>
        </div>
      )}
    </main>
  );
};

export default CampaignRequests;
