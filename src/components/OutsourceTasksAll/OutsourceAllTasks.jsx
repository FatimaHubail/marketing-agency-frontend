import { useEffect, useState } from 'react';
import { getOutsourceTasks } from '../../services/outsourceTaskService';
import './OutsourceAllTasks.css';

const OutsourceAllTasks = () => {
    const [tasks, setTasks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                setIsLoading(true);
                const data = await getOutsourceTasks();
                setTasks(data || []);
            } catch (err) {
                setError(err.message || 'Failed to load tasks');
            } finally {
                setIsLoading(false);
            }
        };

        fetchTasks();
    }, []);

    if (isLoading) {
        return (
            <main>
                <p>Loading tasks...</p>
            </main>
        );
    }

    return (
        <main>
            <h1>Tasks</h1>

            {error && <p role="alert">{error}</p>}

            {tasks.length === 0 ? (
                <p>No tasks found.</p>
            ) : (
                <ul>
                    {tasks.map((task) => (
                        <li key={task._id}>
                            {task.title}
                        </li>
                    ))}
                </ul>
            )}
        </main>
    );
};

export default OutsourceAllTasks;
