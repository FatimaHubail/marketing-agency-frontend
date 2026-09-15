import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { getMyCampaignRequests } from '../../services/campaignRequestService';

const MyCampaignRequests = () => {
    const [requests, setRequests] = useState([]);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const data = await getMyCampaignRequests();
                setRequests(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchRequests();
    }, []);

    if (isLoading) return <main><p>Loading campaign requests...</p></main>;

    return (
        <main>
            <h1>My Campaign Requests</h1>
            {error && <p role="alert">{error}</p>}

            {requests.length === 0 ? (
                <p>
                    No campaign requests yet. <Link to="/requests/new">Submit one</Link>
                </p>
            ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Type</th>
                                <th>Status</th>
                                <th>Submitted</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {requests.map((req) => (
                                <tr key={req._id}>
                                    <td>{req.title}</td>
                                    <td>{req.campaignType.replace(/_/g, ' ')}</td>
                                    <td>{req.status}</td>
                                    <td>{new Date(req.createdAt).toLocaleDateString()}</td>
                                    <td>
                                        <button onClick={() => setSelectedRequest(req)}>
                                            View Details
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
            )}

            {selectedRequest && (
                <div className="request-details-overlay">
                    <div className="request-details">
                        <h2>Campaign Request Details</h2>

                        <p><strong>Title:</strong> {selectedRequest.title}</p>
                        <p><strong>Campaign Type:</strong> {selectedRequest.campaignType.replace(/_/g, ' ')}</p>
                        <p><strong>Goal:</strong> {selectedRequest.goal.replace(/_/g, ' ')}</p>
                        <p><strong>Description:</strong> {selectedRequest.description}</p>
                        <p><strong>Budget:</strong> {selectedRequest.budget} BHD</p>
                        <p><strong>Preferred Channels:</strong> {selectedRequest.preferredChannels?.join(', ')}</p>
                        <p><strong>Notes:</strong> {selectedRequest.notes}</p>
                        <p><strong>Status:</strong> {selectedRequest.status}</p>
                        <p><strong>Submitted:</strong> {new Date(selectedRequest.createdAt).toLocaleDateString()}</p>

                        <button onClick={() => setSelectedRequest(null)}>Close</button>
                    </div>
                </div>
            )}
        </main>
    );
};

export default MyCampaignRequests;
