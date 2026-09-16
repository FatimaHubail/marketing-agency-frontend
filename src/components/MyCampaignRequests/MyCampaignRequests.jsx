import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { getMyCampaignRequests } from '../../services/campaignRequestService';
import './MyCampaignRequests.css';

const MyCampaignRequests = () => {
    const navigate = useNavigate();
    const [requests, setRequests] = useState([]);
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

    if (isLoading) return <main className="my-requests"><div className="my-requests-main"><p>Loading campaign requests...</p></div></main>;

    return (
        <main className="my-requests">
            <div className="my-requests-main">
                <h1>My Campaign Requests</h1>
                <p className="my-requests-subtitle">Track the status of every campaign request you've submitted</p>

                {error && <p role="alert">{error}</p>}

                {requests.length === 0 ? (
                    <div className="my-requests-empty">
                        <p>No campaign requests yet.</p>
                        <Link to="/requests/new" className="my-requests-cta">Submit your first request</Link>
                    </div>
                ) : (
                    <div className="my-requests-table-wrapper">
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
                                        <td>
                                            <span className={`status-badge status-${req.status}`}>{req.status}</span>
                                        </td>
                                        <td>{new Date(req.createdAt).toLocaleDateString()}</td>
                                        <td>
                                            <button className="view-details-btn" onClick={() => navigate(`/requests/${req._id}`)}>
                                                View Details
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </main>
    );
};

export default MyCampaignRequests;
