import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { getMyCampaignRequests } from '../../services/campaignRequestService';

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
                                    <button onClick={() => navigate(`/requests/${req._id}`)}>
                                        View Details
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </main>
    );
};

export default MyCampaignRequests;
