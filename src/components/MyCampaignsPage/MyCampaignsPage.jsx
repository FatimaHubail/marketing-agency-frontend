import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { getCampaigns } from '../../services/campaignService';

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

    if (isLoading) return <main><p>Loading campaigns...</p></main>;

    return (
        <main>
            <h1>My Campaigns</h1>
            {error && <p role="alert">{error}</p>}

            {campaigns.length === 0 ? (
                <p>No campaigns yet. Campaigns appear here once your requests are accepted.</p>
            ) : (
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
                                <td>{campaign.status.replace(/_/g, ' ')}</td>
                                <td>
                                    <button onClick={() => navigate(`/campaigns/${campaign._id}`)}>
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

export default MyCampaignsPage;
