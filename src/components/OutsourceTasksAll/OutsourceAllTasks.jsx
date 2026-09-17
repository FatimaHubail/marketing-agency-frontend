import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { getOutsourceTasks } from '../../services/outsourceTaskService';
import { getCampaigns } from '../../services/campaignService';
import './OutsourceAllTasks.css';

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

const OutsourceAllTasks = () => {
    const navigate = useNavigate();
    const [tasks, setTasks] = useState([]);
    const [campaigns, setCampaigns] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchTasksAndCampaigns = async () => {
            try {
                setIsLoading(true);
                const [tasksData, campaignsData] = await Promise.all([
                    getOutsourceTasks(),
                    getCampaigns().catch(() => []),
                ]);
                setTasks(tasksData || []);
                setCampaigns(campaignsData || []);
            } catch (err) {
                setError(err.message || 'Failed to load tasks');
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
            const matched = campaigns.find((c) => c._id === task.campaignId);
            if (matched) {
                return matched.requestId?.title || matched.title || '';
            }
        }
        if (task.campaignTitle) return task.campaignTitle;
        if (task.campaignName) return task.campaignName;
        if (task.campaignRequestId && typeof task.campaignRequestId === 'object') {
            return task.campaignRequestId.title || '';
        }
        return formatLabel(task.serviceType);
    };

    if (isLoading) {
        return (
            <main>
                <p>Loading tasks...</p>
            </main>
        );
    }

    return (
        <main className="outsource-all-tasks">
            <h1>Tasks</h1>

            {error && <p role="alert" style={{ color: 'red' }}>{error}</p>}

            {tasks.length === 0 ? (
                <p>No tasks found.</p>
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
                                <button
                                    type="button"
                                    onClick={() => navigate(`/outsource-tasks/${task._id}`)}
                                >
                                    View Task
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </main>
    );
};

export default OutsourceAllTasks;
