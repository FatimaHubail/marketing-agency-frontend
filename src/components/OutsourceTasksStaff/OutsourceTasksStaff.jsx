import { useEffect, useState, useContext } from 'react';
import { getAllOutsourceTasks, deleteOutsourceTask } from '../../services/outsourceTaskService';
import { getCampaigns } from '../../services/campaignService';
import { getCampaignRequests } from '../../services/campaignRequestService';
import { UserContext } from '../../contexts/UserContext';
import './OutsourceTasksStaff.css';

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

const OutsourceTasksStaff = () => {
    const { user } = useContext(UserContext);
    const [tasks, setTasks] = useState([]);
    const [campaigns, setCampaigns] = useState([]);
    const [campaignRequests, setCampaignRequests] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        const fetchTasksAndCampaigns = async () => {
            try {
                setIsLoading(true);
                const [tasksData, campaignsData, requestsData] = await Promise.all([
                    getAllOutsourceTasks(),
                    getCampaigns().catch(() => []),
                    getCampaignRequests().catch(() => []),
                ]);
                setTasks(tasksData || []);
                setCampaigns(campaignsData || []);
                setCampaignRequests(requestsData || []);
            } catch (err) {
                setError(err.message || 'Failed to load outsource tasks');
            } finally {
                setIsLoading(false);
            }
        };

        fetchTasksAndCampaigns();
    }, []);

    const getCampaignTitle = (task) => {
        if (task.campaignId && typeof task.campaignId === 'object') {
            return task.campaignId.requestId?.title || task.campaignId.title || '';
        }
        if (task.campaignId) {
            const matchedCamp = campaigns.find((c) => c._id === task.campaignId);
            if (matchedCamp) {
                return matchedCamp.requestId?.title || matchedCamp.title || '';
            }
        }
        if (task.campaignTitle) return task.campaignTitle;
        if (task.campaignName) return task.campaignName;
        if (task.campaignRequestId && typeof task.campaignRequestId === 'object') {
            return task.campaignRequestId.title || '';
        }
        if (task.campaignRequestId) {
            const matchedReq = campaignRequests.find((r) => r._id === task.campaignRequestId);
            if (matchedReq) return matchedReq.title;
        }
        return formatLabel(task.serviceType);
    };

    const handleDelete = async (id) => {
        try {
            setError('');
            await deleteOutsourceTask(id);
            setTasks((prev) => prev.filter((t) => t._id !== id));
            setSuccessMessage('Outsource task deleted successfully.');
        } catch (err) {
            setError(err.message || 'Failed to delete outsource task');
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '—';
        const date = new Date(dateString);
        return isNaN(date.getTime()) ? dateString : date.toLocaleDateString();
    };

    if (isLoading) {
        return (
            <main>
                <p>Loading outsource tasks...</p>
            </main>
        );
    }

    return (
        <main className="outsource-tasks-staff">
            <h1>Assigned Outsource Tasks</h1>
            <p>List of all outsource tasks assigned to external agencies.</p>

            {error && <p role="alert" style={{ color: 'red' }}>{error}</p>}
            {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}

            {tasks.length === 0 ? (
                <p>No outsource tasks found.</p>
            ) : (
                <div className="tasks-cards-container">
                    {tasks.map((task) => (
                        <div key={task._id} className="task-card">
                            <h2 className="task-card-title">{task.title}</h2>
                            <p className="task-card-campaign">
                                <strong>Campaign: </strong>
                                {getCampaignTitle(task)}
                            </p>
                            <p className="task-card-service">
                                <strong>Type of Service: </strong>
                                {formatLabel(task.serviceType)}
                            </p>
                            <p className="task-card-due-date">
                                <strong>Due Date: </strong>
                                {formatDate(task.dueDate)}
                            </p>
                            <div className="task-card-actions">
                                <button type="button">Edit</button>
                                <button type="button" onClick={() => handleDelete(task._id)}>
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </main>
    );
};

export default OutsourceTasksStaff;
