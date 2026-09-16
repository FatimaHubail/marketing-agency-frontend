import { useEffect, useState } from "react";
import "./CampaignRequests.css";
import {
  getCampaignRequests,
  acceptCampaignRequest,
  rejectCampaignRequest,
  getStaff,
} from "../../services/campaignRequestService";

const CampaignRequests = () => {
  const [requests, setRequests] = useState([]);
  const [staff, setStaff] = useState([]);
  const [outsource, setOutsource] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const requestsData = await getCampaignRequests();
        const staffData = await getStaff();

        setRequests(requestsData);
        setStaff(staffData);
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

  const handleAccept = async (request) => {
    try {
      const staffId = document.getElementById(
        `staff-${request._id}`
      ).value;

      const outsourceId = document.getElementById(
        `outsource-${request._id}`
      ).value;

      const startDate = document.getElementById(
        `start-${request._id}`
      ).value;

      const endDate = document.getElementById(
        `end-${request._id}`
      ).value;

      if (!startDate || !endDate) {
        console.log("Start date and end date are required");
        return;
      }

      if (!staffId && !outsourceId) {
        console.log("Select a staff member or outsource partner");
        return;
      }

      const data = await acceptCampaignRequest(request._id, {
        staffId: staffId || undefined,
        outsourceId: outsourceId || undefined,
        startDate,
        endDate,
      });

      setRequests(
        requests.map((item) =>
          item._id === request._id ? data.campaignRequest : item
        )
      );
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="campaign-requests">
      <h1>Campaign Requests</h1>

      <table>
        <thead>
          <tr>
            <th>Client</th>
            <th>Campaign Type</th>
            <th>Goal</th>
            <th>Budget</th>
            <th>Channels</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {requests.map((request) => {
            const matchingStaff = staff.filter((staffMember) =>
              staffMember.specialty?.includes(request.campaignType)
            );

            return (
              <tr key={request._id}>
                <td>{request.clientId?.user?.username}</td>

                <td>{request.campaignType}</td>

                <td>{request.goal}</td>

                <td>{request.budget}</td>

                <td>
                  {request.preferredChannels?.join(", ")}
                </td>

                <td>{request.status}</td>

                <td>
                  <select id={`staff-${request._id}`}>
                    <option value="">Select Staff</option>

                    {matchingStaff.map((staffMember) => (
                      <option
                        key={staffMember._id}
                        value={staffMember._id}
                      >
                        {staffMember.userId?.username}
                      </option>
                    ))}
                  </select>

                  <select id={`outsource-${request._id}`}>
                    <option value="">
                      Select Outsource
                    </option>

                    {outsource.map((user) => (
                      <option
                        key={user._id}
                        value={user._id}
                      >
                        {user.username}
                      </option>
                    ))}
                  </select>

                  <input
                    id={`start-${request._id}`}
                    type="date"
                  />

                  <input
                    id={`end-${request._id}`}
                    type="date"
                  />

                  <button
                    onClick={() =>
                      setSelectedRequest(request)
                    }
                  >
                    View Details
                  </button>

                  <button
                    onClick={() =>
                      handleAccept(request)
                    }
                  >
                    Accept
                  </button>

                  <button
                    onClick={() =>
                      handleReject(request._id)
                    }
                  >
                    Reject
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {selectedRequest && (
        <div className="request-details-overlay">
          <div className="request-details">
            <h2>Campaign Request Details</h2>

            <p>
              <strong>Client:</strong>{" "}
              {selectedRequest.clientId?.user?.username}
            </p>

            <p>
              <strong>Title:</strong>{" "}
              {selectedRequest.title}
            </p>

            <p>
              <strong>Campaign Type:</strong>{" "}
              {selectedRequest.campaignType}
            </p>

            <p>
              <strong>Goal:</strong>{" "}
              {selectedRequest.goal}
            </p>

            <p>
              <strong>Description:</strong>{" "}
              {selectedRequest.description}
            </p>

            <p>
              <strong>Budget:</strong>{" "}
              {selectedRequest.budget}
            </p>

            <p>
              <strong>Preferred Channels:</strong>{" "}
              {selectedRequest.preferredChannels?.join(", ")}
            </p>

            <p>
              <strong>Notes:</strong>{" "}
              {selectedRequest.notes}
            </p>

            <p>
              <strong>Status:</strong>{" "}
              {selectedRequest.status}
            </p>

            <button
              onClick={() => setSelectedRequest(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CampaignRequests;