import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { getCampaignById } from '../../services/campaignService';

const CampaignDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [campaign, setCampaign] = useState(null);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchCampaign = async () => {
            try {
                const data = await getCampaignById(id);
                setCampaign(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCampaign();
    }, [id]);

    if (isLoading) return <main><p>Loading...</p></main>;
    if (error) return <main><p role="alert">{error}</p></main>;

    const request = campaign.requestId;

    return (
        <main>
            <button onClick={() => navigate('/campaigns')}>← Back to My Campaigns</button>

            <h1>{request?.title}</h1>
            <p><strong>Status:</strong> {campaign.status.replace(/_/g, ' ')}</p>
            <p><strong>Campaign Type:</strong> {request?.campaignType?.replace(/_/g, ' ')}</p>
            <p><strong>Goal:</strong> {request?.goal?.replace(/_/g, ' ')}</p>
            <p><strong>Description:</strong> {request?.description}</p>
            <p><strong>Preferred Channels:</strong> {request?.preferredChannels?.join(', ')}</p>
            <p><strong>Notes:</strong> {request?.notes}</p>
            <p><strong>Budget:</strong> {request?.budget} BHD</p>
            <p><strong>Budget Spent:</strong> {campaign.budgetSpent} BHD</p>
            <p><strong>Start Date:</strong> {new Date(campaign.startDate).toLocaleDateString()}</p>
            <p><strong>End Date:</strong> {new Date(campaign.endDate).toLocaleDateString()}</p>
        </main>
    );
};

export default CampaignDetails;
