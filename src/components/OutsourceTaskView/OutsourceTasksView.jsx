import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { getOutsourceTaskById } from '../../services/outsourceTaskService';
import { getCampaigns } from '../../services/campaignService';
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

    const [task, setTask] = useState(null);
    const [campaigns, setCampaigns] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

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
                <p role="alert" style={{ color: 'red' }}>Task not found.</p>
                <button type="button" onClick={() => navigate('/outsource-tasks')}>
                    Back to Tasks
                </button>
            </main>
        );
    }

    return (
        <main className="outsource-task-view">
            <h1>Outsource Task Details</h1>

            <button type="button" onClick={() => navigate('/outsource-tasks')}>
                Back to Tasks
            </button>

            {error && <p role="alert" style={{ color: 'red' }}>{error}</p>}

            <section className="task-info-section">
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
