import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { getCampaignRequestById, deleteMyCampaignRequest } from '../../services/campaignRequestService';

const CampaignRequestDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [request, setRequest] = useState(null);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

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

    const handleDelete = async () => {
        setError('');
        setIsDeleting(true);
        try {
            await deleteMyCampaignRequest(id);
            navigate('/requests');
        } catch (err) {
            setError(err.message);
            setIsDeleting(false);
        }
    };

    if (isLoading) return <main><p>Loading...</p></main>;
    if (error && !request) return <main><p role="alert">{error}</p></main>;

    const canModify = request.status === 'submitted';
    const updateDisabledReason = 'This request can no longer be edited because it has already been reviewed.';
    const deleteDisabledReason = 'This request can no longer be deleted because it has already been reviewed.';

    return (
        <main>
            <button onClick={() => navigate('/requests')}>← Back to My Campaign Requests</button>

            {error && <p role="alert">{error}</p>}

            <h1>{request.title}</h1>
           <p>
  <strong>Campaign Type:</strong>{" "}
  {request.campaignType?.replace(/_/g, " ") || "N/A"}
</p>

<p>
  <strong>Goal:</strong>{" "}
  {request.goal?.replace(/_/g, " ") || "N/A"}
</p>
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
                disabled={!canModify}
                title={canModify ? undefined : updateDisabledReason}
            >
                Update Request
            </button>

            <button
                onClick={() => setShowDeleteConfirm(true)}
                disabled={!canModify}
                title={canModify ? undefined : deleteDisabledReason}
            >
                Delete Request
            </button>

            {showDeleteConfirm && (
                <div className="delete-confirm-overlay">
                    <div className="delete-confirm-dialog">
                        <p>Are you sure you want to delete this request?</p>

                        <button onClick={handleDelete} disabled={isDeleting}>
                            {isDeleting ? 'Deleting...' : 'Delete'}
                        </button>
                        <button onClick={() => setShowDeleteConfirm(false)} disabled={isDeleting}>
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </main>
    );
};

export default CampaignRequestDetails;
