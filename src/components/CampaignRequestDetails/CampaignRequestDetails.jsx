import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { getCampaignRequestById } from '../../services/campaignRequestService';

const CampaignRequestDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [request, setRequest] = useState(null);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchRequest = async () => {
            try {
                const data = await getCampaignRequestById(id);
                setRequest(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchRequest();
    }, [id]);

    if (isLoading) return <main><p>Loading...</p></main>;
    if (error) return <main><p role="alert">{error}</p></main>;

    const canUpdate = request.status === 'submitted';
    const updateDisabledReason = 'This request can no longer be edited because it has already been reviewed.';

    return (
        <main>
            <button onClick={() => navigate('/requests')}>← Back to My Campaign Requests</button>

            <h1>{request.title}</h1>
            <p><strong>Campaign Type:</strong> {request.campaignType.replace(/_/g, ' ')}</p>
            <p><strong>Goal:</strong> {request.goal.replace(/_/g, ' ')}</p>
            <p><strong>Description:</strong> {request.description}</p>
            <p><strong>Budget:</strong> {request.budget} BHD</p>
            <p><strong>Preferred Channels:</strong> {request.preferredChannels?.join(', ')}</p>
            <p><strong>Notes:</strong> {request.notes}</p>
            <p><strong>Status:</strong> {request.status}</p>
            {request.status === 'rejected' && (
                <p><strong>Rejection Reason:</strong> {request.rejectedReason}</p>
            )}
            <p><strong>Submitted:</strong> {new Date(request.createdAt).toLocaleDateString()}</p>

            <button
                onClick={() => navigate(`/requests/${id}/edit`)}
                disabled={!canUpdate}
                title={canUpdate ? undefined : updateDisabledReason}
            >
                Update Request
            </button>
            {!canUpdate && (
                <p className="update-disabled-message">{updateDisabledReason}</p>
            )}
        </main>
    );
};

export default CampaignRequestDetails;
