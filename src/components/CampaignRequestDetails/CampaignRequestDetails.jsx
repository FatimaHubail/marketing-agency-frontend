import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import {
    getCampaignRequestById,
    deleteMyCampaignRequest,
} from '../../services/campaignRequestService';
import './CampaignRequestDetails.css';

const CampaignRequestDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [request, setRequest] = useState(null);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(true);
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

    const handleUpdate = () => {
        navigate(`/requests/${id}/edit`);
    };

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

    if (isLoading) {
        return (
            <main className="crd-page">
                <div className="crd-page-main">
                    <p>Loading...</p>
                </div>
            </main>
        );
    }

    if (error && !request) {
        return (
            <main className="crd-page">
                <div className="crd-page-main">
                    <p role="alert">{error}</p>
                </div>
            </main>
        );
    }

   const canModify =
    request.status !== 'accepted' &&
    request.status !== 'rejected';

    return (
        <main className="crd-page">

            <div className="crd-page-main">

                <button
                    className="back-link"
                    onClick={() => navigate('/requests')}
                >
                    ← Back to Campaign Requests
                </button>

                {error && (
                    <p role="alert">
                        {error}
                    </p>
                )}

                <div className="crd-page-header">

                    <h1>{request.title}</h1>

                    <span
                        className={`status-badge status-${request.status}`}
                    >
                        {request.status}
                    </span>

                </div>

                <div className="detail-grid">

                    <div className="detail-item">
                        <span className="detail-label">
                            Campaign Type
                        </span>

                        <span className="detail-value">
                            {request.campaignType
                                ?.replace(/_/g, ' ')
                                || 'N/A'}
                        </span>
                    </div>

                    <div className="detail-item">
                        <span className="detail-label">
                            Goal
                        </span>

                        <span className="detail-value">
                            {request.goal
                                ?.replace(/_/g, ' ')
                                || 'N/A'}
                        </span>
                    </div>

                    <div className="detail-item">
                        <span className="detail-label">
                            Budget
                        </span>

                        <span className="detail-value">
                            {request.budget
                                ? `${request.budget} BHD`
                                : 'N/A'}
                        </span>
                    </div>

                    <div className="detail-item">
                        <span className="detail-label">
                            Submitted
                        </span>

                        <span className="detail-value">
                            {request.createdAt
                                ? new Date(
                                    request.createdAt
                                ).toLocaleDateString()
                                : 'N/A'}
                        </span>
                    </div>

                    <div className="detail-item detail-item-wide">
                        <span className="detail-label">
                            Preferred Channels
                        </span>

                        <span className="detail-value">
                            {request.preferredChannels?.join(', ')
                                || 'N/A'}
                        </span>
                    </div>

                    <div className="detail-item detail-item-wide">
                        <span className="detail-label">
                            Notes
                        </span>

                        <span className="detail-value">
                            {request.notes || '—'}
                        </span>
                    </div>

                    {request.status === 'rejected' && (
                        <div className="detail-item detail-item-wide detail-item-rejected">

                            <span className="detail-label">
                                Rejection Reason
                            </span>

                            <span className="detail-value">
                                {request.rejectedReason || 'No reason provided'}
                            </span>

                        </div>
                    )}

                </div>

                {/* Client Actions */}

                <div className="request-actions">

                    {canModify ? (
                        <>
                            <button
                                className="btn-primary-action"
                                onClick={handleUpdate}
                                disabled={isDeleting}
                            >
                                Update Request
                            </button>

                            <button
                                className="btn-danger-action"
                                onClick={handleDelete}
                                disabled={isDeleting}
                            >
                                {isDeleting
                                    ? 'Deleting...'
                                    : 'Delete Request'}
                            </button>
                        </>
                    ) : (
                        <p>
                            This request has already been reviewed, it cannot be modified or deleted.
                        </p>
                    )}

                </div>

            </div>

        </main>
    );
};

export default CampaignRequestDetails;