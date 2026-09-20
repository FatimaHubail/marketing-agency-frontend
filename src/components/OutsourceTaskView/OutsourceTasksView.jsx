import { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router';
import { getOutsourceTaskById, updateOutsourceTask } from '../../services/outsourceTaskService';
import { getCampaigns } from '../../services/campaignService';
import { UserContext } from '../../contexts/UserContext';
import './OutsourceTaskView.css';

const formatLabel = (str = '') => {
    if (!str) return '—';
    if (str.toLowerCase() === 'ooh') return 'OOH (Out of Home)';
    if (str.toLowerCase() === 'sem') return 'SEM';
    if (str.toLowerCase() === 'seo') return 'SEO';
    if (str.toLowerCase() === 'pr') return 'PR';
    return str
        .split('_')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');
};

const formatDate = (dateString) => {
    if (!dateString) return '—';
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? dateString : date.toLocaleDateString();
};

const OutsourceTasksView = () => {
    const { taskId, id } = useParams();
    const currentTaskId = taskId || id;
    const navigate = useNavigate();
    const { user } = useContext(UserContext);

    const [task, setTask] = useState(null);
    const [campaigns, setCampaigns] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isRejecting, setIsRejecting] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        const fetchTaskData = async () => {
            try {
                setIsLoading(true);
                setError('');
                const [taskData, campaignsData] = await Promise.all([
                    getOutsourceTaskById(currentTaskId),
                    getCampaigns().catch(() => []),
                ]);
                setTask(taskData);
                setCampaigns(campaignsData || []);
            } catch (err) {
                setError(err.message || 'Failed to load task details');
            } finally {
                setIsLoading(false);
            }
        };

        if (currentTaskId) {
            fetchTaskData();
        }
    }, [currentTaskId]);

    const getCampaignTitle = (currentTask) => {
        if (!currentTask) return '—';
        if (currentTask.campaignId && typeof currentTask.campaignId === 'object') {
            return currentTask.campaignId.requestId?.title || currentTask.campaignId.title || '';
        }
        if (currentTask.campaignId) {
            const matched = campaigns.find((c) => c._id === currentTask.campaignId);
            if (matched) {
                return matched.requestId?.title || matched.title || '';
            }
        }
        if (currentTask.campaignTitle) return currentTask.campaignTitle;
        if (currentTask.campaignName) return currentTask.campaignName;
        if (currentTask.campaignRequestId && typeof currentTask.campaignRequestId === 'object') {
            return currentTask.campaignRequestId.title || '';
        }
        return formatLabel(currentTask.serviceType);
    };

    const handleReject = async (e) => {
        e.preventDefault();

        if (['accepted', 'in_progress', 'delivered', 'completed'].includes(task?.status)) {
            setError('This task has already been accepted and cannot be rejected.');
            return;
        }

        const trimmedReason = rejectionReason.trim();
        if (!trimmedReason) {
            setError('Please provide a reason for rejection.');
            return;
        }

        try {
            setIsSubmitting(true);
            setError('');

            const newUpdate = {
                authorId: user?._id,
                content: `Task rejected: ${trimmedReason}`,
            };

            const payload = {
                status: 'rejected',
                rejectionReason: trimmedReason,
                updates: [...(task?.updates || []), newUpdate],
            };

            await updateOutsourceTask(currentTaskId, payload);
            navigate('/outsource-tasks');
        } catch (err) {
            setError(err.message || 'Failed to reject task');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleAccept = async () => {
        try {
            setIsSubmitting(true);
            setError('');
            setSuccessMessage('');

            const newUpdate = {
                authorId: user?._id,
                content: 'Task accepted',
            };

            const payload = {
                status: 'accepted',
                updates: [...(task?.updates || []), newUpdate],
            };

            const updatedTask = await updateOutsourceTask(currentTaskId, payload);
            setTask(updatedTask);
            setSuccessMessage('Task accepted successfully.');
        } catch (err) {
            setError(err.message || 'Failed to accept task');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <main>
                <p>Loading task details...</p>
            </main>
        );
    }

    if (!task && !isLoading) {
        return (
            <main>
                <p role="alert" className="error-message">Task not found.</p>
                <button type="button" onClick={() => navigate('/outsource-tasks')}>
                    Back to Tasks
                </button>
            </main>
        );
    }

    if (isRejecting) {
        return (
            <main className="outsource-task-view">
                <h1>Reject Outsource Task</h1>

                {error && <p role="alert" className="error-message">{error}</p>}

                <section className="task-info-section">
                    <h2>{task.title}</h2>
                    <p><strong>Campaign: </strong>{getCampaignTitle(task)}</p>
                    <p>
                        <strong>Assigned By (Staff): </strong>
                        {task.staffId?.userId?.username || task.staffId?.name || 'Staff Member'}
                    </p>
                    <p className="reject-instructions">
                        Please provide the reason for rejecting this task. This reason will be recorded and sent to the assigning staff.
                    </p>

                    <form onSubmit={handleReject} className="reject-form">
                        <div className="reject-field">
                            <label htmlFor="rejectionReason" className="reject-label">
                                Reason for Rejection:
                            </label>
                            <textarea
                                id="rejectionReason"
                                name="rejectionReason"
                                rows={5}
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                                placeholder="Reason of Rejecting the request.."
                                required
                            />
                        </div>

                        <div className="task-view-actions">
                            <button
                                type="button"
                                className="btn-cancel"
                                onClick={() => {
                                    setIsRejecting(false);
                                    setError('');
                                }}
                                disabled={isSubmitting}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="btn-reject"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Rejecting...' : 'Reject'}
                            </button>
                        </div>
                    </form>
                </section>
            </main>
        );
    }

    const isAccepted = ['accepted', 'in_progress', 'delivered', 'completed'].includes(task.status);

    return (
        <main className="outsource-task-view">
            <h1>Outsource Task Details</h1>

            <div className="task-view-actions">
                <button type="button" onClick={() => navigate('/outsource-tasks')}>
                    Back to Tasks
                </button>

                {isAccepted ? (
                    <button
                        type="button"
                        className="btn-update-status"
                        onClick={() => navigate(`/outsource-tasks/${currentTaskId}/updates`)}
                    >
                        Update Status
                    </button>
                ) : (
                    <>
                        {task.status !== 'rejected' && (
                            <button
                                type="button"
                                className="btn-accept"
                                onClick={handleAccept}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Accepting...' : 'Accept'}
                            </button>
                        )}
                        <button
                            type="button"
                            className="btn-reject"
                            onClick={() => {
                                setError('');
                                setSuccessMessage('');
                                setIsRejecting(true);
                            }}
                            disabled={task.status === 'rejected' || isSubmitting}
                        >
                            {task.status === 'rejected' ? 'Rejected' : 'Reject'}
                        </button>
                    </>
                )}
            </div>
            <section className="task-info-section">
                {error && <p role="alert" className="error-message">{error}</p>}
                {successMessage && <p className="success-message">{successMessage}</p>}
                <h2>{task.title}</h2>
                <p><strong>Campaign: </strong>{getCampaignTitle(task)}</p>
                <p><strong>Type of Service: </strong>{formatLabel(task.serviceType)}</p>
                <p><strong>Status: </strong>{formatLabel(task.status)}</p>
                <p><strong>Due Date: </strong>{formatDate(task.dueDate)}</p>
                {task.description && (
                    <p><strong>Description: </strong>{task.description}</p>
                )}
                {task.paymentAmount !== undefined && (
                    <p><strong>Payment Amount: </strong>${task.paymentAmount}</p>
                )}
                {task.completedAt && (
                    <p><strong>Completed At: </strong>{formatDate(task.completedAt)}</p>
                )}
                {task.rejectionReason && (
                    <p><strong>Rejection Reason: </strong>{task.rejectionReason}</p>
                )}
                {task.staffId && (
                    <p>
                        <strong>Assigned By (Staff): </strong>
                        {task.staffId?.userId?.username || task.staffId?.name || 'Staff Member'}
                    </p>
                )}
                {task.deliverables && task.deliverables.length > 0 && (
                    <div>
                        <strong>Deliverables: </strong>
                        <ul>
                            {task.deliverables.map((item, idx) => (
                                <li key={idx}>{item}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </section>
        </main>
    );
};

export default OutsourceTasksView;