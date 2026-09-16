import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { getCampaigns } from '../../services/campaignService';
import './MyCampaignsPage.css';

const MyCampaignsPage = () => {
    const navigate = useNavigate();
    const [campaigns, setCampaigns] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchCampaigns = async () => {
            try {
                const data = await getCampaigns();
                setCampaigns(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCampaigns();
    }, []);

    if (isLoading) return <main className="my-campaigns"><div className="my-campaigns-main"><p>Loading campaigns...</p></div></main>;

    return (
        <main className="my-campaigns">
            <div className="my-campaigns-main">
                <h1>My Campaigns</h1>
                <p className="my-campaigns-subtitle">Track every campaign that's come out of your accepted requests</p>

                {error && <p role="alert">{error}</p>}

                {campaigns.length === 0 ? (
                    <div className="my-campaigns-empty">
                        <p>No campaigns yet. Campaigns appear here once your requests are accepted.</p>
                    </div>
                ) : (
                    <div className="my-campaigns-table-wrapper">
                        <table>
                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Status</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {campaigns.map((campaign) => (
                                    <tr key={campaign._id}>
                                        <td>{campaign.requestId?.title}</td>
                                        <td>
                                            <span className={`status-badge status-${campaign.status}`}>{campaign.status.replace(/_/g, ' ')}</span>
                                        </td>
                                        <td>
                                            <button className="view-details-btn" onClick={() => navigate(`/campaigns/${campaign._id}`)}>
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

export default MyCampaignsPage;
