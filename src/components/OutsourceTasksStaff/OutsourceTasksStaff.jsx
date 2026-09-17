import { useEffect, useState, useContext } from 'react';
import { getAllOutsourceTasks, deleteOutsourceTask } from '../../services/outsourceTaskService';
import { getCampaigns } from '../../services/campaignService';
import { getCampaignRequests } from '../../services/campaignRequestService';
import { UserContext } from '../../contexts/UserContext';
import './OutsourceTasksStaff.css';

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
        if (task.campaignRequestId) {
            const matchedReq = campaignRequests.find((r) => r._id === task.campaignRequestId);
            if (matchedReq) return matchedReq.title;
        }
        return task.serviceType ? task.serviceType.replace(/_/g, ' ') : '—';
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
        <main>
            <h1>Assigned Outsource Tasks</h1>
            <p>List of all outsource tasks assigned to external agencies.</p>

            {error && <p role="alert" style={{ color: 'red' }}>{error}</p>}
            {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}

            {tasks.length === 0 ? (
                <p>No outsource tasks found.</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Task Title</th>
                            <th>Campaign Title</th>
                            <th>Due Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tasks.map((task) => (
                            <tr key={task._id}>
                                <td>{task.title}</td>
                                <td>{getCampaignTitle(task)}</td>
                                <td>{formatDate(task.dueDate)}</td>
                                <td>
                                    <button type="button">Edit</button>
                                    <button type="button" onClick={() => handleDelete(task._id)}>
                                        Delete
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

export default OutsourceTasksStaff;
