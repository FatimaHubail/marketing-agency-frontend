import { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router';
import { getOutsourceTaskById, updateOutsourceTask } from '../../services/outsourceTaskService';
import { UserContext } from '../../contexts/UserContext';
import './OutsourceTaskUpdates.css';

const STATUS_OPTIONS = [
    { value: 'pending', label: 'Pending' },
    { value: 'accepted', label: 'Accepted' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'completed', label: 'Completed' },
    { value: 'rejected', label: 'Rejected' },
];

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
    return isNaN(date.getTime()) ? dateString : date.toLocaleString();
};

const OutsourceTaskUpdates = () => {
    const { taskId, id } = useParams();
    const currentTaskId = taskId || id;
    const navigate = useNavigate();
    const { user } = useContext(UserContext);

    const [task, setTask] = useState(null);
    const [status, setStatus] = useState('pending');
    const [comment, setComment] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        const fetchTaskData = async () => {
            try {
                setIsLoading(true);
                setError('');
                const taskData = await getOutsourceTaskById(currentTaskId);
                setTask(taskData);
                if (taskData?.status) {
                    setStatus(taskData.status);
                }
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

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            setIsSubmitting(true);
            setError('');
            setSuccessMessage('');

            const trimmedComment = comment.trim();
            const payload = {
                status,
            };

            if (trimmedComment) {
                const newUpdate = {
                    authorId: user?._id,
                    content: trimmedComment,
                };
                payload.updates = [...(task?.updates || []), newUpdate];
            }

            const updatedTask = await updateOutsourceTask(currentTaskId, payload);
            setTask(updatedTask);
            if (updatedTask?.status) {
                setStatus(updatedTask.status);
            }
            setComment('');
            setSuccessMessage('Task update saved successfully.');
        } catch (err) {
            setError(err.message || 'Failed to save task update');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <main>
                <p>Loading task updates...</p>
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
        <main className="outsource-task-updates">
            <h1>Outsource Task Updates</h1>

            <div>
                <button type="button" onClick={() => navigate(`/outsource-tasks/${currentTaskId}`)}>
                    Back to Task Details
                </button>
                <button type="button" onClick={() => navigate('/outsource-tasks')}>
                    Back to Tasks List
                </button>
            </div>

            {error && <p role="alert" style={{ color: 'red' }}>{error}</p>}
            {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}

            <section className="task-summary-section">
                <h2>{task.title}</h2>
                <p><strong>Current Status: </strong>{formatLabel(task.status)}</p>
            </section>

            <section className="task-update-form-section">
                <h2>Add Update & Change Status</h2>
                <form onSubmit={handleSave}>
                    <div>
                        <label htmlFor="task-status">
                            <strong>Update Status:</strong>
                        </label>
                        <br />
                        <select
                            id="task-status"
                            name="status"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                        >
                            {STATUS_OPTIONS.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <br />

                    <div>
                        <label htmlFor="update-comment">
                            <strong>Comment</strong>
                        </label>
                        <br />
                        <textarea
                            id="update-comment"
                            name="comment"
                            rows={4}
                            cols={50}
                            placeholder="Add a comment or update message about task"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        />
                    </div>

                    <br />

                    <button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Saving...' : 'Save Update'}
                    </button>
                </form>
            </section>

            <section className="task-updates-history-section">
                <h2>Previous Updates</h2>
                {task.updates && task.updates.length > 0 ? (
                    <ul>
                        {[...task.updates].reverse().map((upd, idx) => (
                            <li key={upd._id || idx}>
                                <p>{upd.content}</p>
                                <small>Posted on: {formatDate(upd.createdAt || upd.updatedAt || new Date())}</small>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No previous updates yet.</p>
                )}
            </section>
        </main>
    );
};

export default OutsourceTaskUpdates;
